<template>
  <div class="querydetails">
    <div class="content">
      <div class="header" >
        <!-- <el-page-header @back="goBack" content="详情页面"></el-page-header> -->
        <el-button type="primary" size="medium" @click="goBack" icon="el-icon-arrow-left">返回</el-button>
        <div class="querystatisticssosuo">
          <el-input
            placeholder="输入关键字进行查找"
            clearable
            @clear="clearquy"
            v-model="keyword"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchbtn"></el-button>
          </el-input>
        </div>
        <!-- <el-button style="margin-bottom: 15px;" size="mini" type="primary" @click="exportbtn">导出</el-button> -->
      </div>

      <div class="content_flx">
        <div class="lefttree" style="width:200px;border:1px solid #eee;">
          <div class="lerrt_div">
            <el-table
              ref="singleTable1"
              highlight-current-row
              :indent="indent"
              :data="treedata"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              default-expand-all
              @row-click="handleNodeClick"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="name" label></el-table-column>
            </el-table>
          </div>
          <div class="lerrt_div">
            <el-table
              ref="singleTable2"
              highlight-current-row
              :indent="indent"
              :data="treedata2"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              default-expand-all
              @row-click="handleNodeClick2"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="name" label></el-table-column>
            </el-table>
          </div>
          <div class="lerrt_div">
            <el-table
              ref="singleTable3"
              highlight-current-row
              :indent="indent"
              :data="treedata3"
              style="width: 100%;margin-bottom: 20px;"
              row-key="id"
              default-expand-all
              @row-click="handleNodeClick3"
              :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            >
              <el-table-column prop="name" label></el-table-column>
            </el-table>
          </div>
        </div>

        <!-- 任务详情 -->
        <div v-if="dataType == 1" class="tables">
          <el-table
            border
            :max-height="tableheight"
            ref="multipleTable"
            :data="loadDatas"
            tooltip-effect="dark"
            style="width: 100%;"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              v-for="(item,index) in tableheader"
              :key="index"
              :label="item.name"
              align="center"
              :prop="item.name"
              :width="item.width"
              :resizable="false"
            ></el-table-column>
            <el-table-column label="操作" width="100" align="center" :resizable="false">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="scope.row.收藏标识 == '未收藏'"
                  type="primary"
                  @click="vieworedit(scope.row,1)"
                >收藏</el-button>
                <el-button
                  size="mini"
                  v-if="scope.row.收藏标识 == '已收藏'"
                  type="danger"
                  @click="vieworedit(scope.row,2)"
                >取消收藏</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :page-size="pageSize"
              :page-sizes="[500, 200, 1000]"
              :current-page.sync="currentPage"
              layout="total, sizes, prev, pager, next , jumper"
              :total="countnum"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>

        <!-- 表单详情 -->
        <div v-if="dataType == 0" class="tables">
          <el-table
            border
            :max-height="tableheight"
            ref="multipleTable"
            :data="loadDatas"
            tooltip-effect="dark"
            style="width: 100%;"
            :header-cell-style="getRowClass"
          >
            <el-table-column
              v-for="(item,index) in tableheader"
              :key="index"
              :label="item.propertyName"
              align="center"
              :prop="item.propertyName"
              :width="item.width"
              :render-header="renderHeader"
            ></el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.收藏标识 == '未收藏'"
                  size="mini"
                  type="primary"
                  @click="vieworedit(scope.row,1)"
                >收藏</el-button>
                <el-button
                  v-if="scope.row.收藏标识 == '已收藏'"
                  size="mini"
                  type="danger"
                  @click="vieworedit(scope.row,2)"
                >取消收藏</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination
              :page-size="pageSize"
              :page-sizes="[500, 200, 1000]"
              :current-page.sync="currentPage"
              layout="total, sizes, prev, pager, next , jumper"
              :total="countnum"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </div>

      <div>
        <exportdialog ref="child" @params="exportParams"></exportdialog>
      </div>
    </div>
  </div>
