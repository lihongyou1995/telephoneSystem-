<template>
  <div class="userlog">
       <div class="dialog dialogform2">
                <el-dialog 
                    title="推送日志"
                    :visible.sync="dialogFormVisible"
                    width="1200px"
                >   
                <div class="table2">
                 <el-table
                    border
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    :header-cell-style="getRowClass"
                    >
                    <el-table-column
                        prop="sysLog.operation"
                        label="操作记录"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sysLog.userName"
                        label="操作人"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="sysLog.operationTime"
                        label="时间"
                        align="center"
                        >
                    </el-table-column>

                </el-table>
            </div>
                </el-dialog>
            </div>
  </div>
</template>

<script>
export default {
  name: 'userlog',
  data () {
    return {
        dialogFormVisible:false,
        formLabelWidth:'100px',
        currentPage4:1,   // 默认选中的页数
        userId:sessionStorage.getItem('userID'),    // 用户id
        unitId:sessionStorage.getItem('unitId'),    // 单位id
        roleId:sessionStorage.getItem('roleId'), // 权限id
        pageIndex:1,
        pageSize:10,
        tableData:[],
        firstDate:'', // 初始时间
        lastDate:'', // 结束时间
        countData:0, // 总数
        logId:[], // 日志id
    }
  },
  methods:{

    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                    return 'background:#f2f2f2'
            } else {
                    return ''
            }
    },


  },
  created() {
    this.$watch("dialogFormVisible", function (newValue, oldValue) {
    if(this.dialogFormVisible==true){
            this.$http.getRemind(`userId=${this.userId}`).then(res =>{
                console.log(res)
                if(res.code == 200){
                    res.data.list.forEach(e => {
                         this.logId.push(e.id)
                    });
                    console.log(this.logId)
                    this.$http.setRead({
                        logRemindId:this.logId.toString(),
                    }).then(res =>{
                        console.log(res)
                    })
                    this.tableData = res.data.list;
                }else{
                    this.$message(res.data)
                }
               
            })
        }
    })
},
  mounted(){
       if(this.roleId == 3){
          this.$router.push({
              path:'noauthority',
          })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
<style lang="less">
    .userlog{
        .el-dialog__body{
            display: block !important;
        }
        .el-table__body-wrapper{
            height: 300px !important;
            overflow: auto;
        }
    }
    .el-dialog__header{
        background: #333333;
        .el-dialog__title{
            font-size: 14px;
            color: #fff;
        }
        .el-dialog__close{
            color: #fff;
        }
    }
</style>
