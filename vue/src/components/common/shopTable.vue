<template>
  <div class="order_warp" ref="warp">
    <div class="form">
      <div>
        <el-input placeholder="按商品名称查询" v-model="form.shopName" style="width:200px;" clearable></el-input>
        <el-select placeholder="按商品类型查询" clearable v-model="form.shopClassify">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <button class="find" @click="getShopList">查询</button>
        <button class="add" @click="$router.push('addshop')">添加商品</button>
      </div>
      <table class="tableList_table table-hover table-bordered">
        <thead>
          <tr>
            <th
              v-for="(header,index) in theader"
              :width="header.width"
              :key="index"
            >{{header.value}}</th>
          </tr>
        </thead>
        <tbody>
          <!--表格类容-->
          <tr v-for="(tabledata,index) in tableDatas" :key="index">
            <td>
              <img
                :src="'http://120.77.220.216:3000/shop/'+tabledata.shopImg"
                style="width:40px;height:40px;"
              >
            </td>
            <td>{{tabledata.shopName}}</td>
            <td>{{tabledata.shopName}}</td>
            <td>{{tabledata.shopPrice.old}}</td>
            <td>{{tabledata.shopInventory}}</td>
            <td>{{tabledata.shopPutaway=="true"?'上架':"下架"}}</td>
            <td>{{tabledata.shopClassify|shopKind}}</td>
            <td>{{tabledata.shopProperty}}</td>
            <td>
              <!-- <button
                class="edit"
                v-if="power==1"
                @click="alertDialog(1,tabledata)"
              >编辑</button>
              <button class="cold" v-if="power==1" @click="frost(tabledata.shopId)">冻结</button> -->
              <button
                class="del"
                v-if="power==1||tabledata.userId==userId"
                @click="deletes(tabledata.shopId)"
              >删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <tfoot>
        <tr>
          <td v-bind:colspan="theader.length" class="paging_class">
            <div>
              <ul class="pageTheLi">
                <li>
                  <span>共{{lastPage}}页</span>
                </li>
                <li @click="first">
                  <a>
                    <img src="../../assets/first.png">
                  </a>
                </li>
                <li @click="prev">
                  <a>
                    <img src="../../assets/prev.png">
                  </a>
                </li>
                <li>
                  <span>{{pagination}}</span>
                </li>
                <li @click="next">
                  <a>
                    <img src="../../assets/next.png">
                  </a>
                </li>
                <li @click="last">
                  <a>
                    <img src="../../assets/last.png">
                  </a>
                </li>
                <li>
                  <span>
                    跳到
                    <input type="text" v-model.number="pageStart" @blur="skip">页
                  </span>
                </li>
              </ul>
            </div>
          </td>
        </tr>
      </tfoot>
    </div>
    <v-dialog ref="dialog"></v-dialog>
  </div>
</template>

