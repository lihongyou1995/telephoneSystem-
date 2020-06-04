<template>
  <div class="home">
      <div v-if="roleId != 3">
          <div class="hoemtype">
            <div class="homediv bg1" @click="toform" style="cursor:pointer">
                <p>
                  <span class="numcont">{{countForm}}</span><span class="textfont">个</span>
                </p>
                <p>
                  <span class="textfont">表单总数</span>
                </p>
            </div>
            <div class="homediv bg2" @click="toform" style="cursor:pointer">
               <p>
                  <span class="numcont">{{notSuccessForm}}</span><span class="textfont">个</span>
                </p>
                <p>
                  <span class="textfont">待处理表单</span>
                </p>
            </div>
            <div class="homediv bg3" @click="totask" style="cursor:pointer">
              <p>
                  <span class="numcont">{{countTask}}</span><span class="textfont">个</span>
                </p>
                <p>
                  <span class="textfont">任务总数</span>
                </p>
            </div>
            <div class="homediv bg4" @click="totask" style="cursor:pointer">
              <p>
                  <span class="numcont">{{notSuccessTask}}</span><span class="textfont">个</span>
                </p>
                <p>
                  <span class="textfont">待处理任务</span>
                </p>
            </div>
        </div>
        <div class="datadisplay">
              <p><span></span>数据显示</p>
              <div class="datadisplaycontent">
                  <div class="bgimg1">
                    <span>{{successFormRate }}%</span>
                  </div>
                  <div class="bgimg2">
                    <span>{{successTaskRate }}%</span>
                  </div>
                  <!-- <div class="bgimg3">
                    <span>76%</span>
                  </div>
                  <div class="bgimg4">
                    <span>76%</span>
                  </div> -->
              </div>
              <div class="datadisplaycontent2">
                  <div>
                      <p>表单总数:{{countForm}}个</p>
                      <p>已处理表单:{{successForm}}个</p>
                  </div>
                  <div>
                      <p>任务总数:{{countTask}}个</p>
                      <p>已处理任务:{{successTask}}个</p>
                  </div>
                  <!-- <div>
                      <p>表单总数:2563个</p>
                      <p>已处理表单:2563个</p>
                  </div>
                  <div>
                      <p>表单总数:2563个</p>
                      <p>已处理表单:2563个</p>
                  </div> -->
              </div>
        </div>
      </div>
      <div v-if="roleId == 3">
          <div v-if="istaskview">
            <taskview :viviewtableheder='viviewtableheder' :viviewtabledata='viviewtabledata'></taskview>
          </div>
          <div v-if="isformview">
            <formview :tableheader='tableheader' :tableData3='tableData3'></formview>
          </div>
          <div v-if="!istaskview && !isformview">
            <div class="topdiv">
              <div class="left">
                  <p><span></span>大项任务</p>
                  <div class="datalist">
                    <ul>
                      <li v-for="(item,index) in taskList" :key='index' @click="gettaskid(item)" style="font-size:18px;">{{item.name}}</li>
                    </ul>
                  </div>
              </div>
              <div class="right" style="overflow: auto;">
                <p><span></span>消息提醒</p>
                <ul class="msgcontent">
                  <li style='font-size:18px;' v-for="(item,index) in msgtableData" :key="index">{{item.message}}</li>
                </ul>
              </div>
          </div>

          <div class="bootmlist">
              <div v-for="(item,index) in formAttributeList" :key="index">
                  <p><span></span>{{item.attribute}}</p>
                  <ul v-if='index == 0'>
                    <li style='font-size:18px;' v-for="(item,index) in tableData1" :key="index" @click="clickform(item)">{{item.formName}}</li>
                  </ul>
                   <ul v-if='index == 1'>
                    <li style='font-size:18px;' v-for="(item,index) in tableData2" :key="index" @click="clickform(item)">{{item.formName}}</li>
                  </ul>
                   <ul v-if='index == 2'>
                    <li style='font-size:18px;' v-for="(item,index) in tableData4" :key="index" @click="clickform(item)">{{item.formName}}</li>
                  </ul>
              </div>
          </div>
          </div>


      </div>

  </div>
</template>

