<template>
  <!-- 页头 -->
  <el-page-header class="page-header" @back="this.back" icon="ArrowLeft">
    <template #title>
      <span></span>
    </template>
    <template #content>
      <el-space>
        <el-breadcrumb class="breadcrumb" separator=">">
          <el-breadcrumb-item class="breadcrumb-item">
            <el-button  @click="reducePath('')" size="small" round>
              <el-icon><HomeFilled /></el-icon>
            </el-button>
          </el-breadcrumb-item>
          <template v-for="(item,index) in breadcrumb" :key="index">
            <el-breadcrumb-item class="breadcrumb-item" >
              <el-button @click="reducePath(item)" size="small" round>{{item}}</el-button>
            </el-breadcrumb-item>
          </template>
        </el-breadcrumb>

        <!-- 操作-->
        <el-button-group>
          <el-button size="small" @click="this.getFiles(this.intactPath)" round>
            <el-icon><Refresh /></el-icon>
          </el-button>
          <template v-if="!this.addFolderFlag">
            <el-button size="small" @click="this.addFolderFlag = true" round>
              <el-icon><FolderAdd /></el-icon>
            </el-button>
          </template>
          <el-button size="small" round>
            <el-upload v-model:file-list="fileList" :show-file-list="false" action="/file/sys/upload" multiple method="post"  :auto-upload="true" :data="{path: this.intactPath}" :on-success="this.uploadSuccess">
              <el-icon><Upload /></el-icon>
            </el-upload>
          </el-button>

        </el-button-group>
        <template v-if="addFolderFlag">
          <el-input v-model="this.addFolderName" placeholder="请输入文件夹名称" size="small"></el-input>
          <el-button-group>
            <el-button @click="addFolder" circle>
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button @click="this.addFolderFlag = false" circle>
              <el-icon ><Close /></el-icon>
            </el-button>
          </el-button-group>
        </template>

      </el-space>
    </template>

  </el-page-header>

  <!-- 表格 -->
  <el-table class="el-table" :data="fileArr" style="width: 100%; color: #303133"  :row-class-name="rowClassName" @row-dblclick="addPath" >
    <el-table-column label="名称" >
      <template #default="scope">
        <el-space>
          <template v-if="this.renameFlag !== scope.$index">
            <template v-if="scope.row.isDirectory">
              <el-icon color="#73767a" :size="25"><Folder /></el-icon>
            </template>
            <template v-else>
              <el-icon color="#73767a" :size="25"><Tickets /></el-icon>
            </template>
            {{scope.row.name}}
          </template>
          <template v-else>
            <el-input v-model="this.renameTmp"  clearable />
            <el-button-group>
              <el-button @click="this.renameFile(scope)" circle>
                <el-icon><Check /></el-icon>
              </el-button>
              <el-button @click="this.renameClickCancel" circle>
                <el-icon ><Close /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-space>
      </template>
    </el-table-column>
    <el-table-column label="大小" width="180">
      <template #default="scope">
        <template v-if="scope.row.isDirectory && scope.row.size === ''">
          <el-button @click="this.getSize(scope)" size="small" circle>
            <el-icon><Search /></el-icon>
          </el-button>
        </template>
        <template v-else>
          {{scope.row.size}}
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" width="180" />
    <el-table-column prop="lastModifiedDate" label="修改时间" width="180"/>
    <el-table-column label="操作">
      <template #header>
        <el-input v-model="search" size="small" placeholder="Type to search" />
      </template>

      <template #default="scope">
        <!-- 操作 -->
        <template v-if="this.deleteFlag !== scope.$index">
          <el-button-group>
            <!-- 重命名 -->
            <el-button @click="this.renameClick(scope)" circle>
              <el-icon><EditPen /></el-icon>
            </el-button>

            <el-button @click="this.clickMove(scope)" circle>
              <el-icon><DArrowRight /></el-icon>
            </el-button>

            <!-- 删除 -->
            <el-button @click="this.deleteFlag = scope.$index" circle>
              <el-icon><Delete /></el-icon>
            </el-button>
            <!-- 下载文件 -->
            <template v-if="!scope.row.isDirectory">
              <el-button circle>
                <el-link :href="this.getDownloadUrl(scope.row.path)">
                  <el-icon ><Download /></el-icon>
                </el-link>
              </el-button>
            </template>
          </el-button-group>

        </template>

        <template v-else>
          <el-button-group>
            <el-button @click="this.deleteFile(scope.row)" circle>
              <el-icon><Check /></el-icon>
            </el-button>
            <el-button @click="this.deleteFlag = -1" circle>
              <el-icon><Close /></el-icon>
            </el-button>
          </el-button-group>
        </template>
      </template>
    </el-table-column>
  </el-table>

  <!--移动目录-->
  <el-dialog
      v-model="dialogVisible"
      title="移动"
      width="300px"
  >
    <!--      :before-close="handleClose"-->
    <el-table :data="moveDirArr" :show-header="false" @row-dblclick="changeMoveDir">
      <el-table-column property="name" label="名称">
        <template #default="scope">
          <el-space>
            <el-icon color="#73767a" :size="25"><Folder /></el-icon>
            {{scope.row.name}}
          </el-space>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false" circle>
            <el-icon ><Close /></el-icon>
          </el-button>
          <el-button type="info" @click="doMove" circle>
            <el-icon><Check /></el-icon>
          </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import axios from "axios";

