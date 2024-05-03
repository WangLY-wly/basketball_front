<template>
    <div class="team-news-page">
        <div v-if="mainTeamId !== -1">
            <div v-if="teamNews.length > 0" class="news-container">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="post in teamNews" :key="post.postId" class="post-item">
                        <el-card @click="navigateToPost(post.staticUrl)">
                            <img :src="post.images" class="post-image" alt="Post cover image"/>
                            <div style="padding: 14px;">
                                <span class="post-title">{{ post.title }}</span>
                                <div class="post-time">{{ post.createTime }} {{ post.categoryName }}</div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
            </div>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[10, 15, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalItems">
            </el-pagination>
        </div>
        <div v-else class="no-main-team-alert">
            <el-alert
                type="info"
                title="提醒!"
                description="Please go to the team ranking page and follow a main team first. 请先前往球队榜页面关注主队。"
                show-icon>
            </el-alert>
        </div>
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            mainTeamId: -1,
            currentPage: 1,
            pageSize: 20,
            totalItems: 0,
            teamNews: []
        };
    },
    created() {
        this.fetchMainTeam();
    },
    methods: {
        fetchMainTeam() {
            const token = localStorage.getItem('token');
            axios.get(`http://192.168.43.201:8088/user/getMainTeamByUserId`, {
                headers: {'Authorization': token}
            }).then(response => {
                this.mainTeamId = response.data.data;
                if (this.mainTeamId !== -1) {
                    this.fetchTeamNews(this.mainTeamId);
                }
            }).catch(error => {
                console.error('Error fetching main team:', error);
            });
        },
        fetchTeamNews(teamId) {
            axios.get(`http://192.168.43.201:8088/post/loadnewsCategory`, {
                headers: {'Authorization': localStorage.getItem('token')},
                params: {
                    categoryId: teamId,
                    total: 200,
                    size: this.pageSize,
                    current: this.currentPage
                }
            }).then(response => {
                this.teamNews = response.data.data.records;
                this.totalItems = response.data.data.total;
            }).catch(error => {
                console.error('Error loading team news:', error);
            });
        },
        navigateToPost(url) {
            window.open(url, '_blank');
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.fetchTeamNews(this.mainTeamId);
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            this.fetchTeamNews(this.mainTeamId);
        }
    }
}
</script>
<style scoped>
.team-news-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    width: 100%;
}

.news-container {
    margin-top: 20px;
    width: 100%;
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

.post-time {
    color: #666;
    font-size: 14px;
    margin-top: 10px;
}


</style>
