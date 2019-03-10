<template>
  <div class="login_warp" ref="warp">
    <div class="login">
      <h2>享见康设备管理后台</h2>
      <div class="main">
        <p>账号:</p>
        <el-input
          v-model.trim="userName"
          placeholder="请输入账号(手机号)"
          prefix-icon="fa fa-user-o "
          type="text"
          clearable
        ></el-input>
        <p>密码:</p>
        <el-input
          v-model.trim="loginPass"
          placeholder="请输入密码"
          prefix-icon="fa fa-lock "
          type="password"
          clearable
        ></el-input>
        <el-button type="primary" @click="login">登录</el-button>
      </div>
      <div class="footer">
        <span @click="$router.push('registered')">注册</span>
        <span @click="$router.push('forgetPass')">忘记密码</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      loginPass: ""
    };
  },
  mounted: function() {
    this.$setHeight();
  },
  methods: {
    login() {
      //登录
      let data = {
        userName: this.userName,
        loginPass: this.loginPass
      };
      this.$getData("users/login", data, "post", res => {
        //console.log(res);
        if (res.data.code == 1) {
          this.$router.push("index");
          sessionStorage.setItem("userId", res.data.userId);
          sessionStorage.setItem("power", res.data.power);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    }
  }
};
</script>

<style scoped="scoped">
.login_warp {
  display: flex;
  justify-content: center;
}

.login {
  width: 400px;
  height: 400px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-top: 200px;
  text-align: center;
  padding-top: 20px;
  border-radius: 10px;
}

.login h2 {
  margin: 0;
  font-weight: 100;
}

.login .main {
  width: 70%;
  margin: 0 auto;
  text-align: left;
}

.login .main p:nth-of-type(1) {
  margin-top: 40px;
}

.login .footer {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  color: grey;
  margin-top: 1rem;
}

.el-button {
  width: 100%;
  margin-top: 40px;
}
</style>