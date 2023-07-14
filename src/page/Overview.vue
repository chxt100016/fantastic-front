<template>
  <div id="mse"></div>

</template>

<script>
import Player from "xgplayer";

export default {
  data() {
    return {
      message: "qqqq!!",
      alarmArr:[],
    }
  },
  name: "Overview",
  mounted() {
    new Player({
      id: 'mse',
      url: 'http://localhost:8888/video/play'
    });
  }
}
</script>

<style scoped>
.carousel {
  width: 100%;
}
.img {
  width: 480px;
  height: 270px;
}
</style>