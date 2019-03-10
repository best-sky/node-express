<template>
  <div class="login_warp" ref="warp">
    <div class="login">
      <h2>忘记密码</h2>
      <div class="main" v-if="ispass">
        <p>账号:</p>
        <el-input
          v-model.trim="userName"
          placeholder="请输入账号(手机号)"
          prefix-icon="fa fa-user-o "
          type="text"
          clearable
        ></el-input>
        <p>验证码:</p>
        <div>
          <el-input
            v-model.trim="veri"
            placeholder="请输入验证码"
            prefix-icon="fa fa-lock"
            type="text"
            clearable
          ></el-input>
          <el-button type="info" :disabled="isdis" @click="getCode">{{btnVal}}</el-button>
        </div>
        <el-button type="primary" @click="affirmCode">前往下一步</el-button>
      </div>
      <div class="main" v-else>
        <p>新密码:</p>
        <el-input
          v-model.trim="newPass"
          placeholder="请输入账号(手机号)"
          prefix-icon="fa fa-lock"
          type="password"
          clearable
        ></el-input>
        <p>确认密码:</p>
        <el-input
          v-model.trim="nextPass"
          placeholder="请输入验证码"
          prefix-icon="fa fa-lock"
          type="password"
          clearable
        ></el-input>
        <el-button type="primary" @click="changeLoginPass">确认修改</el-button>
      </div>
      <div class="footer">
        <span @click="$router.push('login')">返回登录页</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "",
      veri: "", //验证码
      newPass: "", //新密码
      nextPass: "", //确认新密码
      ispass: true,
      isdis: false,
      btnVal: "获取验证码"
    };
  },
  mounted: function() {
    this.$setHeight();
  },
  methods: {
    getCode() {
      //获取验证码
      let data = {
        userName: this.userName
      };
      this.$getData("/users/getCode", data, "post", res => {
        //console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.isdis = true;
          this.btnVal = "验证码有效期为10分钟";
          setTimeout(() => {
            this.isdis = false;
          }, 600000);
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    affirmCode() {
      //确认验证码
      let data = {
        userName: this.userName,
        veri: this.veri
      };
      this.$getData("/users/affirmCode", data, "post", res => {
        //console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.veri = res.data.veri; //用作验证身份
          this.ispass = false;
        } else {
          this.$message({
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    changeLoginPass() {
      //修改密码
      let data = {
        userName: this.userName,
        newPass: this.newPass,
        nextPass: this.nextPass,
        veri: this.veri
      };
      this.$getData("/users/changeLoginPass", data, "post", res => {
        //	console.log(res);
        if (res.data.code == 1) {
          this.$message({
            message: res.data.msg,
            type: "success"
          });
          this.$router.push("login");
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

<style>
.login_warp {
  display: flex;
  justify-content: center;
}

.login {
  width: 400px;
  height: 500px;
  background-color: rgba(255, 255, 255, 0.4);
  margin-top: 150px;
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