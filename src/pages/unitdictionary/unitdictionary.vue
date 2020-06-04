<template>
  <div class="unitdictionary">
    <div class="unitListL">
        <div class="titTop">
            <el-button type="primary" size="small" icon="el-icon-document-add" @click="confirmAdd">新增</el-button>
            <!-- <el-button :disabled="!istreviuew" type="primary" icon="el-icon-edit-outline" size="small" @click="editunit">编辑</el-button> -->
            <!-- <el-button type="primary" size="small" icon="el-icon-collection-tag" @click="clerDeselect">取消选中</el-button> -->
            <!-- <el-button :disabled="!istreviuew" type="danger" icon="el-icon-delete" size="small" @click="deletefn">删除</el-button> -->
             <el-upload
                :disabled="!istreviuew"
                class="upload-demo"
                :action="importurl"
                :on-change="handleChange"
                :data="paramsData"
                accept=".xls,.xlsx"
                >
                <el-button size="small " type="primary" :disabled="!istreviuew" icon="el-icon-upload" style="margin:0 10px;">导入</el-button>
            </el-upload>
            <el-button :disabled="!istreviuew" type="primary" size="small " @click="exporttable" icon="el-icon-printer">导出</el-button>
        </div>
    </div>
    <div class="unitstructure_cor">
        <div class="unitstructure">
            <p class="titTop">
                <span style="margin-right:50px;">字典架构</span>
                <span style="margin-right:15px;">字典类型</span>
                <el-select v-model="unittype" @change="dictionarytype">
                    <el-option label="单位级别字典" value="1"></el-option>
                    <el-option label="单位属性字典" value="2"></el-option>
                    <el-option label="单位类型字典" value="3"></el-option>
                    <el-option label="任务属性" value="4"></el-option>
                    <el-option label="表单属性" value="5"></el-option>
                </el-select>
            </p>
            
            <div class="Framework" v-if="istreviuew">
                <!-- <el-tree :data="treedata" default-expand-all :props="defaultProps" @node-click="handleNodeClick" ></el-tree> -->
                <div v-if="dictionaryTypeid == 1">
                    <el-table
                        ref="singleTable"
                        highlight-current-row
                        :data="treedata"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        default-expand-all
                        @row-click="handleNodeClick"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                        prop="levelName"
                        label="名称"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="levelCode"
                        label="编号"
                        >
                        </el-table-column>
                        
                        <el-table-column label="操作" align="center" width="140">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="operation(scope.row,1)">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="operation(scope.row,2)">删除</el-button>
                                    <!-- <i class="el-icon-edit" @click="operation(scope.row,1)" style="margin-right:15px;"></i>
                                    <i class="el-icon-delete" @click="operation(scope.row,2)"></i> -->
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="dictionaryTypeid == 2">
                    <el-table
                        ref="singleTable"
                        highlight-current-row
                        :data="treedata"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        default-expand-all
                        @row-click="handleNodeClick"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                        prop="name"
                        label="名称"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="propertyCode"
                        label="编号"
                        >
                        </el-table-column>
                        
                        <el-table-column label="操作" align="center" width="140">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="operation(scope.row,1)">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="operation(scope.row,2)">删除</el-button>
                                    <!-- <i class="el-icon-edit" @click="operation(scope.row,1)" style="margin-right:15px;"></i>
                                    <i class="el-icon-delete" @click="operation(scope.row,2)"></i> -->
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="dictionaryTypeid == 3">
                    <el-table
                        ref="singleTable"
                        highlight-current-row
                        :data="treedata"
                        style="width: 100%;margin-bottom: 20px;"
                        row-key="id"
                        default-expand-all
                        @row-click="handleNodeClick"
                        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <el-table-column
                        prop="name"
                        label="名称"
                       >
                        </el-table-column>
                        <el-table-column
                        prop="categoryCode"
                        label="编号"
                        >
                        </el-table-column>
                        
                        <el-table-column label="操作" align="center" width="140">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="primary" @click="operation(scope.row,1)">编辑</el-button>
                                    <el-button size="mini" type="danger" @click="operation(scope.row,2)">删除</el-button>
                                    <!-- <i class="el-icon-edit" @click="operation(scope.row,1)" style="margin-right:15px;"></i>
                                    <i class="el-icon-delete" @click="operation(scope.row,2)"></i> -->
                                </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <div class="Framework" v-else>
                 <el-table
                    :data="treedata2"
                    tooltip-effect="dark"
                    style="width: 100%"
                    >
                     <el-table-column
                        prop="id"
                        label="编号"
                        width="120"
                        align="center"
                        >
                    </el-table-column>
                    <el-table-column
                        v-if="this.dictionaryTypeid == 4"
                        prop="attribute"
                        label="任务属性名称"
                        align="center"
                       >
                    </el-table-column>
                    <el-table-column
                         v-if="this.dictionaryTypeid == 5"
                        prop="attribute"
                        label="表单属性名称"
                        align="center"
                       >
                    </el-table-column>
                    <el-table-column label="编辑" align="center" width="140">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="vieworedit(scope.row,1)">编辑</el-button>
                                <el-button size="mini" type="danger" @click="vieworedit(scope.row,2)">删除</el-button>
                                <!-- <i class="el-icon-edit" @click="vieworedit(scope.row,1)"></i> -->
                                <!-- <i class="el-icon-delete" @click="vieworedit(scope.row,2)"></i> -->
                            </template>
                    </el-table-column>

                </el-table>
               
            </div>

        </div>
        <div class="unitstructure2" hidden>
            <p class="titTop">详细信息</p>
            <div class="Framework" style="padding:0;">
                <ul>
                    <li v-show="dictionaryTypeid == 1"><span class="left_name">等级编号</span><span>{{dictionaryInfo.levelCode}}</span></li>
                    <li v-show="dictionaryTypeid == 1"><span class="left_name">等级名称</span><span>{{dictionaryInfo.levelName}}</span></li>

                    <li v-show="dictionaryTypeid == 2"><span class="left_name">属性编号</span><span>{{dictionaryInfo.propertyCode}}</span></li>
                    <li v-show="dictionaryTypeid == 2"><span class="left_name">属性名称</span><span>{{dictionaryInfo.propertyName}}</span></li>

                    <li v-show="dictionaryTypeid == 3"><span class="left_name">类型编号</span><span>{{dictionaryInfo.categoryCode}}</span></li>
                    <li v-show="dictionaryTypeid == 3"><span class="left_name">类型名称</span><span>{{dictionaryInfo.categoryName}}</span></li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 新增/编辑 -->
    <el-dialog
        :title="titletext"
        :visible.sync="dialogVisible"
        :close-on-click-modal='isclose'
        width="300px"
        >
        <!-- <template>
        <el-select v-model="value" placeholder="请选择">
            <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        </template> -->
       <el-input maxlength='10' v-model="atrName"></el-input>
       <el-button type="primary" size="mini" @click="editsubmit">确 定</el-button>

    </el-dialog>


  </div>
