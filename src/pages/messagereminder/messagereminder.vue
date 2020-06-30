<template>
  <div class="messagereminder">
    <div class="content">
      <div class="top_acc">
        <div>
          <template>
            <el-radio v-model="radio" label="1" @change="radiofn">全部消息</el-radio>
            <el-radio v-model="radio" label="2" @change="radiofn">未读消息</el-radio>
          </template>
        </div>
        <div>
          <el-button type="primary" size="mini" @click="getFormNewsfn">一键已读</el-button>
        </div>
      </div>
      <div class="table">
        <template>
          <el-table
            :data="tableData"
            border
            style="width: 100%"
            :header-cell-style="{background:'#f2f2f2'}"
            :row-class-name="rowClass"
            :max-height="tableheight"
          >
            <!-- :highlight-current-row="true" -->
            <el-table-column
              prop="sendUserAndUnit.unitIdAndName.unitName"
              label="单位"
              align="center"
              width="140"
              :resizable="false"
              fixed="left"
            ></el-table-column>
            <el-table-column
              prop="message"
              label="内容"
              align="center"
              width="500"
              :show-overflow-tooltip="true"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              align="center"
              :resizable="false"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="sendUserAndUnit.userName"
              label="发送人"
              align="center"
              width="150"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="sendUserAndUnit.roleName"
              label="职别"
              align="center"
              width="100"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="时间"
              align="center"
              width="150"
              :resizable="false"
            ></el-table-column>
            <el-table-column
              prop="state"
              label="状态"
              align="center"
              width="80"
              :resizable="false"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="success"
                  size="small"
                  scope.row
                  v-if="scope.row.state=='已读'"
                  :disabled="true"
                >{{scope.row.state}}</el-button>
                <el-button
                  type="warning"
                  size="small"
                  scope.row
                  v-if="scope.row.state=='未读'"
                  :disabled="true"
                >{{scope.row.state}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              :resizable="false"
              fixed="right"
              label="操作"
              width="100"
              align="center"
              v-if="radio == 2"
            >
              <template slot-scope="scope">
                <el-button size="mini" @click="vieworedit(scope.row)">设为已读</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>

        <div class="block">
          <el-pagination
            :page-sizes="[20, 40, 60, 100]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="countData"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "messagereminder",
  data() {
    return {
      tableheight:400,
      msgid: [],
      countData: 0,
      pageIndex: 1,
      pageSize: 20,
      radio: "1",
      tableData: [],
      hidepage: true,
      roleId: sessionStorage.getItem("roleId"),
      userId: sessionStorage.getItem("userID"),
      unitId: sessionStorage.getItem("unitId")
    };
  },
  methods: {
    // 获取用户消息
    getallFormNewsfn() {
      this.$http
        .allFormNews(
          `userId=${this.userId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}&type=${this.radio}`
        )
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.msgid = [];
            this.countData = res.data.countData;
            res.data.list.forEach(item => {
              if (item.state == 1) {
                this.msgid.push(item.id);
                item.state = "未读";
              } else if (item.state == 2) {
                item.state = "已读";
              }
            });
            this.tableData = res.data.list;
          }
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.getallFormNewsfn();
    },
    handleCurrentChange(page) {
      this.pageIndex = page;
      this.getallFormNewsfn();
    },
    radiofn() {
      this.pageIndex = 1;
      this.getallFormNewsfn();
    },

    // 获取未读消息总数
    getcountUnreadfn() {
      this.$http.countUnread(`userId=${this.userId}`).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.mseSetItem("unreadnum", res.data);
        }
      });
    },

    // 设为已读
    setupmessage(strmsgid) {
      this.$http
        .getFormNews(`id=${strmsgid}&userId=${this.userId}`)
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.$message.success("操作成功");
            this.getallFormNewsfn();
            this.getcountUnreadfn(); // 更新惟独消息数
          }
        });
    },
    // 批量修改状态
    getFormNewsfn() {
      let strmsgid = this.msgid.toString();
      console.log(strmsgid);
      if (strmsgid) {
        this.setupmessage(strmsgid);
      } else {
        this.$message("暂无未读消息");
      }
    },
    // 单条设置
    vieworedit(item) {
      console.log(item);
      this.setupmessage(item.id);
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableheight = window.innerHeight - 300;
    }, 0);
    this.getallFormNewsfn();
  },

  computed: {
    rowClass({ row, rowIndex }) {
      console.log("-----2-2-2-2-2-2-2--2" + row);
      return "hh";
      //   return { "background-color": "#1E90FF", color: "#fff" };
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.hh {
  background-color: red;
}
</style>
<style lang="less" scoped>
.top_acc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}
</style>
