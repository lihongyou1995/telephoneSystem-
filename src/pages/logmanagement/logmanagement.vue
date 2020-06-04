<template>

  <div class="logmanagement">

     <!-- 弹框 -->
  <div class="check1">
    <el-drawer direction="rtl" title="日志操作详情" center :visible.sync="viewDetailVisible" size="55%">  
      <!-- <div v-for="(viewDetailtable,key) in viewDetailtableData" :key="key"> -->
        <el-table  border max-height="700" :data="viewDetailtableData" stripe style="width: 100%" :header-cell-style="getRowClass" >
          <el-table-column :resizable="false" v-for="(item, index) in viewDetailheaderData" :key="index" :label="item" :property="item" align="center" :render-header="renderHeader">
          </el-table-column> 
        </el-table>
      <!-- </div> -->
  </el-drawer>
  </div>
     <!-- 弹框 -->

    <div class="content">
      <div class="top_acc">
        <div class="block" style="margin-top:0;">
          <span class="demonstration">选择时间范围</span>
          <el-date-picker
            v-model="firstDate"
            type="datetime"
            placeholder="选择开始时间"
            @change="firstDatevalue"
          ></el-date-picker>
        </div>
        <div class="block" style="margin-top:0;">
          <!-- <span class="demonstration">至</span> -->
          <el-date-picker
            v-model="lastDate"
            type="datetime"
            placeholder="选择结束时间"
            @change="lastDatevalue"
          ></el-date-picker>
        </div>
        <div>
          <el-select v-model="unitNameId" clearable @change="getUnitName" placeholder="请选择单位">
            <el-option
              v-for="item in logUnit"
              :key="item.unitId"
              :label="item.unitName"
              :value="item.unitId"
            ></el-option>
          </el-select>
        </div>
        <div>
          <el-select v-model="logTypeName" clearable @change="getLogType" placeholder="选择类型/表单/任务">
            <el-option v-for="item in logType" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="searchlog">搜索</el-button>
        </div>
        <!-- <div>
                        <el-button v-if="unitId != 0" type="primary" size="mini" @click="getuserlog">查看用户推送日志<span v-if="unreadcoun" style="color:yellow;margin-left: 10px;">(未读：{{unreadcoun}})</span></el-button>
                        <el-button type="success" size="mini" @click="logpush">推送</el-button>
        </div>-->
      </div>
      <div class="table">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          :header-cell-style="getRowClass"
          @selection-change="chooseInstance"
          @row-click="handleRowClick"
        >
          <el-table-column prop="unitName" label="单位" width="90" align="center" fixed="left"></el-table-column>
          <el-table-column prop="username" label="用户名" width="150" align="center" ></el-table-column>
          <el-table-column prop="roleName" label="身份标识" width="90" align="center" ></el-table-column>
          <el-table-column prop="type" label="类型" width="100" align="center" ></el-table-column>
          <el-table-column
            prop="name"
            label="表单/任务 名称"
            align="center"
            min-width="150"
            max-width="300"
          ></el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            align="center"
            max-width="100"
          ></el-table-column>
          <el-table-column prop="operationTime" label="操作时间" align="center" width="160"></el-table-column>
          <el-table-column label="操作详情"   align="center" fixed="right" width="160"> 
            <template  slot-scope="scope"> 
                <el-button type="primary" size="small" @click="viewDetail(scope.row.dataMessage)" v-if="scope.row.dataMessage.length">查看操作详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div style="margin-top: 20px">
        <el-pagination
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next"
          :total="countData"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <userlog ref="child"></userlog>

      <!-- 下级列表 -->
      <div class="dialog3">
        <el-dialog title="选择被推送人" :visible.sync="dialogFormVisible2" width="400px">
          <div>
            <el-radio
              @change="changeuser"
              v-for="(city,index) in pushdataList"
              :key="index"
              :label="city[0].userID"
              v-model="userinfo"
            >{{city[0].account}}</el-radio>
          </div>
          <div class="tuisong">
            <el-button type="primary" size="mini" @click="confirmpush">确认推送</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import userlog from './component/userlog'
