<template>
    <div id="app">
        <!-- 只有在非登录页面时才显示导航栏 -->
        <MainNavbar v-if="!isLoginPage"/>
        <router-view></router-view> <!-- 这里将根据路由动态显示组件 -->
    </div>
</template>

<script>
import MainNavbar from './components/MainNavbar.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

export default {
    name: 'App',
    components: {
        MainNavbar
    },
    setup() {
        const route = useRoute()
        // 根据当前路由路径判断是否为登录页面
        const isLoginPage = computed(() => route.path === '/login'||route.path === '/Login')
        return {
            isLoginPage
        }
    }
}
</script>

<style>
#app {
    text-align: center;
}
</style>