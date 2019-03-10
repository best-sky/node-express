import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shopKind'
})
export class ShopKindPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // console.log(args);
    switch (value) {
      case "1":
        return "蔬菜水果";
        break;
      case "2":
        return "生鲜肉类";
        break;
      case "3":
        return "粮油副食";
        break;
      case "4":
        return "调味作料";
        break;
      case "5":
        return "新鲜海产";
        break;
      case "6":
        return "日用百货";
        break;
      case "7":
        return "美味干货";
        break;
      default:
        break;
    }
  }
}