</template>
<script>
import exportdialog from "@/components/exportdialog";
export default {
  name: "querydetails",
  components: {
    exportdialog
  },
  data() {
    return {
      countnum: 0,
      currentPage: 1,
      tableheight: 600,
      phoneBookList: [],
      isCollection: [],
      detailstabledata: [],
      tableheader: [],
      keyword: this.$route.query.keyword,
      dataType: this.$route.query.dataType, //0 表单 1任务
      tableName: this.$route.query.tableName,
      objectId: this.$route.query.objectId,
      roleId: sessionStorage.getItem("roleId"),
      userId: sessionStorage.getItem("userID"),
      unitId: sessionStorage.getItem("unitId"),
      exporyUrl: "",
      treedata: [],
      treedata2: [],
      treedata3: [],
      propertyName: "", // 属性
      unitLevel: "", // 类型
      unitCatagory: "", // 级别
      indent: 0,
      loadDatas: [],
      pageIndex: 1,
      pageSize: 500
    };
  },
  methods: {
    handleSizeChange(size) {
      console.log(size);
      this.pageSize = size;
      this.cleanData();
      this.qryQueryStatisticsDataListfn();
    },
    handleCurrentChange(page) {
      // console.log(page)
      this.pageIndex = page;
      this.loadDatas = [];
      this.qryQueryStatisticsDataListfn();
    },
    cleanData() {
      this.pageIndex = 1;
      this.loadDatas = [];
      this.detailstabledata = []; // table绑定的数据
    },
    // 获取数据
    qryQueryStatisticsDataListfn() {
      if (this.keyword.indexOf(",") != -1 || this.keyword.indexOf(":") != -1)
        return this.$message("查询关键字不能含有英文状态下的逗号或者冒号");
      let _this = this;
      _this.loadData = []
      _this.$http
        .qryQueryStatisticsDataList({
          dataType: this.dataType,
          objId: this.objectId,
          userId: this.userId,
          keyWords: this.keyword,
          unitProperty: this.propertyName,
          unitCatagory: this.unitCatagory,
          unitLevel: this.unitLevel,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.code == 200) {
            console.log(`返回数据${res.data}`);
            _this.loadData = res.data;
            let start = 0;
            let end = 50;
            let sets = setInterval(function() {
              let xuhao = 0;
              if (end <= _this.loadData.length) {
                _this.loadDatas = _this.loadDatas.concat(
                  _this.loadData.slice(start, end)
                );
              } else {
                _this.loadDatas = _this.loadDatas.concat(
                  _this.loadData.slice(start)
                );
                clearInterval(sets);
              }
              start += 50;
              end += 50;
              for (let key in _this.loadDatas) {
                xuhao += 1;
                let numsg = parseInt(
                  xuhao + parseInt((_this.pageIndex - 1) * _this.pageSize)
                );
                _this.loadDatas[key]["序号"] = numsg;
              }
            }, 10);
            // 总条数
            _this.countnum = parseInt(res.num);
          } else {
            _this.loading = true;
            _this.$message(res.data.message || res.message);
          }
        });
    },
    // ----------------------------------------------------------------------------------------------------------------
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
    // 属性
    handleNodeClick(item) {
      this.currentPage = 1;
      console.log(item);
      if (item.name === "根据单位属性查看") {
        this.$refs.singleTable1.setCurrentRow();
        return;
      }
      if (this.propertyName == item.propertyName) {
        this.propertyName = "";
        this.$refs.singleTable1.setCurrentRow();
      } else {
        this.propertyName = item.propertyName;
      }
      this.cleanData();
      this.qryQueryStatisticsDataListfn();
    },
    // 类型
    handleNodeClick2(item) {
      this.currentPage = 1;
      console.log(item);
      if (item.name === "根据单位类型查看") {
        this.$refs.singleTable2.setCurrentRow();
        return;
      }
      if (this.unitCatagory == item.categoryName) {
        this.unitCatagory = "";
        this.$refs.singleTable2.setCurrentRow();
      } else {
        this.unitCatagory = item.categoryName;
      }
      this.cleanData();
      this.qryQueryStatisticsDataListfn();
    },
    // 级别
    handleNodeClick3(item) {
      this.currentPage = 1;
      console.log(item);
      if (item.name === "根据单位级别查看") {
        this.$refs.singleTable3.setCurrentRow();
        return;
      }
      if (this.unitLevel == item.levelName) {
        this.unitLevel = "";
        this.$refs.singleTable3.setCurrentRow();
      } else {
        this.unitLevel = item.levelName;
      }
      this.cleanData();
      this.qryQueryStatisticsDataListfn();
    },
    // 清除输入框
    clearquy() {
      this.qryQueryStatisticsDataListfn();
    },

    // 查询单位属性
    unitPropertyDictsfn() {
      this.$http.unitPropertyDicts().then(res => {
        console.log(res);
        this.treedata = res.data;
        this.treedata.unshift({
          name: "根据单位属性查看"
        });
      });
    },
    // 查询单位类型
    unitCategoryDicts() {
      this.$http.unitCategoryDicts().then(res => {
        console.log(res);
        this.treedata2 = res.data;
        this.treedata2.unshift({
          name: "根据单位类型查看"
        });
      });
    },
    // 查询单位级别
    unitLevelDicts() {
      this.$http.unitLevelDicts().then(res => {
        console.log(res);
        this.treedata3 = res.data;
        this.treedata3.unshift({
          name: "根据单位级别查看"
        });
      });
    },

    // 导出按钮
    exportbtn() {
      if (!this.$refs.child.exportDialog)
        return (this.$refs.child.exportDialog = true);
    },

    // 自定义事件 接受子组件的参数进行处理
    exportParams(params) {
      if (this.dataType == 0) {
        // 表单导出
        if (params.exportType == 1) {
          //导出excel数据
          window.open(
            `${this.exporyUrl}/dev/formOutput/exportExcel?formName=${this.tableName}&ownUnitId=${this.unitId}&formId=${this.objectId}&userId=${this.userId}&type=${params.exportFont}`
          );
        } else if (params.exportType == 3) {
          //导出pdf
          window.open(
            `${this.exporyUrl}/dev/formOutput/exportPDF?formName=${this.tableName}&ownUnitId=${this.unitId}&formId=${this.objectId}&userId=${this.userId}&type=${params.exportFont}`
          );
        }
      } else if (this.dataType == 1) {
        // 任务导出
        if (params.exportType == 1) {
          //导出excel数据
          window.open(
            `${this.exporyUrl}/dev/taskOutput/exportExcel?ownUnitId=${this.unitId}&taskName=${this.tableName}&taskId=${this.objectId}&userId=${this.userId}&type=${params.exportFont}`
          );
        } else if (params.exportType == 3) {
          //导出pdf
          window.open(
            `${this.exporyUrl}/dev/taskOutput/exportPDF?ownUnitId=${this.unitId}&taskName=${this.tableName}&taskId=${this.objectId}&userId=${this.userId}&type=${params.exportFont}`
          );
        }
      }
    },

    // 1收藏 2取消
    vieworedit(item, type) {
      this.phoneBookList = [];
      console.log(item);
      this.phoneBookList.push({
        unkId: item.unkId,
        objectId: this.objectId,
        dataType: this.dataType
      });
      if (type == 1) {
        this.batchAddPhoneBookfn();
      } else if (type == 2) {
        this.batchDeletePhoneBookfn();
      }
    },

    getheader() {
      // 获取表头
      this.$http.gettableheader(`formId=${this.objectId}`).then(res => {
        console.log(res);
        if (res.code == 200) {
          res.data.unshift({
            propertyName: "收藏标识"
          });
          res.data.unshift({
            propertyName: "序号",
            width: "60"
          });
          res.data.push({
            propertyName: "填报单位"
          });

          this.tableheader = res.data;
          console.log(this.tableheader);
        }
      });
    },
    getheader2() {
      this.$http.getTaskProperty(`taskId=${this.objectId}`).then(res => {
        console.log(res);
        if (res.code == 200) {
          res.data.unshift({
            name: "收藏标识"
          });
          res.data.push({
            name: "填报单位"
          });
          this.tableheader = res.data;
        }
      });
    },

    // 查询详情------------------------------------------------------------------
    // qryQueryStatisticsDataListfn(){
    //   this.detailstabledata = [];
    //   this.$http.qryQueryStatisticsDataList({
    //     dataType:this.dataType,
    //     objId:this.objectId,
    //     userId:this.userId,
    //     keyWords:this.keyword,
    //     unitProperty:this.propertyName,
    //     unitCatagory:this.unitCatagory,
    //     unitLevel:this.unitLevel,
    //   }).then(res =>{
    //     console.log(res)
    //     if(res.code == 201){
    //       if(res.data instanceof Array){
    //         this.detailstabledata = res.data;
    //       }
    //     }else{
    //       this.$message(res.data || res.message);
    //     }
    //   })
    // },
    searchbtn() {
      this.currentPage = 1;
      console.log(this.keyword);
      this.cleanData();
      this.qryQueryStatisticsDataListfn();
    },

    // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background:#f2f2f2";
      } else {
        return "";
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
          console.log(res);
          if (res.code == 200) {
            this.qryQueryStatisticsDataListfn();
            this.$message.success("收藏成功");
          } else {
            this.$message(res.message);
          }
        });
    },

    // 取消收藏
    batchDeletePhoneBookfn() {
      this.$http
        .batchDeletePhoneBook({
          phoneBookList: JSON.stringify(this.phoneBookList),
          userId: this.userId
        })
        .then(res => {
          console.log(res);
          if (res.code == 200) {
            this.qryQueryStatisticsDataListfn();
            this.$message.success(res.message);
          } else {
            this.$message.success(res.message);
          }
        });
    }
  },
  mounted() {
    setTimeout(() => {
      this.tableheight = window.innerHeight - 250;
    }, 0);
    this.exporyUrl = document.location.origin;
    // this.exporyUrl = 'http://192.168.1.70:8888';
    if (this.dataType == 1) {
      this.getheader2();
    } else if (this.dataType == 0) {
      this.getheader();
    }
    this.cleanData();
    this.qryQueryStatisticsDataListfn();
    this.unitPropertyDictsfn();
    this.unitCategoryDicts();
    this.unitLevelDicts();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
.content_flx {
  display: flex;
  position: fixed;
  top: 150px;
  right: 0;
  width: calc(100% - 225px);
  .tables {
    width: calc(~"100% - 210px");
    margin-left: 210px;
  }
}
.querystatisticssosuo {
  width: 260px;
  margin-left: 15px;
  margin-right: 15px;
  display: flex;
  align-items: center;
  height: 100%;
}
.returnbutton {
  width: 40px;
}
.header {
  display: flex;
  align-items: center;
  position: fixed;
  height: 70px;
  width: calc(~"100% - 277px");
  background: #fff;
  z-index: 999;
  top: 64px;
  padding-top: 15px;
  display: flex;
  align-items: center;
}
.el-page-header {
  margin-bottom: 15px;
}
</style>
<style lang="less">
.querydetails {
  .el-table__header-wrapper {
    // position:fixed;
    // z-index: 99;
  }
  // .el-table__body-wrapper{
  //   margin-top: 34px;
  // }
  .lefttree {
    position: fixed;
    z-index: 99;
    background: #fff;
    height: calc(~"100% - 200px");
    overflow: scroll;
    .el-table__header-wrapper {
      .has-gutter {
        tr {
          display: none;
        }
      }
    }
    .lerrt_div {
      .el-table__body-wrapper {
        margin: 0;
      }
      .el-table__body-wrapper .el-table__row:nth-child(1){
        background-color: rgb(242, 242, 242) !important;
      }
      // .el-table__header-wrapper {
      //   background-color: red !important;
      // }
    }
  }
}
</style>
