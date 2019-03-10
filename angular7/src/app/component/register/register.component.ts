import { Component, OnInit } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public userName: String = '';
  public loginPass: string = '';
  public confirmPass: string = '';
  public email: string = '';
  constructor(public router: Router, public axios: AxiosService, private message: ElMessageService) { }

  ngOnInit() {
  }
  register() {
    let data: object = {
      userName: this.userName,
      loginPass: this.loginPass,
      confirmPass: this.confirmPass,
      email: this.email
    };
    let result: any = this.axios.$postData('users/registered', data);
    result.subscribe((res: any) => {
      // console.log(res);
      if (res.code == 1) {
        this.message['success'](res.msg);
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 3000);
      } else {
        this.message['error'](res.msg);
      }
    });
  }
}
