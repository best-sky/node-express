import { Component, OnInit, Input } from '@angular/core';
// 导入请求数据的服务
import { AxiosService } from '../../../service/axios.service';
// 导入兄弟组件通信服务
import { BortherService } from '../../../service/borther.service';
// 导入element消息提示服务
import { ElMessageService } from 'element-angular';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  @Input() tableDatas: any;
  @Input() Page: any;
  // 获取父组件方法
  @Input() getUserList: any;
  // 用户id
  public userId: any = localStorage.getItem('userId');
  // 权限
  public power: any = localStorage.getItem('power');
  public theader: any = [{
    value: '注册时间',
    width: '15%',
  },
  {
    value: '用户名',
    width: '15%',
  },
  {
    value: '昵称',
    width: '15%',
  },
  {
    value: '性别',
    width: '15%',
  },
  {
    value: '管理权限',
    width: '10%',
  },
  {
    value: '安全邮箱',
    width: '15%',
  },
  {
    value: '状态',
    width: '5%',
  },
  {
    value: '操作',
    width: '10%',
  }];
  constructor(public axios: AxiosService, private message: ElMessageService, public borther: BortherService) { }

  ngOnInit() {
    // console.log(this.power, this.userId);
    // console.log(this.Page);
  }
  emitFun(item) {
    // 如果组件中，修改了某些数据，该数据在其他组件中有关联，那么就可以发射一个字符串过去
    // 对方接收到这个字符串比对一下，刷新数据。
    item.msg = 2;
    this.borther.eventEmit.emit(item);
  }
  // 下一页
  next() {
    if (this.Page.pagination == this.Page.lastPage) {
      this.message['error']('超过最大页数');
    } else {
      this.Page.pagination++;
      this.Page.pageStart = this.Page.pagination;
      this.getUserList();
    }
  }
  // 上一页
  prev() {
    if (this.Page.pagination == 1) {
      this.message['error']('已经是第一页了');
    } else {
      this.Page.pagination--;
      this.Page.pageStart = this.Page.pagination;
      this.getUserList();
    }
  }
  // 最后一页
  last() {
    if (this.Page.pagination == this.Page.lastPage) {
      this.message['error']('超过最大页数');
    } else {
      this.Page.pagination = this.Page.lastPage;
      this.Page.pageStart = this.Page.pagination;
      this.getUserList();
    }
  }
  // 第一页
  first() {
    if (this.Page.pagination == 1) {
      this.message['error']('已经是第一页了');
    } else {
      this.Page.pagination = 1;
      this.Page.pageStart = this.Page.pagination;
      this.getUserList();
    }
  }
  // 跳转页码
  skip() {
    if (this.Page.pageStart > this.Page.lastPage || this.Page.pageStart < 1) {
      this.message['error']('不在允许范围');
      this.Page.pageStart = this.Page.pagination;
    } else {
      this.Page.pagination = this.Page.pageStart;
      this.getUserList();
    }
  }
  // 删除用户

  delUser(userId) {
    if (window.confirm('此操作将导致该用户无法登陆, 是否继续?')) {
      let data = {
        user_id: userId,
        userId: this.userId
      };
      let result = this.axios.$postData('/index/userlist/delete', data);
      result.subscribe((res: any) => {
        if (res.code == 1) {
          this.message['success'](res.msg);
          this.Page.pagination = 1;
          this.getUserList();
        } else {
          this.message['error'](res.msg);
        }
      });
    }
  }
  // 账号冻结
  frost(userId) {
    if (window.confirm('此操作将导致该用户无法登陆, 是否继续?')) {
      let data = {
        user_id: userId,
        userId: this.userId
      };
      let result = this.axios.$postData('/index/userlist/frost', data);
      result.subscribe((res: any) => {
        if (res.code == 1) {
          this.message['success'](res.msg);
          this.Page.pagination = 1;
          this.getUserList();
        } else {
          this.message['error'](res.msg);
        }
      });
    }
  }

}
