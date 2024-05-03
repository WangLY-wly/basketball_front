import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/LoginPage.vue';
import HomePage from '../components/HomePage.vue';
import TodayGamesPage from '../components/TodayGamesPage.vue';
import TodayNewsPage from '../components/TodayNewsPage.vue';
import TeamsPage from '../components/TeamsPage.vue';
import TeamRankingPage from '../components/TeamRankingPage.vue';
import GameSchedule from '../components/GameSchedule.vue';
import CategoryNewsPage from '../components/CategoryNewsPage.vue';
import MainTeamNewsPage from "../components/MainTeamNewsPage.vue";
import MainTeamSchedulePage from "../components/MainTeamSchedulePage.vue";
const routes = [
    {
        path: '/',
        name: 'HomePage',
        component: HomePage
    },
    {
        path: '/login',
        name: 'LoginPage',
        component: LoginPage
    },
    {
        path: '/today-games',
        name: 'TodayGames',
        component: TodayGamesPage
    },
    {
        path: '/today-news',
        name: 'TodayNews',
        component: TodayNewsPage
    },
    {
        path: '/teams',
        name: 'TeamsPage',
        component: TeamsPage
    },
    {
        path: '/teamRanking',
        name: 'TeamRankingPage',
        component: TeamRankingPage
    },
    {
        path: '/gameSchedule',
        name: 'GameSchedule',
        component: GameSchedule
    },
    {
        path: '/categoryNews',
        name: 'CategoryNews',
        component: CategoryNewsPage
    },
    {
        path: '/mainTeamNews',
        name: 'MainTeamNews',
        component: MainTeamNewsPage
    },
    {
        path: '/mainTeamSchedule',
        name: 'MainTeamSchedule',
        component: MainTeamSchedulePage
    }
];
// 这样在/login后显示登录,在/里显示主页
const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    // 检查localStorage中是否有token
    const isAuthenticated = localStorage.getItem('token');

    // 如果用户未登录并且目标路由不是登录页面，则重定向到登录页面
    if (!isAuthenticated && to.path !== '/login') {
        next('/login');
    } else {
        // 如果用户已登录，或者访问的是登录页面，则继续
        next();
    }
});

export default router;