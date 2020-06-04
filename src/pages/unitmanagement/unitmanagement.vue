<template>
  <div class="unitmanagement">
    <div class="unitListL">
        <div class="titTop">
            <el-button type="primary" icon="el-icon-document-add" size="small" @click="addunit">新增</el-button>
            <el-button type="primary" icon="el-icon-edit-outline" size="small" @click="editunit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="deletefn">删除</el-button>
            <!-- <el-button type="primary" icon="el-icon-printer" size="small">导入</el-button> -->
            <el-upload
                v-if="unitId == 0"
                class="upload-demo"
                :action="importurl"
                :on-change="handleChange"
                :data="paramsData"
                accept=".xls,.xlsx"
                >
                <el-button size="small " type="primary" icon="el-icon-printer" style="margin:0 10px;">导入</el-button>
            </el-upload>
            <el-button v-if="unitId == 0" type="primary" icon="el-icon-bottom" size="small" @click="exportExcelData">导出</el-button>
           
        </div>
    </div>
    <div class="unitstructure_cor">
        <div class="unitstructure">
            <p class="titTop">单位架构</p>
            <div class="Framework">
                <el-table
                    max-height="600"
                    :data="treedata"
                    style="width: 100%;margin-bottom: 20px; font-size:18px"
                    row-key="id"
                    default-expand-all
                    @row-click="handleNodeClick"
                    highlight-current-row
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                    <el-table-column
                    prop="name"
                    label="名称"
                    align="left"
                    >
                    </el-table-column>
                    <!-- <el-table-column
                    prop="dWBM"
                    label="编号"
                    width="180"
                    >
                    </el-table-column> -->
                </el-table>
            </div>
        </div>
        <div class="unitstructure2">
            <p class="titTop">详细信息</p>
            <div class="Framework" style="padding:0;">
                <ul>
                    <li><span class="left_name">上级单位</span><span>{{unitInfo.companyunit}}</span></li>
                    <li><span class="left_name">单位名称</span><span>{{unitInfo.unitname}}</span></li>
                    <li><span class="left_name">单位级别</span><span>{{unitInfo.unitlevel}}</span></li>
                    <li><span class="left_name">单位属性</span><span>{{unitInfo.superiorunit}}</span></li>
                    <li><span class="left_name">单位类别</span><span>{{unitInfo.unitattribute}}</span></li>
                    <li><span class="left_name">值班室电话</span><span>{{unitInfo.DutyRoomTelephone}}</span></li>
                    <li><span class="left_name">单位代号</span><span>{{unitInfo.unitcode}}</span></li>
                    <li><span class="left_name">单位驻地</span><span>{{unitInfo.unitresident}}</span></li>
                </ul>
            </div>
        </div>
    </div>
    <!-- 新增 -->
    <div class="dialog">
        <el-dialog 
            :title="titletxet"
            :visible.sync="dialogFormVisible"
            width="400px"
            :close-on-click-modal=false
         >
            <el-form>
                <el-form-item v-if="addForm.superiorubit != ''" label="* 当前单位" :label-width="formLabelWidth" v-show="isAdd">
                    <el-input autocomplete="off" :disabled="true" v-model="addForm.superiorubit"></el-input>
                </el-form-item>
                <el-form-item v-if="lishidata.pid != null" label="* 新增方式" :label-width="formLabelWidth" v-show="isAdd">
                    <el-select placeholder="请选择" v-model="addways" @change="addfangshi" :disabled="ifdisable==1?true:false">
                        <el-option label="下级" value="下级"></el-option>
                        <el-option label="同级(向下插入)" value="同级(向下插入)"></el-option>
                        <el-option label="同级(向上插入)" value="同级(向上插入)"></el-option>
                    </el-select>
                    <!-- <el-select v-model="addForm.addways" @change="addfangshi" placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select> -->
                </el-form-item>
                <el-form-item label="* 单位名称" :label-width="formLabelWidth">
                    <el-input autocomplete="off" placeholder="请输入单位名称" v-model="addForm.unitname"></el-input>
                </el-form-item>
                <el-form-item label="* 单位代号" :label-width="formLabelWidth">
                    <el-input autocomplete="off" placeholder="请输入单位代号" v-model="addForm.unitcode"></el-input>
                </el-form-item>
                <el-form-item label="* 单位级别" :label-width="formLabelWidth">
                    <el-select v-model="addForm.unitlevel" @visible-change='visiblefn' :filter-method="treefn" filterable  placeholder="请输入关键词">
                        <el-option v-model="addForm.unitlevel">
                            <el-tree 
                                class="filter-tree" 
                                :data="Unitlevel" 
                                default-expand-all 
                                :filter-node-method="filterNode" 
                                :props="defaultProps" 
                                ref="tree"
                                @node-click="Unitlevelfn">
                            </el-tree>
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="* 单位属性" :label-width="formLabelWidth">
                    <el-select v-model="addForm.superiorunit" @visible-change='visiblefn' :filter-method="treefn2" filterable  placeholder="请输入关键词">
                        <el-option v-model="addForm.unitlevel">
                            <el-tree 
                                class="filter-tree" 
                                :data="Unitattribute" 
                                default-expand-all 
                                :filter-node-method="filterNode" 
                                :props="defaultProps" 
                                ref="tree2"
                                @node-click="Unitattributefn">
                            </el-tree>
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="* 单位类型" :label-width="formLabelWidth">
                    <el-select v-model="addForm.unitattribute" @visible-change='visiblefn' :filter-method="treefn3" filterable placeholder="请输入关键词">
                        <el-option v-model="addForm.unitlevel">
                            <el-tree 
                                class="filter-tree" 
                                :data="Unittype" 
                                default-expand-all 
                                :filter-node-method="filterNode" 
                                :props="defaultProps2" 
                                ref="tree3"
                                @node-click="Unittypefn">
                            </el-tree>
                        </el-option>
                    </el-select>

                </el-form-item>
                <el-form-item label="* 值班室电话" :label-width="formLabelWidth">
                    <el-input autocomplete="off" type="tel" v-model="addForm.DutyRoomTelephone"  placeholder="请输入值班室电话"></el-input>
                </el-form-item>
                <el-form-item label="* 单位驻地" :label-width="formLabelWidth">
                    <el-input autocomplete="off" v-model="addForm.unitresident" placeholder="请输入单位驻地"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button  size="mini" >确 定</el-button> -->
                <el-button type="primary" size="medium" @click="confirmAdd" :disabled='antirepeatclick'>确 定</el-button>
            </div>
        </el-dialog>
    </div>


  </div>
