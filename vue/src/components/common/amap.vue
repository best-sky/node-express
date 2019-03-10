<template>
  <div class="map_warp">
    <table>
      <tr>
        <td>
          <label>请输入关键字：</label>
        </td>
      </tr>
      <tr>
        <td>
          <input id="tipinput" @select>
        </td>
      </tr>
    </table>
    <div id="container"></div>
  </div>
</template>

<script>
import AMap from "AMap";
export default {
  mounted: function() {
    this.init();
  },
  methods: {
    init() {
      var map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 13
      });
      AMap.plugin(["AMap.Autocomplete", "AMap.PlaceSearch"], function() {
        var autoOptions = {
          // 城市，默认全国
          city: "南昌",
          // 使用联想输入的input的id
          input: "tipinput"
        };
        var autocomplete = new AMap.Autocomplete(autoOptions);

        var placeSearch = new AMap.PlaceSearch({
          city: "北京",
          map: map
        });
        AMap.event.addListener(autocomplete, "select", function(e) {
          //TODO 针对选中的poi实现自己的功能
          placeSearch.search(e.poi.name);
          console.log(e);
        });
      });
    }
  }
};
</script>

<style scoped="scoped">
* {
  font-size: 12px;
}

.map_warp {
  position: relative;
  top: -80px;
  width: 100%;
  height: 530px;
}

.map_warp #container {
  margin-left: 220px;
  width: 80%;
  height: inherit;
}

.map_warp table {
  margin-left: 220px;
}
</style>