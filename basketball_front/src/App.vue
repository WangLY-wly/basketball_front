<template>
  <div id="app">
    <MainNavbar/>
    <el-container>
      <el-main>
        <!-- 这里将是内容显示区域，可以根据需要添加更多的组件 -->
        <div>这里是内容区域</div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue'

export default {
  name: 'App',
  components: {
    MainNavbar
  }
}
</script>

<style>
#app {
  text-align: center;
}
</style>
