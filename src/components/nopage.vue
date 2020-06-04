<template>
  <div class="nopage">
  <div class="content">
      <h1>4 0 4</h1>
      <p>哦哟~您好像走丢了...</p>
     <p style="margin-top:15px;">
        <el-button @click="toHome">返回首页</el-button>
     </p>
  </div>
        
  </div>
</template>

<script>
export default {
  name: 'nopage',
  data () {
    return {
     
    }
  },
  methods:{
    toHome(){
      this.$router.push({ 
          name:'home',  
      })
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .nopage{
        color: rgb(1, 184, 65);
        h1{
            font-size: 268px;
            text-align: center;
        }
        p{
            text-align: center;
            font-size: 28px;
        }
    }
</style>
