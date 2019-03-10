import { Component, OnInit, ViewChild } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @ViewChild('hiddenInput') hiddenInput: any;
  public navIndex: any = '1';
  public userInfo: any = '';
  public asideTo: any = this.router.config[0].children;
  public avatar: any = 'http://localhost:3000/img';
  constructor(public router: Router, public axios: AxiosService, private message: ElMessageService) { }

  ngOnInit() {
    this.getUserInfo();
    // console.log(this.asideTo);
    //  阻止页面刷新的bug
    for (let index = 0; index < this.asideTo.length; index++) {
      // console.log(this.router.url.slice(13, 21));
      // console.log(this.asideTo[index].path);
      if (this.router.url.slice(8, 20) == this.asideTo[index].path) {
        this.navIndex = index.toString();
      } else if (this.router.url.slice(8, 12) == this.asideTo[index].path) {
        this.navIndex = index.toString();
      };
    }
  }
  // 获取账号信息
  getUserInfo() {
    let data: object = {
      userId: localStorage.getItem('userId')
    };
    let result: any = this.axios.$postData('users/index', data);
    result.subscribe((res: any) => {
      // console.log(res);
      if (res.code == 1) {
        this.userInfo = res.data;
        this.avatar = 'http://localhost:3000/img/' + this.userInfo.headSrc;
      } else {
        this.message['error'](res.msg);
      }
    });
  }
  // 退出登录
  quit() {
    let data: object = {};
    let result: any = this.axios.$postData('users/quit', data);
    result.subscribe((res: any) => {
      // console.log(res);
      if (res.code == 1) {
        this.router.navigate(['login']);
        this.message['success'](res.msg);
      }
    });
  }
  uploadHeadImg() {
    // 打开文件选择框
    // let hiddenInput: any = document.getElementsByClassName('hiddenInput')[0];
    // console.log(this.hiddenInput);
    this.hiddenInput.nativeElement.click();
  }
  handleFile(e) {
    let file: any = e.target.files[0];
    let form: any = new FormData();
    form.append('myfile', file);
    form.set('userId', localStorage.getItem('userId'));
    let data: any = form;
    let result: any = this.axios.$postData('users/changeheadSrc', data);
    result.subscribe((res: any) => {
      //  console.log(res);
      if (res.code == 1) {
        this.message['success'](res.msg);
        this.avatar = 'http://localhost:3000/img/' + res.headSrc;
      } else {
        this.message['error'](res.msg);
      }
    });

  }
  handle(index: string): void {
    switch (index) {
      case '0':
        this.router.navigate(['header/weilcome']);
        break;
      case '1':
        this.router.navigate(['header/home']);
        break;
      case '2':
        this.router.navigate(['header/shop']);
        break;
      case '3':
        this.router.navigate(['header/setting']);
        break;
      case '9':
        this.quit();
        break;
      default:
        break;
    }
  }
}
