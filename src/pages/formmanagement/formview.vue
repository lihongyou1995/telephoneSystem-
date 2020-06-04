<template>
  <div class="formview">
    <!--
    <el-dialog  title="日志操作详情" center :visible.sync="viewDetailVisible" width="70%">-->
    <div class="check1">
      <el-drawer
        direction="rtl"
        :visible.sync="drawer"
        title="修改审核"
        :size="tableheader.length > 8 ? '60%' : '50%'"
      >
        <div class="anniu" style="padding: 10px; text-align: right">
          <el-button size="mini" type="primary" @click="examineFormUpdate" v-if="roleId == 1">审核</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="reportFormUpdate"
            v-if="roleId == 1 || roleId == 2"
          >上报</el-button>
          <el-button size="mini" type="primary" @click="rejectFormUpdate" v-if="roleId == 1">驳回</el-button>
          <el-button size="mini" type="primary" @click="deleteFormUpdate" v-if="roleId == 1">删除</el-button>
        </div>
        <el-table
          border
          :max-height="tableheight"
          v-loading="showloading"
          v-loadmore="ifloads1=='1'?load1s:''"
          ref="dragTable"
          :data="tableData1"
          tooltip-effect="dark"
          row-key="序号"
          style="width: 100%; overflow:auto"
          :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange1"
          @row-click="handleRowClick"
          @click.stop
          @row-contextmenu="rowContextmenu"
          v-rightMenu="menudata"
        >
          <el-table-column type="selection" width="40" fixed :resizable="false"></el-table-column>

          <el-table-column
            :resizable="false"
            class-name="test-class"
            v-for="(item,index) in tableheader"
            :key="index"
            :label="item.propertyName"
            align="center"
            :prop="item.propertyName"
            data-id="序号"
            :width="item.width"
            :render-header="renderHeader1"
          ></el-table-column>

          <el-table-column
            v-if="roleId != 3"
            label="操作"
            width="80"
            align="center"
            fixed="right"
            :resizable="false"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                :disabled="scope.row.pushType == '推送'"
                type="primary"
                @click="editBtn(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-drawer>
    </div>

    <div class="top_acc">
      <div style="margin-bottom: 15px;">
        <!-- <el-page-header @back="goBack"></el-page-header> -->
        <el-button type="primary" size="medium" @click="goBack" icon="el-icon-arrow-left">返回</el-button>
      </div>
      <div class="right" v-if="roleId != 3">
        <el-input
          type="text"
          clearable
          v-model="search"
          @clear="clearquy"
          style="width:180px;margin-right:15px;"
          placeholder="关键字查询"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchQuery"></el-button>
        </el-input>
        <div class="marginR">
          <template>
            <el-select @change="changeDataState" v-model="dataStateValue" placeholder="请选择数据类型">
              <el-option
                v-for="item in dataState"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </template>
        </div>
        <div class="btns">
          <el-button @click="drawerShow" size="mini" type="primary">修改审核</el-button>

          <el-button size="mini" type="primary" @click="exportbtn">导出</el-button>
          <el-upload
            class="upload-demo"
            :action="importurl"
            :data="paramsData"
            :on-change="handleUploadForm"
            accept=".xls, .xlsx"
          >
            <el-button size="mini" type="primary" style="margin:0 10px;">导入数据</el-button>
          </el-upload>
          <el-button size="mini" type="primary" @click="distribute" v-if="roleId == 1">推送</el-button>
          <el-button size="mini" type="primary" @click="datatb(true)">填报</el-button>
          <el-button size="mini" type="primary" @click="nextView(1)" v-show="roleId == 1">已下发</el-button>
          <el-button size="mini" type="primary" @click="nextView(2)" v-show="roleId == 1">已推送</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="adataRejectfn"
            v-if="roleId == 1 && stateQuery == 4"
          >驳回</el-button>
          <el-button
            size="mini"
            type="success"
            @click="addtbydataUpload"
            v-if="createUserId != userId"
          >上报</el-button>
          <el-button size="mini" type="danger" @click="deletData">删除</el-button>
          <el-button size="mini" type="success" @click="adataExaminefn" v-show="roleId == 1">审核通过</el-button>
          <el-button size="mini" type="success" @click="sortedarrays(true)">保存排序</el-button>
        </div>
      </div>
      <div class="right" v-if="roleId == 3">
        <el-button size="mini" type="primary" @click="exportbtn">导出</el-button>
        <el-button size="mini" type="primary" @click="collection">收藏</el-button>
      </div>
    </div>

    <!-- --------------------  数据列表 -->
    <div class="table sendFormUnitsfn">
      <div class="lefttren">
        <el-table
          border
          :header-cell-style="{background:'#F5F7FA'}"
          header-cell-class-name="lefttren-table"
          :data="datatree"
          style="width: 100%;margin-bottom: 20px;"
          :row-key="session.roleId!=3?'unitId':'keyId'"
          default-expand-all
          @cell-click="handleNodeClick"
          @click.stop
          ref="trees"
          highlight-current-row
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          :max-height="tableheight"
        >
          <el-table-column :prop="session.roleId!=3?'unitName':'data'" label="单位名称"></el-table-column>
        </el-table>
      </div>

      <div class="table_content">
        <el-table
          class="table_table"
          border
          :max-height="tableheight"
          ref="dragTable"
          :data="tableData"
          tooltip-effect="dark"
          row-key="序号"
          style="width: 100%;"
          :header-cell-style="getRowClass"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @row-contextmenu="rowContextmenu"
          v-rightMenu="menudata"
        >
          <el-table-column type="selection" width="40" :resizable="false" fixed></el-table-column>

          <el-table-column
            class-name="test-class"
            v-for="(item,index) in tableheader"
            :fixed="item.propertyName=='序号'?true:false"
            :key="index"
            :label="item.propertyName"
            align="center"
            :prop="item.propertyName"
            data-id="序号"
            :width="item.width"
            :render-header="renderHeader"
            min-width="120"
          ></el-table-column>

          <el-table-column
            v-if="roleId != 3"
            label="操作"
            width="80"
            align="center"
            :resizable="false"
            fixed="right"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                :disabled="scope.row.pushType == '推送'"
                type="primary"
                @click="editBtn(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div style="margin-top:20px" class="fenye">
          <el-pagination
            :page-size="pageSize"
            :page-sizes="[500, 200, 1000]"
            :current-page.sync="currentPage"
            layout="total, sizes, prev, pager, next,jumper"
            :total="countData"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
    <!-- -------------------- -->
    <div class="dialog2">
      <el-dialog
        title="选择推送用户"
        :visible.sync="dialogFormVisible4"
        width="400px"
        :close-on-click-modal="false"
      >
        <div class="textarea_div">
          <span>备注:</span>
          <el-input type="textarea" autosize placeholder="备注" v-model="textarea1"></el-input>
        </div>
        <div style="margin-bottom:15px">
          <p style="margin-bottom:5px">推送单位：</p>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(item,index) in pushusers.manager"
              :label="item.userId"
              :key="index"
            >{{item.unitName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div style="margin-bottom:15px">
          <p style="margin-bottom:5px">推送用户：</p>
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="(item,index) in pushusers.user"
              :label="item.userId"
              :key="index"
            >{{item.account}}---{{item.userName}}</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="quexiafa">
          <el-button
            style="float:right;"
            type="primary"
            size="mini"
            @click="confirmthenextissue"
          >确认推送</el-button>
        </div>
      </el-dialog>
    </div>

    <div>
      <div class="dialog dialogform2">
        <el-dialog
          :title="typetitle"
          :visible.sync="dialogFormVisible"
          width="400px"
          :close-on-click-modal="false"
        >
          <el-form :model="form">
            <el-form-item
              :label-width="formLabelWidth"
              v-for="(item,index) in loadList()"
              :key="index"
              :label="item.propertyName"
            >
              <el-input
                @input="change($event)"
                v-if="item.propertyType == 1"
                v-model="item.key"
                @change="getvalue($event)"
              ></el-input>
              <el-select @input="change($event)" v-if="item.propertyType== 2" v-model="item.key">
                <el-option
                  v-for="(item2,index) in item.valueList"
                  :key="index"
                  :label="item2"
                  :value="item2"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" size="mini" @click="dialogFormVisiblefn">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </div>

    <div class="exportDialog">
      <el-dialog title="导出" :visible.sync="exportDialog" width="30%" :close-on-click-modal="false">
        <div style="margin-bottom:20px;">
          <p style="margin-bottom:10px;">选择导出类型：</p>
          <template>
            <el-radio-group @change="changeExportType" v-model="exportType" size="mini">
              <el-radio border :label="1">导出excel数据</el-radio>
              <el-radio border :label="2">导出excel模板</el-radio>
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
    <!-- 下发查看 -->
    <div>
      <nextView ref="child" :formId="formId" :formName="formName"></nextView>
    </div>
  </div>
</template>

<script>
import nextView from "./component/nextView";
export default {
  name: "formview",
  components: {
    nextView
  },
  data() {
    return {
      parentkeyWords: "",
      parentPropertyId: "",
      sonkeyWords: "",
      sonPropertyId: "",
      ifdisable: false,
      currentPage: 1,
      ifdbclick: true,
      tableheight: 600,
      showloading: false,
      loadData: [],
      loadData1: [],
      loading: true,
      immediate: false,
      loading1: false,
      isshow: true,
      immediate1: false,
      drawer: false,
      session: sessionStorage,
      roleId: "",
      userId: "",
      unitId: "",
      unkId: "",
      userId2: "",
      dialogFormVisible: false,
      formLabelWidth: "100px",
      edittableData: [],
      sortArr: [],
      importurl: "",
      paramsData: {
        formName: this.$route.query.formName,
        formId: this.$route.query.formId,
        userId: sessionStorage.getItem("userID"),
        unitId: sessionStorage.getItem("unitId"),
        roleId: sessionStorage.getItem("roleId")
      },
      isconfirm: 0,
      datatree: [],
      defaultProps: {
        children: "children",
        label: "unitName"
      },
      editdata: [],
      typeface2: 1,
      formName: this.$route.query.formName,
      tableheader: [],
      tableData: [],
      tableData1: [],
      type2: this.$route.query.type2,
      stateCnName: this.$route.query.stateCnName,
      formId: parseInt(this.$route.query.formId),
      createUserId: this.$route.query.createUserId,
      formState: this.$route.query.state,
      typetitle: "",
      form: {
        values: []
      },
      dialogFormVisible4: false,
      pushunitIds: [],
      pushusers: [],
      checkedCities: [],
      pageSize: 500,
      pageIndex: 1,
      pageIndex1: 1,
      countData: 0,
      unkIdList: [], // 选择的数据
      unkIdList1: [], // 选择的数据
      sortedarraysIndex: 0,
      dataState: [],
      dataStateValue: "所有数据",
      stateQuery: "1",
      exporyUrl: "",
      exportDialog: false, // 导出框
      exportType: 1, // 导出类型  1数据 2模板 3pdf
      exportFont: 1, // 导出字体 1宋体 2防宋 3楷体
      unkIds: [], // 数据驳回
      phoneBookList: [],
      search: "",
      textarea1: "",
      queryUnitId: "",
      ifloads: "1",
      ifloads1: "1",
      menudata: {
        //  Menu box style
        boxStyle: "width:100px;background:#409EFF;",
        // Style of menu options
        optionStyle: ` color:#fff;
                        font-size:14px;
                        cursor: pointer;
                        border-radius:10px;
                        line-height:25px;
                        `,
        menus: [
          {
            content: `插入数据`,
            callback: "rightClickCallback"
          }
        ]
      },
      serial: ""
    };
  },
  methods: {
    renderHeader(h, { column }) {
      if (column.property.length > 100) {
        return h("div", [
          h(
            "el-tooltip",
            {
              props: {
                effect: "dark",
                content: column.property,
                placement: "top"
              }
            },
            [h("label", column.label.slice(0, 6) + "...")],
            {
              content: column.label
            }
          )
        ]);
      } else {
        return h("div", [h("label", column.label)]);
      }
    },
    renderHeader1(h, { column }) {
      if (column.property.length > 100) {
        return h("div", [
          h(
            "el-tooltip",
            {
              props: {
                effect: "dark",
                content: column.property,
                placement: "top"
              }
            },
            [h("label", column.label.slice(0, 4) + "...")],
            {
              content: column.label
            }
          )
        ]);
      } else {
        return h("div", [h("label", column.label)]);
      }
    },
    drawerShow() {
      this.drawer = true;
      this.loadData1 = [];
      this.tableData1 = [];
      this.pageIndex1 = 1;
      this.showloading = false;
      this.ifloads1 = "1";
      this.cleanData1();
      this.load1s();
    },
    // 表格右键
    rowContextmenu(item) {
      // console.log(item)
      this.serial = item.序号;
    },
    // 表格右键确认事件
    rightClickCallback(item) {
      // console.log(this.serial)
      this.datatb(false); // 调用填报按钮事件
      this.sortedarrays(); // 排序后的数据
    },

    clearquy() {
      this.loads();
    },

    searchQuery() {
      if (this.search.indexOf(",") != -1 || this.search.indexOf(":") != -1)
        return this.$message("不能输入英文状态下的逗号或者冒号");
      this.currentPage = 1;
      this.cleanData();
      this.loads();
    },

    cleanData() {
      this.pageIndex = 1;
      this.loadData = [];
      this.tableData = [];
      this.ifloads = "1";
    },

    cleanData1() {
      this.pageIndex1 = 1;
      this.loadData1 = [];
      this.tableData1 = [];
      this.ifloads1 = "1";
    },

    change(e) {
      this.$forceUpdate();
    },
    // 获取表头
    gettableheaderfn() {
      this.$http.gettableheader(`formId=${this.formId}`).then(res => {
        // console.log(res)
        if (res.code == 200) {
          res.data.unshift({
            propertyName: "序号",
            width: "60"
          });
          res.data.push({
            propertyName: "填报单位"
          });
          res.data.push({
            propertyName: "数据标识",
            width: "140"
          });

          this.tableheader = res.data;
          // console.log(this.tableheader)
        }
      });
    },
    load1s(item) {
      let _this = this;
      if (_this.ifloads1 == "0") return;
      _this.$http
        .getFormUpdateData(
          `pageNum=${this.pageIndex1}&pageSize=${this.pageSize}&formId=${this.formId}&userId=${this.userId}`
        )
        .then(res => {
          _this.countData = res.num;
          if (res.code == 200) {
            _this.loadData1 = res.data;
            if (_this.loadData1) {
              if (_this.loadData1.length < 100) {
                _this.ifloads1 = "0";
                _this.loading1 = true;
                // _this.immediate1 = false
              } else {
                _this.ifloads1 = "1";
                _this.pageIndex1 += 1;
                _this.loading1 = false;
                // _this.immediate1 = true
              }
              _this.tableData1 = _this.tableData1.concat(_this.loadData1);
              for (let key in _this.tableData1) {
                _this.tableData1[key]["序号"] = parseInt(key) + 1;
              }
            }
          } else {
            _this.loading1 = true;
            _this.immediate1 = false;
            _this.$message(res.data || res.message);
          }
        });
    },

    // 分页加载
    loads(item) {
      var item = item || "";
      let _this = this;
      _this.loadData = [];
      _this.tableData = [];
      if (sessionStorage.roleId != 3) {
        this.$http
          .newQueryFormData(
            `pageNum=${this.pageIndex}&pageSize=${this.pageSize}&keyWords=${
              this.search
            }&formId=${this.formId}&unitId=${""}&userIds=${
              this.userId2
            }&userId=${this.userId}&roleId=${this.roleId}&type=${
              this.stateQuery
            }`
          )
          .then(res => {
            _this.ifdbclick = true;
            _this.countData = res.num;
            if (res.code == 200) {
              _this.loadData = res.data;
              let start = 0;
              let end = 50;
              let sets = setInterval(function() {
                let xuhao = 0;
                if (end <= _this.loadData.length) {
                  _this.tableData = _this.tableData.concat(
                    _this.loadData.slice(start, end)
                  );
                } else {
                  _this.tableData = _this.tableData.concat(
                    _this.loadData.slice(start)
                  );
                  clearInterval(sets);
                }
                start += 50;
                end += 50;
                for (let key in _this.tableData) {
                  xuhao += 1;
                  let numsg = parseInt(
                    xuhao + parseInt((_this.pageIndex - 1) * _this.pageSize)
                  );
                  _this.tableData[key]["序号"] = numsg;
                }
              }, 10);
            } else {
              _this.loading = true;
              _this.$message(res.data || res.message);
            }
          });
      } else {
        // roleid==3
        console.log(`roleid等于三`);
        this.$http
          .newGetUserData(
            `pageNum=${this.pageIndex}&pageSize=${this.pageSize}&formId=${this.formId}&userId=${this.userId}
            &parentkeyWords=${this.parentkeyWords}&parentPropertyId=${this.parentPropertyId}
            &sonkeyWords=${this.sonkeyWords}&sonPropertyId=${this.sonPropertyId}`
          )
          .then(res => {
            _this.ifdbclick = true;
            _this.countData = res.num;
            if (res.code == 200) {
              _this.loadData = res.data;
              let start = 0;
              let end = 50;
              let sets = setInterval(function() {
                let xuhao = 0;
                if (end <= _this.loadData.length) {
                  _this.tableData = _this.tableData.concat(
                    _this.loadData.slice(start, end)
                  );
                } else {
                  _this.tableData = _this.tableData.concat(
                    _this.loadData.slice(start)
                  );
                  clearInterval(sets);
                }
                start += 50;
                end += 50;
                for (let key in _this.tableData) {
                  xuhao += 1;
                  let numsg = parseInt(
                    xuhao + parseInt((_this.pageIndex - 1) * _this.pageSize)
                  );
                  _this.tableData[key]["序号"] = numsg;
                }
              }, 10);
            } else {
              _this.loading = true;
              _this.$message(res.data || res.message);
            }
          });
      }
    },

    // 查询数据列表
    queryFormOfficialDatafn(item) {
      this.loading = false;
      var item = item || "";
      let _this = this;
      if (sessionStorage.roleId != 3) {
        this.$http
          .newQueryFormData(
            `pageNum=${this.pageIndex}&pageSize=${this.pageSize}&keyWords=${
              this.search
            }&formId=${this.formId}&unitId=${""}&userIds=${
              this.userId2
            }&userId=${this.userId}&roleId=${this.roleId}&type=${
              this.stateQuery
            }`
          )
          .then(res => {
            // console.log(res)
            this.countData = res.num;
            return res.code == 200
              ? (this.tableData = res.data)
              : this.$message(res.data || res.message);
          });
      } else {
        // roleid!==3
        this.$http
          .newGetUserData(
            `pageNum=${this.pageIndex}&pageSize=${this.pageSize}&keyWords=${
              item.data == undefined ? "" : item.data
            }&formId=${this.formId}&propertyId=${
              item.id == undefined ? "" : item.id
            }&userId=${this.userId}&roleId=${this.roleId}&type=${
              this.stateQuery
            }`
          )
          .then(res => {
            // console.log(res)
            this.countData = res.num;
            return res.code == 200
              ? (this.tableData = res.data)
              : this.$message(res.data || res.message);
          });
      }
    },
    deleteFormUpdate() {
      if (this.unkIdList1.length === 0) {
        return this.$message("请选择需要删除的数据");
      }
      this.$confirm(`确认删除以下${this.unkIdList1.length}条数据`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var deleteUnkIds = [];
          this.unkIdList1.forEach(res => {
            deleteUnkIds.push(res.unkId);
          });
          this.$http
            .deleteFormUpdate({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message);
                this.cleanData1();
                this.load1s();
              } else {
                this.$message(res.message);
              }
            });
        })
        .catch(() => {});
    },
    rejectFormUpdate() {
      if (this.unkIdList1.length === 0) {
        return this.$message("请选择需要驳回的数据");
      }
      this.$confirm(`确认驳回以下${this.unkIdList1.length}条数据`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var deleteUnkIds = [];
          this.unkIdList1.forEach(res => {
            deleteUnkIds.push(res.unkId);
          });
          this.$http
            .rejectFormUpdateData({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message);
                this.cleanData1();
                this.load1s();
              } else {
                this.$message(res.message);
              }
            });
        })
        .catch(() => {});
    },
    reportFormUpdate() {
      if (this.unkIdList1.length === 0) {
        return this.$message("请选择需要上报的数据");
      }
      this.$confirm(`确认上报以下${this.unkIdList1.length}条数据`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var deleteUnkIds = [];
          this.unkIdList1.forEach(res => {
            deleteUnkIds.push(res.unkId);
          });
          this.$http
            .reportFormUpdateData({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message);
                // this.queryFormOfficialDatafn()
                this.cleanData1();
                this.load1s();
              } else {
                this.$message(res.message);
              }
            });
        })
        .catch(() => {});
    },
    examineFormUpdate() {
      if (this.unkIdList1.length === 0) {
        return this.$message("请选择需要审核的数据");
      }
      this.$confirm(`确认审核以下${this.unkIdList1.length}条数据`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.showloading = true;
          var deleteUnkIds = [];
          this.unkIdList1.forEach(res => {
            deleteUnkIds.push(res.unkId);
          });
          this.$http
            .examineFormUpdateData({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message);
                // this.queryFormOfficialDatafn()
                this.showloading = false;
                this.cleanData1();
                this.load1s();
                this.loads();
              } else {
                this.$message(res.message);
              }
            });
        })
        .catch(() => {});
    },
    // 删除数据
    deletData() {
      if (this.unkIdList.length === 0) {
        return this.$message("请选择需要删除的数据");
      }
      // console.log(this.unkIdList)
      this.$confirm(`确认删除数据?共${this.unkIdList.length}条`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var deleteUnkIds = [];
          this.unkIdList.forEach(res => {
            deleteUnkIds.push(res.unkId);
          });
          this.$http
            .newDeleteData({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              if (res.code == 200) {
                this.$message.success("删除成功");
                // this.queryFormOfficialDatafn()
                this.tableData = [];
                this.loads();
              } else {
                this.$message("删除失败");
              }
            });
        })
        .catch(() => {});
    },

    handleRowClick(row, column, event) {
      this.$refs.dragTable.toggleRowSelection(row);
    },

    changeExportType(type) {
      this.exportType = type;
    },

    changeExportFont(font) {
      this.exportFont = font;
    },

    exportDialogBtn() {
      this.exportDialog = false;
      if (this.exportType == 1) {
        this.exportExcelData();
      } else if (this.exportType == 2) {
        this.exportExcelTemplate();
      } else if (this.exportType == 3) {
        this.exportPdf();
      }
    },
    // 导出excel数据
    exportExcelData() {
      window.open(
        `${this.exporyUrl}/dev/formOutput/exportExcel?formName=${this.formName}&ownUnitId=${this.unitId}&formId=${this.formId}&userId=${this.userId}&type=${this.exportFont}`
      );
    },
    // 导出excel模板
    exportExcelTemplate() {
      window.open(
        `${this.exporyUrl}/dev/newForm_/outputExcel?formName=${this.formName}&formId=${this.formId}&userId=${this.userId}&unitId=${this.unitId}&roleId${this.roleId}`
      );
    },
    // 导出pdf
    exportPdf() {
      window.open(
        `${this.exporyUrl}/dev/formOutput/exportPDF?formName=${this.formName}&ownUnitId=${this.unitId}&formId=${this.formId}&userId=${this.userId}&type=${this.exportFont}`
      );
    },
    // 导入
    handleUploadForm(file) {
      let loading = this.openLoading();
      let _this = this;
      _this.isconfirm++;
      if (_this.isconfirm == 2) {
        _this.isconfirm = 0;
        loading.close();
        // console.log(file)
        setTimeout(function() {
          if (file.response.code == 200) {
            _this.$message.success("导入成功");
            _this.loads();
          } else {
            _this.$message(file.response.data || file.response.message);
          }
        }, 0);
      }
    },

    nextView(type) {
      switch (type) {
        case 1:
          if (!this.$refs.child.nextViewVisible) {
            this.$refs.child.nextViewVisible = true;
          }
          break;
        case 2:
          if (!this.$refs.child.pushViewVisible) {
            this.$refs.child.pushViewVisible = true;
          }
      }
    },
    // 选择查看数据类型
    changeDataState(type) {
      this.currentPage = 1;
      // console.log(type)
      this.stateQuery = type;
      this.cleanData();
      this.loads();
    },
    // 数据驳回
    adataRejectfn() {
      if (this.unkIdList.length === 0) {
        return this.$message("请选择要驳回的数据");
      }
      this.unkIdList.forEach(res => {
        this.unkIds.push(res.unkId);
      });
      this.$http
        .newDataReject({
          formId: this.formId,
          userId: this.userId,
          unkIds: this.unkIds.toString()
        })
        .then(res => {
          // console.log(res)
          this.unkIds = [];
          this.loads();
          if (res.code === 200) return this.$message.success("驳回成功");
          return this.$message(res.data || res.message);
        });
    },
    // 数据上报
    addtbydataUpload() {
      // if(this.unkIdList.length===0){
      //   this.$message("请选择需要上报的数据")
      // }
      if (this.unkIdList.length > 0) {
        this.unkIdList.forEach(res => {
          this.unkIds.push(res.unkId);
        });
      } else {
        this.unkIds = [];
      }
      this.$http
        .newDataReport({
          formId: this.formId,
          userId: this.userId,
          unitId: this.unitId,
          unkIds: this.unkIds.toString(),
          roleId: this.roleId
        })
        .then(res => {
          // console.log(res)
          this.unkIds = [];
          // this.queryFormOfficialDatafn()

          if (res.code === 200) {
            this.$message.success("上报成功，待管理员审核");
            this.loads();
          } else {
            this.$message(res.data || res.message);
          }
        });
    },
    // 数据审核
    adataExaminefn() {
      if (this.unkIdList.length > 0) {
        this.unkIdList.forEach(res => {
          this.unkIds.push(res.unkId);
        });
      } else {
        this.unkIds = [];
      }
      this.$http
        .newDataExamine({
          formId: this.formId,
          userId: this.userId,
          unkIds: this.unkIds.toString()
        })
        .then(res => {
          this.unkIds = [];
          // console.log(res)
          // this.queryFormOfficialDatafn()
          if (res.code == 200) {
            this.$message.success("审核成功");
            // this.sortedarrays()
            this.tableData = [];
            this.loads();
          } else {
            this.$message(res.data || res.message);
          }
        });
    },
    handleSizeChange(size) {
      this.pageSize = size;
      this.cleanData();
      this.loads();
    },
    handleCurrentChange(page) {
      this.pageIndex = page;
      this.tableData = [];
      this.loadData = [];
      this.loads();
    },
    // 推送
    distribute() {
      if (this.unkIdList.length === 0) {
        return this.$message("请选择需要推送的数据");
      }
      this.dialogFormVisible4 = true;
      this.getPushUserfn();
    },
    // 获取推送用户/单位
    getPushUserfn() {
      this.$http.getPushUser(`userId=${this.userId}`).then(res => {
        // console.log(res)
        this.pushusers = res.data;
      });
    },
    // 选择的表单
    handleSelectionChange(e) {
      // console.log(e)
      this.unkIdList = e;
    },
    handleSelectionChange1(e) {
      console.log(e);
      this.unkIdList1 = e;
      // console.log(this.unkIdList1)
    },
    // 推送人员选择
    handleCheckedCitiesChange(value) {
      // console.log(value)
      this.checkedCities = value;
    },
    // 确认推送
    confirmthenextissue() {
      if (this.checkedCities.length === 0) {
        return this.$message("请选择推送用户或单位");
      }
      this.dialogFormVisible4 = false;
      this.pushunitIds = [];
      this.unkIdList.forEach(res => {
        this.pushunitIds.push(res.unkId);
      });
      console.log(this.pushunitIds);
      this.$http
        .newPushForm({
          formId: this.formId,
          userId: this.userId,
          userIds: this.checkedCities.toString(),
          unkIds: this.pushunitIds.toString(),
          remark: this.textarea1
        })
        .then(res => {
          // console.log(res)
          this.checkedCities = [];
          return res.code == 200
            ? this.$message.success("推送成功")
            : this.$message(res.data || res.message);
        });
    },
    // 拖到排序
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      this.Sortable.create(el, {
        animation: 150, // 动画参数
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0];
          this.tableData.splice(evt.newIndex, 0, targetRow);
        }
      });
    },
    // 排序后的数组 （msg = 默认值）
    sortedarrays(msg = false) {
      if (this.tableData.length == 0) return;
      this.sortedarraysIndex = (this.pageIndex - 1) * this.pageSize;
      this.tableData.forEach(item => {
        this.sortedarraysIndex++;
        let b = item.unkId + ":" + this.sortedarraysIndex;
        this.sortArr.push(b);
      });
      this.$http
        .newDataSizeNumRestar({
          unkAndNum: this.sortArr.toString(),
          formId: this.formId,
          unitId: this.unitId,
          userId: this.userId,
          roleId: this.roleId
        })
        .then(res => {
          this.sortArr = [];
          // console.log(res)
          // this.queryFormOfficialDatafn()
          // this.cleanData()
          this.loads();
          if (!msg) return;
          return res.code == 200
            ? this.$message.success("排序成功")
            : this.$message(res.data || res.message);
        });
    },
    // 填报按钮
    datatb(i) {
      if (i) this.serial = "";
      this.loadList().forEach(item => {
        item.key = "";
      });
      this.typetitle = "填报";
      this.dialogFormVisible = true;
    },
    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f2f2f2";
      } else {
        return "";
      }
    },
    tabClass() {
      return "background:#f2f2f2;";
    },
    // 编辑按钮
    editBtn(e) {
      // console.log(e)
      this.typetitle = "编辑";
      this.unkId = e.unkId;
      this.dialogFormVisible = true;
      // console.log(this.loadList())
      this.loadList().forEach(item => {
        // console.log(e[item.propertyName])
        item.key = e[item.propertyName];
      });
    },
    // 导出按钮
    exportbtn() {
      this.exportDialog = true;
      this.sortedarrays(false);
    },
    // 批量收藏
    collection(data) {
      if (this.unkIdList.length > 0) {
        this.unkIdList.forEach(res => {
          this.phoneBookList.push({
            unkId: res.unkId,
            objectId: this.formId,
            dataType: 0
          });
        });
        this.batchAddPhoneBookfn();
      } else {
        this.$message("请勾选需要收藏的信息");
      }
    },
    // 收藏常用电话本
    batchAddPhoneBookfn() {
      this.$http
        .batchAddPhoneBook({
          phoneBookList: JSON.stringify(this.phoneBookList),
          userId: parseInt(this.userId)
        })
        .then(res => {
          this.phoneBookList = [];
          // console.log(res)
          if (res.code == 200) {
            // this.queryFormOfficialDatafn()
            // this.cleanData()
            this.loads();
            this.$message.success("收藏成功,请在常用电话本查看");
          } else {
            this.$message(res.message);
          }
        });
    },
    // 查询单位
    sendFormUnitsfn() {
      if (sessionStorage.roleId != 3) {
        this.$http
          .sendFormUnits(`formId=${this.formId}&userId=${this.userId}`)
          .then(res => {
            // console.log(res)
            if (res.code == 200) {
              this.datatree.push(res.data);
            } else {
              // this.$message(res.data || res.message);
            }
          });
      } else {
        // roldid===3
        this.$http
          .getDataUnit(`formId=${this.formId}&userId=${this.userId}`)
          .then(res => {
            // console.log(res)
            if (res.code == 200) {
              this.datatree.push(...res.data);
              this.$nextTick(function() {});
            } else {
              // this.$message(res.data || res.message);
            }
          });
      }
    },
    // 单位查看数据
    handleNodeClick(items) {
      var _this = this;
      // console.log(items);
      if (this.roleId == 3) {
        let selectNode = this.$refs.trees._props.data;
        // console.log(selectNode);
        selectNode.forEach((item, index) => {
          // console.log(item);
          if (item.data == items.data && item.id == items.id && item.unkId == items.unkId) {
            // console.log(item);
            _this.sonkeyWords = "";
            _this.sonPropertyId = "";
            _this.parentPropertyId = item.id;
            _this.parentkeyWords = item.data;
          } else {
            var ds = [];
            ds = item.children;
            // console.log(ds);
            ds.forEach((item1, index1) => {
              if (item1.data == items.data && item1.id == items.id && item.unkId == items.unkId) {
                console.log(item);
                _this.parentPropertyId = item.id;
                _this.parentkeyWords = item.data;
                _this.sonkeyWords = items.data;
                _this.sonPropertyId = items.id;
              } else {
                return false;
              }
            });
          }
        });
        this.currentPage = 1;
        this.queryUnitId = items.unitId;
        this.userId2 = items.userId;
        this.cleanData();
        if (this.ifdbclick == true) {
          setTimeout(() => {
            this.loads(items);
          }, 0);
          this.ifdbclick = false;
        }
      } else {
        this.currentPage = 1;
        this.queryUnitId = items.unitId;
        this.userId2 = items.userId;
        this.cleanData();
        if (this.ifdbclick == true) {
          setTimeout(() => {
            this.loads(items);
          }, 0);
          this.ifdbclick = false;
        }
      }
    },
    //打印填报输入的值
    getvalue(e) {
      console.log(e);
      if (e.indexOf(",") != -1 || e.indexOf(":") != -1) {
        return this.$message("不能输入英文状态下的逗号或者冒号");
        this.ifdisable = true;
      } else {
        this.ifdisable = false;
      }
    },
    // 填报提交
    addFormDatafn() {
      console.log(this.loadList());
      this.loadList().forEach(item => {
        if (item.key.indexOf(",") != -1 || item.key.indexOf(":") != -1) {
          this.ifdisable = true;
        }
      });
      if (this.ifdisable != true) {
        this.loadList().forEach(item => {
          this.form.values.push(`${item.key}`);
        });
        this.form.values.push("");
        this.dialogFormVisible = false;
        this.$http
          .newAddFormData({
            formAtr: this.form.values.toString(),
            formName: this.formName,
            formId: this.formId,
            unitId: this.unitId,
            userId: this.userId,
            roleId: this.roleId,
            numSize: this.serial
          })
          .then(res => {
            // console.log(res)
            this.form.values = [];
            // this.queryFormOfficialDatafn()
            // this.cleanData()
            this.loads();
            return res.code == 200
              ? this.$message.success("填报成功")
              : this.$message(res.data || res.message);
          });
      } else {
        return this.$message("不能输入英文状态下的逗号或者冒号");
      }
    },
    // 编辑提交
    tbyeditFormDatafn() {
      this.loadList().forEach(item => {
        if (item.key.indexOf(",") != -1 || item.key.indexOf(":") != -1) {
          this.ifdisable = true;
        }
      });
      if (this.ifdisable != true) {
        this.loadList().forEach(item => {
          this.form.values.push(item.propertyId + ":" + item.key);
        });
        this.form.values.push("");
        this.dialogFormVisible = false;
        this.$http
          .newUpdateData({
            values: this.form.values.toString(),
            formId: this.formId,
            unkId: this.unkId,
            unitId: this.unitId,
            roleId: this.roleId,
            userId: this.userId
          })
          .then(res => {
            // console.log(res)
            this.tableheader.forEach(e => {
              if (e.key) {
                e.key = "";
              }
            });
            this.form.values = [];
            // this.queryFormOfficialDatafn()
            // this.cleanData()
            this.loads();
            return res.code == 200
              ? this.$message.success("编辑成功")
              : this.$message(res.data || res.message);
          });
      } else {
        return this.$message("不能输入英文状态下的逗号或者冒号");
      }
    },
    // 填报/编辑 提交
    dialogFormVisiblefn() {
      if (this.typetitle == "填报") {
        this.addFormDatafn();
      } else if (this.typetitle == "编辑") {
        this.tbyeditFormDatafn();
      }
    }
  },
  computed: {
    loadList() {
      return () => {
        let newData = [];
        this.tableheader.forEach(item => {
          if (item.propertyType) {
            newData.push(item);
          }
        });
        return newData;
      };
    }
  },
  // created(){
  //   this.getheight()
  // },

  created() {
    setTimeout(() => {
      this.tableheight = window.innerHeight - 300;
    }, 0);
  },
  mounted() {
    (this.userId = sessionStorage.getItem("userID")),
      (this.unitId = sessionStorage.getItem("unitId")),
      (this.roleId = sessionStorage.getItem("roleId")),
      (this.userId2 = this.userId);
    // 数据更新之后的DOM 执行方法
    this.$nextTick(() => {
      this.setSort();
    });
    this.exporyUrl = document.location.origin;
    //   this.exporyUrl = 'http://192.168.1.70:8888';
    this.importurl = this.exporyUrl + "/dev/newForm_/inputExcel";
    // this.queryFormOfficialDatafn() // 查看所有数据
    //   if(this.roleId != 3){
    //       this.queryFormOfficialDatafn(); // 查看所有数据
    //   }else{
    //       this.queryFormOfficialDatafn(this.unitId); // 查看所有数据
    //   }
    this.gettableheaderfn(); // 获取表头
    this.sendFormUnitsfn(); // 查询单位

    if (this.roleId == 1) {
      this.dataState = [
        {
          value: "1",
          label: "所有数据"
        },
        {
          value: "5",
          label: "正式数据"
        },
        {
          value: "7",
          label: "推送数据"
        },
        {
          value: "4",
          label: "待审核数据"
        },
        {
          value: "6",
          label: "驳回数据"
        }
      ];
    } else if (this.roleId == 2) {
      this.dataState = [
        {
          value: "1",
          label: "所有数据"
        },
        {
          value: "3",
          label: "待上报数据"
        },
        {
          value: "4",
          label: "待审核数据"
        },
        {
          value: "5",
          label: "正式数据"
        },
        {
          value: "6",
          label: "驳回数据"
        }
      ];
    }
    this.cleanData();
    this.loads(); //第一次加载数据
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
</style>
<style lang="less" scoped>
.marginR {
  margin-right: 15px !important;
  width: 160px;
}
@media screen and (max-width: 1600px) {
  .btns button {
    margin: 5px 5px;
  }
  .btns {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: auto;
    padding: 15px 0;
  }
}

.btns {
  display: flex;
  flex-wrap: wrap;
}
.el-page-header {
  white-space: nowrap;
}
.textarea_div {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  span {
    width: 45px;
  }
  .el-textarea {
    width: 80%;
  }
}
.upload-demo {
  display: inline-block;
}
.dialog .el-input {
  width: 215px;
}
.sendFormUnitsfn {
  padding-top: 3px;
  display: flex;
  margin-top: 50px;
  position: fixed;
  top: 140px;
  height: calc(100% - 150px);
  right: 0;
  width: calc(100% - 222px);
}
.acccaoz {
  display: flex;
  justify-content: space-between;
}
.top_acc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: calc(~"100% - 242px");
  background: #fff;
  z-index: 99;
  top: 64px;
  padding-right: 100px;
  padding-top: 15px;
}

.right {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}
.lefttren {
  width: 190px;
  position: fixed;
  // height: calc(100% - 300px);
  background: #fff;
  z-index: 9;
  // margin-top: 20px;
  .el-table__header-wrapper {
    position: fixed;
    z-index: 999;
    .test-class .cell {
      height: 40px;
    }
  }
  .el-table__body-wrapper {
    margin-top: 0;
    // overflow-x: hidden !important;
  }
}
.table_content {
  margin-left: 210px;
  width: calc(~"100% - 210px");
  z-index: 2;
  position: relative;
  height: 100%;
}
.table_table {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100000;
}
.treelist {
  line-height: 25px;
  cursor: pointer;
}
.treelist:hover {
  color: #409eff;
}
</style>
<style lang="less" >
.formview {
  .el-upload-list {
    display: none;
  }
  // .el-table__header-wrapper {
  //   position: fixed;
  //   z-index: 999;
  //   .test-class .cell {
  //     height: 40px;
  //   }
  // }
  // .el-table__body-wrapper {
  //   margin-top:50px;
  // }
}
.check1 .el-drawer__header {
  margin-bottom: 0px !important;
  padding: 20px !important;
  background: #333333;
  color: #ffffff;
}
</style>
