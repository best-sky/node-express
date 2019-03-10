import { Component, OnInit } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  public navIndex: string = '1';
  public asideTo: any = this.router.config[0].children[2].children;
  constructor(public router: Router, public axios: AxiosService, public message: ElMessageService) {

  }

  ngOnInit() {}
  //检测数值改变的生命狗子
  ngDoCheck() {
    for (let index = 0; index < this.asideTo.length; index++) {
      if (this.router.url.slice(13, 21) == this.asideTo[index].path) {
        this.navIndex = String(index + 1);
        // console.log(this.navIndex);
      }
    }
  }


  handle(index: string): void {
    switch (index) {
      case '1':
        this.router.navigate(['header/shop/shoplist']);
        break;
      case '2':
        this.router.navigate(['header/shop/addshop']);
        break;
      default:
        break;
    }
  }
}
