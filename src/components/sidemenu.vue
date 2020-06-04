<template>
  <div class="sidemenu">
    <h3>电话号码资源综合管理系统</h3>
    <el-row class="tac" style="width:100%;">
      <el-col style="width:100% !important">
        <el-menu
          style="width:100%"
          v-show="roleId == 1"
          :default-active="defaultActive"
          router
          class="el-menu-vertical-demo"
          background-color="#31475E"
          text-color="#fff"
          active-text-color="#01b841"
          @open="handleOpen"
          @close="handleClose"
          @select="sideactiv"
          unique-opened
          >
          <el-menu-item index="home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="commonphonebook" v-if="unitId != 0">
            <i class="el-icon-phone"></i>
            <span slot="title">常用电话本</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="messagereminder" v-if="unitId != 0">
            <i class="el-icon-info"></i>
            <span>消息提醒</span>
            <el-badge class="mark" :value="unreadnum" v-show="unreadnum > 0" />
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="unitmanagement">
            <i class="el-icon-s-flag"></i>
            <span slot="title">单位管理</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="usermanagement">
            <i class="el-icon-user-solid"></i>
            <span slot="title">账户管理</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="formmanagement" v-if="unitId != 0">
            <i class="el-icon-s-order"></i>
            <span slot="title">表单管理</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="taskgeneration" v-if="unitId != 0">
            <i class="el-icon-s-claim"></i>
            <span slot="title">任务生成</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="querystatistics" v-if="unitId != 0">
            <i class="el-icon-s-data"></i>
            <span slot="title">查询统计</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="logmanagement">
            <i class="el-icon-s-grid"></i>
            <span slot="title">日志管理</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="unitdictionary" v-show="unitId == 0">
            <i class="el-icon-s-platform"></i>
            <span slot="title">单位字典</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="serverManagement" v-show="unitId == 0">
            <i class="el-icon-coin"></i>
            <span slot="title">服务器监控</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
        </el-menu>

         <el-menu
          v-show="roleId == 2"
          :default-active="defaultActive"
          router
          class="el-menu-vertical-demo"
          background-color="#31475E"
          text-color="#fff"
          active-text-color="#01b841"
          @open="handleOpen"
          @close="handleClose"
          @select="sideactiv"
          unique-opened
          >
          <el-menu-item index="home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="commonphonebook">
            <i class="el-icon-phone"></i>
            <span slot="title">常用电话本</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="messagereminder">
            <i class="el-icon-info"></i>
            <span>消息提醒</span>
            <el-badge class="mark" :value="unreadnum" v-show="unreadnum > 0" />
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="formmanagement">
            <i class="el-icon-s-order"></i>
            <span slot="title">表单填报</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="taskgeneration">
            <i class="el-icon-s-claim"></i>
            <span slot="title">任务填报</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="querystatistics">
            <i class="el-icon-s-data"></i>
            <span slot="title">查询统计</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
        </el-menu>


        <el-menu
           v-if="roleId == 3"
           :default-active="defaultActive"
            router
            class="el-menu-vertical-demo"
            background-color="#31475E"
            text-color="#fff"
            active-text-color="#01b841"
            @open="handleOpen"
            @close="handleClose"
            @select="sideactiv"
            unique-opened 
          >
         <el-menu-item index="home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="commonphonebook">
            <i class="el-icon-phone"></i>
            <span slot="title">常用电话本</span>
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-menu-item index="messagereminder">
            <i class="el-icon-info"></i>
            <span>消息提醒</span>
            <el-badge class="mark" :value="unreadnum" v-show="unreadnum > 0" />
            <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
           <el-menu-item index="querystatistics">
            <i class="el-icon-s-data"></i>
            <span slot="title">查询统计</span>
             <i class="el-icon-arrow-right right-icon"></i>
          </el-menu-item>
          <el-submenu index="form">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span>常用表单</span>
            </template>
            <el-menu-item-group>
              <!-- <el-menu-item v-for="(item,index) in formAttributeList" :key="index" :index="item.formAttribute">{{item.formAttribute}}<i class="el-icon-arrow-right right-icon"></i></el-menu-item> -->
              <ul>
                <li @click="menuli(item.attribute)" class="meli" v-for="(item,index) in formAttributeList" :key="index">
                  {{item.attribute}}
                </li>
              </ul>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="task">
            <template slot="title">
              <i class="el-icon-s-claim"></i>
              <span>大项任务</span>
            </template>
            <el-menu-item-group>
              <ul>
                <li @click="taskmenu(item.attribute)" class="meli" v-for="(item,index) in getTaskAtrList" :key="index">
                  {{item.attribute}}
                </li>
              </ul>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>

    </el-row>
  </div>
