<template>
  <div class="addtask">
        <el-dialog 
             title="新增任务"
            :visible.sync="dialogTableVisible"
            width="1000px"
            :close-on-click-modal='isclose'
            >

            <div class="list1">
                <el-form class="demo-form-inline" label-width="100px">
                    <div class="flex">
                        <el-form-item label="* 任务名称">
                            <el-input v-model="addtaskinfo.taskName" placeholder="请输入任务名称"></el-input>
                        </el-form-item>
                        <el-form-item label="* 任务属性">
                            <el-select @change="tasktypefn" v-model="addtaskinfo.tasktype" placeholder="请选择任务属性">
                                <el-option v-for="(item,index) in tasktypeList" :key="index" :label="item.attribute" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <div class="flex">
                        <el-form-item label="* 单位名称" class="unitname">
                            <el-select v-model="addtaskinfo.unitName" multiple placeholder="请选择单位名称" >
                                 <el-option value="shanghai1">
                                     <el-tree 
                                        class="filter-tree" 
                                        :data="unitnameList" 
                                        default-expand-all 
                                        :props="defaultProps2" 
                                        @node-click="Unitattributefn2">
                                    </el-tree>
                                 </el-option>
                            </el-select>
                        </el-form-item>
                        
                    </div>
                    
                    <div class="flex">
                        <el-form-item label="* 表单名称">
                            <el-select v-model="addtaskinfo.formName" @change='selectform'  placeholder="请选择表单名称" >
                                <el-option v-for="(item,index) in fromnameList" :key="index" :label="item.formName" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item  v-if="addtaskinfo.formName == '自定义字段'"  label="* 表单字段">
                              <el-input v-model="addtaskinfo.formfield" placeholder="请输入表单字段"></el-input>
                        </el-form-item>
                        <el-form-item v-else label="* 表单字段">
                             <el-select @change="formfieldvalue" v-model="addtaskinfo.formfield"  placeholder="请选择表单字段" >
                                <el-option v-for="(item,index) in formfieldList" :key="index" :label="item.propertyName" :value="item.propertyName"></el-option>
                            </el-select>
                        </el-form-item>
                      
                        <el-form-item label="* 数据来源">
                            <el-select v-model="addtaskinfo.datasources" @change="datalaiyuan" placeholder="请选择数据来源" >
                                <el-option v-if="addtaskinfo.formName != '自定义字段'" label="数据库" value="数据库"></el-option>
                                <el-option label="人工填报" value="人工填报"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary" size="mini" @click="addforminfo">添加</el-button>
                        </el-form-item>
                    </div>
                    <div class="datadisplay">
                        <div class="datadisplay_content">
                              <el-table
                                ref="multipleTable"
                                :data="tableData"
                                tooltip-effect="dark"
                                style="width: 100%"
                                >
                                 <el-table-column
                                prop="formName"
                                label="表单名称"
                               >
                                </el-table-column>
                                <el-table-column
                                prop="formfield"
                                label="表单字段"
                               >
                                </el-table-column>
                                
                                 <el-table-column
                                prop="datasources"
                                label="数据来源"
                               >
                                </el-table-column>
                                <el-table-column label="操作" width="50px" align="center">
                                    <template slot-scope="scope">
                                        <i class="el-icon-delete" @click="handleDelete(scope.$index,tableData)"></i>
                                    </template>
                                </el-table-column>
                               
                            </el-table>
                        </div>
                    </div>
                    
                      <el-form-item>
                        <el-button type="success" size="mini" @click="addTaskTablefn">生成任务</el-button>
                      </el-form-item>
                </el-form>
            </div>
            
        </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'addtask',
  data () {
    return {
        dialogTableVisible:false,
        isclose:false,
        addtaskinfo:{
            taskName:'',    // 任务属性
            tasktype:'', // 任务属性
            tasktypeid:'', // 任务属性id
            taskattribute:'',   // 单位属性
            unitName:[],    // 单位名称
            unitNameid:[], // 单位名称id
            datasources:'', // 数据来源
            selectedfield:[], // 已选择字段
            formName:'',    // 表单名
            formId:'', // 表单id
            formfield:'', // 表单字段
        },
         Unitattribute:[], // 单位属性
         tasktypeList:[], // 任务属性
         unitnameList:[], // 单位名称
         fromnameList:[], // 表单名称
         formfieldList:[], // 表单字段
         
         defaultProps:{
            children: 'children',
            label: 'propertyName'
        },
        defaultProps2:{
            children: 'children',
            label: 'unitName'
        },
        tableData: [],
        multipleSelection: [],
        addtodata:true,
        roleId:sessionStorage.getItem('roleId'),
        userId:sessionStorage.getItem('userID'),
        unitId:sessionStorage.getItem('unitId'),
        
    }
  },
  methods: {

    handleDelete(index,data){
        console.log(data)
        data.splice(index, 1);
    },
    // 查询
    getTaskAtrfn(){
        // 任务属性
        this.$http.getTaskAtr().then(res =>{
            console.log(res)
            if(res.code == 200){
                this.tasktypeList = res.data;
            }
        });
        // 单位属性
        // this.$http.unitPropertyDicts().then(res =>{
        //     console.log(res)
        //     if(res.code == 200){
        //         this.Unitattribute = res.data;
        //     }
        // });

        // 单位名称
        this.$http.getUnitByProperty(`/task/getUnitByProperty?unitId=${this.unitId}`).then(res =>{
            console.log(res)
            this.unitnameList = res.data;
        })
        
        // 表单名称
        // this.$http.fromquerryname(`userId=${this.userId}&unitId=${this.unitId}&roleId=${this.roleId}&pageNum=1&pageSize=10000000`).then(res =>{
        //     console.log(res)
        //     this.fromnameList = res.data.list;
        //     this.fromnameList.push({
        //         formName:'自定义字段'
        //     })
        // });
        // 获取表单名称
        this.$http.newGetFormTabShow(`userId=${this.userId}&unitId=${this.unitId}&roleId=${this.roleId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}`).then(res=>{
                console.log(res)
                this.fromnameList = [];
                if(res.code == 200 && res.data instanceof Array){
                    res.data.forEach(item =>{
                        //state==4表示已完成的表单
                       item.state == 4 ? this.fromnameList.push(item) : '';
                    })
                    // this.fromnameList = res.data;
                }
                this.fromnameList.push({
                    formName:'自定义字段'
                })
            })
        

    },
    // 选择数据来源
    datalaiyuan(value){
        console.log(value)
        if(this.addtaskinfo.formName === '自定义字段'){
            this.addtaskinfo.datasources = '人工填报';
        }else{
            this.addtaskinfo.datasources = value;
        }
    
    },
    // 选择表单名称
    selectform(formId){
        console.log(formId)
        console.log(this.fromnameList);
        if(formId){
            var obj = this.fromnameList.find((item) =>{ // 根据id匹配对应的name
                console.log(item)
                return item.id == formId;
            })
            console.log(obj)
            this.addtaskinfo.formName = obj.formName;
            this.addtaskinfo.formfield = '';
            this.addtaskinfo.formId = formId;
            this.addtaskinfo.datasources = '';
            // 表单字段
            this.formfieldList = [];
            // this.$http.queerformfield(`formId=${formId}`).then(res =>{
            //     console.log(res)
            //     this.formfieldList = res.data;
            // })
            this.$http.gettableheader(`formId=${formId}`).then(res =>{
                    console.log(res)
                    if(res.code == 200){                        
                        this.formfieldList = res.data;
                    }
            })
        }else{
            this.addtaskinfo.datasources = '人工填报';
            this.addtaskinfo.formId = 0;
            this.addtaskinfo.formName = '自定义字段'
            this.addtaskinfo.formfield = '';
        }
    },
    // 选择任务属性
    tasktypefn(value){
        console.log(value)
        this.addtaskinfo.tasktypeid = value;
    },
    // 选择单位属性
    Unitattributefn(data){
        console.log(data)
        this.addtaskinfo.taskattribute = data.propertyName;
        // 单位名称
        this.$http.getUnitByProperty(`/task/getUnitByProperty?unitProperty=${data.propertyName}&unitId=${this.unitId}`).then(res =>{
            console.log(res)
            this.unitnameList = res.data;
        })
    },
    // 选择单位名称
    Unitattributefn2(data){
        console.log(data)
        if(this.addtaskinfo.unitName.indexOf(data.unitName) == -1){
            this.addtaskinfo.unitName.push(data.unitName);
            this.addtaskinfo.unitNameid.push(data.unitId);
        }
    },
    // 新增表单字段
    addforminfo(){
        if(this.addtaskinfo.formName == '') return this.$message('请选择表单');
        if(this.addtaskinfo.formfield == '') return this.$message('请选择字段');
        if(this.addtaskinfo.formfield.indexOf(',') != -1 || this.addtaskinfo.formfield.indexOf(':') != -1) return this.$message('表单字段不能出现英文状态下的逗号或者冒号');
        if(this.addtaskinfo.datasources == '') return this.$message('请选择数据来源');

        this.addtodata = true;
        console.log(this.tableData)

        this.tableData.forEach(item =>{
            if(this.addtaskinfo.formfield == item.formfield){
                this.$message('该表单字段已存在，请勿重复添加')
                this.addtodata = false;
                return false;
            }else if(this.addtaskinfo.formName != '自定义字段' && this.addtaskinfo.formName != item.formName && item.formId != '0'){
                console.log(this.addtaskinfo.formName)
                console.log(item.formName)
                    this.addtodata = false;
                    this.$confirm('选择新表单将清空已添加字段, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.tableData = [];
                        this.tableData.push({
                            formName:this.addtaskinfo.formName,
                            formId:this.addtaskinfo.formId,
                            formfield:this.addtaskinfo.formfield,
                            datasources:this.addtaskinfo.datasources,
                        })
                    }).catch(() => {});
            }
        });
        if(this.addtodata){
            this.tableData.push({
                formName:this.addtaskinfo.formName,
                formId:this.addtaskinfo.formId,
                formfield:this.addtaskinfo.formfield,
                datasources:this.addtaskinfo.datasources,
            })
        }
    },

    // 选择字段
    formfieldvalue(value){
        console.log(value)
        this.addtaskinfo.formfield = value;
    },

    // 生成任务
    addTaskTablefn(){
        console.log(this.addtaskinfo.formId+':'+this.addtaskinfo.formfield+':'+this.addtaskinfo.datasources)
        console.log(this.tableData)
        let a = []
        this.tableData.forEach(e => {
            console.log(e)
            a.push(e.formId+':'+ e.formfield+':'+ e.datasources) ;
            console.log(a)
        });
        if(this.addtaskinfo.taskName == '' || this.addtaskinfo.tasktypeid == '' || this.addtaskinfo.unitNameid == '' || a == '') return this.$message('请把信息填写完整');
        if(this.addtaskinfo.taskName.indexOf(',') != -1 || this.addtaskinfo.taskName.indexOf(':') != -1) return this.$message('任务名称不能出现英文状态下的逗号或者冒号');
            this.dialogTableVisible = false;
            this.$http.addTaskTable({
                taskName:this.addtaskinfo.taskName,
                taskAtrId:this.addtaskinfo.tasktypeid,
                unitIds:this.addtaskinfo.unitNameid.toString(),
                userId:this.userId,
                unitId:this.unitId,
                formAndAtrs:a.toString(),
            }).then(res =>{
                console.log(res)
                this.$emit('gxdata',1);
                res.code == 200 ?this.$message.success('生成成功') : this.$message(res.data || res.message);
            })
        
    },

    

  },
  mounted(){
     
  },
  watch: {
      dialogTableVisible(){
          console.log(this.dialogTableVisible)
          if(this.dialogTableVisible){
            this.getTaskAtrfn();
          }
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .addtask{
        .list1{
            .el-form{
                .flex{
                    display: flex;
                }
                
            }
            .datadisplay{
                padding:0 175px 0 100px;
                box-sizing: border-box;
                .datadisplay_content{
                    border: 1px solid #dddddd;
                    padding: 15px;
                    box-sizing: border-box;
                    min-height: 100px;
                    max-height: 200px;
                    overflow: auto;
                    >p{
                        border-bottom: 1px solid #dddddd;
                        line-height:30px;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;

                       
                    }
                }
                
            }
        }
    }
</style>
<style lang="less">
.unitname .el-select .el-input__inner{
//    height:auto !important;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0 10px;
    overflow: hidden;
    overflow-y: auto;
  }
    i{
        cursor: pointer;
    }
.addtask{
    .el-input__inner{
            width: 160px;
        }

    .unitname{
        .el-input__inner{
            width: 420px;
        }
    }

}
   
</style>
