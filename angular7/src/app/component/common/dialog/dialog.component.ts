import { Component, OnInit, Input } from '@angular/core';
// 导入请求数据的服务
import { AxiosService } from '../../../service/axios.service';
// 导入兄弟组件通信服务
import { BortherService } from '../../../service/borther.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';
// 导入强制刷新视图服务



@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  @Input() getUserList: any;
  @Input() Page: any;
  // 用户id
  public userId: any = localStorage.getItem('userId');
  public userInfo: object = {};
  public isShow: number = 0;
  public fromData: any = {
    userName: '',
    nickName: '',
    loginPass: '',
    email: '',
    sex: '',
    power: ''
  };
  constructor(public axios: AxiosService, public message: ElMessageService, public borther: BortherService) { }

  ngOnInit() {
    this.getUserList();
    // 判断兄弟组件数据变化
    this.borther.eventEmit.subscribe((value: any) => {
      // console.log(value)
      if (value.msg == 2) {
        // 这里就可以操作数据
        this.fromData = value;
        this.open(value.msg);
      }
    });
  }
  // 关闭弹窗
  colse(e) {
    // console.log(e.target.className);
    // 从这里可以看出ng-if指令会帮dom绑定类名
    if (e.target.className == 'alert_warp ng-star-inserted') {
      this.isShow = 0;
    }
  }
  // 开启弹窗
  open(id) {
    id == 1 ? this.fromData = {} : '';
    let result: any = this.borther.openAlert(id);
    result.subscribe((res: any) => {
      this.isShow = res;
      // console.log(this.isShow);
    });
  }
  // 添加管理员
  addUser() {
    let data: object = {
      userId: localStorage.getItem('userId'),
      userName: this.fromData.userName,
      sex: this.fromData.sex,
      nickName: this.fromData.nickName,
      loginPass: this.fromData.loginPass,
      email: this.fromData.email,
      power: this.fromData.power
    };
    // console.log(data);
    let result: any = this.axios.$postData('/index/userlist/add', data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        this.getUserList();
        this.message['success'](res.msg);
        this.fromData = {};
        this.isShow = 0;
      } else {
        this.message['error'](res.msg);
      }
    });
  }
  // 修改管理员信息
  updateUser() { //通过添加管理员
    let data: object = {
      userId: localStorage.getItem('userId'),
      user_id: this.fromData.userId,
      nickName: this.fromData.nickName,
      sex: this.fromData.sex,
    };
    let result = this.axios.$postData('/index/userlist/change', data);
    result.subscribe((res: any) => {
      if (res.code == 1) {
        // 子组件在调用父组件方法时，子组件必须具有该父组件方法所需要的所有参数参数
        this.getUserList();
        this.message['success'](res.msg);
        this.fromData = {};
        this.isShow = 0;
      } else {
        this.message['error'](res.msg);
      }
    });
  }
}