<script>
import vDialog from "./dialog";
export default {
  data() {
    return {
      userId: sessionStorage.getItem("userId"),
      power: sessionStorage.getItem("power"),
      form: {
        shopName: "",
        shopClassify: ""
      },
      lastPage: 1, //最大页
      tableDatas: [], //表格数据
      pageSize: 2, //单页条数
      pagination: 1, //页码
      pageStart: 1, //跳转页
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
          label: "美味年货",
          value: 7
        }
      ],
      lastPage: 1, //最大页
      tableDatas: [], //表格数据
      pageSize: 2, //单页条数
      pagination: 1, //页码
      pageStart: 1, //跳转页
      theader: [
        {
          value: "商品主图",
          width: "15%"
        },
        {
          value: "商品名称",
          width: "10%"
        },
        {
          value: "商品描述",
          width: "10%"
        },
        {
          value: "价格",
          width: "10%"
        },
        {
          value: "库存",
          width: "10%"
        },
        {
          value: "状态",
          width: "10%"
        },
        {
          value: "商品分类",
          width: "10%"
        },
        {
          value: "商品属性",
          width: "10%"
        },
        {
          value: "操作",
          width: "20%"
        }
      ]
    };
  },
  methods: {
    getShopList() {
      let data = {
        userId: this.userId,
        pageSize: this.pageSize,
        pagination: this.pagination,
        shopName: this.form.shopName,
        shopClassify: this.form.shopClassify
      };
      this.$getData("/shop/shoplist", data, "post", res => {
        if (res.data.code == 1) {
          this.tableDatas = res.data.data.shoplist;
          this.lastPage = res.data.data.lastPage;
        } else {
          this.$message({
            showClose: true,
            message: res.data.msg,
            type: "error"
          });
          this.tableDatas = res.data.data.shoplist;
          this.lastPage = res.data.data.lastPage;
        }
      });
    },
    next() {
      //下一页
      if (this.pagination == this.lastPage) {
        this.$message({
          showClose: true,
          message: "超过最大页数",
          type: "error"
        });
      } else {
        this.pagination++;
        this.pageStart = this.pagination;
        this.getShopList();
      }
    },
    prev() {
      //上一页
      if (this.pagination == 1) {
        this.$message({
          showClose: true,
          message: "已经是第一页了",
          type: "error"
        });
      } else {
        this.pagination--;
        this.pageStart = this.pagination;
        this.getShopList();
      }
    },
    last() {
      //最后一页
      if (this.pagination == this.lastPage) {
        this.$message({
          showClose: true,
          message: "超过最大页数",
          type: "error"
        });
      } else {
        this.pagination = this.lastPage;
        this.pageStart = this.pagination;
        this.getShopList();
      }
    },
    first() {
      //第一页
      if (this.pagination == 1) {
        this.$message({
          showClose: true,
          message: "已经是第一页了",
          type: "error"
        });
      } else {
        this.pagination = 1;
        this.pageStart = this.pagination;
        this.getShopList();
      }
    },
    skip() {
      //跳转页码
      if (this.pageStart > this.lastPage || this.pageStart < 1) {
        this.$message({
          showClose: true,
          message: "不在允许范围",
          type: "error"
        });
        this.pageStart = this.pagination;
      } else {
        this.pagination = this.pageStart;
        this.getShopList();
      }
    },
    deletes(shopId) {
      //用户删除
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          shopId: shopId,
          userId: this.userId
        };
        this.$getData("/shop/shoplist/delete", data, "post", res => {
          if (res.data.code == 1) {
            this.pagination = 1;
            this.getShopList();
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    frost(userId) {
      //账号冻结
      this.$confirm("此操作将导致该用户无法登陆, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let data = {
          user_id: userId,
          userId: this.userId
        };
        this.$getData("/index/userlist/frost", data, res => {
          if (res.data.code == 1) {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            this.pagination = 1;
            this.getShopList();
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
      });
    },
    alertDialog(val, data) {
      //打开弹框
      switch (val) {
        case 0: //显示添加管理员
          this.$refs.dialog.dialogFormVisible = true;
          break;
        case 1: //显示修改用户名
          this.$refs.dialog.dialogFormVisible1 = true;
          this.$refs.dialog.tableData = data; //获取索引的用户信息
          this.$refs.dialog.form.nickName = data.nickName; //获取索引的用户信息
          this.$refs.dialog.form.sex = data.sex == 1 ? "男" : "女"; //获取索引的用户信息
          break;
        default:
          break;
      }
    }
  },
  mounted: function() {
    this.getShopList();
  },
  filters: {
    shopKind(val) {
      switch (val) {
        case "1":
          return "蔬菜水果";
          break;
        case "2":
          return "生鲜肉类";
          break;
        case "3":
          return "粮油副食";
          break;
        case "4":
          return "调味作料";
          break;
        case "5":
          return "新鲜海产";
          break;
        case "6":
          return "日用百货";
          break;
        case "7":
          return "美味干货";
          break;
        default:
          break;
      }
    }
  },
  components: {
    vDialog
  }
};
</script>
<style scoped="scoped">
button {
  border: 0;
  outline: 0;
  color: #fff;
  height: 25px;
  border-radius: 3px;
}

.find,
.reset {
  background-color: rgb(64, 158, 255);
  height: 40px;
  width: 100px;
}

.add {
  background-color: rgb(81, 195, 50);
  height: 40px;
  width: 100px;
}

.order_warp {
  display: flex;
  flex-direction: column;
  min-width: 1280px;
  margin-left: 220px;
}

.form {
  width: 95%;
  margin: 0 auto;
  margin-top: 30px;
}

.clickBg {
  background-color: #f9cc9d !important;
}

.tableList_table {
  width: 100%;
  background-color: #ffffff;
  border-collapse: collapse;
  border: 0;
  margin-top: 50px;
}

.tableList_table thead tr {
  color: #909399;
  height: 34px;
  font-size: 14px;
  text-align: left;
}

.tableList_table tbody tr td {
  padding-left: 10px;
  height: 40px;
  font-size: 14px;
}

.tableList_table thead tr th {
  text-align: left;
  padding-left: 10px;
}

.tableList_table tbody tr:hover {
  /*鼠标移入时的背景颜色*/
  background-color: palegoldenrod;
}

.tableList_table tbody .del {
  background-color: orangered;
}

.tableList_table tbody .edit {
  background-color: rgb(64, 158, 255);
}
.tableList_table tbody .cold {
  background-color: rgb(235, 158, 5);
}

.tableList_table tbody button:hover {
  cursor: pointer;
}

#tableList_table_tbody_tr_click {
  border: 1px solid #c0c0c0;
}

.tableList_table tfoot {
  width: 100%;
}

.tableList_table tfoot tr {
  width: 100%;
  height: 40px;
  border: 1px solid #c0c0c0;
}

.tableList_table tfoot tr td {
  height: 30px;
}

.tableList_table tfoot tr td li {
  border: none;
}

.pageTheLi {
  list-style: none;
  margin: 0;
}

.pageTheLi li a img {
  margin-top: 6px;
}

.pageTheLi li span {
  font-size: 14px;
  display: inline-block;
  margin-top: 10px;
  text-align: center;
}

.pageTheLi li span input {
  width: 50px;
  outline: none;
  text-align: center;
  height: 20px;
  border: 1px solid gainsboro;
}

.pageTheLi li {
  float: left;
  margin-left: 30px;
}
</style>