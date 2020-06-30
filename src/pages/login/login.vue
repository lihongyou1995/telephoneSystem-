<template>
    <div class="login" id="login">
        <!-- <header class="header-top">
            <i class="bg-icon"></i>
            <span>欢迎登录后台管理界面平台</span>
        </header> -->
        <div class="logo">
            <!-- <img src="../../../static/images/biaoti_03.png" alt=""> -->
        </div>
        <main class="content">
            <div class="loginform">
                <div class="login-r">
                    <div class="input-cor">
                        <!-- <span><img src="../../../static/images/login_03.png" alt=""></span> -->
                        <span>账 号</span>
                        <input type="text" placeholder="请输入账号" v-model="account">
                    </div>
                    <div class="input-cor">
                        <!-- <span><img src="../../../static/images/login_06.png" alt=""></span> -->
                        <span>密 码</span>
                        <input type="password" placeholder="请输入密码" v-model="password">
                    </div>
                    <div class="login_btn">
                        <!-- <button class="login-btn" @click="submit">登录</button> -->
                         <el-button class="login-btn" type="primary" @click="submit" size="mini">登 录</el-button>
                    </div>

                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name:'login',
    data(){
        return{
            account:'',   //superadmin user A-tb
            password:'',
            name:'login',
        }
    },
    methods:{
         submit(){
            if(this.account == '' || this.password == '') return this.$message('账号和密码不能为空');
            const loading = this.$loading({
                lock: true,
                text: '正在登录，请稍后...',
            });
            this.$http.login({
                account:this.account,
                password:this.password
            }).then( res=> {
                console.log(res)
                loading.close();
                if(res.code == 200){
                    sessionStorage.setItem("lastTime",new Date().getTime());
                    sessionStorage.setItem('token',res.data.token);
                    sessionStorage.setItem('userID',res.data.userVO.userID);
                    sessionStorage.setItem('unitId',res.data.userVO.unitId);
                    sessionStorage.setItem('roleId',res.data.userVO.roleId);
                    sessionStorage.setItem('unitName',res.data.userVO.unitName);
                    sessionStorage.setItem('account',res.data.userVO.account);
                    sessionStorage.setItem('roleName',res.data.userVO.roleName);
                    sessionStorage.setItem('username',res.data.userVO.username);
                    this.$router.push({
                        name:'home',
                        params:{
                            isLogin:true
                        }
                    });
                }else{
                    this.$message.error(res.message)
                }
            }).catch( res=>{
               loading.close();
            })
         },
    },
    mounted(){
      // this.$http.test({
      //   epContent: '111',
      //   epDescribe: '222',
      //   epEnclosure: '33',
      //   epNumber: '333',
      //   epTarget: '33',
      //   epYear: '33',
      //   id: '333',
      // }).then(res=>{
      //     console.log(res)
      // })
    },
    created() {
        let that = this;

        document.onkeypress = function(e) {
        var keycode = document.all ? event.keyCode : e.which;
        if (keycode == 13 && document.location.hash == "#/") {
            if(that.name == 'login'){
                that.submit();// 登录方法名
                return false;
            }

        }
    };
  }
}
</script>

<style lang="less" scoped>
    .logo{
        text-align: center;
        width:800px;
        height:58px;
        position: fixed;
        top:calc(~'50% - 300px');
        left:calc(~'50% - 400px');
        background: url('../../../static/images/biaoti_03.png') no-repeat;
        background-size: 100% 100%;
    }
    .login{
        width: 100%;
        height: 100%;
        position: fixed;
        background: url('../../../static/images/bg.jpg') no-repeat;
        background-size: cover;
        .header-top{
            background: #2d79bc;
            display: flex;
            align-items: center;
            padding-left: 20px;
            box-sizing: border-box;
            height: 48px;
            .bg-icon{
                display: block;
                width: 15px;
                height: 15px;
                background: url('../../../static/images/tub.png') no-repeat;
                background-size: cover;
                margin-right: 8px;
            }
            span{
                color: #ffffff;
                font-size: 12px;
                font-weight: bold;
            }
        }
        .content{
            padding: 0;
            display: flex;
            align-items: center;
            position: fixed;
            width: 100%;
            height: 100%;

            .login_btn{
                text-align: center;
                height: 35px;
                width: 100%;
            }
            .loginform{
                display: flex;
                margin: 0 auto;
                .login-l{
                    width: 222px;
                    height: inherit;
                    background: url(../../../static/images/zuot_03.png) no-repeat;
                    background-size: 100% 100%;
                }
                .login-r{
                    height: inherit;
                    padding:70px;
                     border-radius:5px;
                     background: url(../../../static/images/kuang_03.png) no-repeat;
                     background-size: 100% 100%;
                     box-sizing: border-box;
                    h1{
                        font-weight: normal;
                        font-size: 18px;
                        color: #005aaa;
                        line-height: 75px;
                        text-align: left;
                    }
                    .input-cor{
                        height:40px;
                        align-items: center;
                        box-sizing: border-box;
                        margin-bottom: 30px;
                        span{
                            display: inline-block;
                            height: 16px;
                            margin-right: 10px;
                            color: #00baff;
                            img{
                                width: inherit;
                                height: inherit;
                            }
                        }
                        input{
                            width:260px;
                            height: 40px;
                            background: url('../../../static/images/mm_03.png') no-repeat;
                            background-size: 100% 100%;
                            padding-left: 12px;
                            box-sizing: border-box;
                            color: #00baff;
                        }
                        input::placeholder{
                            color: #1f5ea1;
                        }

                    }
                    .login-btn{
                        width:260px;
                        height:38px;
                        font-size: 16px;
                        border: none;
                        float: right;
                        background: #00baff;
                    }

                }
            }
        }
    }
</style>
