<template>
    <!-- 导出时弹框选择 -->
    <div class="exportDialog">
            <el-dialog
                title="导出"
                :visible.sync="exportDialog"
                width="30%"
                :close-on-click-modal=false
                >
                <div style="margin-bottom:20px;">
                    <p style="margin-bottom:10px;">选择导出类型：</p>
                    <template>
                        <el-radio-group @change="changeExportType" v-model="exportType" size="mini">
                            <el-radio border :label="1">导出excel数据</el-radio>
                            <!-- <el-radio border :label="2">导出excel模板</el-radio> -->
                            <el-radio border :label="3">导出pdf</el-radio>
                        </el-radio-group>
                    </template>
                </div>
                <div>
                    <p style="margin-bottom:10px;">选择导出字体：</p>
                    <template>
                        <el-radio-group @change="changeExportFont" v-model="exportFont" size="mini">
                            <el-radio border :label="1">宋体</el-radio>
                            <el-radio border :label="2">仿宋</el-radio>
                            <el-radio border :label="3">楷体</el-radio>
                        </el-radio-group>
                    </template>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="mini" @click="exportDialogBtn">确定导出</el-button>
                </span>
            </el-dialog>
        </div>
</template>
<script>
export default {
    name:'exportdialog',
    data(){
        return{
            exportDialog:false, // 导出框
            exportType:1,//导出类型  1数据 2模板 3pdf
            exportFont:1, //导出字体 1宋体 2防宋 3楷体
        }
    },
    methods:{
        // 选择导出类型
        changeExportType(type){
            this.exportType = type;
        },
        // 选择导出字体
        changeExportFont(font){
            this.exportFont = font;
        },
        // 确定导出
        exportDialogBtn(){
            let params = {
                exportType:this.exportType,
                exportFont:this.exportFont,
            }
            this.exportDialog = false;
            this.$emit('params',params)
            // if(this.exportType == 1){
            //     this.exportExcelData();
            // }else if(this.exportType == 2){
            //     this.exportExcelTemplate();
            // }else if(this.exportType == 3){
            //     this.exportPdf();
            // }
        },
    }
}
</script>