<!-- src/components/MainNavbar.vue -->
<template>
    <el-header>
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item index="1">首页推荐</el-menu-item>
        <el-menu-item index="2">今日比赛</el-menu-item>
        <el-menu-item index="3">今日资讯</el-menu-item>
        <el-menu-item index="4">球队榜</el-menu-item>
        <el-menu-item index="5">球队排名</el-menu-item>
        <el-menu-item index="6">赛程表</el-menu-item>
        <el-menu-item index="7">球队专区资讯</el-menu-item>
        <el-menu-item index="8">主队资讯</el-menu-item>
        <el-menu-item index="9">主队赛程</el-menu-item>
        <el-menu-item index="10">资讯搜索</el-menu-item>
        <el-menu-item index="11">个人中心</el-menu-item>

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
        this.$router.push({ path: this.routeFromKey(key) });
        console.log(key, keyPath);
      }
      , routeFromKey(key) {
            const routeMap = {
                '1': '/',
                '2': '/today-games',
                '3': '/today-news',
                '4': '/teams',
                '5': '/teamRanking',
                '6': '/gameSchedule',
                '7': '/categoryNews',
                '8': '/mainTeamNews',
                '9':'/mainTeamSchedule'
                // 其他 key 对应的路径可以继续添加
            };
            return routeMap[key] || '/';
        }
    }
  }
  </script>
  
  <style scoped>
  .el-header {
    background-color: #b3c0d1;
  }
  </style>
  