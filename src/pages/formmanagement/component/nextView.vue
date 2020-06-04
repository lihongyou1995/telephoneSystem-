<template>
    <div class="nextView">
        <!-- 下发/分发 -->
        <el-dialog 
            title="下发/分发数据"
            :visible.sync="nextViewVisible"
             width="800px"
             :close-on-click-modal=false
            >
            <el-table :data="tableData" border>
                <el-table-column property="unitName" label="单位名称" align="center"></el-table-column>
                <el-table-column property="userName" label="用户名称" align="center"></el-table-column>
                <el-table-column property="stateCN" label="填报状态" align="center"></el-table-column>
                <!-- <el-table-column property="type" label="类型" align="center"></el-table-column> -->
                <el-table-column label="操作"  width="160" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="revoke(scope.row)">撤销</el-button>
                        <el-button size="mini" type="primary" @click="remind(scope.row)">提醒</el-button>
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

        <!-- 推送 -->
        <el-dialog 
            title="推送数据"
            :visible.sync="pushViewVisible"
             width="800px"
             :close-on-click-modal=false
            >
            <el-table :data="tableData" border>
                <el-table-column property="unitName" label="单位名称" align="center"></el-table-column>
                <!-- <el-table-column property="formType" label="属性" align="center"></el-table-column> -->
                <el-table-column property="userName" label="用户名称" align="center"></el-table-column>
                <!-- <el-table-column property="address" label="来源" width="100" align="center"></el-table-column> -->
                <el-table-column label="操作"  width="100" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="danger" @click="pushRevoke(scope.row)">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--
            <div class="block">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :total="total"
                    >
                </el-pagination>
            </div>
            -->
        </el-dialog>


    </div>

    
    
</template>
<script>
export default {
    props:{
        formId:Number,
        formName:String,
    },
    data(){
        return{
            userId:sessionStorage.getItem("userID"),
            roleId:sessionStorage.getItem("roleId"),
            tableData: [],
            total:1,
            nextViewVisible:false,
            pushViewVisible:false,
            revocationUnitId:'',
            revocationUserId:'',
        }
    },
    methods:{
        // 查询下发数据
        queryDataList(){
            this.$http.newFormPublishLook(`userId=${this.userId}&formId=${this.formId}`).then(res =>{
                console.log(res)
                this.tableData = res.data;
                // this.total = res.data.countData;
            })
        },
        // 查询推送数据
        queryPushDataList(){
            this.$http.newFormPushLook(`userId=${this.userId}&formId=${this.formId}&roleId=${this.roleId}`).then(res =>{
                console.log(res)
                if(res.code == 200){
                    this.tableData = res.data;
                }
            })
        },
         // 下发 分发撤销
        revoke(item){
            console.log(item)
            this.$http.newFormPublishRevoke({
                userId:this.userId,
                formId:this.formId,
                roleId:item.roleId,
                RevokeUserId:item.userId,
            }).then(res =>{
                console.log(res)
                this.queryDataList();
                if(res.code == 200) return this.$message.success('撤销成功');
                return this.$message(res.data || res.message);
            })
            this.revocationUnitId = '';
            this.revocationUserId = '';
        },

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
                        formName:this.formName,
                    }).then(res =>{
                        console.log(res);
                        return res.code == 200 ? this.$message.success('提醒成功') : this.$message(res.data || res.message);
                    })
                }).catch(() => {       
            });
        },
        // 推送撤销
        pushRevoke(item){
            console.log(item)
            this.$http.newFormPushRemove({
                formId:this.formId,
                userId:this.userId,
                removeUser:item.userId,
            }).then(res =>{
                console.log(res)
                this.queryPushDataList();
                return res.code == 200 ? this.$message.success('撤销成功') : this.$message(res.data || res.message);
            })
        },
        handleCurrentChange(index){
            console.log(index)
        },

    },
    watch:{
        'nextViewVisible'(){
            if(this.nextViewVisible){
                this.queryDataList();
            }
        },
        'pushViewVisible'(){
            if(this.pushViewVisible){
                this.queryPushDataList();
            }
        }
    },
    mounted(){},
}
</script>