<!--  -->
<template>
  <div class="warp">
    <span>{{status}}</span>
    <ul id="ele">
      <li v-for="(item,index) in chatlist" :key="index">
        <span>{{item}}</span>
      </li>
    </ul>
    <textarea name id cols="30" rows="10" v-model="record"></textarea>
    <button @click="run" @enter="run">发送</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      ws: new WebSocket("ws://127.0.0.1:9000"),
      chatlist: [],
      status: "正在连接...",
      record: ""
    };
  },

  components: {},

  computed: {},

  mounted: function() {
    if (window.WebSocket) {
      this.ws = new WebSocket("ws://120.77.220.216:9000");
      this.ws.onopen = e => {
        this.status = "连接成功";
        this.ws.send("game1");
      };
      this.ws.onclose = e => {
        this.status = "连接关闭";
        console.log("服务器关闭");
      };
      this.ws.onerror = e => {
        this.status = "连接出错";
        console.log("连接出错");
      };
      this.ws.onmessage = e => {
        // console.log(e.data);
        if (e.data != "success" && e.data != "game1") {
          this.chatlist.push(e.data);
        }
      };
    }
  },

  methods: {
    run() {
      this.ws.send(this.record);
      this.record = "";
      var ele = document.getElementById("ele");
      ele.scrollTop = ele.scrollHeight;
    }
  }
};
</script>
<style  scoped>
.warp {
  width: 50%;
  height: auto;
  background-color: #fff;
  margin: 50px 0 0 250px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.warp > span {
  font-size: 0.75rem;
  width: 80px;
  height: auto;
  background-color: rgb(241, 241, 241);
  text-align: center;
}
.warp > ul {
  width: 100%;
  height: 400px;
  overflow: auto;
  list-style: none;
  margin: 0;
  margin-top: 10px;
  padding: 0;
}
.warp > ul > li {
  margin-top: 15px;
  padding: 0.5rem;
}
.warp > ul > li > span {
  background-color: rgb(38, 131, 245);
  width: auto;
  height: auto;
  padding: 3px;
  border-radius: 5px;
  color: #fff;
}

.warp > textarea {
  width: 100%;
  height: 200px;
  border: 0;
  border-top: 1px solid gray;
  outline: none;
  padding-top: 0.5rem;
}
.warp > button {
  border: 0;
  background-color: rgb(38, 131, 245);
  color: #fff;
  padding: 0.5rem;
  width: 5rem;
}
</style>