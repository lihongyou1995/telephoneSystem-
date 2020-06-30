<template>
  <div class="taskgeneration">
    <div class="content" v-if="!istaskview && !isnextview">
      <div class="top_acc">
        <div></div>
        <div v-if="unitId != 0 && roleId == 1">
          <el-button type="primary" size="mini" @click="copy">复制</el-button>
          <el-button type="primary" size="mini" @click="addtaskbtn">新增任务</el-button>
          <el-button type="primary" size="mini" @click="lowerhair">下发</el-button>
        </div>
      </div>
      <div class="table">
        <el-table
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :header-cell-style="getRowClass"
          @row-contextmenu="contextmenu"
          @row-click="handleRowClick"
          border
        >
          <el-table-column type="selection" width="40" align="center"></el-table-column>
          <el-table-column prop="name" label="任务名称" align="center" min-width="150" max-width="400"></el-table-column>
          <el-table-column prop="attribute" label="任务属性" align="center" width="150"></el-table-column>
          <el-table-column
            v-if="roleId != 3"
            prop="createUserName"
            label="创建人"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column v-if="roleId != 3" prop="resource" label="来源" align="center" width="120"></el-table-column>
          <el-table-column
            v-if="roleId != 3"
            prop="stateName"
            label="状态"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
          <el-table-column
            v-if="roleId != 3"
            prop="endTimes"
            label="填报剩余时间"
            align="center"
            show-overflow-tooltip
            width="150"
          ></el-table-column>
          <el-table-column
            :resizable="false"
            v-if="unitId != 0 && roleId == 1"
            label="操作"
            width="120"
            align="left"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="vieworedit(scope.row,1)">查看</el-button>
              <el-button
                v-if="userId == scope.row.createUser"
                type="danger"
                size="mini"
                @click="vieworedit(scope.row,2)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            :resizable="false"
            v-if="roleId == 2 || roleId == 3"
            label="操作"
            width="100"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="vieworedit(scope.row,1)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="block" v-if="roleId != 3">
        <el-pagination
          @size-change="handleSizeChange"
          :current-page.sync="currentpage1"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="total2"
        ></el-pagination>
      </div>
      <!-- 分页  roleId==3 -->
      <div class="block" v-if="roleId == 3">
        <el-pagination
          :current-page.sync="currentpage"
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="totals"
        ></el-pagination>
      </div>

      <div class="dialog2">
        <el-dialog :title="issuedTitle" :visible.sync="dialogFormVisible4" width="400px">
          <div class="textarea_div">
            <span>备注:</span>
            <el-input type="textarea" autosize placeholder="备注" v-model="textarea1"></el-input>
          </div>
          <div class="block" style="margin-bottom:15px;">
            <span class="demonstration">{{suedTimedate}}</span>
            <el-date-picker
              v-model="lowerhairtime"
              type="datetime"
              placeholder="选择日期时间"
              @change="datetimefn"
            ></el-date-picker>
          </div>
          <div>
            <p style="margin-bottom:10px">单位：</p>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="(city,index) in cities"
                :label="city.managerId"
                :key="index"
              >{{city.title}}</el-checkbox>
            </el-checkbox-group>
            <p style="margin:10px 0">填报员：</p>
            <el-checkbox-group v-model="distributeuser" @change="distributeuserfn">
              <el-checkbox
                v-for="(item,index) in distributor"
                :key="index"
                :label="item.userId"
              >{{item.account}}---{{item.userName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="quexiafa">
            <el-button type="primary" size="mini" @click="confirmthenextissue">确认下发</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
    <div>
      <addtask ref="child" @gxdata="gxdata"></addtask>
    </div>
  </div>
</template>

<script>
import addtask from "./componet/addtask";

export default {
  components: {
    addtask
  },
  data() {
    return {
      currentpage: 1, //设置当前页数
      currentpage1: 1, //设置当前页数
      totals: 0, //自定义分页
      textarea1: "",
      roleId: sessionStorage.getItem("roleId"),
      userId: sessionStorage.getItem("userID"),
      unitId: sessionStorage.getItem("unitId"),
      istaskview: false,
      tableData: [],
      tableData1: [],
      multipleSelection: [],
      multipleSelectionid: [],
      multipleSelectionname: [],
      dialogFormVisible4: false,
      lowerhairtime: "",
      isissued: "1",
      issuedTitle: "选择下发单位",
      suedTimedate: "选择下发截至时间",
      distributor: [],
      pushuserList: [],
      distributeuser: [],
      checkedCities: [],
      cities: [],
      pushuserid: [],
      isendTime: true,
      typesdeta: "",
      buntext: "",
      isnextview: false,
      nextviewData: [],
      vivewtype: 0,
      viviewtableheder: [],
      viviewtabledata: [],
      taskName: "",
      taskId: 0,
      typename: "",
      sendUnitId: 0,
      itemscope: true,
      istuisong: true,
      pageIndex: 1,
      pageSize: 10,
      total2: 0,
      publishUnitId: "",
      accepectUserId: "",
      taskState: this.$route.query.taskState,
      isno: true,
      userIds: []
    };
  },

  methods: {
    copy() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          type: "info",
          message: "请选择一张任务进行复制！"
        });
        return;
      }
      if (this.multipleSelection.length !== 1) {
        this.$message({
          type: "info",
          message: "只能选择一张任务进行复制！"
        });
        return;
      }
      let _this = this;
      _this
        .$prompt("新任务名", "复制任务", {
          confirmButtonText: "确定",
          cancelButtonText: "取消"
        })
        .then(({ value }) => {
          _this.$http
            .copyTask({
              userId: _this.userId,
              unitId: _this.unitId,
              taskId: _this.multipleSelection[0].id,
              taskName: value
            })
            .then(res => {
              if (res.code == 200) {
                _this.$message.success("复制成功");
                _this.queryTaskListfn();
              } else {
                _this.$message(res.message);
              }
            });
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    gxdata(item) {
      if (item == 1) {
        this.queryTaskListfn();
      }
    },
    // 获取任务列表数据
    queryTaskListfn() {
      this.$http
        .queryTaskList(
          `unitId=${this.unitId}&userId=${this.userId}&roleId=${this.roleId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}`
        )
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.countTime();
            this.total2 = res.data.countData;
          } else {
            this.$message(res.data || res.message);
          }
        });
    },

    // 获取用户任务列表数据
    queryuserTaskListfn() {
      let _this = this;
      new Promise((resolve, reject) => {
        _this.$http
          .queryTaskList(
            `unitId=${this.unitId}&userId=${this.userId}&roleId=${this.roleId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}`
          )
          .then(res => {
            console.log(res);
            let datas1 = [];
            if (res.code === 200) {
              res.data.list.forEach((item, index) => {
                datas1.push(JSON.parse(JSON.stringify(item)));
              });
              resolve(datas1);
            } else {
              this.$message(res.data || res.message);
              reject(res.code);
            }
          });
      })
        .then(val => {
          return new Promise((resolve, reject) => {
            //表单专项任务
            this.$http
              .getFormObj(`userId=${this.userId}&formState=专项任务`)
              .then(res => {
                if (res.code == 200) {
                  res.data.forEach((item, index) => {
                    val.push({
                      name: item.formName,
                      attribute: item.formTypeCN,
                      createTime: item.createTime,
                      types: "form_task",
                      formId: item.id,
                      createTime: item.createTime
                    });
                  });
                  resolve(val);
                } else {
                  this.$message(res.data || res.message);
                  reject(res.code);
                }
              });
          });
        })
        .then(val => {
          for (var i = val.length - 1; i > 0; i--) {
            for (var j = 0; j < i; j++) {
              if (
                new Date(val[j].createTime).getTime() <
                new Date(val[j + 1].createTime).getTime()
              ) {
                [val[j], val[j + 1]] = [val[j + 1], val[j]];
              }
            }
          }
          _this.tableData1 = val;
          _this.totals = val.length;
          _this.fenye(1);
        })
        .catch(err => {
          console.log("error:", err);
        });
    },

    countTime() {
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      this.tableData.forEach(res => {
        // console.log(res);
        if (res.createUserId == this.userId || res.endTime == null)
          return (res.endTimes = "无");
        var end = new Date(res.endTime).getTime();
        var leftTime = end - now;
        if (leftTime >= 0) {
          var d = Math.floor(leftTime / 1000 / 60 / 60 / 24),
            h = Math.floor((leftTime / 1000 / 60 / 60) % 24),
            m = Math.floor((leftTime / 1000 / 60) % 60),
            s = Math.floor((leftTime / 1000) % 60);
          var djs = `${d}天${h}小时${m}分${s}秒`;
          if (res.stateName != "数据采集已完成") {
            res.endTimes = djs;
          } else if (res.stateName == "数据采集已完成") {
            res.endTimes = "已完成";
          }
          if (d < 1 && h <= 3 && this.isno) {
            this.$notify({
              title: "警告",
              message: "请注意，您有即将到期的任务！",
              type: "warning"
            });
            this.isno = false;
          }
        } else {
          if (res.stateName == "数据采集已完成") {
            res.endTimes = "已完成";
          } else {
            res.endTimes = "已超时";
          }
        }
        // 使用this.$set()方法赋值，解决vue实例不更新视图问题
        this.$set(this.tableData, res.endTimes, djs);
      });
      setTimeout(this.countTime, 1000);
    },

    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },

    handleSelectionChange(list) {
      console.log(list);
      this.multipleSelection = list;
      console.log(`任务选择${this.multipleSelection}`);
    },

    lowerhair(i) {
      if (this.multipleSelection.length == 0)
        return this.$message("请选择任务");
      if (this.multipleSelection.length > 1)
        return this.$message("每次只能选择一个任务");
      this.dialogFormVisible4 = true;
      // 请求下发单位
      this.$http
        .queryTree3(`/unit/queryTree3?unitId=${this.unitId}`)
        .then(res => {
          console.log(res);
          this.cities = [];
          if (res.code == 200) {
            res.data.forEach(item => {
              console.log(item);
              if (item.managerId) {
                this.cities.push(item);
              }
            });
          }
        });
      // 请求下发填报员
      this.$http
        .getReportersByUnitId(
          `/user/getReportersByUnitId?unitId=${this.unitId}`
        )
        .then(res => {
          return res.code === 200 ? (this.distributor = res.data) : "";
        });
    },

    // 下发/分发截至时间选择
    datetimefn(date) {
      console.log(date);
      if (date.getTime() >= Date.now()) {
        var year = date.getFullYear(),
          month =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1,
          day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
          hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
          minute =
            date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes(),
          second =
            date.getSeconds() < 10
              ? "0" + date.getSeconds()
              : date.getSeconds();
        this.lowerhairtime =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;
        console.log(this.lowerhairtime);
      } else {
        this.lowerhairtime = "";
        this.$message("截至时间必须大于当前时间");
      }
    },
    // 分发人员选择
    distributeuserfn(id) {
      console.log(id);
      this.distributeuser = id;
      console.log("分发人员选择" + this.distributeuser);
    },
    // 下发人员选择
    handleCheckedCitiesChange(id) {
      console.log(id);
      this.checkedCities = id;
      console.log("城市选择" + this.checkedCities);
    },

    // 下发提交
    confirmthenextissue() {
      this.multipleSelection.forEach(item => {
        this.multipleSelectionid.push(item.id); // 任务id
        this.multipleSelectionname.push(item.name); // 任务名
      });

      this.checkedCities.forEach(item => {
        this.userIds.push(`${item}:1`);
      });
      this.distributeuser.forEach(item => {
        this.userIds.push(`${item}:2`);
      });
      // if(this.distributeuser == '') return this.$message('请选择填报员');
      if (
        this.textarea1.indexOf(",") != -1 ||
        this.textarea1.indexOf(":") != -1
      )
        return this.$message("备注不能出现英文状态下的逗号或者冒号");
      if (this.lowerhairtime == "") return this.$message("请选择截止时间");
      this.dialogFormVisible4 = false;
      console.log(
        `任务ID${this.multipleSelectionid.toString()}-------任务名${this.multipleSelectionname.toString()}----下发城市${this.userIds.toString()}`
      );
      this.$http
        .newTaskpublish({
          unitId: this.unitId,
          endTime: this.lowerhairtime,
          taskIds: this.multipleSelectionid.toString(),
          taskNames: this.multipleSelectionname.toString(),
          acceptUserIds: this.userIds.toString(),
          remark: this.textarea1,
          user: this.userId
        })
        .then(res => {
          this.userIds = [];
          this.multipleSelectionid = [];
          this.multipleSelectionname = [];
          this.distributeuser = [];
          console.log(res);
          this.queryTaskListfn();
          return res.code == 200
            ? this.$message.success(res.message)
            : this.$message(res.data || res.message);
        });
    },
    // 1 查看 2删除
    vieworedit(data, type) {
      console.log(data);
      this.taskName = data.name;
      this.taskId = data.id;
      if (type == 1) {
        if (data.types == undefined) {
          this.$router.push({
            name: "taskgeneration/taskview",
            query: {
              taskName: this.taskName,
              taskId: this.taskId,
              createUser: data.createUser,
              formState: data.state
            }
          });
        } else if (data.types == "form_task") {
          this.$router.push({
            name: "formmanagement/formview",
            query: {
              formName: this.formName,
              formId: data.formId
            }
          });
        }
      } else if (type == 2) {
        this.$confirm("是否继续删除这条任务记录?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$http
              .deleteTask({
                unitId: this.unitId,
                userId: this.userId,
                taskId: this.taskId
              })
              .then(res => {
                console.log(res);
                this.queryTaskListfn();
                res.code == 200
                  ? this.$message.success("删除成功")
                  : this.$message(res.data || res.message);
              });
          })
          .catch(() => {});
      } else if (type == 5) {
        this.$router.push({
          name: "nextview",
          query: {
            taskName: this.taskName,
            vivewType: 1,
            taskId: data.taskId
          }
        });
      } else if (type == 6) {
        this.$router.push({
          name: "nextview",
          query: {
            taskName: this.taskName,
            vivewType: 2,
            taskId: data.taskId
          }
        });
      } else if (type == 7) {
        this.$router.push({
          name: "nextview",
          query: {
            taskName: this.taskName,
            vivewType: 3,
            taskId: data.taskId
          }
        });
      }
    },
    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f2f2f2";
      } else {
        return "";
      }
    },

    // 新增按钮
    addtaskbtn() {
      if (!this.$refs.child.dialogTableVisible) {
        this.$refs.child.dialogTableVisible = true;
      }
    },

    // 分页查看
    handleCurrentChange(page) {
      console.log(page);
      this.pageIndex = page;
      this.queryTaskListfn();
    },
    handleSizeChange(size) {
      console.log(size);
      this.currentpage1 = 1;
      this.pageSize = size;
      this.queryTaskListfn();
    },
    handleSizeChange1(size) {
      this.tableData = [];
      this.currentpage = 1;
      this.pageSize = size;
      this.fenye(1);
    },
    handleCurrentChange1(page) {
      let _this = this;
      _this.tableData = [];
      console.log(page);
      console.log(`页数${page}`);
      console.log(`pagesize${_this.pageSize}`);
      _this.fenye(page);
    },
    // 自定义分页---专项任务
    fenye(page) {
      let _this = this;
      for (let i in _this.tableData1) {
        console.log(i);
        if (
          i >= parseInt((page - 1) * _this.pageSize) &&
          i < parseInt((page - 1) * _this.pageSize + _this.pageSize)
        ) {
          console.log(_this.tableData1[i]);
          _this.tableData.push(_this.tableData1[i]);
        }
      }
      console.log(_this.tableData);
    },
    // 右键
    contextmenu(row) {
      console.log(row);
    }
  },
  mounted() {
    this.roleId == 3 ? this.queryuserTaskListfn() : this.queryTaskListfn();
  },
  watch: {
    $route() {
      this.taskState = this.$route.query.taskState;
      this.queryuserTaskListfn();
    }
  }
};
</script>

<style lang="less" scoped>
.textarea_div {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    width: 45px;
  }
  .el-textarea {
    width: 80%;
  }
}
.top_acc {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.quexiafa {
  text-align: right;
}
</style>