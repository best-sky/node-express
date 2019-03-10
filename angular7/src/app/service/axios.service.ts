import { Injectable } from '@angular/core';
// 导入ajax服务
import { HttpClient, HttpHeaders } from '@angular/common/http';
// 导入获取异步数据的模块
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AxiosService {
  public url: string = 'api/';
  constructor(public http: HttpClient) { }
  // get请求
  $getData(url, data) {
    let api: string = this.url + url;
    return new Observable((observable) => {
      this.http.get(api, data).subscribe((res: any) => {
        observable.next(res);
      });
    });
  }
  // post请求
  $postData(url, data) {
    let api: string = this.url + url;
    // console.log(data);
    // 这边返回的异步数据不能直接获取,这边使用内置服务监听整个获取数据的方法
    return new Observable((observable) => {
      this.http.post(api, data).subscribe((res: any) => {
        observable.next(res);
      });
    });
  }
  $deleteData(url, data) {
    let api: string = this.url + url;
    // console.log(data);
    // 这边返回的异步数据不能直接获取,这边使用内置服务监听整个获取数据的方法
    return new Observable((observable) => {
      this.http.delete(api, data).subscribe((res: any) => {
        observable.next(res);
      });
    });
  }
}
