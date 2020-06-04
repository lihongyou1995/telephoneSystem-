<template>
  <div class="querystatistics">
        <div class="content" v-show="!isdetails">
          <div class="querystatisticssosuo">
            <div class="que1">
               <el-input placeholder="输入关键字进行查找" v-model="keyword" class="input-with-select">
                  <!-- <el-button slot="append" icon="el-icon-search" @click="searchbtn"></el-button> -->
              </el-input>
            </div>
            <div class="que2">
              <span class="name">选择类型</span>
               <el-select v-model="value" clearable placeholder="请选择" @change='changevalfn'>
                  <el-option
                    v-for="item in options"
                    :key="item"
                    :label="item"
                    :value="item">
                  </el-option>
                </el-select>
            </div>
            <div class="que2">
              <span class="name">选择创建时间</span>
                  <el-date-picker
                    @change="datechange"
                    v-model="firstDate"
                    type="date"
                    placeholder="选择日期">
                  </el-date-picker>
            </div>
            <div class="que2">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="searchbtn">搜索</el-button>
            </div>
          </div>
            <div class="table">
                <el-table
                    :data="tableData"
                    style="width: 100%"
                    :header-cell-style="getRowClass"
                    border 
                    >
                    <el-table-column
                        prop="tableName"
                        label="表名"
                        align="center"
                        min-width="200"
                      
                        :resizable="false"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="tableType"
                        label="类型"
                        align="center"
                        min-width="90"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="createUsername"
                        label="创建人"
                        align="center"
                        min-width="90"
                        :resizable="false"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="创建时间"
                        align="center"
                        width="200"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column :resizable="false" label="操作"  width="100" align="center">
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="vieworedit(scope.row)">查看</el-button>
                            </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 20px">
                  <el-pagination
                      :page-size="pageSize"
                      layout="total, sizes, prev, pager, next"
                      :total='total'
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      >
                  </el-pagination>          
              </div>
            </div>
        </div>
        <!-- <div v-show="isdetails">
              <detailsvivie @backpage='pagefh' @searchval='searchvalfn' :dataType='dataType' :objectId='objectId' :detailstabledata='detailstabledata' :tableheader='tableheader'></detailsvivie>
        </div> -->
  </div>
</template>

<script>

export default {
  name: 'querystatistics',
  data () {
    return {
       total:0,
       keyword:'',
       pageIndex:1,
       pageSize:10,
       tableData: [],
       dataType:0,
       tableName:'',
       isdetails:false,
       detailstabledata:[],
       tableheader:[],
       objectId:0,
       options: [],
       value: '',
       firstDate:'',
       type:'',
       roleId:sessionStorage.getItem('roleId'),
        userId:sessionStorage.getItem('userID'),
        unitId:sessionStorage.getItem('unitId'),
    }
  },
  methods: {
    vieworedit(data){
        console.log(data)
        localStorage.setItem('keyword',this.keyword)
        this.$router.push({
          name:'querystatistics/querydetails',
          query:{
            dataType:data.dataType,
            tableName:data.tableName,
            objectId:data.objectId,
            keyword:this.keyword,
          }
        })
      },
      // 搜索
    searchbtn(){
          this.qryQueryStatisticsListfn()
      },
      // 改变表头颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
            if (rowIndex == 0) {
                    return 'background:#f2f2f2'
            } else {
                    return ''
            }
    },

    // 查询列表 
    qryQueryStatisticsListfn(){
      if(this.keyword.indexOf(',')!=-1 || this.keyword.indexOf(':')!=-1)return this.$message('查询关键字不能含有英文状态下的逗号或者冒号')
      this.$http.qryQueryStatisticsList({
        pageNum:this.pageIndex,
        pageSize:this.pageSize,
        userId:this.userId,
        keyWords:this.keyword,
        firstDate:this.firstDate,
        type:this.type,
      }).then(res =>{
        console.log(res)
        if(res.code == 200){
          this.total = res.data.countData;
          this.tableData = res.data.list;
          if (this.keyword || this.firstDate || this.type) {
            this.$message.success('搜索成功')
          }
        }else{
          this.$message(res.data || res.message);
        }
      })
    },

    // 查询表单类型
    queryFormAttributefn(){
        this.$http.getAttribute().then(res =>{
          console.log(res)
          if(res.code == 200){
            this.options = res.data;
          }
        })
    },

    handleSizeChange(size){
      this.pageSize = size;
      this.qryQueryStatisticsListfn();
    },
    handleCurrentChange(page){
      this.pageIndex = page;
      this.qryQueryStatisticsListfn();
    },

    // 选择表单类型
    changevalfn(item){
      console.log(item)
      this.type = item;
    },

      // 时间戳转换
    dateToMs (date) {
        let result = new Date(date).getTime();
        return result;
    },

    // 选择日期
    datechange(){
      this.firstDate = this.dateToMs(this.firstDate);
      console.log(this.firstDate)
    }


  },

  mounted(){
    this.queryFormAttributefn();
    this.qryQueryStatisticsListfn();
    this.keyword = '' || localStorage.getItem('keyword')
    
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .querystatisticssosuo{
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        .que1{
          width: 210px;
          margin-right: 30px;
        }
        .que2{
          margin-right: 30px;
          .name{
            font-size: 14px;
            color: #666;
          }
        }
    }
    .balckpage{
      margin-top: 15px;
      // float: right;
    }
</style>
