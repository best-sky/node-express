import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// 双向绑定生效模块
import { FormsModule } from '@angular/forms';
//引入element-ui
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElModule } from 'element-angular';
// 引入echart图表
import { NgxEchartsModule } from 'ngx-echarts';
//导入服务
import { AxiosService } from './service/axios.service';
import { BortherService } from './service/borther.service';


// 引入路由
import { AppRoutingModule } from './app-routing.module';
// 組件引入
import { AppComponent } from './app.component';
import { HomeComponent } from './component/home/home.component';
import { ShopComponent } from './component/shop/shop.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ForgetpassComponent } from './component/forgetpass/forgetpass.component';
import { HeaderComponent } from './component/header/header.component';
import { WeilcomeComponent } from './component/header/weilcome/weilcome.component';
import { SettingComponent } from './component/setting/setting.component';
import { TablesComponent } from './component/common/tables/tables.component';
import { DialogComponent } from './component/common/dialog/dialog.component';
import { ShopTableComponent } from './component/common/shop-table/shop-table.component';
import { AddshopComponent } from './component/shop/addshop/addshop.component';
import { ShoplistComponent } from './component/shop/shoplist/shoplist.component';

// 导入管道过滤器
import { ShopKindPipe } from './filter/shop-kind.pipe';



@NgModule({
  // 组件注册
  declarations: [
    AppComponent,
    HomeComponent,
    ShopComponent,
    LoginComponent,
    RegisterComponent,
    ForgetpassComponent,
    HeaderComponent,
    WeilcomeComponent,
    SettingComponent,
    TablesComponent,
    DialogComponent,
    ShopTableComponent,
    ShopKindPipe,
    AddshopComponent,
    ShoplistComponent
  ],
  // 模块注册
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ElModule.forRoot(),
    NgxEchartsModule,
  ],
  // 服务注册
  providers: [AxiosService, BortherService],
  // 设置根组件
  bootstrap: [AppComponent]
})
export class AppModule { }
