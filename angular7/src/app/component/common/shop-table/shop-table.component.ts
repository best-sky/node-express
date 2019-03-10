import { Component, OnInit, Input } from '@angular/core';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';
// 导入请求数据的服务
import { AxiosService } from '../../../service/axios.service';
@Component({
  selector: 'app-shop-table',
  templateUrl: './shop-table.component.html',
  styleUrls: ['./shop-table.component.css']
})
export class ShopTableComponent implements OnInit {
  @Input() tableDatas: any;
  @Input() Page: any;
  @Input() formData: any;
  @Input() getShopData: any;
  public userId: any = localStorage.getItem("userId");
  public power: any = localStorage.getItem('power');
  public theader: any = [
    {
      value: "商品主图",
      width: "15%"
    },
    {
      value: "商品名称",
      width: "15%"
    },
    {
      value: "商品描述",
      width: "15%"
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
      width: "5%"
    }
  ];
  constructor(public message: ElMessageService, public axios: AxiosService) { }

  ngOnInit() {

  }
  // 下一页
  next() {
    if (this.Page.pagination == this.Page.lastPage) {
      this.message['error']('超过最大页数');
    } else {
      this.Page.pagination++;
      this.Page.pageStart = this.Page.pagination;
      this.getShopData();
    }
  }
  // 上一页
  prev() {
    if (this.Page.pagination == 1) {
      this.message['error']('已经是第一页了');
    } else {
      this.Page.pagination--;
      this.Page.pageStart = this.Page.pagination;
      this.getShopData();
    }
  }
  // 最后一页
  last() {
    if (this.Page.pagination == this.Page.lastPage) {
      this.message['error']('超过最大页数');
    } else {
      this.Page.pagination = this.Page.lastPage;
      this.Page.pageStart = this.Page.pagination;
      this.getShopData();
    }
  }
  // 第一页
  first() {
    if (this.Page.pagination == 1) {
      this.message['error']('已经是第一页了');
    } else {
      this.Page.pagination = 1;
      this.Page.pageStart = this.Page.pagination;
      this.getShopData();
    }
  }
  // 跳转页码
  skip() {
    if (this.Page.pageStart > this.Page.lastPage || this.Page.pageStart < 1) {
      this.message['error']('不在允许范围');
      this.Page.pageStart = this.Page.pagination;
    } else {
      this.Page.pagination = this.Page.pageStart;
      this.getShopData();
    }
  }
  // 删除用户

  delUser(shopId) {
    if (window.confirm('确定执行此操作?')) {
      let data = {
        shopId: shopId,
        userId: this.userId
      };
      // console.log(data);
      let result = this.axios.$postData('/shop/shoplist/delete', data);
      result.subscribe((res: any) => {
        if (res.code == 1) {
          this.Page.pagination = 1;
          this.getShopData();
        } else {
          this.message['error'](res.msg);
        }
      });
    }
  }
}
