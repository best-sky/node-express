import { Component, OnInit } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';

@Component({
  selector: 'app-shoplist',
  templateUrl: './shoplist.component.html',
  styleUrls: ['./shoplist.component.css']
})
export class ShoplistComponent implements OnInit {
  public formData: any = {
    shopName: "",
    shopClassify: ""
  };
  public Page: any = {
    lastPage: 1, //最大页
    pageSize: 2,//单页条数
    pagination: 1,//页码
    pageStart: 1 //跳转页
  };
  public userId = localStorage.getItem("userId");
  public tableDatas: any = []; //表格数据
  public options: any = [
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
  ];
  constructor(public router: Router, public axios: AxiosService, public message: ElMessageService) { }

  ngOnInit() {
    this.getShopData();
    // console.log(this.asideTo)
  }
  getShopData() {
    let data: object = {
      userId: this.userId,
      pageSize: this.Page.pageSize,
      pagination: this.Page.pagination,
      shopName: this.formData.shopName,
      shopClassify: Number(this.formData.shopClassify)
    };
    let result = this.axios.$postData("shop/shoplist", data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        this.tableDatas = res.data.shoplist;
        this.Page.lastPage = res.data.lastPage;
        this.Page.pagination = res.data.pagination;
        this.message['success'](res.msg);
      } else {
        this.tableDatas = res.shoplist;
        this.Page.lastPage = res.data.lastPage;
        this.Page.pagination = res.data.pagination;
        this.message['error'](res.msg);
      }
    })
  };
  addShop() {
    // get路由传参
    // this.router.navigate(['header/shop/addshop'], { queryParams: { id: 2 } });
    this.router.navigate(['header/shop/addshop']);
  }
}
