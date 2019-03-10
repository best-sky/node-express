import { Injectable, EventEmitter } from '@angular/core';
// 导入获取异步数据的模块
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class BortherService {
  // 此服务为兄弟组件传值服务
  public isShow: number = 0;
  public eventEmit: any = new EventEmitter();

  constructor() { }
  openAlert(id) {
    return new Observable((observable) => {
      this.isShow = id;
      observable.next(id);
    });
  }
}