export default {
  name: "FileSystem",
  data() {
    return {
      search: "",
      fileList: [],
      addFolderName: "",
      addFolderFlag: false,
      moveTmp: {
        oldPath: "",
        newPath: "",
      },
      moveDirPath:"",
      moveDirArr:[],
      dialogVisible: false,
      fileArr: [],
      breadcrumb: [],
      deleteFlag: -1,
      renameFlag: -1,
      renameTmp: '',
    }
  },
  methods: {
    doSearch(){
      this.$axios.post(this.$serverUri + "/file/sys/getFile", {type:0, path:this.intactPath, search: this.search}).then((res)=>{
        this.fileArr = res.data
      })
    },
    uploadSuccess(){
      this.getFiles(this.intactPath)
    },
    getDownloadUrl(path){

      return this.$serverUri + "/file/sys/downloadFile?path=" + encodeURIComponent(path)
    },
    addFolder(){
      this.$axios.get(this.$serverUri + "/file/sys/addFolder", {
        params: {path:this.intactPath + "/" + this.addFolderName}
      }).then((response) => {
        if (response.data) {
          this.addFolderFlag = false
          this.addFolderName = ""
          this.getFiles(this.intactPath)
        }
      })
    },
    doMove(){

      this.$axios.get(this.$serverUri + "/file/sys/move", {
        params: {
          'oldPath': this.moveTmp.oldPath,
          'newPath': this.moveTmp.newPath,
        }
      }).then((response) => {
        if (response) {
          this.dialogVisible = false;
          this.getFiles(this.intactPath)
        }
      })
    },
    changeMoveDir(row){
      this.getMoveDir(row.path)
    },
    clickMove(scope){
      this.dialogVisible = true;
      this.moveTmp.oldPath = scope.row.path
      this.moveDirPath = this.intactPath
      this.getMoveDir(this.moveDirPath)
    },
    getMoveDir(path){
      this.$axios.post(this.$serverUri + "/file/sys/getFile", {type:2, path:path}).then((res)=>{
        this.moveDirArr = res.data
        this.moveTmp.newPath = path
      })
    },
    back(){
      this.breadcrumb.pop()
      this.getFiles(this.intactPath)
    },
    renameClickCancel(){
      this.renameFlag = -1;
      this.renameTmp = '';
    },
    renameClick(scope){
      this.renameFlag = scope.$index
      this.renameTmp = scope.row.name
    },
    rowClassName(item){
      if(item.row.isDirectory) {
        return 'directory-row'
      }
      return 'file-row'
    },
    getFiles(path) {
      this.$axios.get(this.$serverUri + "/file/sys/ls?path=" + encodeURIComponent(path)).then((response) => {
        if (response.status === 200) {
          this.fileArr = response.data
          this.$router.push({path: this.$route.path, query:{path: path}})
        }
      })
    },
    addPath(row) {
      if (row.isDirectory) {
        this.breadcrumb.push(row.name)
      }
    },
    reducePath(name) {
      while (this.breadcrumb.length > 0) {
        if (this.breadcrumb[this.breadcrumb.length-1] === name) break;
        this.breadcrumb.pop();
      }
    },
    deleteFile(row){
      axios.get(this.$serverUri + "/file/sys/delete?path=" + encodeURIComponent(row.path)).then((response) => {
        if (response) {
          this.deleteFlag = -1;
          this.getFiles(this.intactPath);
        }
      })
    },
    renameFile(scope){
      axios.get(this.$serverUri + "/file/sys/rename", {
        params: {
          'path': scope.row.path,
          'name': this.renameTmp,
        }
      }).then((response) => {
        if (response) {
          this.renameFlag = -1;
          this.getFiles(this.intactPath)
        }
      })
    },
    getSize(scope){
      axios.get(this.$serverUri + "/file/sys/getSize", {
        params: {
          'path': scope.row.path,
        }
      }).then((response) => {
        this.fileArr[scope.$index].size = response.data
      })
    }
  },
  mounted() {
    let param = this.$route.query.path;

    if (param === undefined) {
      this.$router.push({path: this.$route.path, query:{path: "/"}})
      param = "/"
    }
    this.intactPath = param
    this.getFiles(param)
  },
  watch: {
    search(){
      this.doSearch()
    },
    breadcrumb: {
      handler() {
        this.getFiles(this.intactPath)
      },
      deep: true
    }
  },
  computed:{
    intactPath: {
      get(){
        return "/" + this.breadcrumb.join("/")
      },
      set(path){
        this.breadcrumb = path.split("/").filter(item => item !== '')
      }
    }
  }
}
</script>

<style scoped>
.page-header{
  padding-bottom: 10px;
  padding-left: 5px;
}
.el-table /deep/ .directory-row {

}
</style>