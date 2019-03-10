<template>
  <div>
    <el-dialog title="添加管理员" :visible.sync="dialogFormVisible" width="25%" v-if="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名">
          <el-input v-model="form.userName"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="登陆密码">
          <el-input v-model="form.loginPass"></el-input>
        </el-form-item>
        <el-form-item label="安全邮箱">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请添加系统权限">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限级别">
          <el-select v-model="form.power" placeholder="请添加系统权限">
            <el-option label="超级管理员" value="1"></el-option>
            <el-option label="普通管理员" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <button class="cancel" @click="dialogFormVisible = false">取消</button>
      <button class="reset" @click="addUser">确定</button>
    </el-dialog>
    <el-dialog
      title="编辑用户信息"
      :visible.sync="dialogFormVisible1"
      width="25%"
      v-if="dialogFormVisible1"
    >
      <el-form :model="form">
        <el-form-item label="用户名">
          <span>{{tableData.userName}}</span>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="form.sex" placeholder="请添加系统权限">
            <el-option label="男" value="1"></el-option>
            <el-option label="女" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="安全邮箱">
          <span>{{tableData.email}}</span>
        </el-form-item>
        <el-form-item label="权限级别">
          <span>{{tableData.power==1?"超级管理员":'普通管理员'}}</span>
        </el-form-item>
      </el-form>
      <button class="cancel" @click="dialogFormVisible1 = false">取消</button>
      <button class="reset" @click="updateUser">确定</button>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: null,
      dialogFormVisible: false,
      dialogFormVisible1: false,
      form: {
        userName: "",
        nickName: "",
        loginPass: "",
        sex: "",
        email: "",
        power: ""
      }
    };
  },
  methods: {
    addUser() {
      //通过添加管理员
      let data = {
        userId: sessionStorage.getItem("userId"),
        userName: this.form.userName,
        sex: this.form.sex,
        nickName: this.form.nickName,
        loginPass: this.form.loginPass,
        email: this.form.email,
        power: this.form.power
      };
      this.$getData("/index/userlist/add", data, "post", res => {
        //					console.log(res);
        if (res.data.code == 1) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success"
          });
          this.$parent.getUserList();
          this.dialogFormVisible = false;
          this.form = {};
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
        }
      });
    },
    updateUser() {
      //通过添加管理员
      let data = {
        userId: sessionStorage.getItem("userId"),
        user_id: this.tableData.userId,
        nickName: this.form.nickName,
        sex: this.form.sex
      };
      this.$getData("/index/userlist/change", data, "post", res => {
        //					console.log(res);
        if (res.data.code == 1) {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "success"
          });
          //调取父组件方法刷新列表
          this.form = {};
          this.dialogFormVisible1 = false;
          this.$parent.getUserList();
        } else {
          this.$message({
            showClose: true,
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
button {
  border: 0;
  outline: 0;
  color: #fff;
  height: 40px;
  border-radius: 3px;
}

.reset {
  background-color: rgb(64, 158, 255);
  height: 40px;
  width: 100px;
}

.cancel {
  background-color: gray;
  height: 40px;
  width: 100px;
}
</style>