</template>

<script>
export default {
  
  data () {
    return {
      menuname2:'表单管理',
      formAttributeList:[], // 表单属性
      getTaskAtrList:[], // 任务属性
      column:'',  // 分类
      unreadnum:'0', // 未读消息数量
      defaultActive:'home',
      amsg:0,
      userId:sessionStorage.getItem('userID'),
      roleId:sessionStorage.getItem('roleId'),
      unitId:sessionStorage.getItem('unitId'),
    }
  },
  methods:{
    handleOpen(key) {
      console.log('--------'+key);
      this.column = key;
    },
    handleClose(key) {
      // console.log(key);
    },
    // 表单
    menuli(item){
      console.log(item)
       this.$router.push({
         name:'formmanagement',
         query:{
           formState:item
         }
       })
    },
    // 任务
    taskmenu(item){
      this.$router.push({
         name:'taskgeneration',
         query:{
           taskState:item
         }
       })
    },
    sideactiv(index){
      sessionStorage.setItem('routeName',index);
    },

    // 查询表单属性
    queryFormAttributefn(){
      this.$http.getFormAtrribute().then(res =>{
        console.log(res)
        if(res.code == 200){
          this.formAttributeList = res.data;
        }
      })
    },
    // 查询任务属性
    getTaskAtrfn(){
      this.$http.getTaskAtr().then(res =>{
        console.log(res)
        if(res.code == 200){
          this.getTaskAtrList = res.data;
        }
      })
    },

    // 获取未读消息总数
    getcountUnreadfn(){
        this.$http.countUnread(`userId=${this.userId}`).then(res =>{
          console.log(res)
          if(res.code == 200){
             this.mseSetItem('unreadnum',res.data);
          }
        })
    },
    setCurrentRoute () {
      console.log(this.defaultActive)
      if(this.$route.name.indexOf(this.defaultActive) == -1) return this.defaultActive = this.$route.name;
    },


  },
   watch: {
    $route () {
      this.setCurrentRoute()
    }
  },
  mounted(){
    this.unreadnum = sessionStorage.getItem('unreadnum');
    this.getcountUnreadfn();
    if(this.roleId == 3){
      this.queryFormAttributefn();
      this.getTaskAtrfn();
    }
  },
  created(){
    this.setCurrentRoute()
      window.addEventListener('setItem', ()=> {
          this.unreadnum = sessionStorage.getItem('unreadnum');
      })
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
@media screen and (max-width:1300px){
  .sidemenu{
    overflow-y: scroll;
  }
}
.meli{
  color: #fff;
  text-align: center;
  line-height: 45px;
  cursor: pointer;
  font-size: 14px;
}
.meli:hover{
  background: rgb(39, 57, 75)
}
.sidemenu{
  position: fixed;
  height: 100%;
  background: #31475E;
  width: 200px;
  top: 0;
  box-sizing: border-box;
  .el-icon-s-order{
    color: #fff;
      box-sizing: border-box;

  }
  
  h3{
    font-size: 14px;
    text-align: center;
    line-height:50px;
    color: #fff;
    background: #4B5D7A;
    font-weight: bold;
  }
  .el-menu-item i{
    color: #fff;
  }

}
  .right-icon{
    float: right;
    margin-top: 23px;
    font-size: 12px;
    text-align: right;
    margin-right: 0;
  }
</style>
