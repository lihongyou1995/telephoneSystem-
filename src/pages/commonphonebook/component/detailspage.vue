<template>
  <div class="details">
      <div class="details_content">
           <el-page-header @back="goBack" content="电话本详情"></el-page-header>
             <!-- 任务详情 -->
            <div v-if="dataType == 1" class="table">
                    <el-table
                        border
                        ref="multipleTable"
                        :data="detailstabledata"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        :header-cell-style="{background:'#f2f2f2'}" 
                        :max-height="tableheight"
                        v-loadmore="ifloads=='1'?qryPhoneBookDataListfn:''"
                    >
                    <el-table-column v-for="(item,index) in tableheader" :key='index' 
                        :label="item.name" 
                        align="center"
                        :prop='item.name'
                        :width="item.width"
                        :resizable="false"
                    ></el-table-column>
                    <el-table-column :resizable="false" label="操作"  width="100" align="center" >
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="cancelcollection(scope.row)">取消收藏</el-button>
                            </template>
                    </el-table-column>
                </el-table>
            </div>

            <!-- 表单详情 -->
            <div v-if="dataType == 0" class="table">
                    <el-table
                        border
                        ref="multipleTable"
                        :data="detailstabledata"
                        tooltip-effect="dark"
                        style="width: 100%;"
                        :max-height="tableheight"
                        v-loadmore="ifloads=='1'?qryPhoneBookDataListfn:''"
                    >
                    <el-table-column v-for="(item,index) in tableheader" :key='index' 
                        :label="item.propertyName" 
                        align="center"
                        :prop='item.propertyName'
                        :width="item.width"
                    ></el-table-column>
                    <el-table-column label="操作"  width="100" align="center" >
                            <template slot-scope="scope">
                                <el-button size="mini" type="danger" @click="cancelcollection(scope.row)">取消收藏</el-button>
                            </template>
                    </el-table-column>
                </el-table>
            </div>
      </div>
  </div>
</template>

<script>
export default {
  name: 'detailspage',

  data () {
    return {
        tableheight:600,
        dataType:this.$route.query.dataType,
        objectId:this.$route.query.objectId,
        tableName:this.$route.query.tableName,
        tableheader:[],
        detailstabledata:[],
        phoneBookList:[],
        roleId:sessionStorage.getItem('roleId'),
        userId:sessionStorage.getItem('userID'),
        unitId:sessionStorage.getItem('unitId'),
        loadData:[],
        pageIndex:1,
        pageSize:100,
       ifloads:'1'
    }
  },
  methods:{
      // 滚动分页加载------------------------------------------------------------------------
     cleanData(){
      this.pageIndex = 1;
      this.loadData = [];
      this.detailstabledata = [];      // table绑定的数据
      this.ifloads='1'
    },
    // 获取数据
      qryPhoneBookDataListfn(){
        let _this = this
        // console.log('00000000000000000---'+_this.ifloads)
        if(_this.ifloads=='0'){
          return
        }else if(_this.ifloads=='1'){
        _this.$http.qryPhoneBookDataList({
            dataType:this.dataType,
            objId:this.objectId,
            userId:this.userId,
            pageNum:this.pageIndex,
            pageSize:this.pageSize
        }).then(res =>{
            //  _this.ifdbclick=true
            if(res.code == 201 ){
              console.log(`返回数据${res.data}`)
              _this.loadData = res.data
              if(_this.loadData){
                if (_this.loadData.length < 100) {
                  _this.ifloads='0'
                  _this.loading =  true
                } else {
                  _this.ifloads='1'
                  _this.pageIndex += 1
                  _this.loading = false
                }
                _this.detailstabledata = _this.detailstabledata.concat(_this.loadData)
                _this.loadData=[]
                for (let key in _this.detailstabledata) {
                  _this.detailstabledata[key]['序号'] = parseInt(key) + 1 
                }
              } 
            }else{
              _this.loading = true
              _this.$message(res.data.message || res.message)
              // _this.$message(res.message)
            }  
          })
        }

    },
// ---------------------------------------------------------
    // 获取表头
    gettableheaderfn(){
      this.$http.gettableheader(`formId=${this.objectId}`).then(res =>{
        console.log(res)
          if(res.code == 200 && res.data instanceof Array){
              res.data.unshift({
                  propertyName:'序号',
                  width:'60',
              })
              this.tableheader = res.data;
          }
        })
    },
    gettableheaderfn2(){
      this.$http.getTaskProperty(`taskId=${this.objectId}`).then(res =>{
        console.log(res)
        if(res.code == 200 && res.data instanceof Array){
          res.data.push({
            name:'数据标识'
          })
          this.tableheader = res.data;
        }
      })
    },

    // 电话本详情列表
    // qryPhoneBookDataListfn(){
    //     this.$http.qryPhoneBookDataList({
    //         dataType:this.dataType,
    //         objId:this.objectId,
    //         userId:this.userId,
    //     }).then(res =>{
    //         console.log(res)
    //         if(res.code == 201){
    //             this.detailstabledata = res.data;
    //         }else{
    //             this.$message(res.data || res.message);
    //         }
    //     })
    // },
    // 取消收藏
     cancelcollection(item){
        console.log(item)
        this.phoneBookList.push({
            unkId:item.unkId,
            objectId:this.objectId,
            dataType:this.dataType
        })
        this.$http.batchDeletePhoneBook({
            phoneBookList:JSON.stringify(this.phoneBookList),
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.$message.success('取消成功');
                this.cleanData()
                this.qryPhoneBookDataListfn();
            }else{
                this.$message('操作失败')
            }
        })
    },

  },
  mounted(){
    //   动态设置表格高度
      setTimeout(()=>{
        this.tableheight = window.innerHeight - 250;
      },0)
      if(this.dataType == 0){
          this.gettableheaderfn()
      }else if(this.dataType == 1){
          this.gettableheaderfn2()
      }
      this.qryPhoneBookDataListfn();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-page-header{
        margin-bottom: 15px;
    }
</style>
