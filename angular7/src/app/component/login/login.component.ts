import { Component, OnInit } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public userName: string = '';
  public loginPass: string = '';

  constructor(public router: Router, public axios: AxiosService, private message: ElMessageService) { }

  ngOnInit() {
  }
  //登录
  login() {
    let data: Object = {
      userName: this.userName,
      loginPass: this.loginPass
    };
    let resul: any = this.axios.$postData('users/login', data);
    resul.subscribe((res: any) => {
      // console.log(res.code);
      if (res.code == 1) {
        this.message['success'](res.msg);
        this.router.navigate(['header']);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('power', res.power);
      } else {
        this.message['error'](res.msg);
      }
    });
    this.message['success']("登录成功");
    this.router.navigate(['header']);
    localStorage.setItem('userId',"heqi");
    localStorage.setItem('power', "1234");
  }
}
