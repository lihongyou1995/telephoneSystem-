<template>
    <div class="usermanagement">
       <div class="content">
            <div class="Unitstructure">
                <p>单位架构</p>
                <div  id="jiagou">
                <el-table
                    max-height="600"
                    :data="queryUserTreedata"
                    style="width: 100%;margin-bottom: 20px;"
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
                </el-table>
                </div>
            </div>
            <div class="userList">
                <div class="operation">
                    <div>
                    </div>
                    <p class="btn_p">
                        <el-button @click="addregistryfn(1)" v-show="postuserList.unitId != unitId " type="primary" size="mini">新增管理员</el-button>
                        <el-button @click="addregistryfn(2)" v-show="postuserList.unitId == unitId " type="primary" size="mini">新增填报员</el-button>
                        <el-button @click="addregistryfn(3)" v-show="postuserList.unitId == unitId " type="primary" size="mini">新增用户</el-button>
                        <el-button @click="exportTemplate" v-show="postuserList.unitId == unitId" type="primary" size="mini">导出模板</el-button>
                        <el-upload
                            v-show="postuserList.unitId == unitId"
                            class="upload-demo"
                            ref="upload"
                            :action="importurl"
                            :data="paramsData"
                            :on-change="handleUploadForm"
                            accept=".xls,.xlsx"
                            :auto-upload="false"
                            >
                            <el-button size="mini" type="primary" style="margin:0 10px;">导入用户</el-button>
                        </el-upload>
                        <el-button @click="deluser" v-show="postuserList.unitId == unitId" type="danger" size="mini">删除</el-button>
                    </p>
                </div>
                <div class="table">
                    <el-table
                        border
                        :data="tableData"
                        :header-cell-style="getRowClass"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column
                            type="selection"
                            width="40"
                            >
                        </el-table-column>
                        <el-table-column
                        prop="account"
                        label="账号"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="userName"
                        label="姓名"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="gender"
                        label="性别"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="roleId"
                        label="角色"
                        align="center"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="officePhone"
                        label="办公室电话"
                       align="center"
                       width="90"
                        >
                        </el-table-column>
                        <el-table-column
                        prop="armyPhone"
                        label="手机号码"
                       align="center"
                        >
                        </el-table-column>
                       <el-table-column label="操作"  width="200" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="vieworedit(scope.row,1)">查看</el-button>
                                <el-button type="primary" size="mini" @click="vieworedit(scope.row,2)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="vieworedit(scope.row,3)">删除</el-button>
                                <!-- <el-button v-if="postuserList.unitId == unitId || unitId == 0" type="primary" size="mini" @click="vieworedit(scope.row,4)">重置密码</el-button> -->
                            </template>
                       </el-table-column>
                       <el-table-column label="重置密码"  width="80" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" @click="vieworedit(scope.row,4)">重置密码</el-button>
                            </template>
                       </el-table-column>
                    </el-table>
                </div>
                <div class="block">
                    <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage4"
                    :page-sizes="[20, 30, 50, 100]"
                    :page-size="20"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total='count'
                    >
                    </el-pagination>
                </div>
            </div>
            <div class="dialog">
                <el-dialog
                    :title="addinfotitle"
                    :visible.sync="dialogFormVisible"
                    width="400px"
                    :close-on-click-modal=false
                >
                    <el-form>
                        <el-form-item label="* 账号" :label-width="formLabelWidth">
                            <el-input :disabled="isdisabled" autocomplete="off" maxlength="20" v-model="adduserinfo.account" placeholder="不超过20位数"></el-input>
                        </el-form-item>
                        <el-form-item v-show="isedit" label="* 密码" :label-width="formLabelWidth">
                            <el-input :disabled="isdisabled" minlength="6" maxlength="20" autocomplete="off" type="password" placeholder="请输入密码(6-20位数)" v-model="adduserinfo.password"></el-input>
                        </el-form-item>
                        <el-form-item label="* 姓名" :label-width="formLabelWidth">
                            <el-input :disabled="isdisabled" autocomplete="off" maxlength="20" placeholder="请输入姓名" v-model="adduserinfo.fullname"></el-input>
                        </el-form-item>
                        <el-form-item v-show="isedit" label="* 性别" :label-width="formLabelWidth">
                            <el-radio-group v-model="adduserinfo.gender">
                                <el-radio :disabled="isdisabled" :label="1">男</el-radio>
                                <el-radio :disabled="isdisabled" :label="2">女</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="* 职别" :label-width="formLabelWidth">
                            <el-input :disabled="isdisabled" placeholder="请输入职别" autocomplete="off"  v-model="adduserinfo.officialrank"></el-input>
                        </el-form-item>
                        <el-form-item v-show="isedit" label="* 所属单位" :label-width="formLabelWidth">
                            <el-input autocomplete="off"  v-model="adduserinfo.unitname" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="办公室电话" :label-width="formLabelWidth">
                            <el-input @change='check' :disabled="isdisabled" autocomplete="off" type="tel" maxlength="11" v-model="adduserinfo.officephone" placeholder="请输入办公室电话"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号码" :label-width="formLabelWidth">
                            <el-input @change='check' :disabled="isdisabled" autocomplete="off" type="tel" maxlength="11" v-model="adduserinfo.militarytelephone"  placeholder="请输入手机号码"></el-input>
                        </el-form-item>

                    </el-form>
                    <div slot="footer" class="dialog-footer" v-if="!isdisabled">
                        <el-button type="primary" size="medium" @click="addsubmit(isedit)" :disabled='antirepeatclick'>确 定</el-button>
                    </div>
                </el-dialog>
            </div>

            <!-- 修改密码 -->
            <div>
                <el-dialog
                title="重置密码"
                :visible.sync="dialogFormVisible2"
                width="320px"
                >
                    <el-form :model="editpas">
                        <el-form-item label="账号" label-width="60px">
                            <el-input v-model='editpas.username' disabled></el-input>
                        </el-form-item>
                        <el-form-item label="* 密码" label-width="60px">
                            <el-input v-model="editpas.newPassword" type="password" show-password placeholder="输入新密码(6-20位)" minlength="6" maxlength="20"></el-input>
                        </el-form-item>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="pwssubmit" size="mediun">确 定</el-button>
                    </div>
                </el-dialog>
            </div>
       </div>
    </div>
</template>
<script>
export { default } from './js/index'
</script>

 <style lang="less" scoped>
 .dialog-footer{
     display: flex;
     justify-content: center;
 }
 .usermanagement{
     .btn_p{
         display: flex;
     }
     .content{
         display: flex;
         margin-top: 20px;
         .Unitstructure{
             border: 1px solid #dddddd;
             width:280px;
             margin-right: 18px;
             >p{
                 background: #f4f6ff;
                 line-height: 40px;
                 padding-left: 15px;
                 box-sizing: border-box;
             }
             >div{
                 padding: 10px;
                 box-sizing: border-box;
             }
         }
         .userList{
             width: calc(~'100% - 300px');
             border: 1px solid #dddddd;
             padding: 15px;
             box-sizing: border-box;
             .operation{
                 display: flex;
                 align-items: center;
                 justify-content: space-between;
                 border-bottom: 1px solid #dddddd;
                 padding-bottom: 15px;
             }
             .block{
                 margin-top: 15px;
             }
         }

     }
 }

 </style>
<style scoped>
    .el-table .cell{
        font-size: 12px;
    }
    #jiagou .el-table {
        font-size: 14px !important;
        cursor: pointer;
    }
</style>