<script>
// import taskview from './../taskgeneration/componet/taskview'
// import formview from './../formmanagement2/formview'
export default {
  name: 'home',
  components:{
    // taskview,formview
  },
  data () {
    return {
      roleId:sessionStorage.getItem('roleId'),
      userId:sessionStorage.getItem('userID'),
      unitId:sessionStorage.getItem('unitId'),
      countForm:'', // 表单总数
      countTask:'', // 任务总数
      notSuccessForm:'', // 待处理表单
      notSuccessTask:'',  // 待处理任务
      successForm:'', // 已完成表单
      successFormRate:'', // 表单百分比
      successTask:'', // 已处理任务
      successTaskRate:'', // 任务百分比
      taskList:[], // 大项任务列表
      formAttributeList:[], // 表单属性
      istaskview:false,
      viviewtableheder:[],
      viviewtabledata:[],
      taskId:'',
      taskName:'',
      tableData1:'',
      tableData2:'',
      tableData3:[],
      tableData4:'',
      isformview:false,
      tableheader:[],
      formName:'',
      msgtableData:'',
      isLogin:this.$route.params.isLogin,
    }
  },
  methods:{
    // 获取用户消息
    getallFormNewsfn(){
        this.$http.allFormNews(`userId=${this.userId}&pageNum=1&pageSize=1000000&type=1`).then(res =>{
                console.log(res)
                if(res.code == 200){
                    this.msgid = [];
                    this.countData = res.data.countData;
                    res.data.list.forEach(item =>{
                        if(item.state == 1){
                            this.msgid.push(item.id)
                            item.state = '未读'
                        }else if(item.state == 2){
                            item.state = '已读'
                        }

                    })
                    this.msgtableData = res.data.list;
                }
        })
    },
    // 查看表单
    clickform(item){
      console.log(item)
      this.formName = item.formName;
      this.$router.push({ 
          name:'formmanagement/formview',  
          query:{   
              formName:item.formName,
              formId:item.id,
              createUserId:item.createUser,
              state:item.state,
          }
        })
    },
    //跳转表单
    toform(){
      this.$router.push({
        name:'formmanagement'
      })
    },
    //跳转任务
    totask(){
      this.$router.push({
        name:'taskgeneration'
      })
    },
    // 查看任务
    gettaskid(item){
      console.log(item)
      
      this.$router.push({
          name:'taskgeneration/taskview',
          query:{
            taskName:item.name,
            taskId:item.id,
            createUser:item.createUser,
            formState:item.state,
          }
        })
      // this.getTaskPropertyfn();
      // this.getDataListfn();
    },
    // 获取统计数据
    getformAndTaskStatisticsfn(){
      this.$http.formAndTaskStatistics(`userId=${this.userId}`).then(res =>{
        console.log(res)
        if(res.code == 200){
          this.countForm = res.data.countForm;
          this.countTask = res.data.countTask;
          this.notSuccessForm = res.data.notSuccessForm;
          this.notSuccessTask = res.data.notSuccessTask;
          this.successForm = res.data.successForm;
          this.successFormRate = (res.data.successFormRate * 10000).toFixed(2) / 100;
          this.successTask = res.data.successTask;
          this.successTaskRate = (res.data.successTaskRate * 10000).toFixed(2) /100;
        }else{
          this.$message(res.data)
        }
      })
    },
    // 获取任务列表（大项任务）
    queryTaskListfn(){
      this.$http.queryTaskList(`unitId=${this.unitId}&userId=${this.userId}&roleId=${this.roleId}&pageNum=1&pageSize=10000000`).then(res =>{
        console.log(res)
        if(res.code == 200){
            this.taskList = res.data.list;
        }
      })
    },
    // 查询表单属性
    queryFormAttributefn(){
      this.$http.getFormAtrribute().then(res =>{
        console.log(res)
        if(res.code == 200){
          this.formAttributeList = res.data.slice(0,3);
          this.getformdata();
          console.log(this.formAttributeList)
        }
      })
    },
    getformdata(){
      if(this.formAttributeList[0].attribute){
        this.$http.getFormObj(`userId=${this.userId}&formState=${this.formAttributeList[0].attribute}`).then(res =>{
              console.log(res)
              return res.code == 200 ? this.tableData1 = res.data : this.$message(res.data || res.$message);
            })
      }
      if(this.formAttributeList[1].attribute){
        this.$http.getFormObj(`userId=${this.userId}&formState=${this.formAttributeList[1].attribute}`).then(res =>{
          console.log(res)
          return res.code == 200 ? this.tableData2 = res.data : this.$message(res.data || res.$message);
          
        })
      }
      if(this.formAttributeList[2].attribute){
        this.$http.getFormObj(`userId=${this.userId}&formState=${this.formAttributeList[2].attribute}`).then(res =>{
          console.log(res)
          return res.code == 200 ? this.tableData4 = res.data : this.$message(res.data || res.$message);
        })
      }
        
        
    },

    // 获取表头
    getTaskPropertyfn(){
       this.$http.getTaskProperty(`taskId=${this.taskId}`).then(res =>{
            if(res.code == 200){
               res.data.push({
                taskPropertyName:'数据标识'
              }
              )
              this.viviewtableheder = res.data;
            }
            console.log(res)
          });
    },

    // 获取查看数据
    getDataListfn(){
       this.$http.getDataList(`unitId=${this.unitId}&userId=${this.userId}&roleId=${this.roleId}&taskId=${this.taskId}&taskName=${this.taskName}&from='正式`).then(res =>{
            console.log(res)
            if(res.code == 200 && res.data instanceof Array){
                this.viviewtabledata = res.data;
            }

          })
    },



  },
  mounted(){
    if(this.isLogin){
      this.$message.success('登录成功');
    }
    if(this.userId){
      if(this.roleId != 3){
      this.getformAndTaskStatisticsfn();
    }else if(this.roleId == 3){
      this.queryTaskListfn();
      this.queryFormAttributefn();
      this.getallFormNewsfn();
    }
    }



  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
  .home{
    margin-top: 20px;
    .hoemtype{
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      width:100%;
      .homediv{
        width:calc(~'25% - 30px');
        height:120px;
        margin-bottom: 20px;
        border: 1px solid #dddddd;
        text-align: center;
        color: #fff;
        padding-top: 20px;
        box-sizing: border-box;
        >p{
          .numcont{
            font-size: 38px;
            font-weight: bold;
          }
          .textfont{
            font-size: 12px;
          }
        }
      }
        .bg1{
            background: #6676EF;
          }
        .bg2{
          background: #50E2BE;
        }
        .bg3{
          background: #FEA327;
        }
        .bg4{
          background: #FB534B;
        }
    }
    .commonfunctions{
      display: flex;
      justify-content: space-between;
      >div{
        width: calc(~'50% - 20px');
        border: 1px solid #dddddd;
        padding: 15px;
        box-sizing: border-box;
        .left_title{
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 15px;
            border-bottom: 1px solid #dddddd;
            i{
              font-size:24px;
              cursor: pointer;
            }
          }
          .left_list{
            display: flex;
            justify-content: space-around;
            padding: 20px 0;
            >div{
              text-align: center;
              width: calc(~'20% - 10px');
              cursor: pointer;
              font-size: 14px;
            }
            img{
              margin-bottom: 15px;
            }
          }


          .right_ul{
            padding: 0 20px;
            li{
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid #dddddd;
              line-height: 40px;
              span{
                font-size: 14px;
              }
              // padding-bottom: 15px;
              i{
                font-size: 24px;
                font-weight: bold;
                cursor: pointer;
                line-height: 40px;
              }
            }
          }


      }
    }
    .datadisplay{

        >p{
          font-size: 14px;
          display: flex;
          align-items: center;
          border-bottom: 2px solid #eeeeee;
          padding: 10px 0;
          >span{
            display: inline-block;
            width: 5px;
            height: 20px;
            background: #6676EF;
            margin-right: 10px;
          }
        }
        .datadisplaycontent{
          display: flex;
          justify-content: space-around;
          padding-top: 10px;
          >div{
            width:150px;
            height:150px;
            border-radius: 50%;
            border: 1px solid #eee;
            display: flex;
            align-items: center;
            justify-content: space-around;
            color: #fff;
          }
           .bgimg1{
            background: url('./../../../static/images/1.png') no-repeat;
            background-size: cover;
          }
           .bgimg2{
            background: url('./../../../static/images/2.png') no-repeat;
            background-size: cover;
          }
           .bgimg3{
            background: url('./../../../static/images/3.png') no-repeat;
            background-size: cover;
          }
           .bgimg4{
            background: url('./../../../static/images/4.png') no-repeat;
            background-size: cover;
          }
        }
        .datadisplaycontent2{
          display: flex;
          justify-content: space-around;
          margin-top: 10px;
           >div{
            width:150px;
            text-align: center;
            font-size: 14px;
            color: #999;
          }

        }

    }
    .topdiv{
      height: 300px;
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      .left{
        width: calc(~'100% / 3 * 2 - 10px');
        border: 1px solid #ddd;
        padding: 0 15px;
        box-sizing: border-box;
          >p{
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #eeeeee;
            padding: 10px 0;
            >span{
              display: inline-block;
              width: 5px;
              height: 20px;
              background: #6676EF;
              margin-right: 10px;
            }
          }
      }
      .right{
        width:calc(~'100% / 3 - 18px');
        border: 1px solid #dddddd;
        padding: 0 15px;
        box-sizing: border-box;
        >p{
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #eeeeee;
            padding: 10px 0;
            >span{
              display: inline-block;
              width: 5px;
              height: 20px;
              background: #6676EF;
              margin-right: 10px;
            }
          }
      }
      .datalist{
        height: 310px;
        overflow: auto;
        ul{
          li{
            line-height: 30px;
            font-size: 14px;
            border-bottom: 1px solid #dddddd;
            cursor: pointer;
          }
        }
      }
    }
    .bootmlist{
      // border: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      >div{
        width: calc(~'100% / 3 - 20px');
        border: 1px solid #ddd;
        height: 260px;
        margin:28px 0;
          >p{
            font-size: 18px;
            font-weight: bold;
            display: flex;
            align-items: center;
            border-bottom: 2px solid #eeeeee;
            padding: 10px;
            box-sizing: border-box;
            >span{
              display: inline-block;
              width: 5px;
              height: 20px;
              background: #6676EF;
              margin-right: 10px;
            }
          }
      }
      li{
        padding:5px 15px;
        cursor: pointer;
      }
      li:hover{
        color: #6676EF;
      }
    }
    .msgcontent{
      line-height: 30px;
      font-size: 14px;
      color: #999;

    }
  }
</style>
