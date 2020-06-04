<template>
  <div class="topheader">
      <header>
          <div class="left_info">
              <h3>你好,<span style="font-size:18px;font-weight: bold;">{{username}}</span> 欢迎来到电话号码资源管理系统！</h3>
          </div>
          <div class="right_operation">
              <a href="javascript:" @click="dialogFormVisible2 = true">
                    <i class="el-icon-user"></i>
                    <span>个人信息</span>
              </a>
                <a href="javascript:" @click="dialogFormVisible = true">
                    <i class="el-icon-edit"></i>
                    <span>修改密码</span>
                </a>
                <a href="javascript:" @click="logoutfn">
                    <i class="el-icon-timer"></i>
                    <span>退出登录</span>
                </a>
          </div>
      </header>


       <!-- 修改密码 -->
       <div>
           <el-dialog 
           title="修改当前账号登录密码" 
           :visible.sync="dialogFormVisible"
           width="320px"
           >
                <el-form :model="editpas">
                    <el-form-item label="* 原密码" :label-width="formLabelWidth">
                        <el-input v-model='editpas.oldPassword' show-password placeholder="输入原密码"></el-input>
                    </el-form-item>
                    <el-form-item label="* 新密码" :label-width="formLabelWidth">
                        <el-input v-model="editpas.newPassword" type="password" show-password placeholder="输入新密码" minlength="6" maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="* 确认密码" :label-width="formLabelWidth">
                        <el-input v-model="editpas.newPassword2" type="password" show-password placeholder="再次输入新密码" minlength="6" maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pwssubmit" size="mini">确 定</el-button>
                </div>
            </el-dialog>
       </div>

       <!-- 查看个人信息 -->
       <div>
           <el-dialog 
           title="个人信息" 
           :visible.sync="dialogFormVisible2"
           width="320px"
           >
                <el-form :model="editpas">
                    <el-form-item label="姓名" :label-width="formLabelWidth2">
                        <el-input v-model="username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="账号" :label-width="formLabelWidth2">
                        <el-input v-model="account" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="职别" :label-width="formLabelWidth2">
                        <el-input v-model="identity" disabled></el-input>
                    </el-form-item>
                </el-form>
            </el-dialog>
       </div>
  </div>
</template>

<script>
export default {
  props:{
  },
  data () {
    return {
        account:'',
        username:'',
        identity:'',
        roleId:sessionStorage.getItem("roleId"),
        userId:sessionStorage.getItem("userID"),
        unitId:sessionStorage.getItem("unitId"),
        unreadnum:'',
        pageIndex:1,
        pageSize:10,
        tableData:[],
        radio:2,
        msgid:[],
        countData:0,
        gridData: [],
        dataType:'',
        tableName:'',
        objectId:'',
        formLabelWidth:'80px',
        formLabelWidth2:"60px",
        dialogFormVisible:false,
        dialogFormVisible2:false,
        editpas:{
            oldPassword:'',
            newPassword:'',
            newPassword2:'',
        },
        isdrawer:false,
    }
  },
  methods:{

    logoutfn(){
          this.$confirm('是否退出登录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            sessionStorage.clear();
            this.$router.push({
                path:'/'
            })
        }).catch(() => {});
    },



    // 修改密码
    pwssubmit(){
        if(this.editpas.oldPassword != '' && this.editpas.newPassword != '' && this.editpas.newPassword2 !=''){
            if(this.editpas.newPassword === this.editpas.newPassword2){
                if(this.editpas.newPassword.length >= 6 && this.editpas.newPassword.length <= 20){
                    this.$http.editPassword({
                        oldPassword:this.editpas.oldPassword,
                        newPassword:this.editpas.newPassword,
                        userId:this.userId,
                        operationUserId:this.userId,
                    }).then(res =>{
                        console.log(res)
                        if(res.code == 301){
                            let _this = this;
                            this.dialogFormVisible = false;
                            this.$message.success('密码修改成功，请使用新密码重新登录')
                            setTimeout(function(){
                                sessionStorage.clear();
                                _this.$router.push({
                                    path:'/'
                                })
                            },1500)
                        }else{
                            this.$message(res.message)
                        }
                    })
                }else{
                    this.$message('密码不能小于6位数，不得大于20位数')
                }
                
            }else{
                this.$message('两次新密码不一致')
            }
        }else{
            this.$message('信息不完整')
        }
    }

  },
   watch: {
      dialogFormVisible() {
        if(!this.dialogFormVisible){
            this.editpas.oldPassword = '';
            this.editpas.newPassword = '';
            this.editpas.newPassword2 = '';
        }
      }
    },
  mounted(){
      let _this = this;
      this.account = sessionStorage.getItem('account');
      this.identity = sessionStorage.getItem('roleName');
      this.username = sessionStorage.getItem('username');
      if(this.unitId == 0){
          this.identity = '超级管理员'
      } 
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .topheader{
        header{
            background: #fff;
            height:64px;
            border-bottom: 15px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 15px;
            box-sizing: border-box;
            color: #333;
            width: calc(~"100% - 200px");
            margin-left:200px;
            .left_info{
                display: flex;
                align-items: center;
                h3{
                    font-size: 14px;
                    font-weight: 100;
                }
                a{
                    font-size: 14px;
                    margin: 0 15px;
                    .marker{
                        display: inline-block;
                        background: #FD482C;
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        box-sizing: border-box;
                        text-align: center;
                       
                    }
                }
            }
            .right_operation{
                display: flex;
                align-items: center;
                a{
                    color: #555;
                    font-size: 14px;
                    margin-left: 20px;
                }
                p{
                    span{
                        margin: 0 2px;
                    }
                }
            }
        }
    }
</style>
<style lang="less">
.topheader .el-drawer__header{
    display: none;
}
.calsname{
    height:50% !important;
    padding: 10px 15px;
    box-sizing: border-box;
    overflow: auto;
}
.el-table__body-wrapper{
    height: auto !important;
}
.btncz{
    text-align: right;
    margin-bottom: 15px;
}
.block{
    margin-top: 15px;
}

.topheader .el-dropdown{
    color: #fff;
    font-size: 16px;
    cursor: pointer;
}
.topheader .el-dropdown-menu{
    padding:10px 15px;
    font-size: 14px;
    p{
        line-height: 30px;
    }
}
</style>