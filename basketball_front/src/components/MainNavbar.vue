<!-- src/components/MainNavbar.vue -->
<template>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页</el-menu-item>
        <el-menu-item index="2">新闻</el-menu-item>
        <el-menu-item index="3">比赛日程</el-menu-item>
        <el-menu-item index="4">球队排名</el-menu-item>
      </el-menu>
    </el-header>
  </template>
  
  <script>
  export default {
    name: 'MainNavbar',
    data() {
      return {
        activeIndex: '1',
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
        // 这里可以根据key来处理导航的逻辑，例如页面跳转等
      }
    }
  }
  </script>
  
  <style scoped>
  .el-header {
    background-color: #b3c0d1;
  }
  </style>
  