import { Component, OnInit } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';



@Component({
  selector: 'app-forgetpass',
  templateUrl: './forgetpass.component.html',
  styleUrls: ['./forgetpass.component.css']
})
export class ForgetpassComponent implements OnInit {
  public userName: string = '';
  public newPass: string = '';
  public nextPass: string = '';
  public btnVal: string = '获取验证码';
  public veri: string = '';
  public ispass: boolean = true;
  public isdis: boolean = false;
  constructor(public router: Router, public axios: AxiosService, private message: ElMessageService) { }

  ngOnInit() {
  }
  // 获取验证码
  getCode() {
    let data: Object = {
      userName: this.userName
    };
    let result: any = this.axios.$postData('/users/getCode', data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        this.message['success'](res.msg);
        this.isdis = true;
        setTimeout(() => {
          this.isdis = false;
        }, 60000);
      } else {
        this.message['error'](res.msg);
      }
    });
  }
  // 确认验证码

  affirmCode() {
    let data: Object = {
      userName: this.userName,
      veri: this.veri
    };
    let result: any = this.axios.$postData('users/affirmCode', data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        this.message['success'](res.msg);
        this.ispass = false;
      } else {
        this.message['error'](res.msg);
      }
    });
  }
  changeLoginPass() {
    let data: Object = {
      userName: this.userName,
      newPass: this.newPass,
      nextPass: this.nextPass,
      veri: this.veri
    };
    let result: any = this.axios.$postData('users/changeLoginPass', data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        this.message['success'](res.msg);
        setTimeout(() => {
          this.router.navigate(['login']);
        });
      } else {
        this.message['error'](res.msg);
      }
    });
  }

}
