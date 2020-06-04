<template>
    <div class="serverManagement">
        <div class="circle_content">
            <div class="circle">
                <p>cpu使用率</p>
                <el-progress type="circle" :percentage="upuInfo"></el-progress>
            </div>
            <div class="circle">
                 <p>磁盘使用率</p>
                <el-progress type="circle" :percentage="hdIOpPercent"></el-progress>
            </div>
            <div class="circle">
                 <p>内存使用率</p>
                <el-progress type="circle" :percentage="memoryUsage"></el-progress>
            </div>
            <!-- <div class="circle">
                 <p>磁盘使用率</p>
                <el-progress type="circle" :percentage="hdIOpPercent"></el-progress>
            </div>
            <div class="circle">
                 <p>内存使用率</p>
                <el-progress type="circle" :percentage="memoryUsage"></el-progress>
            </div> -->
        </div>
        
    </div>
</template>
<script>
export default {
    data(){
        return{
            upuInfo:10,
            hdIOpPercent:10,
            memoryUsage:10,
        }
    },
    methods:{
        // 获取cpu使用率
        getCpuUsage(){
            this.$http.getCpuUsage(``).then(res =>{
                console.log(res)
                res = res.split("%");
                console.log(res)
                this.upuInfo = parseInt(res[0]);
            })
        },
        // 获取磁盘使用率
        getHdIOpPercent(){
            this.$http.getHdIOpPercent(``).then(res =>{
                console.log(res)
                res = res.split("%");
                this.hdIOpPercent = parseInt(res[0]);
            })
        },
        // 获取内存使用率
        getMemoryUsage(){
            this.$http.getMemoryUsage(``).then(res =>{
                console.log(res)
                res = res[0].memTotal.split("%");
                this.memoryUsage = parseInt(res[0]);
            })
        },
        // 带宽使用率
        getNetWork(){
            this.$http.getNetWork(``).then(res =>{
                console.log(res);
            })
        },

        // 网络速度
        getNetWorkSpeed(){
            this.$http.getNetWorkSpeed(``).then(res =>{
                console.log(res)
            })
        },
    },
    mounted(){
        this.getCpuUsage();
        this.getHdIOpPercent();
        this.getMemoryUsage();
       var a = 8042436 / 1024 / 1024;
       console.log(a)
        setInterval( ()=>{
             this.getCpuUsage();
            this.getHdIOpPercent();
            this.getMemoryUsage();
        },5000)
        // this.getNetWork();
        // this.getNetWorkSpeed();
    },
}
</script>
<style lang="less" scope>
    .serverManagement{
        .circle_content{
            display: flex;
            justify-content: space-between;
        }
        .circle{
           height: 200px;
           width: 200px;
        //    display: flex;
           text-align: center;
           align-items: center;
           justify-content: space-around;
        //    border: 3px solid #eee;
           p{
               margin-bottom: 20px;
               padding-top: 10px;
           }
        }
    }
</style>