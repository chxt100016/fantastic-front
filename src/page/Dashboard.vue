<template>
  <el-container>
    <el-space direction="vertical">
      <el-aside>
        1
      </el-aside>
      <el-aside>
        <FileSystem></FileSystem>
      </el-aside>
    </el-space>

  </el-container>
</template>

<script>
import FileSystem from "@/components/FileSystem.vue";

export default {
  components: {FileSystem},
  data() {
    return {
      message: "qqqq!!",
      alarmArr:[],
    }
  },
  name: "Overview",
  mounted() {
    const begin = new Date()
    begin.setHours(0)
    begin.setMinutes(0)
    begin.setSeconds(0)

    const end = new Date()
    end.setHours(23);
    end.setMinutes(59);
    end.setSeconds(59)
    this.$axios.get("/alarm", {
      params: {
        'beginTime': begin.getTime(),
        'endTime': end.getTime(),
      }
    }).then((res) => {
      this.alarmArr = res.data
    })
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