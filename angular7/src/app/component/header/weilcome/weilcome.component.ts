import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AxiosService } from "../../../service/axios.service";
import { EChartOption } from 'echarts';

@Component({
  selector: 'app-weilcome',
  templateUrl: './weilcome.component.html',
  styleUrls: ['./weilcome.component.css']
})
export class WeilcomeComponent implements OnInit {
  public echartData: any;
  public cakeOption: EChartOption;
  public lineOption: EChartOption = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      }
    ],
    yAxis: [
      {
        type: 'value'
      }
    ],
    series: [
      {
        name: '邮件营销',
        type: 'line',
        stack: '总量',
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '联盟广告',
        type: 'line',
        stack: '总量',
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '视频广告',
        type: 'line',
        stack: '总量',
        data: [150, 232, 201, 154, 190, 330, 410]
      },
      {
        name: '直接访问',
        type: 'line',
        stack: '总量',
        data: [320, 332, 301, 334, 390, 330, 320]
      },
      {
        name: '搜索引擎',
        type: 'line',
        stack: '总量',
        data: [820, 932, 901, 934, 1290, 1330, 1320]
      }
    ]
  };

  constructor(public axios: AxiosService, public ref: ChangeDetectorRef, public zone: NgZone) { }

  ngOnInit() {
    this.getEchartData();
  }

  getEchartData() {
    let data: object = {
      userId: localStorage.getItem('userId')
    };
    var result = this.axios.$postData("echart/echart", data);
    result.subscribe((res: any) => {
      // console.log(res);
      this.echartData = res.echartData;
      // console.log(this.zone)
      // this.zone.run(() => {
      //   // 要更新视图的代码
      // });
      this.cakeOption = {
        title: {
          text: '某站点用户访问来源',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          x: 'left',
          data: ['普通用户', '普通管理员', '超级管理员']
        },
        calculable: true,
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: this.echartData
          }
        ],
        color: ["rgb(126,206,124)", "rgb(215,158,210)", "rgb(157,143,206)"]
      };
      // //标注
      // this.ref.markForCheck();
      // // 要多加一行这个 执行一次变化检测
      // this.ref.detectChanges();
    });
  }
}
