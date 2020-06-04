<template>
  <div class="formview">
    <div class="top_acc">
      <div style="margin-bottom: 15px;">
        <el-page-header @back="goBack"></el-page-header>
      </div>
      <div class="right" v-if="roleId != 3">
        <el-input
          type="text"
          clearable
          v-model="search"
          @clear="clearquy"
          style="width:200px;margin-right:15px;"
          placeholder="关键字查询"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchQuery"></el-button>
        </el-input>
        <div style="margin-right:15px;">
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
        <div>
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

    <div class="table sendFormUnitsfn">
      <div class="lefttren">
        <!-- <p style="font-size:14px;margin-bottom:15px;">根据单位查看</p> -->
        <!-- <el-tree :data="datatree" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree> -->
        <el-table
                    :data="datatree"
                    style="width: 100%;margin-bottom: 20px;"
                    row-key="id"
                    default-expand-all
                    @row-click="handleNodeClick"
                    highlight-current-row
                    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">

                    <el-table-column
                    prop="data"
                    label="单位名称"
                   >
                    </el-table-column>
        </el-table>

      </div>
      <div class="table_content">
        <el-table
          border
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
          <el-table-column type="selection" width="40"></el-table-column>

<!-- -------- -->
          <el-table-column
            v-for="(item,index) in tableheader"
            :key="index"
            :label="item.propertyName"
            align="center"
            :prop="item.propertyName"
            data-id="序号"
            :width="item.width"
          ></el-table-column>
          


          <el-table-column v-if="roleId != 3" label="操作" width="80" align="center">
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
        <div class="block">
          <el-pagination
            :page-size="pageSize"
            :page-sizes="[500, 1000, 1500, 2000,3000,5000,10000]"
            layout="total, sizes, prev, pager, next"
            :total="countData"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>

    <!-- <div class="table sendFormUnitsfn" v-if="roleId != 1">
            <div style="width:100%">
                <el-table
                    border
                    ref="dragTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    row-key="序号"
                    style="width: 100%;"
                    :header-cell-style="getRowClass"
                    @selection-change="handleSelectionChange"
                    @row-click="handleRowClick"
                >
                 <el-table-column
                    type="selection"
                    width="40"
                    >
                </el-table-column>
                <el-table-column v-for="(item,index) in tableheader" :key='index'
                    :label="item.propertyName"
                    align="center"
                    :prop='item.propertyName'
                    data-id="序号"
                    :width="item.width"
                    :show-overflow-tooltip="true"
                ></el-table-column>
                 <el-table-column
                    v-if="roleId == 2"
                    label="操作"
                    width="80"
                    align="center"
                    >
                        <template slot-scope="scope">
                            <el-button size="mini" type="primary" @click="editBtn(scope.row)">编辑</el-button>
                        </template>
                </el-table-column>
                 </el-table>
            </div>
    </div>-->

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
              <el-input @input="change($event)" v-if="item.propertyType == 1" v-model="item.key"></el-input>
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
import nextView from './component/nextView'
export default {
  name: 'formview',
  components: {
    nextView
  },
  data () {
    return {
      datatree1: [
        {
          children: [],
          data: '123',
          id: 2,
          spread: true
        }
      ],
      roleId: '',
      userId: '',
      unitId: '',
      unkId: '',
      userId2: '',
      dialogFormVisible: false,
      formLabelWidth: '100px',
      edittableData: [],
      sortArr: [],
      importurl: '',
      paramsData: {
        formName: this.$route.query.formName,
        formId: this.$route.query.formId,
        userId: sessionStorage.getItem('userID'),
        unitId: sessionStorage.getItem('unitId'),
        roleId: sessionStorage.getItem('roleId')
      },
      isconfirm: 0,
      datatree: [],
      defaultProps: {
        children: 'children',
        label: 'unitName'
      },
      editdata: [],
      typeface2: 1,
      formName: this.$route.query.formName,
      tableheader: [],
      tableData: [],
      type2: this.$route.query.type2,
      stateCnName: this.$route.query.stateCnName,
      formId: parseInt(this.$route.query.formId),
      createUserId: this.$route.query.createUserId,
      formState: this.$route.query.state,
      typetitle: '',
      form: {
        values: []
      },
      dialogFormVisible4: false,
      pushunitIds: [],
      pushusers: [],
      checkedCities: [],
      pageSize: 500,
      pageIndex: 1,
      countData: 0,
      unkIdList: [], // 选择的数据
      sortedarraysIndex: 0,
      dataState: [],
      dataStateValue: '所有数据',
      stateQuery: '1',
      exporyUrl: '',
      exportDialog: false, // 导出框
      exportType: 1, // 导出类型  1数据 2模板 3pdf
      exportFont: 1, // 导出字体 1宋体 2防宋 3楷体
      unkIds: [], // 数据驳回
      phoneBookList: [],
      search: '',
      textarea1: '',
      queryUnitId: '',
      menudata: {
        //  Menu box style
        boxStyle: 'width:100px;background:#409EFF;',
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
            callback: 'rightClickCallback'
          }
        ]
      },
      serial: ''
    }
  },
  methods: {
    // 表格右键
    rowContextmenu (item) {
      console.log(item)
      this.serial = item.序号
    },
    // 表格右键确认事件
    rightClickCallback (item) {
      console.log(this.serial)
      this.datatb(false) // 调用填报按钮事件
      this.sortedarrays() // 排序后的数据
    },

    clearquy () {
      this.queryFormOfficialDatafn()
    },

    searchQuery () {
      this.queryFormOfficialDatafn()
    },

    change (e) {
      this.$forceUpdate()
    },
    // 获取表头
    gettableheaderfn () {
      this.$http.gettableheader(`formId=${this.formId}`).then(res => {
        console.log(res)
        if (res.code == 200) {
          res.data.unshift({
            propertyName: '序号',
            width: '60'
          })
          res.data.push({
            propertyName: '填报单位'
          })
          res.data.push({
            propertyName: '数据标识',
            width: '140'
          })

          this.tableheader = res.data
          // console.log(this.tableheader)
        }
      })
    },
    // 查询数据列表
    queryFormOfficialDatafn (item) {
      var item = item || ''
      let _this = this
      this.$http
        .newGetUserData(
          `pageNum=${this.pageIndex}&pageSize=${this.pageSize}&keyWords=${
            item.data == undefined ? '' : item.data
          }&formId=${this.formId}&propertyId=${item.id == undefined ? '' : item.id}&userId=${
            this.userId
          }&roleId=${this.roleId}&type=${this.stateQuery}`
        )
        .then(res => {
          console.log(res)
          this.countData = res.num
          return res.code == 200
            ? (this.tableData = res.data)
            : this.$message(res.data || res.message)
        })
    },
    // 删除数据
    deletData () {
      if (this.unkIdList.length === 0) { return this.$message('请选择需要删除的数据') }
      console.log(this.unkIdList)
      this.$confirm(`确认删除数据?共${this.unkIdList.length}条`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          var deleteUnkIds = []
          this.unkIdList.forEach(res => {
            deleteUnkIds.push(res.unkId)
          })
          this.$http
            .newDeleteData({
              formId: this.formId,
              unkIds: deleteUnkIds.toString(),
              userId: this.userId
            })
            .then(res => {
              console.log(res)
              if (res.code == 200) {
                this.$message.success('删除成功')
                this.queryFormOfficialDatafn()
              } else {
                this.$message('删除失败')
              }
            })
        })
        .catch(() => {})
    },

    handleRowClick (row, column, event) {
      this.$refs.dragTable.toggleRowSelection(row)
    },

    changeExportType (type) {
      this.exportType = type
    },

    changeExportFont (font) {
      this.exportFont = font
    },

    exportDialogBtn () {
      this.exportDialog = false
      if (this.exportType == 1) {
        this.exportExcelData()
      } else if (this.exportType == 2) {
        this.exportExcelTemplate()
      } else if (this.exportType == 3) {
        this.exportPdf()
      }
    },
    // 导出excel数据
    exportExcelData () {
      window.open(
        `${this.exporyUrl}/dev/formOutput/exportExcel?formName=${this.formName}&ownUnitId=${this.unitId}&formId=${this.formId}&userId=${this.userId}&type=${this.exportFont}`
      )
    },
    // 导出excel模板
    exportExcelTemplate () {
      window.open(
        `${this.exporyUrl}/dev/newForm_/outputExcel?formName=${this.formName}&formId=${this.formId}&userId=${this.userId}&unitId=${this.unitId}&roleId${this.roleId}`
      )
    },
    // 导出pdf
    exportPdf () {
      window.open(
        `${this.exporyUrl}/dev/formOutput/exportPDF?formName=${this.formName}&ownUnitId=${this.unitId}&formId=${this.formId}&userId=${this.userId}&type=${this.exportFont}`
      )
    },
    // 导入
    handleUploadForm (file) {
      let loading = this.openLoading()
      let _this = this
      _this.isconfirm++
      if (_this.isconfirm == 2) {
        _this.isconfirm = 0
        loading.close()
        console.log(file)
        setTimeout(function () {
          if (file.response.code == 200) {
            _this.queryFormOfficialDatafn()
            _this.$message.success('导入成功')
          } else {
            _this.$message(file.response.data || file.response.message)
          }
        }, 0)
      }
    },

    nextView (type) {
      switch (type) {
        case 1:
          if (!this.$refs.child.nextViewVisible) {
            this.$refs.child.nextViewVisible = true
          }
          break
        case 2:
          if (!this.$refs.child.pushViewVisible) {
            this.$refs.child.pushViewVisible = true
          }
      }
    },
    // 选择查看数据类型
    changeDataState (type) {
      console.log(type)
      this.stateQuery = type
      this.queryFormOfficialDatafn()
    },
    // 数据驳回
    adataRejectfn () {
      if (this.unkIdList.length === 0) { return this.$message('请选择要驳回的数据') }
      this.unkIdList.forEach(res => {
        this.unkIds.push(res.unkId)
      })
      this.$http
        .newDataReject({
          formId: this.formId,
          userId: this.userId,
          unkIds: this.unkIds.toString()
        })
        .then(res => {
          console.log(res)
          this.unkIds = []
          this.queryFormOfficialDatafn()
          if (res.code === 200) return this.$message.success('驳回成功')
          return this.$message(res.data || res.message)
        })
    },
    // 数据上报
    addtbydataUpload () {
      if (this.unkIdList.length > 0) {
        this.unkIdList.forEach(res => {
          this.unkIds.push(res.unkId)
        })
      } else {
        this.unkIds = []
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
          console.log(res)
          this.unkIds = []
          this.queryFormOfficialDatafn()
          if (res.code === 200) { return this.$message.success('上报成功，待管理员审核') }
          return this.$message(res.data || res.message)
        })
    },
    // 数据审核
    adataExaminefn () {
      if (this.unkIds.length == 0) this.unkIds = ''
      this.$http
        .newDataExamine({
          formId: this.formId,
          userId: this.userId,
          unkIds: this.unkIds
        })
        .then(res => {
          console.log(res)
          this.queryFormOfficialDatafn()
          return res.code == 200
            ? this.$message.success('审核成功')
            : this.$message(res.data || res.message)
        })
    },
    handleSizeChange (size) {
      console.log(size)
      this.pageSize = size
      this.queryFormOfficialDatafn()
    },
    handleCurrentChange (page) {
      console.log(page)
      this.pageIndex = page
      this.queryFormOfficialDatafn()
    },
    // 推送
    distribute () {
      if (this.unkIdList.length === 0) { return this.$message('请选择需要推送的数据') }
      this.dialogFormVisible4 = true
      this.getPushUserfn()
    },
    // 获取推送用户/单位
    getPushUserfn () {
      this.$http.getPushUser(`userId=${this.userId}`).then(res => {
        console.log(res)
        this.pushusers = res.data
      })
    },
    // 选择的表单
    handleSelectionChange (e) {
      console.log(e)
      this.unkIdList = e
    },
    // 推送人员选择
    handleCheckedCitiesChange (value) {
      console.log(value)
      this.checkedCities = value
    },
    // 确认推送
    confirmthenextissue () {
      if (this.checkedCities.length === 0) { return this.$message('请选择推送用户或单位') }
      this.dialogFormVisible4 = false
      this.pushunitIds = []
      this.unkIdList.forEach(res => {
        this.pushunitIds.push(res.unkId)
      })
      this.$http
        .newPushForm({
          formId: this.formId,
          userId: this.userId,
          userIds: this.checkedCities.toString(),
          unkIds: this.pushunitIds.toString(),
          remark: this.textarea1
        })
        .then(res => {
          console.log(res)
          this.checkedCities = []
          return res.code == 200
            ? this.$message.success('推送成功')
            : this.$message(res.data || res.message)
        })
    },
    // 拖到排序
    setSort () {
      const el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.Sortable.create(el, {
        animation: 150, // 动画参数
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.tableData.splice(evt.oldIndex, 1)[0]
          this.tableData.splice(evt.newIndex, 0, targetRow)
        }
      })
    },
    // 排序后的数组 （msg = 默认值）
    sortedarrays (msg = false) {
      if (this.tableData.length == 0) return
      this.sortedarraysIndex = (this.pageIndex - 1) * this.pageSize
      this.tableData.forEach(item => {
        this.sortedarraysIndex++
        let b = item.unkId + ':' + this.sortedarraysIndex
        this.sortArr.push(b)
      })
      this.$http
        .newDataSizeNumRestar({
          unkAndNum: this.sortArr.toString(),
          formId: this.formId,
          unitId: this.unitId,
          userId: this.userId,
          roleId: this.roleId
        })
        .then(res => {
          this.sortArr = []
          console.log(res)
          this.queryFormOfficialDatafn()
          if (!msg) return
          return res.code == 200
            ? this.$message.success('排序成功')
            : this.$message(res.data || res.message)
        })
    },
    // 填报按钮
    datatb (i) {
      if (i) this.serial = ''
      this.loadList().forEach(item => {
        item.key = ''
      })
      this.typetitle = '填报'
      this.dialogFormVisible = true
    },
    // 改变表头颜色
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return 'background:#f2f2f2'
      } else {
        return ''
      }
    },
    // 编辑按钮
    editBtn (e) {
      console.log(e)
      this.typetitle = '编辑'
      this.unkId = e.unkId
      this.dialogFormVisible = true
      console.log(this.loadList())
      this.loadList().forEach(item => {
        console.log(e[item.propertyName])
        item.key = e[item.propertyName]
      })
    },
    // 导出按钮
    exportbtn () {
      this.exportDialog = true
      this.sortedarrays(false)
    },
    // 批量收藏
    collection (data) {
      if (this.unkIdList.length > 0) {
        this.unkIdList.forEach(res => {
          this.phoneBookList.push({
            unkId: res.unkId,
            objectId: this.formId,
            dataType: 0
          })
        })
        this.batchAddPhoneBookfn()
      } else {
        this.$message('请勾选需要收藏的信息')
      }
    },
    // 收藏常用电话本
    batchAddPhoneBookfn () {
      this.$http
        .batchAddPhoneBook({
          phoneBookList: JSON.stringify(this.phoneBookList),
          userId: parseInt(this.userId)
        })
        .then(res => {
          this.phoneBookList = []
          console.log(res)
          if (res.code == 200) {
            this.queryFormOfficialDatafn()
            this.$message.success('收藏成功,请在常用电话本查看')
          } else {
            this.$message(res.message)
          }
        })
    },
    // 查询单位
    sendFormUnitsfn () {
      this.$http
        .getDataUnit(`formId=${this.formId}&userId=${this.userId}`)
        .then(res => {
          console.log(res)
          if (res.code == 200) {
            this.datatree.push(...res.data)
            this.$nextTick(function () {
              console.log('res.data:', res.data)
              console.log('this.datatree:', this.datatree)
            })
          } else {
            // this.$message(res.data || res.message);
          }
        })
    },
    // 根据单位查看数据
    handleNodeClick (item) {
      console.log('item:', item)
      // this.unitId = item.unitId;
      this.queryUnitId = item.unitId
      this.userId2 = item.userId
      this.queryFormOfficialDatafn(item)
    },
    // 填报提交
    addFormDatafn () {
      console.log(this.loadList())
      this.loadList().forEach(item => {
        this.form.values.push(`${item.key}`)
      })
      this.form.values.push('')
      console.log(this.form.values.toString())
      // return;
      this.dialogFormVisible = false
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
          console.log(res)
          this.form.values = []
          this.queryFormOfficialDatafn()
          return res.code == 200
            ? this.$message.success('填报成功')
            : this.$message(res.data || res.message)
        })
    },
    // 编辑提交
    tbyeditFormDatafn () {
      this.loadList().forEach(item => {
        //  console.log(item)
        // this.form.values.push(item.propertyId+":"+item.key)
        this.form.values.push(item.propertyId + ':' + item.key)
      })
      this.form.values.push('')
      console.log(this.form.values.toString())
      this.dialogFormVisible = false
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
          console.log(res)
          this.tableheader.forEach(e => {
            if (e.key) {
              e.key = ''
            }
          })
          this.form.values = []
          this.queryFormOfficialDatafn()
          return res.code == 200
            ? this.$message.success('编辑成功')
            : this.$message(res.data || res.message)
        })
    },
    // 填报/编辑 提交
    dialogFormVisiblefn () {
      if (this.typetitle == '填报') {
        this.addFormDatafn()
      } else if (this.typetitle == '编辑') {
        this.tbyeditFormDatafn()
      }
    }

    // showDate(val) {
    //     val = val + '';
    //     if (val.indexOf(this.search) !== -1 && this.search !== '') {
    //     return val.replace(this.search, '<font color="#409EFF">' + this.search + '</font>')
    //     } else {
    //         return val
    //     }
    // },
  },
  computed: {
    // 实时监听表格
    // tables() {
    //      const search = this.search
    //         if (search) {
    //             this.tableData.forEach(res =>{
    //                 delete res.unkId
    //             })
    //             return this.tableData.filter(dataNews => {
    //             return Object.keys(dataNews).some(key => {
    //             // return this.tableData
    //                 // this.showDate()
    //                 // console.log(dataNews[key])
    //                 return String(dataNews[key]).toLowerCase().indexOf(search) > -1
    //             })
    //             })
    //         }
    //     return this.tableData
    //     },
    loadList () {
      return () => {
        let newData = []
        this.tableheader.forEach(item => {
          if (item.propertyType) {
            newData.push(item)
          }
        })
        return newData
      }
    }
  },
  mounted () {
    (this.userId = sessionStorage.getItem('userID')),
    (this.unitId = sessionStorage.getItem('unitId')),
    (this.roleId = sessionStorage.getItem('roleId')),
    (this.userId2 = this.userId)
    // 数据更新之后的DOM 执行方法
    this.$nextTick(() => {
      this.setSort()
    })
    this.exporyUrl = document.location.origin
    //   this.exporyUrl = 'http://192.168.1.70:8888';
    this.importurl = this.exporyUrl + '/dev/newForm_/inputExcel'
    this.queryFormOfficialDatafn() // 查看所有数据
    //   if(this.roleId != 3){
    //       this.queryFormOfficialDatafn(); // 查看所有数据
    //   }else{
    //       this.queryFormOfficialDatafn(this.unitId); // 查看所有数据
    //   }
    this.gettableheaderfn() // 获取表头
    this.sendFormUnitsfn() // 查询单位

    if (this.roleId == 1) {
      this.dataState = [
        {
          value: '1',
          label: '所有数据'
        },
        {
          value: '5',
          label: '正式数据'
        },
        {
          value: '7',
          label: '推送数据'
        },
        {
          value: '4',
          label: '待审核数据'
        },
        {
          value: '6',
          label: '驳回数据'
        }
      ]
    } else if (this.roleId == 2) {
      this.dataState = [
        {
          value: '1',
          label: '所有数据'
        },
        {
          value: '3',
          label: '待上报数据'
        },
        {
          value: '4',
          label: '待审核数据'
        },
        {
          value: '5',
          label: '正式数据'
        },
        {
          value: '6',
          label: '驳回数据'
        }
      ]
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
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
  display: flex;
  margin-top: 50px;
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
  // padding: 10px;
  border: 1px solid #eeeeee;
  width: 150px;
  position: fixed;
  height: 100%;
  background: #fff;
  z-index: 9;
  margin-top: 20px;
}
.table_content {
  margin-left: 170px;
  width: calc(~"100% - 170px");
  z-index: 2;
}
.treelist {
  line-height: 25px;
  cursor: pointer;
}
.treelist:hover {
  color: #409eff;
}
</style>
<style lang="less">
.formview {
  .el-upload-list {
    display: none;
  }
  .el-table__header-wrapper {
    position: fixed;
    z-index: 999;
  }
  .el-table__body-wrapper {
    margin-top: 35px;
  }
}

// .sendFormUnitsfn{
//     position: absolute;
//     height: 500px;
//     overflow: auto;
//     width:calc(~'100% - 200px')
// }
</style>
