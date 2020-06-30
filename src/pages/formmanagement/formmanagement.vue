<template>
  <div class="formmanagement">
    <div class="content">
      <div class="top_acc">
        <div></div>
        <div v-show="roleId == 1 && unitId != 0">
          <el-button type="primary" size="mini" @click="copyform">复制</el-button>
          <el-button type="primary" size="mini" @click="addform">新增表单</el-button>
          <el-button type="primary" size="mini" @click="distribute">下发</el-button>
        </div>
      </div>

      <div class="table" v-if="roleId != 3">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          :header-cell-style="getRowClass"
          @selection-change="selectiontaball"
          @row-click="handleRowClick"
        >
          <el-table-column type="selection" width="40" :resizable="false"></el-table-column>
          <el-table-column
            prop="formName"
            label="表单名称"
            align="center"
            min-width="150"
            max-width="400"
          ></el-table-column>

          <el-table-column
            v-if="roleId == 1"
            prop="createUserName"
            label="创建人"
            align="center"
            width="150"
          ></el-table-column>
          <el-table-column prop="formTypeCN" label="表单类型" align="center" width="100"></el-table-column>
          <el-table-column prop="stateCN" label="表单状态" align="center" width="120"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
          <el-table-column prop="endTimes" label="填报剩余时间" align="center" width="150"></el-table-column>
          <el-table-column
            v-if="roleId == 1 && unitId != 0"
            label="操作"
            width="190"
            align="left"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="vieworedit(scope.row,1)">查看</el-button>
              <el-button
                v-if="userId == scope.row.createUser && scope.row.stateCN == '待下发'"
                size="mini"
                type="primary"
                @click="editForm(scope.row)"
              >编辑</el-button>
              <el-button
                v-if="userId == scope.row.createUser"
                size="mini"
                type="danger"
                @click="deletForm(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-if="roleId == 2 && unitId != 0"
            label="操作"
            width="100"
            align="center"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="vieworedit(scope.row,1)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentpage"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="countData"
          ></el-pagination>
        </div>
      </div>

      <div class="table" v-if="roleId == 3">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%;"
          :header-cell-style="getRowClass"
        >
          <el-table-column prop="formName" label="表单名称" align="center"></el-table-column>
          <el-table-column prop="formTypeCN" label="表单类型" align="center" width="150"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="150"></el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="vieworedit(scope.row,1)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange1"
            @current-change="handleCurrentChange1"
            :current-page.sync="currentpage1"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next"
            :total="countData"
          ></el-pagination>
        </div>
      </div>

      <!-- 复制
      <div class="dialog dialogform2">
        <el-dialog
          title="复制"
          :visible.sync="dialogFormVisible"
          width="1200px"
          :close-on-click-modal="isclose"
        >
          <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-dynamic">
            <el-form-item prop="formName" label="表单名">
              <el-input v-model="form.formName" placeholder="请输入表单名"></el-input>
            </el-form-item>
            <el-button
              type="primary"
              size="small"
              @click="submitForm"
              :disabled="antirepeatclick"
            >提交</el-button>
          </el-form>
        </el-dialog>
      </div>-->

      <!-- 新增 -->
      <div class="dialog dialogform2">
        <el-dialog
          title="新增表单"
          :visible.sync="dialogFormVisible"
          width="1200px"
          :close-on-click-modal="isclose"
        >
          <div class="fomrdiv1">
            <div class="fomrdiv1_top">
              <el-form
                :model="form"
                :rules="rules"
                ref="form"
                label-width="100px"
                class="demo-dynamic"
              >
                <el-form-item prop="formName" label="表单名">
                  <el-input v-model="form.formName" placeholder="请输入表单名"></el-input>
                </el-form-item>
                <el-form-item label="表单类型" prop="formType">
                  <el-select v-model="form.formType" @change="formtypevalue" placeholder="请选择表单类型">
                    <el-option
                      v-for="(formtypes,index) in formtypeData"
                      :key="index"
                      :label="formtypes.attribute"
                      :value="formtypes.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <div class="fomrdiv1_add">
              <el-form>
                <el-form-item>
                  <el-form-item
                    v-for="(domain, index) in form.domains"
                    :label="domain.controlname"
                    :key="index"
                    :label-width="formLabelWidth"
                    class="el-form-item__content"
                  >
                    <el-input v-if="domain.type == 1"></el-input>
                    <el-select
                      v-model="domain.value"
                      v-if="domain.type == 2"
                      :placeholder="domain.controlspecification"
                    >
                      <el-option
                        v-for="(controldropdown,index) in domain.valueList"
                        :label="controldropdown.value"
                        :value="controldropdown.value"
                        :key="index"
                      ></el-option>
                    </el-select>
                    <i class="el-icon-delete" @click.prevent="removeDomain(domain)"></i>
                    <!-- <el-button v-if="index > 1" type="danger" size="mini" icon="el-icon-delete" circle @click.prevent="removeDomain(domain)"></el-button> -->
                  </el-form-item>
                </el-form-item>
              </el-form>
            </div>
            <div class="dialog-footer">
              <el-button
                type="primary"
                size="medium"
                @click="submitForm"
                :disabled="antirepeatclick"
              >提交</el-button>
            </div>
          </div>
          <div class="formdiv_r">
            <div slot="footer" class="dialog-footer" style="margin-bottom:15px;height:60px">
              <el-button @click="addDomain2" size="medium" v-show="isdrop">新增选项值</el-button>
              <el-button type="primary" size="medium" @click="addDomain">添加表单控件</el-button>
            </div>

            <div style="border-top: 1px solid #ddd;padding-top:20px">
              <el-form :model="form" :rules="rules" ref="form">
                <el-form-item prop="paragraphName" label="字段名称" :label-width="formLabelWidth">
                  <el-input
                    autocomplete="off"
                    maxlength="30"
                    v-model="form.paragraphName"
                    placeholder="请输入控件名称(最大长度30)"
                  ></el-input>
                </el-form-item>
                <div class="radio">
                  <el-radio-group v-model="radio" @change="radiofn">
                    <el-radio v-model="radio" label="1">输入框</el-radio>
                    <el-radio v-model="radio" label="2">下拉框</el-radio>
                  </el-radio-group>
                </div>
              </el-form>

              <div class="setxl" v-show="isdrop">
                <el-form
                  :model="dynamicValidateForm"
                  ref="dynamicValidateForm"
                  label-width="100px"
                  class="demo-dynamic"
                >
                  <el-form-item
                    v-for="(domain, index) in dynamicValidateForm.domains"
                    :label="'输入值'"
                    :key="index"
                    :prop="'domains.' + index + '.value'"
                  >
                    <el-input v-model="domain.value" maxlength="10" placeholder="最大长度10"></el-input>
                    <i
                      v-if="index != 0"
                      class="el-icon-delete"
                      @click.prevent="removeDomain2(domain)"
                    ></i>
                    <!-- <el-button size="mini" @click.prevent="removeDomain2(domain)">删除</el-button> -->
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>

      <!-- 编辑 -->
      <div class="dialog">
        <el-dialog
          title="编辑表单"
          :visible.sync="dialogFormVisible2"
          width="500px"
          :close-on-click-modal="false"
        >
          <div class="fomrdiv1">
            <el-form label-width="150px" class="demo-dynamic">
              <!-- <el-form-item prop="formName" label="表单名">
                                <el-input v-model="edit.formName" disabled ></el-input>
                            </el-form-item>
                            <el-form-item prop="formName" label="表单类型">
                                <el-input v-model="edit.formType" disabled ></el-input>
              </el-form-item>-->
              <div>
                <el-button type="primary" size="mini" @click="addField">新增字段</el-button>
              </div>
              <el-form-item
                v-for="(item,index) in formdatas"
                :key="index"
                :label="item.propertyName"
              >
                <el-input disabled></el-input>
                <i class="el-icon-edit" @click="editField(item)"></i>
                <i class="el-icon-delete" @click="deletefieid(item)"></i>
              </el-form-item>

              <div class="dialog-footer">
                <el-button type="primary" size="mini" @click="dialogFormVisible2 = false">确定</el-button>
              </div>
            </el-form>
          </div>
        </el-dialog>
      </div>

      <!-- 编辑字段 -->
      <div class="dialog">
        <el-dialog
          title="编辑表单字段"
          :visible.sync="dialogFormVisible3"
          width="450px"
          :close-on-click-modal="false"
        >
          <div class="fomrdiv1">
            <el-form label-width="150px" class="demo-dynamic">
              <el-form-item prop="formName" label="字段名称">
                <el-input v-model="edit.formPropertyName" maxlength="30" placeholder="不超过30个字符"></el-input>
              </el-form-item>
              <div class="dialog-footer">
                <el-button v-if="isEditBtn" type="primary" size="mini" @click="editFieldSubmit">提交</el-button>
                <el-button v-if="!isEditBtn" type="primary" size="mini" @click="addFieldSubmit">提交</el-button>
              </div>
            </el-form>
          </div>
        </el-dialog>
      </div>

      <!-- 新增字段 -->
      <div class="dialog dialogform2">
        <el-dialog
          title="新增字段"
          :visible.sync="dialogFormVisible5"
          width="400px"
          :close-on-click-modal="isclose"
        >
          <div class="formdiv_r">
            <div slot="footer" class="dialog-footer" style="margin-bottom:15px;">
              <el-button @click="addDomain2" size="mini" v-show="isdrop">新增选项值</el-button>
              <!-- <i v-show="isdrop" class="el-icon-plus" @click="addDomain2"></i> -->
              <!-- <el-button v-show="isdrop" type="primary" icon="el-icon-plus" circle @click="addDomain2"></el-button> -->
            </div>

            <div>
              <el-form :model="form" :rules="rules" ref="form" style="border-top: 1px solid #ddd;">
                <el-form-item prop="paragraphName" label="字段名称" :label-width="formLabelWidth">
                  <el-input
                    autocomplete="off"
                    maxlength="30"
                    v-model="form.paragraphName"
                    placeholder="请输入字段名称(最大长度30)"
                  ></el-input>
                </el-form-item>
                <div class="radio">
                  <el-radio-group v-model="radio" @change="radiofn">
                    <el-radio v-model="radio" label="1">输入框</el-radio>
                    <el-radio v-model="radio" label="2">下拉框</el-radio>
                  </el-radio-group>
                </div>
              </el-form>
              <div class="setxl" v-show="isdrop">
                <el-form
                  :model="dynamicValidateForm"
                  ref="dynamicValidateForm"
                  label-width="100px"
                  class="demo-dynamic"
                >
                  <el-form-item
                    v-for="(domain, index) in dynamicValidateForm.domains"
                    :label="'输入值'"
                    :key="index"
                    :prop="'domains.' + index + '.value'"
                  >
                    <el-input v-model="domain.value" maxlength="10" placeholder="最大长度10"></el-input>
                    <i
                      v-if="index != 0"
                      class="el-icon-delete"
                      @click.prevent="removeDomain2(domain)"
                    ></i>
                  </el-form-item>
                </el-form>
              </div>
              <div style="float:right">
                <el-button type="primary" size="mini" @click="addFieldSubmit">添加</el-button>
              </div>
            </div>
          </div>
        </el-dialog>
      </div>

      <!-- 下发选择弹款 -->
      <div class="dialog2">
        <el-dialog
          title="下发"
          :visible.sync="dialogFormVisible4"
          width="400px"
          :close-on-click-modal="false"
        >
          <div class="textarea_div">
            <span>备注:</span>
            <el-input type="textarea" autosize placeholder="备注" v-model="textarea1"></el-input>
          </div>
          <div class="block" style="margin-bottom:15px;">
            <span class="demonstration">截止时间</span>
            <el-date-picker
              v-model="lowerhairtime"
              type="datetime"
              placeholder="选择日期时间"
              @change="datetimefn"
            ></el-date-picker>
          </div>
          <div>
            <p style="margin-bottom:10px">单位：</p>
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox
                v-for="(city,index) in cities"
                :label="city.managerId"
                :key="index"
                v-if="(index + 1) % 3 == 0"
                style="margin-right: 0"
              >{{city.title}}</el-checkbox>
              <el-checkbox :label="city.managerId" :key="index" v-else>{{city.title}}</el-checkbox>
            </el-checkbox-group>
            <p style="margin:10px 0">填报员：</p>
            <el-checkbox-group v-model="distributeuser" @change="handleCheckedCitiesChange2">
              <el-checkbox
                v-for="(item,index) in distributor"
                :key="index"
                :label="item.userId"
              >{{item.account}}---{{item.userName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="quexiafa">
            <el-button type="primary" size="mini" @click="newFormPublishfn">确认下发</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "formmanagement",
  data() {
    return {
      roleId: sessionStorage.getItem("roleId"),
      userId: sessionStorage.getItem("userID"),
      unitId: sessionStorage.getItem("unitId"),
      antirepeatclick: false, // 防重复点击
      isaddform: false,
      isclose: false,
      isaddformtext: "添加表单控件",
      fillinfalse: false,
      isdistributionview: false, // 分发查看
      isformview: false, // 查看页面
      dialogFormVisible: false, // 弹框
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogFormVisible4: false,
      isdrop: false,
      formLabelWidth: "100px",
      currentPage4: 1, // 默认选中的页数
      radio: "1", // 1 输入框 2选择框
      pageIndex: 1,
      pageSize: 10,
      formIdList: [], // 下发表单id
      formName: "", // 表单名称
      formId: "",
      form: {
        domains: [],
        formType: "",
        formName: "",
        paragraphName: "" // 字段名称
      },
      // 编辑表单数据
      edit: {
        formType: "",
        formName: "",
        formPropertyId: "",
        formPropertyName: "", // 字段名称
        formPropertytips: "", // 字段备注
        formId: ""
      },
      formtypeData: [],
      formdatas: [],
      controlname: "",
      controlspecification: "",
      tableData: [],
      multipleSelection: [],
      // 新增控件下拉选项
      controldropdowns: [{}],
      // 选择下拉框输入值
      dynamicValidateForm: {
        domains: [{ value: "" }]
      },
      // 表单验证规则
      rules: {
        formType: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        formName: [
          { required: true, message: "请输入表单名称", trigger: "blur" }
        ],
        paragraphName: [
          { required: true, message: "字段名称为必填", trigger: "blur" }
        ]
      },

      // 下发 分发
      checkedCities: [],
      cities: [],
      pushusers: [], // 推送用户
      isIndeterminate: true,
      lowerhairtime: "", // 下发截至时间
      isissued: true, // 下发 / 分发
      issuedTitle: "选择下发单位",
      suedTimedate: "选择下发截至时间",
      distributor: [], // 被分发人员列表
      distributeuser: [], // 被分发人
      // 分发查看数据
      tableData2: [],
      // 查看
      tableheader: [],
      tableData3: [],
      xfformname: "",
      type2: "",
      stateCnName: "", // 上报状态名称
      isitpossibletoadd: true,
      createUserId: 0, // 表单创建人id
      formnames: [],
      istuisong: true,
      countData: 0,
      formState: this.$route.query.formState,
      fillInNndTime: [], // 填报截止时间
      textarea1: "", // 备注
      userIds: [], // 下发需要传递的参数
      isEditBtn: false,
      dialogFormVisible5: false,
      timeH: 100,
      formNameInfo: "",
      timeData: [],
      isno: true,
      tableData1: [],
      currentpage: 1,
      currentpage1: 1
    };
  },
  methods: {
    // 查询表单数据
    querydata() {
      this.tableData1 = [];
      this.tableData = [];
      this.$http
        .newGetFormTabShow(
          `userId=${this.userId}&unitId=${this.unitId}&roleId=${this.roleId}&pageNum=${this.pageIndex}&pageSize=${this.pageSize}`
        )
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.tableData1 = res.data;
            this.countTime();
            this.countData = res.data.length;
            let a = [];
            this.tableData1.forEach(item => {
              console.log(item);
              if (item.stateCN == "待上报") {
                // this.timeData.push(item);
              }
            });
          } else {
            this.$message(res.data || res.message);
          }
          this.fenye(1);
        });
    },

    // 查询用户表单数据  roleid==3
    queryuserdata() {
      this.tableData = [];
      this.$http
        .getFormObj(`userId=${this.userId}&formState=${this.formState}`)
        .then(res => {
          console.log(res);
          if (res.code == 200 && res.data instanceof Array) {
            this.tableData1 = res.data;
          } else {
            this.$message(res.data || res.message);
          }
          this.fenye(1);
        });
    },

    // 倒计时
    countTime() {
      //获取当前时间
      var date = new Date();
      var now = date.getTime();
      this.tableData.forEach(res => {
        // console.log(res);
        if (res.createUserId == this.userId || res.endTime == null) {
          res.endTimes = "无";
        } else {
          var end = new Date(res.endTime).getTime();
          var leftTime = end - now;
          if (leftTime >= 0) {
            var d = Math.floor(leftTime / 1000 / 60 / 60 / 24),
              h = Math.floor((leftTime / 1000 / 60 / 60) % 24),
              m = Math.floor((leftTime / 1000 / 60) % 60),
              s = Math.floor((leftTime / 1000) % 60);
            var djs = `${d}天${h}小时${m}分${s}秒`;
            if (res.stateCN != "数据采集已完成") {
              res.endTimes = djs;
            } else if (res.stateCN == "数据采集已完成") {
              res.endTimes = "已完成";
            }
            if (d < 1 && h <= 3 && this.isno) {
              this.$notify({
                title: "警告",
                message: "请注意，您有即将到期的任务！",
                type: "warning"
              });
              this.isno = false;
            }
          } else {
            if (res.stateCN == "数据采集已完成") {
              res.endTimes = "已完成";
            } else {
              res.endTimes = "已超时";
            }
          }
        }
        // 使用this.$set()方法赋值，解决vue实例不更新视图问题
        this.$set(this.tableData, res.endTimes, djs);
      });
      setTimeout(this.countTime, 1000);
    },
    // 点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    // 拖到排序
    setSort() {
      // const el = document.getElementsByClassName('el-dialog__body>fomrdiv1_add>el-form>el-form-item>el-form-item__content')[0]
      const el = document.getElementsByClassName("el-form-item__content")[2];
      this.Sortable.create(el, {
        animation: 150, // 动画参数
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          const targetRow = this.form.domains.splice(evt.oldIndex, 1)[0];
          this.form.domains.splice(evt.newIndex, 0, targetRow);
          console.log(this.form.domains);
        }
      });
    },
    // 分页
    handleSizeChange(size) {
      console.log(size);
      this.tableData = [];
      this.currentpage = 1;
      this.pageSize = size;
      this.fenye(1);
      // this.querydata();
    },
    handleCurrentChange(page) {
      console.log(page);
      this.tableData = [];
      this.pageIndex = page;
      this.fenye(page);
      // this.querydata();
    },
    // roleId==3  分页
    handleSizeChange1(size) {
      this.tableData = [];
      this.currentpage1 = 1;
      this.pageSize = size;
      this.fenye(1);
    },
    handleCurrentChange1(page) {
      let _this = this;
      _this.tableData = [];
      console.log(page);
      console.log(`页数${page}`);
      console.log(`pagesize${_this.pageSize}`);
      _this.fenye(page);
    },
    // 自定义分页---专项任务
    fenye(page) {
      let _this = this;
      for (let i in _this.tableData1) {
        // console.log(i);
        if (
          i >= parseInt((page - 1) * _this.pageSize) &&
          i < parseInt((page - 1) * _this.pageSize + _this.pageSize)
        ) {
          console.log(_this.tableData1[i]);
          _this.tableData.push(_this.tableData1[i]);
        }
      }
      _this.countData = _this.tableData1.length; //总数
      console.log(_this.tableData);
    },
    // 选择表单
    selectiontaball(selection) {
      this.formIdList = [];
      console.log(selection);
      if (selection.length > 0) {
        selection.forEach(e => {
          this.formIdList.push(e.id);
        });
      } else {
        this.formIdList = [];
        //   this.formnames = [];
      }
    },
    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f2f2f2";
      } else {
        return "";
      }
    },
    // 下发按钮事件
    distribute() {
      if (this.formIdList.length === 0) return this.$message("请先选择表单");
      this.dialogFormVisible4 = true;
      // 查询下发单位
      this.$http
        .queryTree3(`/unit/queryTree3?unitId=${this.unitId}`)
        .then(res => {
          console.log(res);
          this.cities = [];
          if (res.code == 200) {
            res.data.forEach(item => {
              console.log(item);
              if (item.managerId) {
                this.cities.push(item);
              }
            });
          }
        });
      // 查询下发填报员
      this.$http
        .getReportersByUnitId(
          `/user/getReportersByUnitId?unitId=${this.unitId}`
        )
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.distributor = res.data;
          }
        });
    },
    // 下发单位选择
    handleCheckedCitiesChange(id) {
      console.log(id);
      this.checkedCities = id;
    },
    // 下发填报员选择
    handleCheckedCitiesChange2(id) {
      console.log(id);
      this.distributeuser = id;
    },
    // 下发截至时间选择
    datetimefn(date) {
      console.log(date);
      console.log(date.getTime());
      console.log(Date.now());
      if (date.getTime() >= Date.now()) {
        var year = date.getFullYear(),
          month =
            date.getMonth() + 1 < 10
              ? "0" + (date.getMonth() + 1)
              : date.getMonth() + 1,
          day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
          hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
          minute =
            date.getMinutes() < 10
              ? "0" + date.getMinutes()
              : date.getMinutes(),
          second =
            date.getSeconds() < 10
              ? "0" + date.getSeconds()
              : date.getSeconds();
        this.lowerhairtime =
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hour +
          ":" +
          minute +
          ":" +
          second;
        console.log(this.lowerhairtime);
      } else {
        this.lowerhairtime = "";
        this.$message("截至时间必须大于当前时间");
      }
    },
    // 下发提交
    newFormPublishfn() {
      if (this.checkedCities.length === 0 && this.distributeuser.length === 0) {
        return this.$message("请选择单位或填报员");
      }
      if (this.lowerhairtime == "") return this.$message("请选择截止时间");
      this.dialogFormVisible4 = false;
      this.checkedCities.forEach(item => {
        this.userIds.push(`${item}:1`);
      });
      this.distributeuser.forEach(item => {
        this.userIds.push(`${item}:2`);
      });
      console.log(this.userIds.toString());
      // return;
      if (
        this.textarea1.indexOf(",") != -1 ||
        this.textarea1.indexOf(":") != -1
      )
        return this.$message("备注不能含有英文状态下的逗号或者冒号");
      this.$http
        .newFormPublish({
          formIds: this.formIdList.toString(),
          userId: this.userId,
          userIds: this.userIds.toString(),
          publishTime: this.lowerhairtime,
          remark: this.textarea1
        })
        .then(res => {
          console.log(res);
          this.userIds = [];
          // this.formIdList = [];
          if (res.code !== 200) return this.$message(res.data || res.message);
          this.$message.success("下发成功");
          this.querydata();
        });
    },
    // 删除表单
    deletForm(item) {
      this.$confirm("是否继续删除这条表单记录？", "删除表单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.$http
            .newDeleteForm({
              formId: item.id,
              userId: this.userId
            })
            .then(res => {
              console.log(res);
              this.querydata(); // 查询表单数据
              if (res.code === 200) return this.$message.success("删除成功");
              return this.$message(res.data || res.message);
            });
        })
        .catch(() => {});
    },
    // 1查看 2编辑 3删除
    vieworedit(data, type, type2) {
      console.log(data);
      if (data.createUserId) {
        this.createUserId = data.createUserId;
      }
      this.formName = data.formName;
      this.formId = data.formId;
      this.stateCnName = data.stateCnName;
      if (type == 1) {
        this.$router.push({
          name: "formmanagement/formview",
          query: {
            formName: this.formName,
            formId: data.id,
            createUserId: data.createUser,
            state: data.state
          }
        });
      } else if (type == 2) {
        this.edit.formType = data.formType;
        this.edit.formName = data.formName;
        // this.dialogFormVisible2 = true;
        // this.quyeditform(this.formId);
      }
    },
    // 查询编辑字段
    queryEditgetAtr() {
      this.$http
        .editgetAtr(`/newForm_/getAtr?formId=${this.formId}`)
        .then(res => {
          console.log(res);
          this.formdatas = res.data;
          if (res.code === 200) return (this.dialogFormVisible2 = true);
          this.$message(res.data || res.message);
        });
    },
    // 编辑按钮事件
    editForm(item) {
      console.log(item);
      this.formId = item.id;
      this.queryEditgetAtr();
    },
    // 增加字段
    addField() {
      this.isEditBtn = false;
      this.dialogFormVisible5 = true;
    },
    // 增加字段提交
    addFieldSubmit() {
      var values = [];
      console.log(this.radio);
      console.log(this.form.paragraphName);
      if (this.form.paragraphName == "") return this.$message("请填写字段名");
      if (
        this.form.paragraphName.indexOf(",") != -1 ||
        this.form.paragraphName.indexOf(":") != -1
      )
        return this.$message("字段名不能含有英文状态下的逗号或者冒号");
      if (this.radio == 2) {
        this.dynamicValidateForm.domains.forEach(res => {
          if (res.value == "") {
            this.$message("选择框的值不能为空");
            return false;
          } else {
            values.push({ value: res.value });
          }
        });
      }
      console.log(values);
      this.$http
        .newAddfield({
          type: this.radio,
          controlname: this.form.paragraphName,
          formId: this.formId,
          ValueList: values,
          userId: this.userId
        })
        .then(res => {
          console.log(res);
          this.dialogFormVisible5 = false;
          this.queryEditgetAtr();
          if (res.code === 200) return this.$message.success("添加成功");
          return this.$message(res.data || res.message);
        });
    },
    // 编辑字段按钮
    editField(item) {
      console.log(item);
      this.isEditBtn = true;
      this.edit.formId = item.formId;
      this.edit.formPropertyId = item.propertyId;
      this.edit.formPropertyName = item.propertyName;
      this.dialogFormVisible3 = true;
    },
    // 编辑字段提交
    editFieldSubmit() {
      this.antirepeatclick = true;
      if (
        this.edit.formPropertyName.indexOf(",") != -1 ||
        this.edit.formPropertyName.indexOf(":") != -1
      )
        return this.$message("字段名称不能含有英文状态下的逗号或者冒号");
      this.$http
        .newUpfield({
          formId: this.edit.formId,
          fieldId: this.edit.formPropertyId,
          filedName: this.edit.formPropertyName,
          userId: this.userId
        })
        .then(res => {
          console.log(res);
          this.antirepeatclick = false;
          this.queryEditgetAtr();
          this.dialogFormVisible3 = false;
          if (res.code === 200) return this.$message.success("编辑成功");
          return this.$message(res.data || res.message);
        });
    },
    // 删除字段提交
    deletefieid(item) {
      this.edit.formId = item.formId;
      this.edit.formPropertyId = item.propertyId;
      this.edit.formPropertyName = item.propertyName;
      this.$confirm("是否继续删除", "删除字段", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          this.$http
            .newDeleteFiledById({
              fieldId: this.edit.formPropertyId,
              formId: this.edit.formId,
              userId: this.userId
            })
            .then(res => {
              console.log(res);
              this.queryEditgetAtr();
              if (res.code === 200) return this.$message.success("删除成功");
              return this.$message(res.data || res.message);
            });
        })
        .catch(() => {});
    },
    // 表单类型选择
    formtypevalue(value) {
      console.log(value);
      this.form.formType = value;
    },
    // 新增表单事件
    addform() {
      this.dialogFormVisible = true;
    },
    // 复制表单事件
    copyform() {
      this.currentpage = 1;
      //   this.dialogFormVisible = true
      if (this.formIdList.length == 0) {
        this.$message({
          type: "info",
          message: "请选择一张表单进行复制！"
        });
        return;
      }
      if (this.formIdList.length !== 1) {
        this.$message({
          type: "info",
          message: "只能选择一张表单进行复制！"
        });
        return;
      }
      this.$prompt("新表单名", "复制表单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          console.log("ids:", this.formIdList.toString());

          this.$http
            .copyAddForm({
              formName: value,
              formId: this.formIdList[0],
              userId: this.userId,
              unitId: this.unitId
            })
            .then(res => {
              this.$message.success("复制成功");
              this.querydata();
              console.log(res);
              //   this.antirepeatclick = false
              //   if (res.code == 200) {
              //     this.form.paragraphName = ''
              //     this.dynamicValidateForm.domains = [{ value: '' }]
              //     this.form.formName = ''
              //     this.form.formType = '';
              //     (this.form.domains = []), this.querydata() // 查询表单数据
              //     this.$message.success('新增成功')
              //   } else {
              //     this.$message(res.data)
              //   }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    // 单选
    radiofn(data) {
      console.log(data);
      if (data == 2) {
        this.isdrop = true;
      } else {
        this.isdrop = false;
      }
    },
    // 新增表单提交事件
    submitForm(formName) {
      this.currentpage = 1;
      this.tableData = [];
      this.fenye(1);
      this.tableData1 = [];
      if (
        this.form.formName.indexOf(",") != -1 ||
        this.form.formName.indexOf(":") != -1 ||
        this.form.domains.indexOf(",") != -1 ||
        this.form.domains.indexOf(":") != -1
      )
        return this.$message("表单名不能输入英文状态下的逗号或者冒号");
      if (this.form.formName == "" || this.form.formType == "") {
        this.$message("表单名称或表单类型不能为空");
        return false;
      } else if (this.form.domains.length < 1) {
        this.$message("请至少添加一个字段");
        return false;
      }
      this.antirepeatclick = true;
      this.dialogFormVisible = false;
      this.$http
        .newAddForm({
          formName: this.form.formName,
          formType: this.form.formType,
          userId: this.userId,
          unitId: this.unitId,
          fieldSelection: this.form.domains
        })
        .then(res => {
          console.log(res);
          this.antirepeatclick = false;
          if (res.code == 200) {
            this.form.paragraphName = "";
            this.dynamicValidateForm.domains = [{ value: "" }];
            this.form.formName = "";
            this.form.formType = "";
            (this.form.domains = []), this.querydata(); // 查询表单数据
            this.$message.success("新增成功");
          } else {
            this.$message(res.message);
            // this.$message(res.data)
          }
        });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain(item) {
      console.log(item);
      var index = this.form.domains.indexOf(item);
      if (index !== -1) {
        this.form.domains.splice(index, 1);
      }
    },
    // 新增控件
    addDomain() {
      if (
        this.form.paragraphName != "" &&
        this.form.paragraphName.length <= 30
      ) {
        if (
          this.form.paragraphName.indexOf(",") != -1 ||
          this.form.paragraphName.indexOf(":") != -1
        )
          return this.$message("字段名称不能含有英文状态下的逗号或者冒号");
        this.isitpossibletoadd = true;
        this.form.domains.forEach(res => {
          if (this.form.paragraphName == res.controlname) {
            this.$message("该字段已存在，请注意字段名称不能重复");
            this.isitpossibletoadd = false;
            return false;
          }
        });
        if (this.form.domains.length >= 20) {
          return this.$message("最多只能添加20个字段哦");
        }
        if (this.isitpossibletoadd) {
          if (this.radio == 1) {
            this.form.domains.push({
              type: 1,
              controlname: this.form.paragraphName,
              valueList: []
            });
            this.$message.success("添加成功！");
          } else if (this.radio == 2) {
            let isaddse = true;
            let values = [];
            console.log(this.dynamicValidateForm);
            this.dynamicValidateForm.domains.forEach(res => {
              if (res.value == "") {
                this.$message("选择框的值不能为空");
                isaddse = false;
                return false;
              } else {
                values.push({ value: res.value });
              }
            });
            if (isaddse) {
              this.form.domains.push({
                type: 2,
                controlname: this.form.paragraphName,
                valueList: values
              });
            }
          }
          console.log(this.form.domains);
        }
      } else {
        this.$message("字段名称不能为空并且不超过30个字符");
      }
    },

    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm2(formName) {
      this.$refs[formName].resetFields();
    },
    removeDomain2(item) {
      var index = this.dynamicValidateForm.domains.indexOf(item);
      if (index !== -1) {
        this.dynamicValidateForm.domains.splice(index, 1);
      }
    },
    addDomain2() {
      this.dynamicValidateForm.domains.push({
        value: ""
      });
    },

    // 查询表单类型
    queryFormAttributefn() {
      this.$http.getFormAtrribute().then(res => {
        console.log(res);
        if (res.code == 200) {
          this.formtypeData = res.data;
        }
      });
    },

    // 填报员点击查看
    tbyvivew() {
      this.$http
        .getFormData(
          `/form/getFormData?unitName=${undefined}&acceptUserId=${undefined}&formName=${this.formName}&roleId=${this.roleId}&unitId=${this.unitId}&userId=${this.userId}`
        )
        .then(res => {
          console.log(res);
          if (res.data instanceof Array) {
            this.tableData3 = res.data;
          }
        });
    }
  },
  mounted() {
    //   console.log(this.tableData)
    if (this.roleId == 3) {
      this.queryuserdata();
    } else {
      this.querydata(); // 查询表单数据
      this.queryFormAttributefn(); // 查询表单类型
    }
    this.$nextTick(() => {
      if (this.timeH <= 3) {
        console.log(this.timeData);
        this.$notify({
          title: "警告",
          message: "请注意，您有即将到期的表单！",
          type: "warning",
          duration: 0
        });
        this.timeH = "";
      }
    });
  },
  watch: {
    $route() {
      this.formState = this.$route.query.formState;
      this.queryuserdata();
    },
    "form.domains"(data) {
      if (data.length > 0) {
        this.setSort();
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.textarea_div {
  display: flex;
  align-items: center;
  span {
    width: 45px;
  }
  .el-textarea {
    width: 80%;
  }
}
.content {
  padding: 15px;
  box-sizing: border-box;
  .top_acc {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .table {
    margin-top: 15px;
  }
  .fomrdiv1 {
    // border-bottom: 1px solid #dddddd;
    margin-bottom: 15px;
    padding-bottom: 15px;
  }
  .radio {
    padding-left: 33px;
  }
  .quexiafa {
    text-align: right;
    margin-top: 15px;
  }
}
</style>
<style lang="less">
.returnbutton {
  font-size: 12px;
  margin-bottom: 15px;
  cursor: pointer;
  display: inline-block;
}

.formmanagement {
  .content {
    .dialog {
      .el-input {
        width: 215px;
      }
    }
    .el-dialog__body {
      display: flex;
      //    align-items: center;
    }
    .dialog2 {
      .el-dialog__body {
        display: block !important;
        .el-input__inner {
          height: 30px;
        }
      }
    }

    .fomrdiv1 {
      width: 700px;
      border-right: 1px solid #dddddd;
      .dialog-footer {
        text-align: right;
        padding-right: 15px;
        box-sizing: border-box;
        // margin-top: -50px;
      }
      .el-form-item__content {
        margin-left: 0 !important;
        // margin-bottom: 15px;
      }
      .el-form {
        // display: flex;
        align-items: center;
        > .el-form-item {
          margin-right: 15px;
          display: flex;
        }
      }
      .fomrdiv1_add {
        height: 200px;
        padding-right: 15px;
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        // border-bottom: 1px solid #ddd;
        // border-left: 1px solid #ddd;
        position: relative;
        overflow: auto;
        .el-form-item__content {
          margin-bottom: 15px;
          width: 100%;
        }
        .el-form-item {
          width: 100%;
        }
        .el-button--danger {
          margin-left: 15px;
        }
      }
      .fomrdiv1_top {
        height: 60px;
        .el-form {
          display: flex;
        }
      }
      .dialog-footer {
        margin-right: 15px;
        margin-top: 15px;
      }
    }
    .formdiv_r {
      width: 400px;
      .dialog-footer {
        padding-left: 100px;
      }
      .radio {
        padding-left: 35px;
        margin-bottom: 22px;
      }
      .setxl {
        max-height: 200px;
        overflow: auto;
      }
    }
  }
}
</style>
