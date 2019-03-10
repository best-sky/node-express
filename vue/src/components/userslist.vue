<template>
  <div class="index_warp" ref="warp">
    <v-userTables></v-userTables>
  </div>
</template>

<script>
import VUserTables from "./common/userTable";
export default {
  mounted: function() {
    this.$setHeight();
  },
  components: {
    VUserTables
  }
};
</script>

<style>
</style>