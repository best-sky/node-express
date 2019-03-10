<template>
  <div class="nav">
    <el-menu
      class="el-menu-vertical-demo"
      :default-active="$route.path"
      background-color="rgba(0,0,0,0)"
      text-color="#fff"
      active-text-color="#00a0e9"
      :router="true"
    >
      <el-menu-item index="/index">
        <i class="el-icon-menu"></i>
        <span slot="title">数据统计</span>
      </el-menu-item>
      <el-menu-item index="/userslist">
        <i class="el-icon-document"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
      <el-submenu index="/shoplist">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/shoplist">商品列表</el-menu-item>
          <el-menu-item index="/addshop">添加商品</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/chat">
        <i class="el-icon-setting"></i>
        <span slot="title">在线反馈</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          index: this.$route.name,
          title: this.$route.meta.title
        }
      ]
    };
  },
  mounted: function() {
    //console.log(this.items)
  }
};
</script>

<style scoped="scoped">
.nav {
  width: 200px;
  height: 1200px;
  background-color: rgba(0, 0, 0, 0.25);
  position: absolute;
  top: 80px;
  left: 0;
  z-index: 999;
}

i {
  color: #fff;
}
</style>