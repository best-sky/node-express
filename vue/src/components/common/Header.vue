<template>
  <div>
    <header>
      <div class="left">
        <img :src="avatar" @click="uploadHeadImg">
        <input
          type="file"
          accept="image/*"
          capture="camcorder"
          @change="handleFile"
          class="hiddenInput"
          style="display: none;"
        >
        <h2>李洋的管理后台</h2>
      </div>
      <div class="right">
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{userInfo.nickName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">退出登录</el-dropdown-item>
            <el-dropdown-item command="b">修改密码</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </header>
    <v-slider></v-slider>
    <div class="tags_box">
      <v-tags></v-tags>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import vSlider from "./slider";
import vTags from "./tags";
export default {
  data() {
    return {
      avatar: "http://localhost:3000/img",
      userInfo: ""
    };
  },
  components: {
    vSlider,
    vTags
  },
  methods: {
    handleCommand(command) {
      switch (command) {
        case "a":
          this.quit();
          break;
        case "b":
          this.$router.push({
            name: "userInfo"
          });
          break;
        default:
          break;
      }
    },
    // 退出登录
    quit() {
      let data = {};
      this.$getData("users/quit", data, "post", res => {
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.$router.push("login");
          sessionStorage.clear();
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    //获取用户信息
    getUserInfo() {
      let data = {
        userId: sessionStorage.getItem("userId")
      };
      this.$getData("users/index", data, "post", res => {
        //console.log(res);
        if (res.data.code == 1) {
          this.userInfo = res.data.data;
          this.avatar = "http://localhost:3000/img/" + this.userInfo.headSrc;
          //this.avatar = "http://120.77.220.216:3000/img/" + this.userInfo.headSrc;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
          this.$router.push("login");
        }
      });
    },
    uploadHeadImg() {
      //是获取文档中 class=”hiddenInput” 的元素。
      this.$el.querySelector(".hiddenInput").click();
    },
    handleFile(e) {
      let file = e.target.files[0];
      let form = new FormData();
      form.append("myfile", file);
      form.set("userId", sessionStorage.getItem("userId"));
      let data = form;
      // console.log(data);
      this.$getData("/users/changeheadSrc", data, "post", res => {
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.avatar = "http://localhost:3000/img/" + res.data.headSrc;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  },
  mounted: function() {
    this.getUserInfo();
  }
};
</script>

<style scoped="scoped">
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  background-color: rgba(0, 0, 0, 0.25);
}

header .left {
  display: flex;
  flex-direction: row;
}

header .left img {
  width: 60px;
  height: auto;
  padding: 10px;
}

header .left h2 {
  color: #f5f5f5;
  line-height: 80px;
}

header .right {
  margin-right: 300px;
}

header .right span {
  color: #f5f5f5;
  line-height: 80px;
  font-size: 20px;
}

.tags_box {
  margin-left: 220px;
  margin-top: 20px;
}
</style>