</template>

<script>
    export { default } from './js/index';
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.dialog-footer{
    display: flex;
    justify-content: center;
}
.Framework .el-table {
    font-size: 14px !important;
    cursor: pointer;
}

.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    height: auto;
    max-height: 274px;
    padding: 0;
    overflow: hidden;
    overflow-y: auto;
  }
  .el-select-dropdown__item.selected{
    font-weight: normal;
  }
  ul li .el-tree .el-tree-node__content{
    height:auto;
    padding: 0 20px;
  }
  .el-tree-node__label{
    font-weight: normal;
  }
  .el-tree .is-current .el-tree-node__label{
    color: #409EFF;
    font-weight: 700;
  }
  .el-tree .is-current .el-tree-node__children .el-tree-node__label{
    color:#606266;
    font-weight: normal;
  }
  .titTop{
        background:#f4f6ff;
        padding: 12px;
        margin-top: 20px;
        border: 1px solid #dddddd;
        display: flex;
        button{
            color: #fff;
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
                        // text-align: right;
                        // margin-right: 20px;
                        margin-left: 20px;
                    }
                }
            }
        }
        .unitstructure{
            width:280px;
            box-sizing: border-box;
        }
        .unitstructure2{
            width: calc(~"100% - 300px")
        }
    }
    .el-input{
        width: 215px;
    }
    // .el-select{
    //     //  width: calc(~"100% - 80px");
    // }

</style>
<style>

    .el-dialog__title{
        color: #fff;
        font-size: 16px;
    }
    .el-dialog__header{
        background: #333333;
    }
    .el-dialog__headerbtn .el-dialog__close{
        color: #fff;
    }
    .el-form-item__content{
        line-height: 30px;
    }
    .el-input__inner{
        line-height: 30px;
        height: 30px;
    }
    .el-form-item__label{
        line-height: 30px;
        width: 100px;
    }
    .el-select-dropdown__list {
     padding: 6px 8px;
    }

</style>
