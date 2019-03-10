<template>
  <div class="index_warp" ref="warp">
    <div class="weather">
      <div class="weather_top">
        <span>{{city}}</span>
        <div v-if="weather=='晴'" class="img1"></div>
        <div v-if="weather=='多云'" class="img2"></div>
        <div v-if="weather=='阴'" class="img3"></div>
        <div v-if="weather=='阵雨'" class="img4"></div>
        <div v-if="weather=='雷阵雨'" class="img5"></div>
        <div v-if="weather=='雷阵雨并伴有冰雹'" class="img6"></div>
        <div v-if="weather=='雨加雪'" class="img7"></div>
        <div v-if="weather=='小雨'" class="img8"></div>
        <div v-if="weather=='中雨'" class="img9"></div>
        <div v-if="weather=='大雨'" class="img10"></div>
        <div v-if="weather=='暴雨'" class="img11"></div>
        <div v-if="weather=='大暴雨'" class="img12"></div>
        <div v-if="weather=='特大暴雨'" class="img13"></div>
        <div v-if="weather=='阵雪'" class="img14"></div>
        <div v-if="weather=='小雪'" class="img15"></div>
        <div v-if="weather=='中雪'" class="img16"></div>
        <div v-if="weather=='大雪'" class="img17"></div>
        <div v-if="weather=='暴雪'" class="img18"></div>
        <div v-if="weather=='雾'" class="img19"></div>
        <div v-if="weather=='冻雨'" class="img20"></div>
        <div v-if="weather=='沙尘暴'" class="img21"></div>
        <div v-if="weather=='小雨-中雨'" class="img222"></div>
        <div v-if="weather=='中雨-大雨'" class="img23"></div>
        <div v-if="weather=='大雨-暴雨'" class="img24"></div>
        <div v-if="weather=='暴雨-大暴雨'" class="img25"></div>
        <div v-if="weather=='大暴雨-特大暴雨雨'" class="img26"></div>
        <div v-if="weather=='小雪-中雪'" class="img27"></div>
        <div v-if="weather=='中雪-大雪'" class="img28"></div>
        <div v-if="weather=='大雪-暴雪'" class="img29"></div>
        <div v-if="weather=='浮尘'" class="img30"></div>
        <div v-if="weather=='扬沙'" class="img31"></div>
        <div v-if="weather=='强沙尘暴'" class="img32"></div>
        <span>{{temperature}}℃</span>
      </div>
      <time>发布时间：{{time}}</time>
      <span>风力大小{{windPower}}级，{{windDirection}}风，相对湿度{{humidity}}</span>
      <address>当前位置：{{positions}}</address>
    </div>
    <div class="echart" ref="myechart" style="height:200px"></div>
    <v-amap></v-amap>
  </div>
</template>

