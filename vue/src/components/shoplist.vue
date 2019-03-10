<template>
  <div class="warp" ref="warp">
    <v-shopTable></v-shopTable>
  </div>
</template>

<script>
import VShopTable from "./common/shopTable";
export default {
  data() {
    return {
      
    };
  },
  mounted: function() {
    this.$setHeight();
  },
  components: {
    VShopTable
  }
};
</script>

<style scoped="scoped">
.warp {
  width: 100%;
  height: 100%;
}
</style>
