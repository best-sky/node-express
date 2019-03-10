<!--  -->
<template>
  <div class="warp">
    <el-form :model="formData" label-width="80px">
      <el-form-item label="商品名称">
        <el-input v-model="formData.shopName" placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品标题">
        <el-input v-model="formData.shopTitle" placeholder="商品标题"></el-input>
      </el-form-item>
      <el-form-item label="商品描述">
        <el-input v-model="formData.shopDescribe" placeholder="商品描述"></el-input>
      </el-form-item>
      <el-form-item label="商品分类">
        <el-select v-model="formData.shopClassify" placeholder="请选择商品分类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="活动时间">
        <el-col :span="11">
          <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-time-picker
            type="fixed-time"
            placeholder="选择时间"
            v-model="form.date2"
            style="width: 100%;"
          ></el-time-picker>
        </el-col>
      </el-form-item>-->
      <el-form-item label="是否上架">
        <el-switch v-model="formData.shopPutaway"></el-switch>
      </el-form-item>
      <el-form-item label="活动性质">
        <el-checkbox-group v-model="formData.shopProperty">
          <el-checkbox label="新品" name="shopProperty"></el-checkbox>
          <el-checkbox label="推荐" name="shopProperty"></el-checkbox>
          <el-checkbox label="热卖" name="shopProperty"></el-checkbox>
          <el-checkbox label="包邮" name="shopProperty"></el-checkbox>
          <el-checkbox label="不参与折扣" name="shopProperty"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="特殊资源">
        <el-radio-group v-model="form.resource">
          <el-radio label="线上品牌商赞助"></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="商品价格">
        <div class="Price">
          <el-input v-model="formData.shopPrice.old" placeholder="原价"></el-input>
          <el-input v-model="formData.shopPrice.new" placeholder="现价"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="商品库存">
        <el-input v-model="formData.shopInventory" placeholder="商品库存"></el-input>
      </el-form-item>
      <el-form-item label="商品主图">
        <div class="upload" @click="uploadImg">
          <i class="el-icon-upload" v-if="isShow"></i>
          <img :src="avatar" v-else>
          <input
            type="file"
            accept="image/*"
            capture="camcorder"
            @change="handleFile"
            class="hiddenInput"
            style="display: none;"
          >
        </div>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addShop">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        shopName: "", //商品名称
        shopTitle: "", //商品标题
        shopPrice: {
          old: "", //原价
          new: "" //现价
        }, //商品价格
        shopClassify: "", //商品分类
        shopDescribe: "", //商品描述
        shopInventory: 0, //商品库存
        shopPutaway: false, //是否上架
        shopProperty: [] //商品属性
      },
      postData: "",
      isShow: true,
      avatar: "",
      options: [
        {
          label: "蔬菜水果",
          value: 1
        },
        {
          label: "生鲜肉类",
          value: 2
        },
        {
          label: "粮油副食",
          value: 3
        },
        {
          label: "调味作料",
          value: 4
        },
        {
          label: "新鲜海产",
          value: 5
        },
        {
          label: "日用百货",
          value: 6
        },
        {
          label: "美味干货",
          value: 7
        }
      ]
    };
  },

  components: {},

  computed: {},

  mounted: function() {},

  methods: {
    uploadImg() {
      //是获取文档中 class=”hiddenInput” 的元素。
      this.$el.querySelector(".hiddenInput").click();
    },
    handleFile(e) {
      // console.log(e);
      let file = e.target.files[0];
      let form = new FormData();
      form.append("myfile", file);
      form.set("shopName", this.formData.shopName);
      form.set("shopTitle", this.formData.shopTitle);
      form.set("shopOldPrice", this.formData.shopPrice.old);
      form.set("shopNewPrice", this.formData.shopPrice.new);
      form.set("shopClassify", this.formData.shopClassify);
      form.set("shopDescribe", this.formData.shopDescribe);
      form.set("shopPutaway", this.formData.shopPutaway);
      form.set("shopProperty", this.formData.shopProperty);
      form.set("shopInventory", this.formData.shopInventory);
      this.postData = form;
      var reader = new FileReader();
      // 事件会在页面或图像加载完成后立即发生。
      reader.onload = data => {
        let res = data.target || data.srcElement;
        this.avatar = res.result;
        this.isShow = false;
      };
      reader.readAsDataURL(file);
    },
    addShop() {
      //添加商品
      if (this.avatar == "") {
        this.$message({
          message: "填写完整信息",
          type: "error"
        });
      } else {
        this.$getData("/shop/add", this.postData, "post", res => {
          console.log(res);
          if (res.data.code == 1) {
            this.$message({
              message: res.data.msg,
              type: "success"
            });
            this.$router.push("shoplist");
          } else {
            this.$message({
              message: res.data.msg,
              type: "error"
            });
          }
        });
      }
    }
  }
};
</script>
<style scoped>
.warp {
  margin-left: 250px;
  margin-top: 50px;
  width: 50%;
}
.Price {
  display: flex;
  flex-direction: row;
}
.upload {
  border: 1px solid gray;
  width: 80px;
  height: 80px;
  margin-left: 30px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.upload > i {
  font-size: 30px;
  margin: 0 auto;
  color: grey;
}
.upload > input {
  display: none;
}
.upload > img {
  width: 80px;
  height: 80px;
}
</style>