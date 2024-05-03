<template>
    <div class="home-page">
        <el-row :gutter="20">
            <el-col :span="6" v-for="post in posts" :key="post.postId" class="post-item">
                <el-card @click="navigateToPost(post.staticUrl,post.postId)">
                    <img :src="post.images" class="post-image"/>
                    <div style="padding: 14px;">
                        <span class="post-title">{{ post.title }}</span>
                        <div class="post-time">{{post.createTime}}  {{ post.categoryName }}</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            posts: [],
        };
    },
    methods: {
        async loadPosts() {
            try {
                const params = {
                    maxBehotTime: '',
                    minBehotTime: '',
                    size: 10,
                    tag: '__all__',
                };
                const token = localStorage.getItem('token'); // 从localStorage中获取token
                console.log(token);
                const config = {
                    headers: {
                        'Authorization': `${token}`,// 将token添加到请求头中
                        'Content-Type': 'application/json'
                    }
                };
                const response = await axios.post('http://192.168.43.201:8088/post/load', params, config);
                this.posts = response.data.data;
            } catch (error) {
                console.error('Error loading posts:', error);
                // 在这里处理错误
            }
        },
        navigateToPost(url, postId) {
            // 从localStorage中获取token
            const token = localStorage.getItem('token');

            // 发送GET请求增加浏览量
            axios.get(`http://192.168.43.201:8088/post/addViewCount`, {
                headers: {
                    'Authorization': token
                },
                params: {
                    postId: postId // 确保这里的参数名称与后端接收的参数名称相匹配
                }
            }).then(response => {
                console.log('View count increased successfully', response);
                // 如果请求成功，导航到文章详情页面
                const newUrl = new URL(url);
                // 从localStorage获取用户信息字符串
                const userStr = localStorage.getItem('user');
                // 解析用户信息字符串为JSON对象
                const userObj = JSON.parse(userStr);
                // 从用户信息对象中获取userId
                const userId = userObj.userId;
                newUrl.searchParams.set('userId', userId);
                newUrl.searchParams.set('token', token);
                window.open(newUrl.href, '_blank');
            }).catch(error => {
                console.error('Error increasing view count:', error);
                // 即使请求失败，也导航到文章详情页面
                const newUrl = new URL(url);
                // 从localStorage获取用户信息字符串
                const userStr = localStorage.getItem('user');
                // 解析用户信息字符串为JSON对象
                const userObj = JSON.parse(userStr);
                // 从用户信息对象中获取userId
                const userId = userObj.userId;
                newUrl.searchParams.set('userId', userId);
                newUrl.searchParams.set('token', token);
                window.open(newUrl.href, '_blank');
            });
        }
    },
    mounted() {
        this.loadPosts();
    },
};

</script>

<style scoped>
.home-page {
    margin: 20px;
}

.post-item {
    cursor: pointer;
}

.post-image {
    width: 100%;
    height: auto;
    border-radius: 4px;
}

.post-title {
    font-size: 16px;
    font-weight: bold;
}

.post-description {
    color: #666;
    font-size: 14px;
    margin-top: 10px;
}
</style>