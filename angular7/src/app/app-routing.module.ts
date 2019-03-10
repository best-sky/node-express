import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { ShopComponent } from './component/shop/shop.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { ForgetpassComponent } from './component/forgetpass/forgetpass.component';
import { HeaderComponent } from './component/header/header.component';
import { WeilcomeComponent } from './component/header/weilcome/weilcome.component';
import { SettingComponent } from './component/setting/setting.component';
import { AddshopComponent } from './component/shop/addshop/addshop.component';
import { ShoplistComponent } from './component/shop/shoplist/shoplist.component';
const routes: Routes = [
  {
    path: 'header', component: HeaderComponent,
    children: [{
      path: 'Weilcome', component: WeilcomeComponent,
      data: {
        title: '项目介绍'
      }
    }, {
      path: 'home', component: HomeComponent,
      data: {
        title: '用户列表'
      }
    },
    {
      path: 'shop', component: ShopComponent,
      children: [
        {
          path: 'shoplist', component: ShoplistComponent,
          data: {
            title: '商品列表'
          }
        },
        {
          path: 'addshop', component: AddshopComponent,
          data: {
            title: '添加商品'
          }
        },
        {
          path: '**', redirectTo: 'shoplist'
        }]
    },
    {
      path: 'setting', component: SettingComponent
    }, {
      path: '**', redirectTo: 'Weilcome'
    }]
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'forgetpass', component: ForgetpassComponent
  },
  {
    path: '**', redirectTo: 'login'
  }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
