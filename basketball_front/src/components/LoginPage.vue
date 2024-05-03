<template>
    <div class="login-page">
        <div class="login-box">
            <h1 class="title">basketballCommunity</h1>
            <el-form :model="loginForm" @submit.prevent="onLogin">
                <el-form-item>
                    <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="User"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="loginForm.password" placeholder="密码" type="password" prefix-icon="Lock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
// import { ref } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 用于显示消息提示

export default {
    data() {
        return {
            loginForm: {
                username: 'admin',
                password: '123456'
            },
            // 你的API地址
            loginUrl: 'http://192.168.43.201:8088/user/login'
        };
    },
    methods: {
        async onLogin() {
            // 输入验证
            if (!this.loginForm.username || !this.loginForm.password) {
                ElMessage.error('用户名和密码不能为空');
                return;
            }
            try {
                // 发送登录请求
                const response = await axios.post(this.loginUrl, this.loginForm);
                // 登录成功处理
                console.log('登录成功:', response);
                if (response.data.code === 200) {
                    ElMessage.success(response.data.msg);

                    // 存储token和用户信息
                    localStorage.setItem('token', response.data.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.data));
                    // todo:log out按钮和功能,需要删除localStorage的数据
                    // 跳转到主页或其他页面
                    this.$router.replace('/');
                } else {
                    // 登录失败处理
                    ElMessage.error(response.data.msg);
                }
            } catch (error) {
                // 登录失败处理
                console.error('登录异常:', error.response);
                ElMessage.error('登录异常，请稍后再试');
            }
        }
    }
};
</script>

<style scoped>
.login-page {
    background: url('../assets/img/login-bg.jpg') no-repeat center center fixed;
    background-size: cover;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-box {
    padding: 40px;
    width: 320px;
    background-color: rgba(255, 255, 255, 0.7); /* 更柔和的白色背景 */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); /* 增强的阴影效果 */
    border-radius: 10px; /* 圆角 */
    transition: all 0.3s ease-in-out;
    backdrop-filter: blur(10px); /* 背景模糊效果 */
}

.title {
    text-align: center;
    margin-bottom: 30px;
    color: #333;
    font-size: 24px;
    font-weight: 300; /* 字体更细 */
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input__inner {
    border-radius: 25px;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.6); /* 输入框内部的阴影 */
}

.el-button {
    width: 100%; /* 按钮宽度与输入框相同 */
    border-radius: 25px;
    padding: 12px 20px;
    font-size: 16px;
    background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%); /* 渐变背景色 */
    border: none; /* 移除边框 */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* 按钮的阴影 */
    color: white; /* 文字颜色 */
}

.el-button:hover {
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.3); /* 按钮悬停时的阴影 */
    transform: translateY(-2px); /* 按钮悬停时轻微上移 */
}

/* 移除 Element UI 默认的按钮激活状态的边框 */
.el-button:focus, .el-button:active {
    border: none;
    outline: none;
}
</style>
