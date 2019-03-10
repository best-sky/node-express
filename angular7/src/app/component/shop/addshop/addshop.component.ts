import { Component, OnInit, ViewChild } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';

@Component({
  selector: 'app-addshop',
  templateUrl: './addshop.component.html',
  styleUrls: ['./addshop.component.css']
})
export class AddshopComponent implements OnInit {
  @ViewChild('hiddenInput') hiddenInput: any;
  public formData: any = {
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
    shopProperty: ['新品'] //商品属性
  };
  public postData: any = "";
  public isShow: boolean = true;
  public avatar: string = "";
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
      label: "美味干货",
      value: 7
    }
  ];


  constructor(public router: Router, public axios: AxiosService, public message: ElMessageService, private route: ActivatedRoute) { }

  ngOnInit() {
    // 接受路由传递过来的参数
    // console.log(this.route.snapshot.queryParams["id"])
    //  console.log(this.routerinfo.snapshot.params['id'])
  }
  uploadImg() {
    //是获取文档中 class=”hiddenInput” 的元素。
    // console.log(this.hiddenInput)
    this.hiddenInput.nativeElement.click();
  }
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
      let imgSrc: any = data.target || data.srcElement;
      this.avatar = imgSrc.result;
      this.isShow = false;
    };
    reader.readAsDataURL(file);
  };
  addShop(): void {
    //添加商品
    if (this.avatar == "") {
      this.message['error']('请填写完整信息');
    } else {
      let result: any = this.axios.$postData('/shop/add', this.postData);
      result.subscribe((res: any) => {
        // console.log(res);
        if (res.code == 1) {
          this.message['error'](res.msg);
          this.router.navigate(['header/shop/addShop']);
        } else {
          this.message['error'](res.msg)
        }
      });
    }
  };
}
