<template>
  <div class="commonphonebook">
        <div class="content">
            <div class="table">
                 <template>
                    <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    :header-cell-style="{background:'#f2f2f2'}" 
                    >
                    <el-table-column
                        prop="tableName"
                        label="名称"
                        min-width="200"
                        max-width="400"
                        align="center"
                        :resizable="false"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="tableType"
                        label="类型"
                        align="center"
                        :resizable="false"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createUsername"
                        label="创建人"
                        align="center"
                        :resizable="false"
                        >
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="创建时间"
                        align="center"
                        :resizable="false"
                    >
                    </el-table-column>
                    <el-table-column :resizable="false" label="操作"  width="100" align="center" >
                            <template slot-scope="scope">
                                <el-button size="mini" type="primary" @click="vieworedit(scope.row)">查看</el-button>
                            </template>
                    </el-table-column>
                    </el-table>
                </template>
            </div>
        </div>
  </div>
</template>

<script>

export default {
  name: 'commonphonebook',
  data () {
    return {
        tableData: [],  
        dataType:0,
        tableName:'',
        objectId:'',
        detailstabledata:[],  
        tableheader:[],
        isdetails:false,
        roleId:sessionStorage.getItem('roleId'),
        userId:sessionStorage.getItem('userID'),
        unitId:sessionStorage.getItem('unitId'),
    }
  },
  methods:{
    // 查看
    vieworedit(data){
        console.log(data)
        this.$router.push({
            name:'commonphonebook/detailspage',
            query:{
                dataType:data.dataType,
                objectId:data.objectId,
                tableName:data.tableName,
            }
        })
    },
    // 常用电话本列表
    qryPhoneBookListfn(){
        this.$http.qryPhoneBookList({
            userId:this.userId,
        }).then(res =>{
            console.log(res)
            if(res.code == 200){
                this.tableData = res.data.list;
            }
        })
    },

  },
  mounted(){
      this.qryPhoneBookListfn();

  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

</style>
