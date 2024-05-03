import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router';  // 确保引入路由配置
import axios from 'axios';
import { ElMessage } from 'element-plus';
const app = createApp(App)

app.use(ElementPlus)
app.use(router);  // 使用路由
app.mount('#app')

/*window.addEventListener('beforeunload', function() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 这里你还可以添加其他需要清除的资源或者状态
});*/

// 设置响应拦截器
axios.interceptors.response.use(response => {
    // 如果响应是成功的，只需返回响应
    return response;
}, error => {
    // 如果返回的响应是错误的，检查错误状态码
    if (error.response.status === 401) {
        // 如果是 401 错误，清除本地存储的 token 并重定向到登录页面
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        ElMessage.error('会话已过期，请重新登录');
    } else {
        // 对于其他所有错误，只需返回错误
        ElMessage.error(error.response.data.message || '发生错误，请稍后再试');
    }
    return Promise.reject(error);
});