</template>

<script>

export default {
  name: 'unitdictionary',
  data () {
    return {
        isGl:true,
        value: '',
        isclose:false,
        importurl:'',
        dialogVisible:false,
        isconfirm:0,
        treedata: [], // 单位
        treedata2:[],
        istreviuew:true,
        isActive:'',
        defaultProps: {
            children: 'children',
            label: 'name'
        },
        defaultProps2:{
            label: 'taskAttribute'
        },
        unittype:'单位级别字典', // 字典类型
        dictionaryId:'',    // 查询字典详情id
        dictionaryTypeid:'1', // 字典类型id
        dictionaryInfo:{
            levelName:'', // 等级名称
            levelCode:'', // 等级编号
            propertyCode:'', // 属性编号
            propertyName:'', // 属性名称
            categoryCode:'', // 类型编号
            categoryName:'', // 类型名称
        },
        titletext:'',
        atrName:'',
        atrId:'',
        isatrNamedate:true,
        roleId:sessionStorage.getItem('roleId'),
        userId:sessionStorage.getItem('userID'),
        unitId:sessionStorage.getItem('unitId'),
        urlorigin:'',
        paramsData:{
            userId:sessionStorage.getItem('userID'),
        },
        isbtn:true,
    }
  },
  methods:{
    // 新增
    confirmAdd(){
        this.atrName = '';
        this.dialogVisible = true;
        if(this.dictionaryTypeid == 4){
            this.titletext = '新增任务属性'
        }else if(this.dictionaryTypeid == 5){
            this.titletext = '新增表单属性'
        }else if(this.dictionaryTypeid == 1){
            this.titletext = '新增单位等级'
        }else if(this.dictionaryTypeid == 2){
            this.titletext = '新增单位属性'
        }else if(this.dictionaryTypeid == 3){
            this.titletext = '新增单位类型'
        }
    },
    // 树形表格编辑按钮
    operation(item,type){
        console.log(item)
        console.log(type)
        if(type == 1){
            this.dialogVisible = true;
            this.dictionaryId = item.id;
            this.isbtn = false;
            if(this.dictionaryTypeid == 1){
                this.titletext = '编辑单位等级'
            }else if(this.dictionaryTypeid == 2){
                this.titletext = '编辑单位属性'
            }else if(this.dictionaryTypeid == 3){
                this.titletext = '编辑单位类型'
            }
        }else if(type == 2){
            this.$confirm('确认删除该单位等级?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.dictionaryTypeid == 1){
                    this.unitLevelDictsdeletefn(item.id);
                }else if(this.dictionaryTypeid == 2){
                    this.unitPropertyDictsdeletefn(item.id);
                }else if(this.dictionaryTypeid == 3){
                    this.unitCategoryDictsdeletefn(item.id);
                }
            }).catch(() => {         
            });
        }
        
    },

    
    // 编辑按钮
    // editunit(){
    //     if(this.dictionaryId != ''){
    //         this.dialogVisible = true;
    //         if(this.dictionaryTypeid == 1){
    //             this.titletext = '编辑单位等级'
    //         }else if(this.dictionaryTypeid == 2){
    //             this.titletext = '编辑单位属性'
    //         }else if(this.dictionaryTypeid == 3){
    //             this.titletext = '编辑单位类型'
    //         }
    //     }else{
    //         this.$message('请选择需要编辑的单位')
    //     }
        
    // },

    // 删除
    // deletefn() {
    //     if(this.dictionaryId != ''){
    //         this.$confirm('确认删除该单位等级?', '提示', {
    //             confirmButtonText: '确定',
    //             cancelButtonText: '取消',
    //             type: 'warning'
    //         }).then(() => {
    //             if(this.dictionaryTypeid == 1){
    //                 this.unitLevelDictsdeletefn();
    //             }else if(this.dictionaryTypeid == 2){
    //                 this.unitPropertyDictsdeletefn();
    //             }else if(this.dictionaryTypeid == 3){
    //                 this.unitCategoryDictsdeletefn();
    //             }
    //         }).catch(() => {         
    //         });
            
    //     }else{
    //         this.$message('请选择需要删除的单位')
    //     }
        
    // },
    // 验证输入是否为空
    isatrName(){
        if(this.atrName == ''){
            this.$message('名称不能为空')
            this.isatrNamedate = false;
        }else{
            this.isatrNamedate = true;
        }
    },
    // 表格操作数据
    vieworedit(data,type){
        console.log(data)
        this.atrId = data.id;
        if(type == 1){
            this.dialogVisible = true;
            if(this.dictionaryTypeid == 4){
                this.titletext = '编辑任务属性'
                this.atrName = data.attribute;
            }else if(this.dictionaryTypeid == 5){
                this.titletext = '编辑表单属性'
                this.atrName = data.attribute;
            }
        }else if(type == 2){
            if(this.dictionaryTypeid == 4){
                // 删除任务
                this.deleteTaskAttributefn(data.id);
            }else if(this.dictionaryTypeid == 5){
                // 删除表单
                this.deleteformAttributefn(data.id);
            }
            
        }
        
        
    },

    // 查询单位类型
    unitCategoryDictsfn(){
        this.$http.unitCategoryDicts().then(res=>{
            console.log(res)
            this.treedata = res.data;
            this.istreviuew = true;
        })
    },
    // 查询单位级别
    unitLevelDictsfn(){
        this.$http.unitLevelDicts().then(res=>{
            console.log(res)
           this.treedata = res.data;
           this.istreviuew = true;
        })
    },
    // 查询单位属性
    unitPropertyDictsfn(){
        this.$http.unitPropertyDicts().then(res=>{
            console.log(res)
            this.treedata = res.data;
            this.istreviuew = true;
        })
    },
    // 查询任务属性
    getTaskAtrfn(){
        this.$http.getTaskAtr().then(res =>{
            console.log(res)
             this.treedata2 = res.data;
             this.istreviuew = false;
        })
    },
    // 查询表单属性
    queryFormAttributefn(){
        this.$http.getFormAtrribute().then(res =>{
            console.log(res)
             this.treedata2 = res.data;
             this.istreviuew = false;
        })
    },
    // 任务属性编辑
    editTaskAttributefn(){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.editTaskAttribute({
            atrName:this.atrName,
            atrId:this.atrId,
        }).then(res =>{
            console.log(res)
            this.dialogVisible = false;
            this.getTaskAtrfn();    // 查询任务属性
            return res.code == 200 ? this.$message.success('编辑成功') : this.$message(res.data || res.message);
        })
    },
    // 任务属性删除
    deleteTaskAttributefn(id){
        this.$confirm('是否删除该任务属性?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.deleteAttribute({
                userId:this.userId,
                attributeId:id,
            }).then(res =>{
                console.log(res)
                this.getTaskAtrfn();
                return res.code == 200 ? this.$message.success('删除成功') : this.$message(res.data || res.message);
                
            })
        }).catch(() => {         
        });
       
    },
    // 新增任务属性
    addTaskAttributefn(){
        this.isatrName();
       if(!this.isatrNamedate) return;
        this.$http.addTaskAttribute({
            atrName:this.atrName
        }).then(res =>{
            console.log(res)
            this.atrName = '';
            this.dialogVisible = false;
            this.getTaskAtrfn();
            return res.code == 200 ? this.$message.success('新增成功') : this.$message(res.data || res.message);
        })
    },
    // 新增表单属性
    addformAttributefn(){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.addformAttribute({
            atrName:this.atrName
        }).then(res =>{
            console.log(res)
            this.atrName = '';
            this.dialogVisible = false;
            this.queryFormAttributefn();
            return res.code == 200 ? this.$message.success('新增成功') : this.$message(res.data || res.message);
        })
    },
    // 编辑表单属性
    editformAttributefn(){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.editformAttribute({
            atrId:this.atrId,
            atrName:this.atrName
        }).then(res =>{
            console.log(res)
            this.dialogVisible = false;
            if(res.code == 200){
                this.queryFormAttributefn();
                this.$message.success('编辑成功')
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 删除表单属性
    deleteformAttributefn(id){
         this.$confirm('是否删除该表单属性?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$http.deleteFormAttribute({
               atrId:id,
               userId:this.userId,
           }).then(res =>{
                console.log(res)
                if(res.code == 200){
                    this.queryFormAttributefn();
                    this.$message.success('删除成功')
                }else{
                    this.$message(res.data || res.message)
                }
           })
        }).catch(() => {         
        });
    },
    // 新增单位等级
    unitLevelDictsaddfn(){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.unitLevelDictsadd({
            levelName:this.atrName,
            pid:this.dictionaryId,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitLevelDictsfn();
                this.$message.success('新增单位等级成功');
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 删除单位等级
    unitLevelDictsdeletefn(id){
        console.log(this.dictionaryId)
        this.$http.unitLevelDictsdelete({
            unitLevelId:id,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.clerDeselect(); // 清除选中信息
                this.unitLevelDictsfn();
                this.dictionaryInfo.levelName = '';
                this.dictionaryInfo.levelCode = '';
                // this.unitLevelDicts1fn();
                this.$message.success('删除成功')
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 编辑单位等级
    unitLevelDictsupdatefn(){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.unitLevelDictsupdate({
            newLevelName:this.atrName,
            unitLevelId:this.dictionaryId,
            userId:this.userId
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitLevelDictsfn();
                this.$message.success('修改成功')

            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 新增单位类型
    unitCategoryDictsaddfn(){
        this.$http.unitCategoryDictsadd({
            categoryName:this.atrName,
            pid:this.dictionaryId,
            userId:this.userId
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitCategoryDictsfn(); // 查询单位类型
                this.$message.success('新增单位类型成功')
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 删除单位类型
    unitCategoryDictsdeletefn(id){
        this.isatrName();
        if(!this.isatrNamedate) return;
        this.$http.unitCategoryDictsdelete({
            unitCategoryId:id,
            userId:this.userId
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.clerDeselect(); // 清除选中信息
                this.unitCategoryDictsfn(); // 查询单位类型
                 this.dictionaryInfo.categoryCode = '';
                this.dictionaryInfo.categoryName = '';
                this.$message.success('删除成功')
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 编辑单位类型
    unitCategoryDictsupdatefn(){
        this.$http.unitCategoryDictsupdate({
            newCategoryName:this.atrName,
            unitCategoryId:this.dictionaryId,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitCategoryDictsfn(); // 查询单位类型
                this.$message.success('修改成功');
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 新增单位属性
    unitPropertyDictsaddfn(){
        this.$http.unitPropertyDictsadd({
            propertyName:this.atrName,
            pid:this.dictionaryId,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitPropertyDictsfn(); // 查询单位属性
                this.$message.success('新增成功')
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 删除单位属性
    unitPropertyDictsdeletefn(id){
        this.$http.unitPropertyDictsdelete({
            unitPropertyId:id,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.clerDeselect(); // 清除选中信息
                this.unitPropertyDictsfn(); // 查询单位属性
                this.dictionaryInfo.propertyCode = '';
                this.dictionaryInfo.propertyName = '';
                this.$message.success('删除成功');
            }else{
                this.$message(res.data || res.message)
            }
        })
    },
    // 编辑单位属性
    unitPropertyDictsupdatefn(){
        this.$http.unitPropertyDictsupdate({
            newPropertyName:this.atrName,
            unitPropertyId:this.dictionaryId,
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.unitPropertyDictsfn(); // 查询单位属性
                this.$message.success('编辑成功');
            }else{
                this.$message(res.data || res.message)
            }
        })
    },

    // 单位等级详情
    unitLevelDicts1fn(){
        this.$http.unitLevelDicts1(`/unitLevelDicts/${this.dictionaryId}`).then(res =>{
            console.log(res);
            this.dictionaryInfo.levelName = res.data.levelName;
            this.dictionaryInfo.levelCode = res.data.levelCode;
        })
    },
    // 单位属性详情
    unitLevelDicts2fn(){
        this.$http.unitLevelDicts2(`/unitPropertyDicts/${this.dictionaryId}`).then(res =>{
            console.log(res)
            this.dictionaryInfo.propertyCode = res.data.propertyCode;
            this.dictionaryInfo.propertyName = res.data.propertyName;
        })
    },
    // 单位类型详情
    unitLevelDicts3fn(){
       this.$http.unitLevelDicts3(`/unitCategoryDicts/${this.dictionaryId}`).then(res =>{
            console.log(res)
            this.dictionaryInfo.categoryCode = res.data.categoryCode;
            this.dictionaryInfo.categoryName = res.data.categoryName;
        })  
    },

     // 输入框提交
    editsubmit(){
        if(this.titletext != ''){
            this.dialogVisible = false;
        }
        if(this.titletext == '编辑任务属性'){
            this.editTaskAttributefn(); // 任务属性编辑
        }else if(this.titletext == '新增任务属性'){
            this.addTaskAttributefn();   // 新增任务属性
        }else if(this.titletext == '新增表单属性'){
            this.addformAttributefn(); // 新增表单属性
        }else if(this.titletext == '编辑表单属性'){
            this.editformAttributefn(); // 编辑表单属性
        }else if(this.titletext == '新增单位等级'){
            this.unitLevelDictsaddfn();
        }else if(this.titletext == '编辑单位等级'){
            this.unitLevelDictsupdatefn();
        }else if(this.titletext == '新增单位类型'){
            this.unitCategoryDictsaddfn();
        }else if(this.titletext == '编辑单位类型'){
            this.unitCategoryDictsupdatefn();
        }else if(this.titletext == '新增单位属性'){
            this.unitPropertyDictsaddfn();  // 新增单位属性
        }else if(this.titletext == '编辑单位属性'){
            this.unitPropertyDictsupdatefn();  // 编辑单位属性
        }
        
       
    },

    // 查询
    dictionarytype(data){
        console.log(data)
        this.dictionaryId = '';
        this.dictionaryTypeid = data;
        if(data == 1){
            this.unitLevelDictsfn(); // 查询单位级别字典
        }else if(data == 2){
            this.unitPropertyDictsfn(); // 查询单位属性字典
        }else if(data == 3){
            this.unitCategoryDictsfn(); // 查询单位类型字典
        }else if(data == 4){
            this.getTaskAtrfn();    // 查询任务属性
        }else if(data == 5){
            this.queryFormAttributefn(); // 查询表单属性
        }
    },

    // 树形结构 选中
    handleNodeClick(data) {
        console.log(data);
        console.log(this.dictionaryId)
        if(this.dictionaryId == data.id && this.isbtn){
            this.dictionaryId ='';
            this.atrName = '';
            this.$refs.singleTable.setCurrentRow();
            console.log(this.dictionaryId)
        }else{
            this.dictionaryId = data.id;
            console.log(this.dictionaryId)
        }
        this.atrName = data.name;
        // if(this.dictionaryTypeid == 1){
        //     this.$http.unitLevelDicts1(`/unitLevelDicts/${data.id}`).then(res =>{
        //         console.log(res);
        //         this.dictionaryInfo.levelName = res.data.levelName;
        //         this.dictionaryInfo.levelCode = res.data.levelCode;
        //     })
        // }else if(this.dictionaryTypeid == 2){
        //     this.$http.unitLevelDicts2(`/unitPropertyDicts/${data.id}`).then(res =>{
        //         console.log(res)
        //         this.dictionaryInfo.propertyCode = res.data.propertyCode;
        //         this.dictionaryInfo.propertyName = res.data.propertyName;
        //     })
        // }else if(this.dictionaryTypeid == 3){
        //     this.$http.unitLevelDicts3(`/unitCategoryDicts/${data.id}`).then(res =>{
        //         console.log(res)
        //         this.dictionaryInfo.categoryCode = res.data.categoryCode;
        //         this.dictionaryInfo.categoryName = res.data.categoryName;
        //     })
        // }
    },
    // 清除选中信息
    clerDeselect(){
        this.dictionaryId ='';
        this.atrName = '';
    },

    // 导出
    exporttable(){
        if(this.dictionaryTypeid == 1){
            window.open(`${this.urlorigin}/dev/unitLevelDicts/export`)
        }else if(this.dictionaryTypeid == 2){
            window.open(`${this.urlorigin}/dev/unitPropertyDicts/export`)
        }else if(this.dictionaryTypeid == 3){
            window.open(`${this.urlorigin}/dev/unitCategoryDicts/export`)
        }
    },
    // 导入
    handleChange(file) {
        let _this = this;
        this.isconfirm ++;
        console.log(this.isconfirm)
        const loading = this.$loading({
          lock: true,
          text: '正在上传，请稍微...',
        });
        if(this.isconfirm == 2){
            this.isconfirm = 0;
            loading.close();
                    setTimeout(function(){
                        console.log(file)
                        if(file.response.code == 200){
                            _this.$message.success('导入成功')
                            if(_this.dictionaryTypeid == 1){
                                _this.unitLevelDictsfn(); // 查询单位级别字典
                            }else if(_this.dictionaryTypeid == 2){
                                _this.unitPropertyDictsfn(); // 查询单位属性字典
                            }else if(_this.dictionaryTypeid == 3){
                                _this.unitCategoryDictsfn(); // 查询单位类型字典
                            }
                        }else{
                            _this.$message(file.response.message)
                        }
                    },0)
            // this.$confirm('导入单位将清空所有数据，请谨慎操作，是否继续导入？', '提示', {
            //     confirmButtonText: '确定',
            //     cancelButtonText: '取消',
            //     type: 'warning'
            //     }).then(() => {
            //         if(this.dictionaryTypeid == 1){
            //             this.importurl = `${this.urlorigin}/dev/unitLevelDicts/readExcel`
            //         }else if(this.dictionaryTypeid == 2){
            //             this.importurl = `${this.urlorigin}/dev/unitPropertyDicts/readExcel`
            //         }else if(this.dictionaryTypeid == 3){
            //             this.importurl = `${this.urlorigin}/dev/unitCategoryDicts/readExcel`
            //         }
            //         setTimeout(function(){
            //             console.log(file)
            //             if(file.response.code == 200){
            //                 _this.$message.success(file.response.message)
            //                 if(_this.dictionaryTypeid == 1){
            //                     _this.unitLevelDictsfn(); // 查询单位级别字典
            //                 }else if(_this.dictionaryTypeid == 2){
            //                     _this.unitPropertyDictsfn(); // 查询单位属性字典
            //                 }else if(_this.dictionaryTypeid == 3){
            //                     _this.unitCategoryDictsfn(); // 查询单位类型字典
            //                 }
            //             }else{
            //                 _this.$message(file.response.message)
            //             }
            //         },0)
            //     }).catch(() => {
            //         this.$message('已取消导入')
                           
            // });
        }
            
        console.log(file)
        
      },


  },
  mounted(){
      this.urlorigin = document.location.origin;
    //   this.urlorigin = 'http://192.168.0.70:8888';
      this.importurl = this.urlorigin+'/dev/unitLevelDicts/readExcel'
      if(this.unitId != 0){
          this.$router.push({
              path:'noauthority',
          })
      }
      this.unitLevelDictsfn(); // 查询单位级别字典
      
  },
  watch: {
     dictionaryTypeid(){
        if(this.dictionaryTypeid == 1){
            this.importurl = `${this.urlorigin}/dev/unitLevelDicts/readExcel`
        }else if(this.dictionaryTypeid == 2){
            this.importurl = `${this.urlorigin}/dev/unitPropertyDicts/readExcel`
        }else if(this.dictionaryTypeid == 3){
            this.importurl = `${this.urlorigin}/dev/unitCategoryDicts/readExcel`
        }
     },
     dialogVisible(){
         if(!this.dialogVisible){
             this.isbtn = true;
         }
     }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .libgcolor{
        background: #409EFF;
        color: #fff;
        
    }
    li{
        padding-left: 12px;
        box-sizing: border-box;
        cursor: pointer;
    }
    .titTop{
        background:#f4f6ff;
        padding: 12px;
        margin-top: 20px;
        border: 1px solid #dddddd;
        display: flex;
        align-items: center;
        button{
            color: #fff;
            // margin-right: 15px;
        }
    }
    .unitstructure_cor{
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .Framework{
            border: 1px solid #dddddd;
            padding: 12px;
            >ul{
                >li{
                    line-height: 25px;
                    border-bottom: 1px solid #dddddd;
                    box-sizing: border-box;
                    font-size: 14px;
                    .left_name{ 
                        display: inline-block;
                        width: 100px;
                        text-align: right;
                        margin-right: 20px;
                    }
                }
            }
        }
        .unitstructure{
            width:100%;
            box-sizing: border-box;
        }
        .unitstructure2{
            width: calc(~"100% - 500px")
        }
    }
    .el-input{
        width: 215px;
    }

</style>
<style lang="less">
.unitdictionary{
    .el-dialog__header{
    padding: 10px;
}
.el-dialog__headerbtn{
    top: 14px;
}
.el-dialog__body{
    display: flex;

    .el-input{
        margin-right: 15px;
    }
}
    .el-button--default{
        position: relative;
    }
    .uploadEventFile{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        opacity: 0;
    }
    .el-upload-list{
        display: none;
    }
}

</style>
