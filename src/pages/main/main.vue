<template>
  <div class="home">
    <topheader ref="chind" @drawer="drawerfn"></topheader>
    <main>
      <sidemenu @activefnc="getMsgFormSon"></sidemenu>
      <div class="content">
        <div class="content_main">
          <router-view></router-view>
        </div>
        <div id="loading"></div>
      </div>
    </main>
  </div>
</template>

<script>
import topheader from "./../../components/topheader";
import sidemenu from "./../../components/sidemenu";
export default {
  components: {
    topheader,
    sidemenu
  },
  data() {
    return {
      userId: sessionStorage.getItem("userID"),
      account: "",
      roleName: "",
      unreadnum: 0,
      sidemenuName: "首页",
      sidemenuIndex: 0,
      drawer: false,
      iswrapperClosable: false,
      socket: "",
      sidemenuIndex2: "",
      iftankuang: true
    };
  },
  methods: {
    // 首页
    pagehome() {
      this.sidemenuIndex = 0;
    },
    drawerfn(b) {
      if (b) {
        this.drawer = true;
      }
    },
    vieworedit(data) {
      console.log(data);
    },

    getMsgFormSon(index) {
      this.sidemenuIndex = index;
      sessionStorage.setItem("sidemenuIndex", index);
      if (index == 1) {
        this.sidemenuName = "单位管理";
      } else if (index == 2) {
        this.sidemenuName = "账户管理";
      } else if (index == 3) {
        this.sidemenuName = "表单管理";
      } else if (index == 4) {
        this.sidemenuName = "任务生成";
      } else if (index == 5) {
        this.sidemenuName = "查询统计";
      } else if (index == 7) {
        this.sidemenuName = "单位字典";
      } else if (index == 6) {
        this.sidemenuName = "日志管理";
      } else if (index == 8) {
        this.sidemenuName = "常用电话本";
      } else if (index == 9) {
        this.sidemenuName = "消息提醒";
      } else if (index == 0) {
        this.sidemenuName = "首页";
      } else if (index == 10) {
        this.sidemenuName = "常用表单";
      } else if (index == 11) {
        this.sidemenuName = "大项任务";
      }
    },

    // 桌面消息通知
    notify(msg) {
      if (!("Notification" in window)) {
        this.$message("你的浏览器不支持Notification通知");
      }
      //检查是否拥有通知权限；有就通知，没有请求；
      else if (Notification.permission == "granted") {
        var options = { body: msg };
        var notification = new Notification("您有新的消息", options);
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function(result) {
          if (result == "granted") {
            var notification = new Notification("您有新的消息", options);
          }
        });
      }
    },
    // webSocket 实时通讯
    initwebSocket() {
      if (typeof WebSocket === "undefined") {
        this.$message("您的浏览器不支持socket");
      } else {
        // 实例化socket
        var urlorigin2 = document.location.host;
        // var urlorigin2 = '192.168.1.70:8888';
        this.socket = new WebSocket(
          `ws://${urlorigin2}/dev/websocket/${this.userId}`
        );
        // this.socket = new WebSocket(`ws://${'192.168.1.11:8888'}/dev/websocket/${this.userId}`);
        // 监听socket连接
        this.socket.onopen = this.open;
        // 监听socket错误信息
        this.socket.onerror = this.error;
        // 监听socket消息
        this.socket.onmessage = this.getMessage;
      }
    },
    open() {
      console.log("socket连接成功");
    },
    error() {
      console.log("连接错误");
    },
    getMessage(msg) {
      let _this = this;
      this.$http.countUnread(`userId=${this.userId}`).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.mseSetItem("unreadnum", res.data);
          if (res.data > 0) {
            // this.$alert("您有新的消息请注意查阅！", "新消息提示", {
            //   confirmButtonText: "关闭",
            //   callback: action => {
            //     _this.iftankuang = false;
            //   }
            // });
            const h = this.$createElement;
            this.$notify({
              title: "新消息提示",
              dangerouslyUseHTMLString:true,
              message: '<a href="#/messagereminder" class="notice">您有新的消息请注意查阅，去查看！</a>',
              duration: 60000
            });
          }
        }
      });
    }
  },
  mounted() {
    let logintoken = sessionStorage.getItem("token");
    if (!logintoken) {
      this.$router.push({
        path: "/"
      });
    } else {
      this.initwebSocket();
    }
  }
};
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
.notice{
  text-decoration: none;
  color: teal;
}
</style>
<style lang="less" scoped>
#loading {
  width: 100px;
  height: 100px;
  position: fixed;
  left: 50%;
  top: calc(~"50% - 50px");
}
main {
  .content {
    padding: 12px;
    box-sizing: border-box;
    width: calc(~"100% - 200px");
    background: #fff;
    position: absolute;
    height: calc(~"100% - 85px");
    right: 0;
    p.title {
      border-bottom: 2px solid #e6e6e6;
      font-size: 14px;
      position: fixed;
      background: #fff;
      z-index: 99;
      width: 100%;
      height: 41px;
      top: 64px;
      display: flex;
      align-items: center;
      // position: absolute;
      // width: 100%;
      // background: #fff;
      // height: 60px;
    }
  }
}
</style>
<style lang="less">
.drawer_content {
  padding: 0 15px;
  box-sizing: border-box;
}
</style>
