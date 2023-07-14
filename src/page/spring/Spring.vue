<template>
  <el-space direction="vertical" alignment="flex-start">
    <!-- header -->
    <el-space style="padding-left: 10px; padding-top:20px" :size="20">

      <el-radio-group v-model="this.type" size="small" @change="this.getList">
        <el-radio-button label="">所有</el-radio-button>
        <el-radio-button label="华人">华人</el-radio-button>
        <el-radio-button label="亚洲">亚洲</el-radio-button>
        <el-radio-button label="欧美">欧美</el-radio-button>
        <el-radio-button label="动漫">动漫</el-radio-button>
      </el-radio-group>


      <el-badge :value="this.total" class="item" type="primary" :max="999">
        <el-button type="primary" @click="this.getList" size="small">
          <el-icon><CollectionTag /></el-icon>
        </el-button>
      </el-badge>

    </el-space>

    <!-- main -->
    <template v-if="this.total !== 0 && this.list.length > 0">

      <!-- init -->
      <el-space direction="vertical">

        <el-carousel :autoplay="false" arrow="always" height="600px" style="width: 1600px" type="card" >
          <el-carousel-item v-for="(item, index) in this.list[0].items" :key="index">
            <el-image  style="height: 800px"  :src="this.getSrc(item.name)"></el-image>
          </el-carousel-item>
        </el-carousel>

        <el-badge :value="this.list.length" class="item" type="primary" :max="999">
          <el-space size="small" wrap>
            <el-tag v-for="(item, index) in this.getTag(this.list[0].tag, this.list[0].id)" :key="index" type="info" >
              {{ item }}
            </el-tag>
          </el-space>
        </el-badge>

        <el-tag type="info" size="large">
          {{this.list[0].name}}
        </el-tag>

        <el-space size="large">
          <el-button round @click="this.changeStatus(0, 'downloading')" size="large">
            <el-icon><Download /></el-icon>
          </el-button>
          <el-button round @click="this.changeStatus(0, 'trash')" size="large">
            <el-icon><Delete /></el-icon>
          </el-button>
        </el-space>
      </el-space>

    </template>

    <template v-else>
      <el-empty description="。。。。。。" />
    </template>
  </el-space>


</template>


<script>


export default {
  data() {
    return {
      show: false,
      type: undefined,
      page: 1,
      pageSize: 200,
      list: [],
      total: 0,
      downloadPercentage: {},

    }
  },
  mounted() {
    this.getList()
  },
  methods:{
    find(flag) {
      this.$axios.get(this.$serverUri + "/download/find?name=" + flag).then(res => {
        this.downloadPercentage = res.data
      });
    },
    switchStatus() {
      this.list = []
      this.getList()
      if (this.status === "downloading") {
        this.$axios.get(this.$serverUri + "/download/percentage").then(res => {
          this.downloadPercentage = res.data
        });
      }
    },
    getWidth(name){
      let url = this.getSrc(name);
      let image = new Image();
      let w, h;
      image.src = url;
      // 如果有缓存，读缓存
      if(image.complete){
        w = image.width;  // 图片宽度
        h = image.height;
      }else { //否则加载图片
        console.log("load")
        image.onload = function() {
          w = image.width;   // 图片宽度
          h = image.height;
          image.onload = null;   // 避免重复加载
          console.log("h" + h + "," + "w" + w)
        };
      }
      return (200/h) * w - 26 + 'px';
    },
    openWindow(url){
      window.open(url)
    },
    getSrc(name) {
      return "http://2202.com:9999/image/test/etc/" + name;
    },
    changeStatus(index, status) {
      this.$axios.get(this.$serverUri + "/download/change", {params: {id:this.list[index].id, status:status}}).then(()=>{
        if (this.list.length === 0) {
          this.getList()
        }
      })
      this.list.splice(index, 1)
    },

    getTag(str, id){
      let arr = str.split(',')
      arr.push(id)
      return arr;
    },
    getList() {
      this.$axios.post(this.$serverUri + "/spring/list", {
        page:this.page,
        pageSize:this.pageSize,
        status: 'init',
        type:this.type,
      }).then((res)=>{
        this.list = res.data.records
        this.total = res.data.total
      })
    },

  }
}
</script>

<style >

</style>