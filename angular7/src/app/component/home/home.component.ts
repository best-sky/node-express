import { Component, OnInit, ViewChild } from '@angular/core';
// 导入路由模块
import { Router, NavigationExtras } from '@angular/router';
// 导入请求数据的服务
import { AxiosService } from '../../service/axios.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // 获取子组件实例
  @ViewChild('mydialog') mydialog: any;
  public tableDatas: any = [];
  // 用户id
  public userId: any = localStorage.getItem('userId');
  // 权限
  public power: any = localStorage.getItem('power');
  // 搜索条件
  public formData: any = {
    userName: '',
    power: ''
  };

  // 最大页
  public Page: any = {
    lastPage: 1,
    pageSize: 2,
    pagination: 1,
    pageStart: 1
  };

  constructor(public router: Router, public axios: AxiosService, private message: ElMessageService) { }

  ngOnInit() {
    this.getUserList();
    // console.log(this.mydialog);
  }
  // 获取用户列表
  getUserList() {
    let data: object = {
      userId: this.userId,
      pageSize: this.Page.pageSize,
      pagination: this.Page.pagination
    };
    let result: any = this.axios.$postData('/index/userlist', data);
    result.subscribe((res: any) => {
      // console.log(res);
      this.tableDatas = res.data.userlist;
      this.Page.lastPage = res.data.lastPage;
      // console.log(this.tableDatas, this.Page.lastPage);
    });
  }
  // 查询数据
  find() {
    let data: object = {
      userName: this.formData.userName,
      power: Number(this.formData.power),
      userId: this.userId,
      pageSize: this.Page.pageSize,
      pagination: this.Page.pagination
    };
     console.log(data);
    let result: any = this.axios.$postData('/index/userlist/find', data);
    result.subscribe((res: any) => {
      // console.log(res);
      if (res.code == 1) {
        this.message['success'](res.msg);
        this.tableDatas = res.data.userlist;
        this.Page.lastPage = res.data.lastPage;
        this.Page.pagination = res.data.pagination;
        this.formData.userName = '';
        this.formData.power = '';
      } else {
        this.message['error'](res.msg);
        this.tableDatas = [];
        this.formData.userName = '';
        this.formData.power = '';
      }
    });
  }
}
