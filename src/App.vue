<template>
  <div id="app" @click="isDo()">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      lastTime: null, //最后一次点击的时间
      currentTime: null, //当前点击的时间
      timeOut: 60 * 60 * 1000, //设置超时时间
    }
  },
  methods: {
    isDo() {
      if(sessionStorage.getItem('userID')){
          this.currentTime = new Date().getTime(); //记录这次点击的时间
          this.lastTime = sessionStorage.getItem('lastTime')
          if(this.currentTime - this.lastTime > this.timeOut) {
                this.$message('由于您长时间未操作，登录已过期，请重新登录')
                sessionStorage.clear();
                  this.$router.push({
                      path:'/'
                })
          } else {
              sessionStorage.setItem("lastTime",new Date().getTime());
          }
        }
      }
    },
    mounted(){

    },
    mounted(){
      this.currentTime = new Date().getTime(); //记录这次点击的时间
    }
}
</script>
<style >
/* 解决table表头与数据不对齐 */
body .el-table th.gutter{
    display: table-cell!important;
}

</style>