export default {
  name: 'logmanagement',
  components: {
    userlog
  },
  data () {
    return {
      viewDetailVisible:false,
      viewDetailtableData:[],
      viewDetailheaderData: [],
      roleId: sessionStorage.getItem('roleId'),
      userId: sessionStorage.getItem('userID'),
      unitId: sessionStorage.getItem('unitId'),
      dialogFormVisible2: false,
      formLabelWidth: '100px',
      currentPage4: 1, // 默认选中的页数
      pageIndex: 1,
      pageSize: 10,
      tableData: [],
      firstDate: '', // 初始时间
      lastDate: '', // 结束时间
      countData: 0, // 总数
      unreadcoun: '', // 未读数量
      pushlogid: '', // 推送的日志id
      pushdataList: [], // 单位级别
      userinfo: '',
      logUnit: [],
      unitNameId: '',
      logType: [
        {
          id: 1,
          name: '表单'
        },
        {
          id: 2,
          name: '任务'
        }
      ],
      logTypeName: ''
    }
  },
  methods: {
    // 显示详情弹框
    viewDetail(row){
      this.viewDetailVisible = true 
      let jsonData = JSON.parse(row)
      let common_table_info= []
      for(let v in jsonData){
        // let a = {}
        let header = []
        for(let i in jsonData[v]){
          header.push(i)
        }
        // common_table_info.push([a]);
        // this.viewDetailheaderData.push(v)
        this.viewDetailheaderData = header
      }
      this.viewDetailtableData = jsonData 
    },
    renderHeader (h,{column}) {
      if (column.property.length > 100) {
          return h(
            'div',
            [ 
              h('el-tooltip',{
  　　　　      props:{
  　　　　　　　　effect:'dark',
  　　　　　　　　content: column.property,
  　　　　　　　　placement:'top'
  　　　　　　},　　　 
  　　　　 },[
                  h('label', column.label.slice(0,6)+'...'),
              ],{
                  content: column.label
              })
            ],
          );
      } else {
          return h(
            'div',
            [ 
              h('label', column.label),
            ],
          );
      }
      
    },
    // 获取单位
    getLogUnit () {
      this.$http.getLogUnit(`userId=${this.userId}`).then(res => {
        // console.log(res)
        res.code == 200 ? (this.logUnit = res.data) : ''
      })
    },
    // 选择单位
    getUnitName (id) {
      // console.log(id)
      this.unitNameId = id
    },

    // 选择类型
    getLogType (id) {
      // console.log(id)
      this.logTypeName = id
    },

    // 获取用户日志
    queryLogdata () {
      if (!this.firstDate) {
        this.firstDate = ''
      }
      if (!this.lastDate) {
        this.lastDate = ''
      }
      this.$http
        .getLogNew(
          `userId=${this.userId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}&firstDate=${this.firstDate}&lastDate=${this.lastDate}&unitId=${this.unitNameId}&type=${this.logTypeName}`
        )
        .then(res => {
          // console.log(res)
          if (res.data.list.length > 0) {
            res.data.list.forEach(res => {
              switch (res.type) {
                case 0:
                  res.type = '系統日志'
                  break
                case 1:
                  res.type = '表单'
                  if (res.formName != '') {
                    res.name = res.formName
                  } else {
                    res.name = '该表单已被删除'
                  }
                  break
                case 2:
                  res.type = '任务'
                  if (res.taskName != '') {
                    res.name = res.taskName
                  } else {
                    res.name = '该任务已被删除'
                  }
                  break
                case 3:
                  res.type = '用戶操作'
                  break
              }
            })
          }
          this.tableData = res.data.list
          this.countData = res.data.countData
        })
    },

    // 点击行触发，选中或不选中复选框
    handleRowClick (row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },

    // 搜索日志
    searchlog () {
      this.queryLogdata()
    },

    // size改变回调
    handleSizeChange (size) {
      // console.log(size)
      this.pageSize = size
      this.queryLogdata()
    },
    // page改变回调
    handleCurrentChange (page) {
      this.pageIndex = page
      // console.log(page)
      this.queryLogdata()
    },

    // 改变表头颜色
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f2f2f2'
      } else {
        return ''
      }
    },

    // 判断单选
    chooseInstance (rows) {
      // console.log(rows)
      if (rows.length > 0) {
        this.pushlogid = rows[0].id
      } else {
        this.pushlogid = ''
      }
      this.multipleSelection = rows
      if (this.multipleSelection.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.multipleSelection[0])
      }
    },

    // 未读数量
    unreadnum () {
      this.$http.unread(`/sysLog/unread?userId=${this.userId}`).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.unreadcoun = res.data
        }
      })
    },

    // 推送按钮事件
    logpush () {
      // console.log(this.pushlogid)
      if (this.pushlogid) {
        this.pushdataList = []
        // 获取下级管理员
        this.$http
          .acquireSubordinateManagers(
            `/sysLog/acquireSubordinateManagers?userId=${this.userId}`
          )
          .then(res => {
            // console.log(res)
            if (res.code == 200) {
              if (res.data.length == 0) {
                return this.$message('没有可接收的用户')
              }
              this.dialogFormVisible2 = true
              res.data.forEach(res => {
                console.log(res)
                if (res.length > 0) {
                  this.pushdataList.push(res)
                }
              })
            } else {
              this.$message(res.data || res.message)
            }
          })
      } else {
        this.$message('请选择要推送的日志')
      }
    },
    // 选择被推送人
    changeuser (e) {
      // console.log(e)
      this.userinfo = e
    },
    // 确认推送
    confirmpush () {
      if (this.userinfo != '') {
        this.$http
          .addRemind({
            logId: this.pushlogid,
            userId: this.userinfo
          })
          .then(res => {
            console.log(res)
            if (res.code == 200) {
              this.dialogFormVisible2 = false
              this.queryLogdata(this.pageIndex, this.pageSize)
              this.$message({
                message: '推送成功',
                type: 'success'
              })
            } else {
              this.$message('推送失败,请重试')
            }
          })
      }
    },
    // 获取用户推送日志
    getuserlog () {
      if (!this.$refs.child.dialogFormVisible) {
        this.$refs.child.dialogFormVisible = true
      }
    },
    // 时间戳转换
    dateToMs (date) {
      let result = new Date(date).getTime()
      return result
    },
    // 初始时间
    firstDatevalue (date) {
      this.firstDate = this.dateToMs(date)
      // console.log(this.firstDate)
    },
    // 结束时间
    lastDatevalue (date) {
      this.lastDate = this.dateToMs(date)
      // console.log(this.lastDate)
    }
  },
  mounted () {
    if (this.roleId == 3) {
      this.$router.push({
        path: 'noauthority'
      })
    }
    this.queryLogdata(this.pageIndex, this.pageSize) // 查询日志列表
    this.unreadnum()
    this.getLogUnit()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.content {
  margin-top: 20px;
  padding: 15px;
  box-sizing: border-box;
  // border: 1px solid #dddddd;
  .top_acc {
    display: flex;
    align-items: center;
    > div {
      margin-right: 15px;
      font-size: 14px;
    }
  }
  .table {
    margin-top: 15px;
  }
  .fomrdiv1 {
    border-bottom: 1px solid #dddddd;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
  .radio {
    padding-left: 33px;
  }
}
</style>
<style lang="less">
.logmanagement {
  .table {
    // .el-table__body-wrapper{
    //     height: 400px;
    //     overflow: auto;
    // }
    thead {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
  .dialog3 {
    .el-dialog__body {
      display: block;
      .tuisong {
        text-align: right;
        margin-top: 15px;
      }
    }
  }
}

.check1 .el-drawer__header {
  margin-bottom: 0px!important;
  padding: 20px!important;
  background: #333333;
  color: #ffffff;
}
</style>
