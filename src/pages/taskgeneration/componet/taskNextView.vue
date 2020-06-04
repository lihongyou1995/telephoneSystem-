<template>
    <div class="nextView">
        <el-dialog 
            title="下发/分发"
            :visible.sync="nextViewVisible"
             width="800px"
             :close-on-click-modal=false
            >
            <el-table :data="tableData" border>
                <el-table-column property="unitName" label="单位" align="center"></el-table-column>
                <el-table-column property="userName" label="接收人" align="center"></el-table-column>
                <el-table-column property="stateCn" label="状态" align="center"></el-table-column>
                <el-table-column property="type" label="类型" align="center"></el-table-column>
                <el-table-column label="操作"  width="160" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="revoke(scope.row)">撤销</el-button>
                        <el-button size="mini" type="primary" @click="remind(scope.row)">提醒</el-button>
                    </template>
                </el-table-column>
            </el-table>


            
            <!-- <div class="block">
                <el-pagination
                    layout="total,prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="total"
                    >
                </el-pagination>
            </div> -->
        </el-dialog>

        <el-dialog 
            title="推送数据"
            :visible.sync="pushViewVisible"
             width="800px"
             :close-on-click-modal=false
            >
            <el-table :data="tableData" border>
                <el-table-column property="name" label="任务名称" align="center"></el-table-column>
                <!-- <el-table-column property="taskAtr" label="状态" align="center"></el-table-column> -->
                <el-table-column property="receiveUser" label="用户" align="center"></el-table-column>
                <el-table-column label="操作"  width="100" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="pushRevoke(scope.row)">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <div class="block">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="total"
                    >
                </el-pagination>
            </div> -->
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{
        taskName:String,
        taskId:Number,
    },
    data(){
        return{
            roleId:sessionStorage.getItem("roleId"),
            userId:sessionStorage.getItem("userID"),
            unitId:sessionStorage.getItem("unitId"),
            tableData: [],
            total:100,
            nextViewVisible:false,
            pushViewVisible:false,
            pageIndex:1,
            pageSize:10,
        }
    },
    methods:{
    // 提醒
        remind(item){
            console.log(item)
            this.$prompt('请输入提醒消息', '提醒', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.$http.updateFormNews({
                        userId:this.userId,
                        acceptUserId:item.userId,
                        remark:value,
                        formName:this.taskName,
                    }).then(res =>{
                        console.log(res);
                        return res.code == 200 ? this.$message.success('提醒成功') : this.$message(res.data || res.message);
                    })
                }).catch(() => {       
            });
        },
    // 下发 分发 撤销
    revoke(item){
        console.log(item)
        this.revocationUserId = item.userId;
        // if(item.type == '下发'){
        //     this.revocationUnitId = item.userId;
        // }else if(item.type == '分发'){
        //     this.revocationUserId = item.userId;
        // }
        this.$http.taskPublishRevoke({
            taskId:this.taskId,
            userId:this.userId,
            // revocationUnitId:this.revocationUnitId,
            revocationUserId:this.revocationUserId,
        }).then(res =>{
            console.log(res)
            this.getissueTask();
            res.code == 200 ? this.$message.success('撤销成功') : this.$message(res.data || res.message);                
        })
    },
    // 推送撤销
    pushRevoke(item){
        console.log(item)
        this.$http.taskPushRemove({
            taskId:this.taskId,
            userId:item.acceptUserId,
        }).then(res =>{
            console.log(res)
            this.getPushTask();
            return res.code == 200 ? this.$message.success('撤销成功') :  this.$message(res.data || res.message);
        })
    },
    handleCurrentChange(index){
        console.log(index)
        this.pageIndex = index;
        this.getissueTask();
    },
    // 获取下发/分发数据
    getissueTask(){
        this.$http.taskAlreadyIssued(`unitId=${this.unitId}&taskId=${this.taskId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}&userId=${this.userId}&unitId=${this.unitId}`).then(res =>{
            console.log(res)
            res.code == 200 ? this.tableData = res.data : this.$message(res.data || res.message);
            // if(res.code == 200){
            //     this.tableData = res.data.list;
            //     this.total = res.data.countData;
            // }
        })
    },
    // 获取推送数据
    getPushTask(){
        this.$http.queryPushTask(`userId=${this.userId}&unitId=${this.unitId}&taskName=${this.taskName}&taskId=${this.taskId}`).then(res =>{
            console.log(res)
            return res.code == 200 ? this.tableData = res.data : this.$message(res.data || res.message);
        })
    },
        

    },
    mounted(){},
    watch:{
        'nextViewVisible'(){
            if(this.nextViewVisible){
                this.getissueTask();
            }
        },
        'pushViewVisible'(){
            if(this.pushViewVisible){
                this.getPushTask();
            }
        }

    }
}
</script>