<template>
  <el-space style="padding-top: 20px" direction="vertical" alignment="flex-start">
    <el-radio-group style="padding-left: 10px" v-model="type" class="ml-4" @change="getList">
      <el-radio label="华人"  >华人</el-radio>
      <el-radio label="亚洲"  >亚洲</el-radio>
      <el-radio label="动漫"  >动漫</el-radio>
      <el-radio label="欧美"  >欧美</el-radio>
      <el-switch v-model="filter" class="ml-2" style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" @change ='getList'/>
    </el-radio-group>



    <el-space  wrap>
      <el-card v-for="(item, index) in data" :key="index" >
        <el-popover :width="400">
          <template #reference>
            <img style="height: 200px" :src="'http://2202.com:9999/image/test/etc/'+item.items[0].name">
          </template>

          <el-button-group>
            <template v-if="this.confirmIndex !== index">
              <el-button circle @click="this.confirmIndex = index">
                <el-icon size="small"><Delete /></el-icon>
              </el-button>
            </template>
            <template v-else>
              <el-button  circle @click="this.changeStatus(item.id, 'delete')">
                <el-icon><Check /></el-icon>
              </el-button>
              <el-button  circle @click="this.confirmIndex = -1">
                <el-icon><Close /></el-icon>
              </el-button>
            </template>
          </el-button-group>

          <el-link @click="open(item)" v-for="(item, index) in item.paths" :key="index" type="info">{{item.substring(item.lastIndexOf('/')+1)}}</el-link>
        </el-popover>
      </el-card>
    </el-space>
  </el-space>


  <el-dialog v-model="dialogVisible" width="1600px">
    <video style="height: 80%" v-if="this.dialogVisible" :src="'/video/play?path=' + this.path" controls></video>
  </el-dialog>
</template>

<script>

export default {
  name: "Springboot",
  data() {
    return {
      page: 1,
      pageSize: 100,
      data: [],
      dialogVisible: false,
      path: "",
      type: "华人",
      filter: true,
      confirmIndex: -1
    }
  },

  mounted() {
    this.getList()
  },
  methods:{
    changeStatus(id, status) {
      this.$axios.get(this.$serverUri + "/download/change", {params: {id:id, status:status}}).then(()=>{
        this.getList()
      })
    },
    getList() {
      this.$axios.post(this.$serverUri + "/spring/list", {
        page: this.page,
        pageSize: this.pageSize,
        status: this.filter ? 'complete' : 'downloading',
        type: this.type,
      }).then(res => {
        this.data = res.data.records
      });
    },
    open(path){
      this.dialogVisible = true
      this.path = path

    },

  }

}

</script>

<style scoped>

</style>