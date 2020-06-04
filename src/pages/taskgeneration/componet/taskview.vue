<template>
  <div class="taskview">
    <div class="check1">
      <el-drawer
        direction="rtl"
        :visible.sync="drawer"
        title="修改审核"
        :size="tableherder.length > 8 ? '60%' : '50%'"
      >
        <div class="anniu" style="padding: 10px; text-align: right">
          <el-button size="mini" type="primary" @click="examineTaskUpdate" v-if="roleId == 1">审核</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="reportTaskUpdate"
            v-if="roleId == 1 || roleId == 2"
          >上报</el-button>
          <el-button size="mini" type="primary" @click="rejectTaskUpdate" v-if="roleId == 1">驳回</el-button>
          <el-button size="mini" type="primary" @click="deleteTaskUpdate" v-if="roleId == 1">删除</el-button>
        </div>
        <div style="width:100%;">
          <el-table
            border
            :max-height="tableheight"
            v-loading="showloading"
            v-loadmore="ifloads1=='1'?load1s:''"
            ref="dragTable1"
            :data="tabledata1"
            tooltip-effect="dark"
            row-key="序号"
            style="width: 100% !important;"
            :header-cell-style="getRowClass"
            @selection-change="handleSelectionChange1"
            @row-click="handleRowClick"
            @row-contextmenu="rowContextmenu"
            v-rightMenu="menudata"
          >
            <el-table-column type="selection" width="40" :resizable="false"></el-table-column>

            <el-table-column
              v-for="(item,index) in tableherder"
              :fixed="item.name=='序号'?true:false"
              :key="index"
              :label="item.name"
              :prop="item.name"
              align="center"
              :width="item.width"
              :show-overflow-tooltip="true"
              :render-header="renderHeader1"
            ></el-table-column>

            <el-table-column
              label="操作"
              width="80"
              align="center"
              v-if="roleId == 2 || roleId == 1"
              :resizable="false"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  :disabled="scope.row.pushType == '推送'"
                  type="primary"
                  @click="vieworedit(scope.row, 1)"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-drawer>
    </div>

    <div class="content">
      <div class="header">
        <div>
          <!-- <el-page-header @back="goBack"></el-page-header> -->
          <el-button type="primary" size="medium" @click="goBack" icon="el-icon-arrow-left">返回</el-button>
        </div>
        <div class="top_acc" v-show="roleId != 3">
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
            <el-button @click="drawerShow" size="mini" type="primary" style>修改审核</el-button>
            <el-button size="mini" type="primary" @click="exportbtn">导出</el-button>
            <el-button size="mini" type="primary" @click="importurltbtn">导入</el-button>
            <el-button v-show="roleId == 1" type="primary" size="mini" @click="taskPush">推送</el-button>
            <el-button v-show="roleId == 1" type="primary" size="mini" @click="nextView(1)">已下发</el-button>
            <el-button v-show="roleId == 1" type="primary" size="mini" @click="nextView(2)">已推送</el-button>
            <el-button type="primary" size="mini" @click="addDatabtn(true)">填报</el-button>
            <el-button
              v-if="createUser != userId"
              type="primary"
              size="mini"
              @click="taskDataReportfn"
            >上报</el-button>
            <el-button
              v-if="roleId == 1 && stateQuery == '待审核'"
              type="primary"
              size="mini"
              @click="taskDataRejectfn"
            >驳回</el-button>
            <el-button v-show="roleId == 1" type="primary" size="mini" @click="checkBtn">核对</el-button>
            <el-button type="danger" size="mini" @click="deletData">删除</el-button>
            <el-button
              v-show="roleId == 1"
              type="success"
              size="mini"
              @click="approvalorrejectionofaudit"
            >审核通过</el-button>
            <el-button type="success" size="mini" @click="sortedarrays(true)">保存排序</el-button>
          </div>
        </div>
        <div class="top_acc" v-show="roleId == 3">
          <el-button size="mini" type="primary" @click="exportbtn">导出</el-button>
          <el-button size="mini" type="primary" @click="collection">收藏</el-button>
        </div>
      </div>
      <div class="tableData">
        <div class="lefttren" v-if="roleId!=3">
          <el-table
            border
            :data="datatree"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%;margin-bottom: 20px;"
            row-key="unitId"
            default-expand-all
            @cell-click="handleNodeClick"
            @click.stop
            highlight-current-row
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :max-height="tableheight"
          >
            <el-table-column prop="unitName" label="单位名称"></el-table-column>
          </el-table>
        </div>

        <div class="lefttren" v-if="roleId==3">
          <el-table
            border
            :data="datatree"
            :header-cell-style="{background:'#F5F7FA'}"
            style="width: 100%;margin-bottom: 20px;"
            row-key="keyId"
            default-expand-all
            @cell-click="handleNodeClick1"
            @click.stop
            ref="tree"
            highlight-current-row
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :max-height="tableheight"
          >
            <el-table-column prop="data" label="单位名称"></el-table-column>
          </el-table>
        </div>

        <!-- 数据列表 -->
        <div class="table_content">
          <el-table
            :max-height="tableheight"
            ref="dragTable"
            :data="tabledata"
            tooltip-effect="dark"
            style="width: 100% !important"
            :header-cell-style="getRowClass"
            @selection-change="handleSelectionChange"
            row-key="unkId"
            @row-click="handleRowClick"
            @click.stop
            border
            @row-contextmenu="rowContextmenu"
            v-rightMenu="menudata"
          >
            <el-table-column type="selection" width="40" :resizable="false" fixed></el-table-column>

            <el-table-column
              v-for="(item,index) in tableherder"
              :fixed="item.name=='序号'?true:false"
              :key="index"
              :label="item.name"
              :prop="item.name"
              align="center"
              :width="item.width"
              :render-header="renderHeader"
              min-width="120"
            ></el-table-column>
            <el-table-column
              label="操作"
              width="80"
              align="center"
              v-if="roleId == 2 || roleId == 1"
              :resizable="false"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  :disabled="scope.row.pushType == '推送'"
                  size="mini"
                  @click="vieworedit(scope.row,1)"
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

        <!-- 任务填报 -->
        <div>
          <el-dialog :title="title" :visible.sync="dialogVisible" width="350px">
            <el-form label-width="100px">
              <el-form-item v-for="(item,index) in loadList()" :key="index" :label="item.name">
                <el-input @input="change($event)" v-model="item.key" @change="getvalue($event)"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" size="mini" @click="taskreportingbtn">确 定</el-button>
            </span>
          </el-dialog>
        </div>

        <div class="dialog2">
          <el-dialog title="选择推送用户" :visible.sync="dialogFormVisible4" width="400px">
            <div class="textarea_div">
              <span>备注:</span>
              <el-input type="textarea" autosize placeholder="备注" v-model="textarea1"></el-input>
            </div>
            <div style="margin-bottom:15px">
              <p style="margin-bottom:5px">推送单位：</p>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="(item,index) in pushuserList.manager"
                  :label="item.userId"
                  :key="index"
                >{{item.unitName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div style="margin-bottom:15px">
              <p style="margin-bottom:5px">推送用户：</p>
              <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="(item,index) in pushuserList.user"
                  :label="item.userId"
                  :key="index"
                >{{item.account}}---{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="quexiafa" style="float:right">
              <el-button type="primary" size="mini" @click="confirmthenextissue">确认推送</el-button>
            </div>
          </el-dialog>
        </div>
      </div>

      <!-- 导出时弹框选择 -->
      <div class="exportDialog">
        <el-dialog
          title="导出"
          :visible.sync="exportDialog"
          width="40%"
          :close-on-click-modal="false"
        >
          <div style="margin-bottom:20px;">
            <!-- <span>选择导出类型：</span> -->
            <p style="margin-bottom:10px;">选择导出类型：</p>
            <template>
              <el-radio-group @change="changeExportType" v-model="exportType" size="mini">
                <el-radio border :label="1">导出正式数据</el-radio>
                <el-radio border :label="2">导出模板填报</el-radio>
                <el-radio border :label="4">导出数据修改</el-radio>
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

      <!-- 导入时弹框选择 -->
      <div class="exportDialog2">
        <el-dialog
          title="导入"
          :visible.sync="exportDialog2"
          width="260px"
          :close-on-click-modal="false"
        >
          <div style="margin-bottom:20px;display: flex;">
            <!-- <span>选择导出类型：</span> -->
            <!-- <p style="margin-bottom:10px;">选择导入类型：</p> -->
            <div>
              <el-upload
                class="upload-demo"
                :action="importurl"
                :data="paramsData"
                :on-change="handleUploadForm"
                accept=".xls, .xlsx"
              >
                <el-button size="mini" type="primary" style="margin:0 0 0 10px">导入填报数据</el-button>
              </el-upload>
            </div>
            <div>
              <el-upload
                class="upload-demo"
                :action="importurl2"
                :data="paramsData"
                :on-change="handleUploadForm"
                accept=".xls, .xlsx"
              >
                <el-button size="mini" type="primary" style="margin:0 10px;">导入修改数据</el-button>
              </el-upload>
            </div>
          </div>
          <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="mini" @click="exportDialogBtn">确定导出</el-button>
          </span>-->
        </el-dialog>
      </div>

      <!-- 下发查看 -->
      <div>
        <taskNextView ref="child" :taskName="taskName" :taskId="taskId"></taskNextView>
      </div>
    </div>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import taskNextView from "./taskNextView";
export default {
  components: {
    taskNextView
  },
  data() {
    return {
      sonKeyWords: "",
      sonPropertyId: "",
      parentKeyWords: "",
      parentPropertyId: "",
      ifdisable: false,
      currentPage: 1,
      ifdbclick: true,
      iftrue: true,
      tableheight: 600,
      showloading: false,
      loadData: [],
      loadData1: [],
      loading: false,
      loading1: false,
      immediate1: false,
      drawer: false,
      exportType2: 1,
      exportDialog2: false,
      textarea1: "",
      importurl: "",
      importurl2: "",
      isconfirm: 0,
      paramsData: {
        taskId: this.$route.query.taskId,
        userId: sessionStorage.getItem("userID")
      },
      title: "",
      isbtn: false,
      unkId: "",
      dialogVisible: false,
      addData: [],
      istabledata: false,
      sortArr: [],
      tabledata: [],
      tabledata1: [],
      tableherder: [],
      taskId: parseInt(this.$route.query.taskId),
      taskName: this.$route.query.taskName,
      sendUnitId: this.$route.query.sendUnitId,
      itemscope: this.$route.query.itemscope,
      vivewstr: this.$route.query.vivewstr,
      stateCnName: this.$route.query.stateCnName,
      createUser: this.$route.query.createUser,
      formState: this.$route.query.formState,
      content: "",
      unkIds: [],
      unkIdList1: [],
      accepectUserId: "",
      publishUnitId: "",
      roleId: sessionStorage.getItem("roleId"),
      userId: sessionStorage.getItem("userID"),
      unitId: sessionStorage.getItem("unitId"),
      userIds: sessionStorage.getItem("userID"),
      pageIndex: 1,
      pageIndex1: 1,
      pageSize: 500,
      countData: 0,
      nopushunkId: [], // 选择的代表不推送的
      nodata: [],
      pushuserList: [],
      checkedCities: [],
      dialogFormVisible4: false,
      ispushbtn: false,
      dataState: [],
      dataStateValue: "所有数据",
      stateQuery: "全部",
      phoneBookList: [],
      exporyUrl: "",
      exportDialog: false,
      exportType: 1, //导出类型  1数据 2pdf
      exportFont: 1, //导出字体 1宋体 2防宋 3楷体
      datatree: [],
      defaultProps: {
        children: "children",
        label: "unitName"
      },
      serial: "",
      ifloads: "1",
      ifloads1: "1",
      menudata: {
        // 菜单box的样式  Menu box style
        boxStyle: "width:100px;background:#409EFF;",
        // 菜单选项的样式 Style of menu options
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
      }
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
      // console.log(column)
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
    tabClass() {
      return "background:#f2f2f2;";
    },
    importurltbtn() {
      this.exportDialog2 = true;
    },
    // 表格右键
    rowContextmenu(item) {
      // console.log(item)
      this.serial = item.序号;
    },
    // 表格右键确认事件
    rightClickCallback(item) {
      console.log(item);
      // console.log(this.serial);
      this.addDatabtn(false);
    },

    // 解决动态循环input赋值后无法编辑的问题
    change(e) {
      this.$forceUpdate();
    },

    // 获取表头
    getTaskPropertyfn() {
      this.$http.getTaskProperty(`taskId=${this.taskId}`).then(res => {
        // console.log(res)
        if (res.code == 200 && res.data instanceof Array) {
          res.data.unshift({
            name: "序号",
            width: "80"
          });
          if (this.roleId != 3) {
            res.data.push({
              name: "填报单位"
            });
            res.data.push({
              name: "数据来源"
            });
            res.data.push({
              name: "数据标识"
            });
          }
          this.tableherder = res.data;
          // console.log(this.tableherder, 1111111)
        }
      });
    },
    load1s() {
      let _this = this;
      if (_this.ifloads1 == "0") {
        return;
      }
      _this.$http
        .getTaskUpdateData(
          `pageSize=${this.pageSize}&pageNum=${this.pageIndex1}&userId=${this.userId}&taskId=${this.taskId}`
        )
        .then(res => {
          if (res.code == 200) {
            _this.loadData1 = res.data;
            if (_this.loadData1) {
              if (_this.loadData1.length < 100) {
                _this.ifloads1 = "0";
                _this.loading1 = true;
              } else {
                _this.ifloads1 = "1";
                _this.pageIndex1 += 1;
                _this.loading1 = false;
              }
              _this.tabledata1 = _this.tabledata1.concat(_this.loadData1);

              for (let key in _this.tabledata1) {
                _this.tabledata1[key]["序号"] = parseInt(key) + 1;
              }
              _this.showloading = false;
            } else {
              _this.loading1 = true;
              _this.showloading = false;
            }
          } else {
            _this.ifloads1 = "0";
            _this.loading1 = true;
            _this.showloading = false;
            // _this.$message(res.data || res.message)
          }
          // this.countData = res.data.countData;
          // return res.code == 200 ? this.tabledata = res.data.list : this.$message(res.data || res.message);
        });
    },
    // 获取数据
    loads(item) {
      var item = item || "";
      let _this = this;
      _this.tabledata = [];
      _this.loadData = [];
      console.log(11111);
      if (this.roleId != 3) {
        _this.$http
          .getDataList({
            pageSize: this.pageSize,
            pageNum: this.pageIndex,
            reportUnitId: 0,
            unitId: this.unitId,
            userId: this.userId,
            userIds: this.userIds,
            roleId: this.roleId,
            taskId: this.taskId,
            dataSource: this.stateQuery,
            taskName: this.taskName
          })
          .then(res => {
            _this.ifdbclick = true;
            if (res.code == 200) {
              _this.loadData = res.data.list;
              let start = 0;
              let end = 50;
              let sets = setInterval(function() {
                let xuhao = 0;
                if (end <= _this.loadData.length) {
                  _this.tabledata = _this.tabledata.concat(
                    _this.loadData.slice(start, end)
                  );
                } else {
                  _this.tabledata = _this.tabledata.concat(
                    _this.loadData.slice(start)
                  );
                  clearInterval(sets);
                }
                start += 50;
                end += 50;
                for (let key in _this.tabledata) {
                  xuhao += 1;
                  let numsg = parseInt(
                    xuhao + parseInt((_this.pageIndex - 1) * _this.pageSize)
                  );
                  _this.tabledata[key]["序号"] = numsg;
                }
              }, 10);
            } else {
              _this.loading = true;
              _this.$message(res.data || res.message);
            }
            this.countData = res.data.countData;
          });
      } else if (this.roleId == 3) {
        console.log("11-1-1--1-1-1-----" + sessionStorage.getItem("userID"));
        _this.$http
          .task_getUsersData({
            pageSize: this.pageSize, //
            pageNum: this.pageIndex, //
            userId: sessionStorage.getItem("userID"), //
            taskId: this.taskId, //
            sonPropertyId: this.sonPropertyId,
            sonKeyWords: this.sonKeyWords,
            parentPropertyId: this.parentPropertyId,
            parentKeyWords: this.parentKeyWords
          })
          .then(res => {
            _this.ifdbclick = true;
            if (res.code == 200) {
              _this.loadData = res.data.list;
              let start = 0;
              let end = 50;
              let sets = setInterval(function() {
                let xuhao = 0;
                if (end <= _this.loadData.length) {
                  _this.tabledata = _this.tabledata.concat(
                    _this.loadData.slice(start, end)
                  );
                } else {
                  _this.tabledata = _this.tabledata.concat(
                    _this.loadData.slice(start)
                  );
                  clearInterval(sets);
                }
                start += 50;
                end += 50;
                for (let key in _this.tabledata) {
                  xuhao += 1;
                  let numsg = parseInt(
                    xuhao + parseInt((_this.pageIndex - 1) * _this.pageSize)
                  );
                  _this.tabledata[key]["序号"] = numsg;
                }
              }, 10);
            } else {
              _this.loading = true;
              _this.$message(res.data || res.message);
            }
            this.countData = res.data.countData;
          });
      }
    },
    // 获取数据
    getDataListfn() {
      // `pageSize=${this.pageSize}&pageNum=${this.pageIndex}&reportUnitId=${0}&unitId=${this.unitId}&userId=${this.userId}&roleId=${this.roleId}&taskId=${this.taskId}&taskName=${this.taskName}&dataSource=${this.stateQuery}`
      this.$http
        .getDataList({
          pageSize: this.pageSize,
          pageNum: this.pageIndex,
          reportUnitId: 0,
          unitId: this.unitId,
          userId: this.userId,
          userIds: this.userIds,
          roleId: this.roleId,
          taskId: this.taskId,
          dataSource: this.stateQuery,
          taskName: this.taskName
        })
        .then(res => {
          console.log(res);
          this.countData = res.data.countData;
          return res.code == 200
            ? (this.tabledata = res.data.list)
            : this.$message(res.data || res.message);
        });
    },
    // 核对
    checkBtn() {
      if (this.nopushunkId.length === 0) return this.$message("请选择数据");
      let deletUnkids = [];
      this.nopushunkId.forEach(res => {
        deletUnkids.push(res.unkId);
      });
      this.$http
        .checkData({
          userId: this.userId,
          taskId: this.taskId,
          unks: deletUnkids.toString()
        })
        .then(res => {
          // console.log(res)
          // this.getDataListfn();

          if (res.code == 200) {
            this.$message.success("核对成功");
            this.loadData = [];
            this.tabledata = [];
            this.loads();
          } else {
            this.$message(res.data || res.message);
          }
        });
    },
    rejectTaskUpdate() {
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
            .rejectTaskUpdateData({
              taskId: this.taskId,
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
    cleanData1() {
      this.loadData1 = [];
      this.tabledata1 = [];
      this.pageIndex1 = 1;
      this.ifloads1 = "1";
      // setTimeout(()=>{
      //   this.tableheight = window.innerHeight - 200;
      // },0)
    },
    deleteTaskUpdate() {
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
            .deleteTaskUpdate({
              taskId: this.taskId,
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
    reportTaskUpdate() {
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
            .reportTaskUpdateData({
              taskId: this.taskId,
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
    drawerShow() {
      this.drawer = true;
      this.loadData1 = [];
      this.tabledata1 = [];
      this.pageIndex1 = 1;
      this.showloading = true;
      this.ifloads1 = "1";
      this.cleanData1();

      this.load1s();
    },
    examineTaskUpdate() {
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
            .examineTaskUpdateData({
              taskId: this.taskId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              this.showloading = false;
              // console.log(res)
              if (res.code == 200) {
                this.$message.success(res.message);
                // this.queryFormOfficialDatafn(
                this.loadData1 = [];
                this.tabledata1 = [];
                this.pageIndex1 = 1;
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
    handleSelectionChange1(e) {
      this.unkIdList1 = e;
      // console.log(this.unkIdList1)
    },
    // 删除
    deletData() {
      if (this.nopushunkId.length === 0)
        return this.$message("请选择要删除的数据");
      this.$confirm(`确认删除数据?共${this.nopushunkId.length}条`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let deletUnkids = [];
          this.nopushunkId.forEach(res => {
            deletUnkids.push(res.unkId);
          });
          this.$http
            .deleteTaskData({
              unitId: this.unitId,
              taskId: this.taskId,
              unkIds: deletUnkids.toString(),
              userId: this.userId
            })
            .then(res => {
              // console.log(res)
              // this.getDataListfn();
              this.tabledata = [];
              this.loads();
              res.code == 200
                ? this.$message.success(res.message)
                : this.$message(res.data || res.message);
            });
        })
        .catch(() => {});
    },
    //点击行触发，选中或不选中复选框
    handleRowClick(row, column, event) {
      this.$refs.dragTable.toggleRowSelection(row);
    },
    // 导出按钮
    exportbtn() {
      this.exportDialog = true;
      // this.sortedarrays(false);
    },
    // 选择导出类型
    changeExportType(type) {
      // console.log(type)
      this.exportType = type;
    },
    // 选择导出字体
    changeExportFont(font) {
      // console.log(font)
      this.exportFont = font;
    },
    // 确定导出
    exportDialogBtn() {
      this.exportDialog = false;
      if (this.exportType == 1) {
        this.exportExcelData(); //导出excel数据
      } else if (this.exportType == 3) {
        this.exportPdf(); //导出pdf
      } else if (this.exportType == 2) {
        this.exportExcelTemplate(); //导出模板
      } else if (this.exportType == 4) {
        this.exportEditData();
      }
    },
    //导出excel数据
    exportExcelData() {
      window.open(
        `${this.exporyUrl}/dev/taskOutput/exportExcel?ownUnitId=${this.unitId}&taskName=${this.taskName}&taskId=${this.taskId}&userId=${this.userId}&type=${this.exportFont}`
      );
    },
    //导出excel模板
    exportExcelTemplate() {
      window.open(
        `${this.exporyUrl}/dev/task/outputExcel?taskId=${this.taskId}&userId=${this.userId}`
      );
    },
    //导出pdf
    exportPdf() {
      window.open(
        `${this.exporyUrl}/dev/taskOutput/exportPDF?ownUnitId=${this.unitId}&taskName=${this.taskName}&taskId=${this.taskId}&userId=${this.userId}&type=${this.exportFont}`
      );
    },
    // 导出修改数据
    exportEditData() {
      window.open(
        `${this.exporyUrl}/dev/taskOutput/needModificationDatas?taskId=${this.taskId}&userId=${this.userId}`
      );
    },

    // 导入
    handleUploadForm(file) {
      // console.log(file)
      this.exportDialog2 = false;
      let loading = this.openLoading();
      let _this = this;
      _this.isconfirm++;
      if (_this.isconfirm == 2) {
        _this.isconfirm = 0;
        loading.close();
        // console.log(file)
        setTimeout(function() {
          if (file.response.code == 200) {
            // _this.getDataListfn();
            _this.tabledata = [];
            _this.loads();
            _this.$message.success("导入成功");
          } else {
            _this.$message(file.response.data);
          }
        }, 0);
      }
    },

    // 收藏
    collection(data) {
      if (this.nopushunkId.length > 0) {
        this.nopushunkId.forEach(res => {
          this.phoneBookList.push({
            unkId: res.unkId,
            objectId: this.taskId,
            dataType: 1
          });
        });
        this.batchAddPhoneBookfn();
      } else {
        this.$message("请勾选需要收藏的信息");
      }
    },
    // 收藏常用电话本
    batchAddPhoneBookfn() {
      let _this = this;
      this.$http
        .batchAddPhoneBook({
          phoneBookList: JSON.stringify(this.phoneBookList),
          userId: parseInt(this.userId)
        })
        .then(res => {
          this.phoneBookList = [];
          // console.log(res)
          if (res.code == 200) {
            // this.getDataListfn();
            _this.tabledata = [];
            _this.loads();
            _this.$message.success("收藏成功,请在常用电话本查看");
          } else {
            _this.$message(res.message);
          }
        });
    },
    //下发查看
    nextView(type) {
      if (type == 1) {
        if (!this.$refs.child.nextViewVisible) {
          this.$refs.child.nextViewVisible = true;
        }
      } else if (type == 2) {
        if (!this.$refs.child.pushViewVisible) {
          this.$refs.child.pushViewVisible = true;
        }
      }
    },
    // 选择查看数据类型
    changeDataState(val) {
      this.currentPage = 1;
      // console.log(val);
      this.stateQuery = val;
      // this.getDataListfn();
      this.cleanData();
      this.loads();
    },
    // 填报按钮
    addDatabtn(i) {
      if (i) this.serial = "";
      this.unkId = "";
      this.title = "填报";
      this.dialogVisible = true;
      this.loadList().forEach(item => {
        item.key = "";
      });
    },
    // 编辑按钮
    vieworedit(data) {
      // console.log(data)
      this.title = "编辑";
      this.dialogVisible = true;
      this.unkId = data.unkId;
      this.loadList().forEach(item => {
        // console.log(data[item.name])
        if (data[item.name]) {
          item.key = data[item.name];
        } else {
          item.key = "";
        }
      });
    },
    // 选择的数据
    handleSelectionChange(data) {
      // console.log(data)
      this.nopushunkId = data;
    },
    // 推送人员选择
    handleCheckedCitiesChange(value) {
      // console.log(value)
      this.checkedCities = value;
    },
    // 按钮推送 查询用户
    taskPush() {
      if (this.nopushunkId.length > 0) {
        this.dialogFormVisible4 = true;
        this.getPushUserfn();
      } else {
        this.$message("请勾选需要推送的数据");
      }
    },
    // 获取推送用户/单位
    getPushUserfn() {
      this.$http.getPushUser(`userId=${this.userId}`).then(res => {
        this.pushuserList = res.data;
      });
    },
    // 推送提交
    confirmthenextissue() {
      let _this = this;
      if (this.nopushunkId.length > 0) {
        this.nopushunkId.forEach(res => {
          this.nodata.push(res.unkId);
        });
        if (this.checkedCities.length > 0) {
          this.dialogFormVisible4 = false;
          this.$http
            .taskpushTask({
              unitId: this.unitId,
              taskId: this.taskId,
              taskName: this.taskName,
              acceptUserIds: this.checkedCities.toString(),
              unkIds: this.nodata.toString(),
              remark: this.textarea1,
              userId: this.userId
            })
            .then(res => {
              this.checkedCities = [];
              this.nodata = [];
              // console.log(res)
              if (res.code == 200) {
                // this.getDataListfn();
                _this.tabledata = [];
                _this.loads();
                this.$message.success("推送成功");
              } else {
                this.$message(res.data || res.message);
              }
            });
        } else {
          this.$message("请选择推送单位或者人员");
        }
      }
    },
    handleSizeChange(size) {
      // console.log(size)
      this.pageSize = size;
      // this.getDataListfn();
      this.cleanData();
      this.loads();
    },
    handleCurrentChange(page) {
      console.log(page);
      this.pageIndex = page;
      this.loadData = [];
      this.tabledata = [];
      this.loads();
    },
    // 排序
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        ".el-table__body-wrapper > table > tbody"
      )[0];
      // console.log(el);
      Sortable.create(el, {
        animation: 150, //动画参数
        setData: function(dataTransfer) {
          dataTransfer.setData("Text", "");
        },
        onEnd: evt => {
          const targetRow = this.tabledata.splice(evt.oldIndex, 1)[0];
          this.tabledata.splice(evt.newIndex, 0, targetRow);
        }
      });
    },
    // 排序后的数组
    sortedarrays(msg) {
      let index = 0;
      let _this = this;
      this.tabledata.forEach(item => {
        index++;
        let a = item.unkId + ":" + index;
        this.sortArr.push(a);
      });
      // console.log(this.sortArr)
      this.$http
        .updateTaskDataSerialNumber({
          unkIds: this.sortArr.toString(),
          taskId: this.taskId
        })
        .then(res => {
          // console.log(res)
          this.sortArr = [];
          if (res.code == 200) {
            // this.getDataListfn();
            this.tabledata = [];
            _this.loads();
            if (msg) {
              this.$message.success("排序成功");
            }
          } else {
            if (msg) {
              this.$message(res.data || res.message);
            }
          }
        });
    },

    // 数据上报
    taskDataReportfn() {
      this.$http
        .taskDataReport({
          unitId: this.unitId,
          taskId: this.taskId,
          taskName: this.taskName,
          reportUnitId: this.sendUnitId,
          userId: this.userId,
          roleId: this.roleId
        })
        .then(res => {
          // console.log(res)
          // this.getDataListfn();
          this.tabledata = [];
          this.loads();
          return res.code == 200
            ? this.$message.success("上报成功")
            : this.$message(res.data || res.message);
        });
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
    // 填报/编辑提交
    taskreportingbtn() {
      console.log(this.loadList());
      this.loadList().forEach(item => {
        if (item.key.indexOf(",") != -1 || item.key.indexOf(":") != -1) {
          this.ifdisable = true;
        }
      });
      if (this.ifdisable != true) {
        console.log(this.loadList());
        this.loadList().forEach(item => {
          this.addData.push(item.name + ":" + item.key);
        });
        this.addData.push("");
        this.dialogVisible = false;
        this.$http
          .updateTaskData({
            unitId: this.unitId,
            unkId: this.unkId,
            taskId: this.taskId,
            userId: this.userId,
            roleId: this.roleId,
            values: this.addData.toString(),
            dataSerialNumber: this.serial
          })
          .then(res => {
            this.addData = [];
            // console.log(res)
            // this.getDataListfn();
            let msg = "";
            this.unkId ? (msg = "修改成功") : (msg = "填报成功");
            if (res.code == 200) {
              this.$message.success(msg);
              if (this.drawer) {
                this.loadData1 = [];
                this.tabledata1 = [];
                this.pageIndex1 = 1;
                this.cleanData1();
                this.load1s();
              } else {
                this.loadData = [];
                this.tabledata = [];
                this.loads();
              }
            } else {
              this.$message(res.data || res.message);
            }
          });
      } else {
        return this.$message("不能输入英文状态下的逗号或者冒号");
      }
    },

    // 数据驳回
    taskDataRejectfn() {
      if (this.nopushunkId.length > 0) {
        this.nopushunkId.forEach(res => {
          this.unkIds.push(res.unkId);
        });
      }
      this.$http
        .taskDataReject({
          unitId: this.unitId,
          taskId: this.taskId,
          taskName: this.taskName,
          unkIds: this.unkIds.toString(),
          userId: this.userId
        })
        .then(res => {
          this.unkIds = [];
          // console.log(res)
          // this.getDataListfn();
          this.tabledata = [];
          this.loads();
          res.code == 200
            ? this.$message.success("驳回成功")
            : this.$message(res.data || res.message);
        });
    },

    // 数据审核
    approvalorrejectionofaudit() {
      // if(this.vivewstr == '下发'){
      //   this.orderBy = 1;
      //   this.accepectUserId = 0;
      //   this.publishUnitId = this.sendUnitId;
      // }else if(this.vivewstr == '分发'){
      //   this.orderBy = 2;
      //   this.publishUnitId = 0;
      //   this.accepectUserId = this.userId2;
      // }
      // if(this.unkIds.length===0){
      //   this.$message("请选择待审核数据")
      // }
      this.$http
        .taskDataExamine({
          userId: this.userId,
          unitId: this.unitId,
          taskId: this.taskId,
          taskName: this.taskName,
          orderBy: this.orderBy,
          unkIds: this.unkIds.toString(),
          accepectUserId: this.accepectUserId,
          publishUnitId: this.publishUnitId
        })
        .then(res => {
          // console.log(res)
          // this.getDataListfn();
          this.unkIds = [];
          if (res.code == 200) {
            this.$message.success("审核通过成功");
            this.tabledata = [];
            this.loads();
          } else {
            this.$message(res.data || res.message);
          }
        });
    },
    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f2f2f2";
      } else {
        return "";
      }
    },

    // 查询单位
    getsendTaskUnits() {
      console.log(`获取roleid${sessionStorage.roleId}`);
      if (sessionStorage.roleId != 3) {
        this.$http
          .sendTaskUnits(`taskId=${this.taskId}&userId=${this.userId}`)
          .then(res => {
            // console.log(res)
            if (res.code == 200) {
              this.datatree.push(res.data);
            }
          });
      } else if (sessionStorage.roleId == 3) {
        console.log(`roleId=3d 的时候`);
        this.$http
          .task_getDataUnit(`taskId=${this.taskId}&userId=${this.userId}`)
          .then(res => {
            if (res.code == 200) {
              this.datatree.push(...res.data);
              // this.$nextTick(function() {});
              console.log(this.datatree[0]);
            }
          });
      }
    },
    cleanData() {
      this.pageIndex = 1;
      this.loadData = [];
      this.tabledata = [];
      this.ifloads = "1";
    },
    // roleId==3的时候，根据单位查看
    handleNodeClick1(row, column, cell, event) {
      var _this = this;
      // console.log(cell);
      let selectNode = this.$refs.tree._props.data;
      selectNode.forEach((item, index) => {
        console.log(item);
        if (item.data == row.data && item.id == row.id && item.unkId == row.unkId) {
          _this.parentPropertyId = item.id;
          _this.parentKeyWords = item.data;
          _this.sonKeyWords = "";
          _this.sonPropertyId = "";
        } else {
          var ds = [];
          ds = item.children;
          // console.log(ds);
          ds.forEach((item1, index1) => {
            if (item1.data == row.data && item1.id == row.id && item.unkId == row.unkId) {
              _this.parentPropertyId = item.id;
              _this.parentKeyWords = item.data;
              _this.sonKeyWords = row.data;
              _this.sonPropertyId = row.id;
            }
          });
        }
      });
      // console.log(selectNode);
      this.currentPage = 1;
      this.unitId = row.unitId;
      this.userId = row.userId;
      this.cleanData();
      if (this.ifdbclick == true) {
        setTimeout(() => {
          this.loads();
          this.ifloads = "1";
        }, 0);
        this.ifdbclick = false;
        console.log(this.ifdbclick);
      }
    },

    // 根据单位查看数据
    handleNodeClick(row, column, cell, event) {
      console.log("点击单位" + row.unitId);
      this.currentPage = 1;
      // console.log(this.ifloads)
      this.unitId = row.unitId;
      this.userId = row.userId;
      this.cleanData();
      if (this.ifdbclick == true) {
        setTimeout(() => {
          this.loads();
          this.ifloads = "1";
        }, 0);
        this.ifdbclick = false;
        console.log(this.ifdbclick);
      }
    }
  },
  beforeDestory() {},
  created() {},
  destroyed() {},
  mounted() {
    setTimeout(() => {
      this.tableheight = window.innerHeight - 300;
    }, 0);
    // this.exporyUrl = 'http://192.168.1.6:8888';
    // this.exporyUrl = 'http://sjzh2016.ticp.io:8888/'
    this.exporyUrl = document.location.origin;
    this.importurl = this.exporyUrl + "/dev/task/inputExcel";
    this.importurl2 = this.exporyUrl + "/dev/task/batchUpdateTaskData";
    if (this.roleId == 1) {
      this.getsendTaskUnits();
      this.dataState = [
        {
          value: "全部",
          label: "所有数据"
        },
        {
          value: "正式",
          label: "正式数据"
        },
        {
          value: "推送",
          label: "推送数据"
        },
        {
          value: "待审核",
          label: "待审核数据"
        },
        {
          value: "驳回",
          label: "驳回数据"
        },
        {
          value: "待核对",
          label: "待核对数据"
        }
      ];
    } else if (this.roleId == 2) {
      this.dataState = [
        {
          value: "全部",
          label: "所有数据"
        },
        {
          value: "正式",
          label: "正式数据"
        },
        {
          value: "待审核",
          label: "待审核数据"
        },
        {
          value: "驳回",
          label: "驳回数据"
        },
        {
          value: "待上报",
          label: "待上报数据"
        }
      ];
    } else if (this.roleId == 3) {
      this.getsendTaskUnits();
    }
    if (this.stateCnName == "数据采集完成") {
      this.ispushbtn = false;
    } else {
      this.ispushbtn = true;
    }
    this.setSort();
    this.getTaskPropertyfn();
    this.loads();
    // this.getDataListfn();
  },
  computed: {
    loadList() {
      return () => {
        let newData = [];
        this.tableherder.forEach(item => {
          if (item.id) {
            newData.push(item);
          }
        });
        return newData;
      };
    }
  }
};
</script>
<style >
</style>
<style lang="less" scoped>
.marginR {
  margin-right: 15px !important;
}
@media screen and (max-width: 900px) {
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
// .el-table{
//     font-size:14px!important;//设置固定的字体大小
//   }
// .el-table th.gutter{
//   display: table-cell!important;
// }
.table_content {
  margin-left: 210px;
  width: calc(100% - 210px);
  z-index: 10;
  position: absolute;
  right: 0;
  height: calc(100% - 100);
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
.tableData {
  display: flex;
  margin-top: 50px;
  position: absolute;
  top: 55px;
  height: calc(100% - 150px);
  right: 0;
  width: calc(100% - 20px);
  overflow: hidden;
  .el-table {
    z-index: 9 !important;
  }
  .lefttren {
    width: 190px;
    position: fixed;
    z-index: 9;
    // height: calc(100% - 300px);
    background: #fff;
    // margin-top: 20px;
    .left_p {
      font-size: 14px;
      margin-bottom: 15px;
    }
    .el-table__body-wrapper {
      // overflow-x:hidden !important;
    }
  }
}
.el-page-header {
  white-space: nowrap;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: calc(~"100% - 254px");
  background: #fff;
  z-index: 1;
  height: 90px;
  top: 64px;
  flex-wrap: nowrap;
}
.returnbutton {
  font-size: 12px;
  display: inline-block;
  align-items: center;
  cursor: pointer;
}
.top_acc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // margin-bottom: 15px;
  height: auto;
}
input::placeholder {
  color: #333;
}
</style>
<style lang="less">
.fenye {
}
.taskview {
  .el-table__header-wrapper {
    // position: fixed;
    z-index: 999;
  }
  .el-table__body-wrapper {
    // margin-top: 36px;
  }
}

.check1 .el-drawer__header {
  margin-bottom: 0px !important;
  padding: 20px !important;
  background: #333333;
  color: #ffffff;
}
.check1 .el-table th.is-hidden > * {
  visibility: visible;
}
</style>