<script>
import vAmap from "./common/amap";
export default {
  name: "index",
  data() {
    return {
      city: "", //所在城市
      weather: "", //当前天气
      time: "", //检测时间
      windPower: "", //风力大小
      windDirection: "", //风向
      humidity: "", //湿度
      temperature: "",
      positions: "",
      echartData: []
    };
  },
  components: {
    vAmap
  },
  methods: {
    getPosition() {
      //获取定位天气信息
      AMap.plugin("AMap.CitySearch", () => {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity((status, result) => {
          if (status === "complete" && result.info === "OK") {
            // 查询成功，result即为当前所在城市信息
            //							console.log(result);
            this.city = result.province + "-" + result.city;
            var lnglat = [];
            lnglat[0] =
              result.rectangle[0] +
              result.rectangle[1] +
              result.rectangle[2] +
              result.rectangle[3] +
              result.rectangle[4] +
              result.rectangle[5] +
              result.rectangle[6] +
              result.rectangle[7] +
              result.rectangle[8] +
              result.rectangle[9] +
              result.rectangle[10];
            lnglat[1] =
              result.rectangle[12] +
              result.rectangle[13] +
              result.rectangle[14] +
              result.rectangle[15] +
              result.rectangle[16] +
              result.rectangle[17] +
              result.rectangle[18] +
              result.rectangle[19] +
              result.rectangle[20] +
              result.rectangle[21] +
              result.rectangle[10];
            AMap.plugin("AMap.Weather", () => {
              //创建天气查询实例
              var weather = new AMap.Weather();
              //执行实时天气信息查询
              weather.getLive(result.city, (err, data) => {
                //console.log(data);
                this.weather = data.weather;
                this.time = data.reportTime;
                this.windPower = data.windPower;
                this.windDirection = data.windDirection;
                this.humidity = data.humidity;
                this.temperature = data.temperature;
              });
            });
            AMap.plugin("AMap.Geocoder", () => {
              var geocoder = new AMap.Geocoder({
                // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
                citycode: "0791"
              });
              geocoder.getAddress(lnglat, (status, result) => {
                if (status === "complete" && result.info === "OK") {
                  // result为对应的地理位置详细信息
                  this.positions = result.regeocode.formattedAddress;
                }
              });
            });
          }
        });
      });
    },
    getEchartData() {
      let data = {
        userId: sessionStorage.getItem("userId")
      };
      this.$getData("/echart/echart", data, "post", res => {
        // console.log(res);
        this.echartData = res.data.echartData;
        this.echart();
      });
    },
    echart() {
      var myEchart = this.$echarts.init(this.$refs.myechart);
      var option = {
        title: {
          text: "注册用户所占比重",
          x: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["普通用户", "普通管理员", "超级管理员"]
        },
        calculable: true,
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.echartData
          }
        ],
        color: ["rgb(126,206,124)", "rgb(215,158,210)", "rgb(157,143,206)"]
      };
      myEchart.setOption(option);
    }
  },
  mounted: function() {
    this.$setHeight();
    this.getPosition();
    this.getEchartData();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index_warp {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.index_warp .weather,
.echart {
  border-radius: 5px;
  margin-left: 220px;
  margin-top: 30px;
  width: 30%;
  height: 150px;
  background-color: rgb(249, 250, 252);
  padding: 20px;
  overflow: hidden;
}

.index_warp .weather .weather_top {
  display: flex;
  flex-direction: row;
}

.index_warp .weather span,
time,
address {
  padding: 15px;
}

.index_warp .weather address {
  font-style: normal;
}

.index_warp .weather .img1 {
  background: url(../assets/weather.jpg) 0px 0px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img2 {
  background: url(../assets/weather.jpg) -170px 0px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img3 {
  background: url(../assets/weather.jpg) -340px 0px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img4 {
  background: url(../assets/weather.jpg) -510px 0px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img5 {
  background: url(../assets/weather.jpg) 0px -50px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img6 {
  background: url(../assets/weather.jpg) -170px -50px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img7 {
  background: url(../assets/weather.jpg) -340px -50px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img8 {
  background: url(../assets/weather.jpg) -510px -50px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img9 {
  background: url(../assets/weather.jpg) 0px -110px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img10 {
  background: url(../assets/weather.jpg) -170px -110px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img11 {
  background: url(../assets/weather.jpg) -340px -110px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img12 {
  background: url(../assets/weather.jpg) -510px -110px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img13 {
  background: url(../assets/weather.jpg) 0px -160px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img14 {
  background: url(../assets/weather.jpg) -170px -160px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img15 {
  background: url(../assets/weather.jpg) -340px -160px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img16 {
  background: url(../assets/weather.jpg) -510px -160px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img17 {
  background: url(../assets/weather.jpg) 0px -230px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img18 {
  background: url(../assets/weather.jpg) -170px -230px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img19 {
  background: url(../assets/weather.jpg) -340px -230px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img20 {
  background: url(../assets/weather.jpg) -510px -230px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img21 {
  background: url(../assets/weather.jpg) 0px -280px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img22 {
  background: url(../assets/weather.jpg) -170px -280px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img23 {
  background: url(../assets/weather.jpg) -340px -280px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img24 {
  background: url(../assets/weather.jpg) -510px -280px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img25 {
  background: url(../assets/weather.jpg) 0px -340px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img26 {
  background: url(../assets/weather.jpg) -170px -340px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img27 {
  background: url(../assets/weather.jpg) -340px -340px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img28 {
  background: url(../assets/weather.jpg) -510px -340px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img29 {
  background: url(../assets/weather.jpg) 0px -400px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img30 {
  background: url(../assets/weather.jpg) -170px -400px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img31 {
  background: url(../assets/weather.jpg) -340px -400px;
  width: 180px;
  height: 52px;
}

.index_warp .weather .img32 {
  background: url(../assets/weather.jpg) -510px -400px;
  width: 180px;
  height: 52px;
}
</style>