<template>
  <el-image class="logo" :src="this.kanbanImgUrl" fit="cover" v-if="!this.collapse"></el-image>
  <el-image class="logo" :src="this.kanbanImgUrl" fit="cover" v-if="this.collapse" style="width: 25px; height: 25px"></el-image>

  <el-menu class="menu"
           default-active="1"
           text-color="white"
           active-text-color="white"
           background-color="#404961"

  >
    <el-menu-item class="menu-item" index="/overview" @click="go('/overview')" :style="this.menuItemStyle">
      <el-icon ><Grid /></el-icon>
      <span  v-if="!this.collapse">概览</span>
    </el-menu-item>
    <el-menu-item class="menu-item" index="/project-group" @click="go('/project-group')" :style="this.menuItemStyle">
      <el-icon ><Monitor /></el-icon>
      <span  v-if="!this.collapse">全部项目</span>
    </el-menu-item>

    <el-menu-item class="menu-item" index="/mission-group" @click="go('/mission-group')" :style="this.menuItemStyle">
      <el-icon ><Aim /></el-icon>
      <span  v-if="!this.collapse">全部任务</span>
    </el-menu-item>

   <el-menu-item class="menu-item" index="/fileSystem" @click="go('/fileSystem')" :style="this.menuItemStyle">
     <el-icon ><Folder /></el-icon>
     <span  v-if="!this.collapse">文件</span>
   </el-menu-item>

    <el-menu-item class="menu-item" index="strapi" @click="open('http://2202.com:1337/admin')" :style="this.menuItemStyle">
      <el-icon ><Document /></el-icon>
      <span  v-if="!this.collapse">内容</span>
    </el-menu-item>

    <el-menu-item class="menu-item" index="/frame/transmission" @click="go('/frame/transmission')" :style="this.menuItemStyle">
      <el-icon ><Download /></el-icon>
      <span  v-if="!this.collapse">下载</span>
    </el-menu-item>

<!--    <el-menu-item class="menu-item" index="/frame/homeAssistant" :style="this.menuItemStyle">-->
<!--      <el-icon ><House /></el-icon>-->
<!--      <span  v-if="!this.collapse">控制</span>-->
<!--    </el-menu-item>-->

    <el-menu-item class="menu-item" index="hass"  @click="open('http://2202.com:8123')" :style="this.menuItemStyle">
      <el-icon ><House /></el-icon>
      <span  v-if="!this.collapse">控制</span>
    </el-menu-item>

    <el-menu-item class="menu-item" index="pt" @click="open('http://2202.com:9000')" :style="this.menuItemStyle">
      <el-icon ><Goblet /></el-icon>
      <span  v-if="!this.collapse">容器</span>
    </el-menu-item>

    <el-menu-item class="menu-item" index="pt" @click="open('http://192.168.1.1')" :style="this.menuItemStyle">
      <el-icon><Connection /></el-icon>
      <span  v-if="!this.collapse">路由</span>
    </el-menu-item>
  </el-menu>

  <el-button class="option-button" v-if="!this.collapse" size="small" icon="DArrowLeft" @click="asideOptionHandler"></el-button>
  <el-button class="option-button" v-if="this.collapse" size="small" icon="DArrowRight" @click="asideOptionHandler"></el-button>




</template>

<script>
import kanbanLog from '@/assets/kanban.png'
export default {
  data() {
    return {
      kanbanImgUrl: kanbanLog,
      collapse: false,
      menuItemStyle: {
        paddingLeft: '20px'
      }
    }
  },
  name: "Aside",
  methods: {
    go(path){
      console.log(path)
      this.$router.push({path:path})
    },
    open(url){
      window.open(url)
    },
    asideOptionHandler() {
      if (this.collapse === false) {
        this.collapse = true
        this.menuItemStyle.paddingLeft='5px'
        this.$emit("widthChange", {width: '34px'})
      } else {
        this.collapse = false
        this.menuItemStyle.paddingLeft='20px'
        this.$emit("widthChange", {width: '140px'})
      }
    },
  }
}
</script>

<style scoped>
.logo {
  background-color: #404961;
  height: 64px;
  width: 64px;
  margin: 0 auto;
  display: block;
}
.menu {
  border: 0;
}
.menu-item {
  width: 140px;
}
.option-button {
  width: 12px;
  position: absolute;
  left: 5px;
  bottom: 10px
}
</style>