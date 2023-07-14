<template>
  <el-tree :props="defaultProps" :load="getFiles" lazy></el-tree>

</template>

<script>
import axios from "axios";

export default {
  name: "FileSystem",
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'isLeaf'
      },
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
    getFiles(node, resolve) {
      console.log(node.data.path)
      this.$axios.get(this.$serverUri + "/file/ls?path=" + encodeURIComponent(node.data.path === undefined ? "/" : node.data.path)).then((response) => {
        if (response.status === 200) {
          const data = response.data.map(item => {
            return {
              ...item,
              children:[],
              isLeaf: !item.isDirectory
            }
          })
          resolve(data)
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