<template>
    <div class="team-news-page">
        <div class="team-menu">
            <div class="team-section" v-for="section in sections" :key="section.title">
                <h3>{{ section.title }}</h3>
                <div class="team-grid">
                    <div class="team-item" v-for="team in section.teams" :key="team.id" @click="fetchTeamNews(team.id)">
                        <img :src="team.logo" alt="team logo" class="team-logo">
                        <span>{{ team.name }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="teamNews.length > 0" class="news-container">
            <el-row :gutter="20">
                <el-col :span="6" v-for="post in teamNews" :key="post.postId" class="post-item">
                    <el-card @click="navigateToPost(post.staticUrl,post.postId)">
                        <img :src="post.images" class="post-image"/>
                        <div style="padding: 14px;">
                            <span class="post-title">{{ post.title }}</span>
                            <div class="post-time">{{ post.createTime }} {{ post.categoryName }}</div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <div v-else>
            <p>!请先选择球队!No news available for this team.</p>
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
</template>


<script>
import axios from 'axios';

export default {
    data() {
        return {
            activeTeam: 1,
            currentPage: 1,
            pageSize: 12,
            totalItems: 0,
            haveSelected:false,
            sections: [
                {
                    title: '东部分区',
                    teams: [
                        {
                            id: '16',
                            name: '波士顿凯尔特人',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/58ad76e5013f88cd.png'
                        }
                        , {
                            id: '17',
                            name: '纽约尼克斯',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d1497fa2d3158da7.png'
                        }
                        , {
                            id: '18',
                            name: '费城76人',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b4f0980fef76de22.png'
                        }
                        , {
                            id: '19',
                            name: '布鲁克林篮网',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8fb395595fe476f7.png'
                        }
                        , {
                            id: '20',
                            name: '多伦多猛龙',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8143ce5275f35b64.png'
                        }
                        , {
                            id: '21',
                            name: '奥兰多魔术',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/6c8eb942322783b9.png'
                        }
                        , {
                            id: '22',
                            name: '迈阿密热火',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/584ff80b87a21cd8.png'
                        }
                        , {
                            id: '23',
                            name: '亚特兰大老鹰',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/1c4b8d2d45a649b9.png'
                        }
                        , {
                            id: '24',
                            name: '夏洛特黄蜂',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/30772edf038d248d.png'
                        }
                        , {
                            id: '25',
                            name: '华盛顿奇才',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/a76937b225c20218.png'
                        }
                        , {
                            id: '26',
                            name: '密尔沃基雄鹿',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/7091f8420b800878.png'
                        }
                        , {
                            id: '27',
                            name: '克利夫兰骑士',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b88b9d38a6685d3c.png'
                        }
                        , {
                            id: '28',
                            name: '印第安纳步行者',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/83b033b5c036f590.png'
                        }
                        , {
                            id: '29',
                            name: '芝加哥公牛',
                            logo: ' https://gdc.hupucdn.com/gdc/nba/team/logo/0d490533faca1986.png'
                        }
                        , {
                            id: '30',
                            name: '底特律活塞',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/86e9f9cbf13706fb.png'
                        }
                    ]
                },
                {
                    title: '西部分区',
                    teams: [
                        {
                            id: '1',
                            name: '达拉斯独行侠',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e27275cb4a9cf56f.png'
                        },
                        {
                            id: '2',
                            name: '新奥尔良鹈鹕',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/c5d7ee3d3999e1a3.png'
                        },
                        {
                            id: '3',
                            name: '休斯顿火箭',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b72de688b7833a63.png'
                        },
                        {
                            id: '4',
                            name: '孟菲斯灰熊',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/906d3cb1d084d39b.png'
                        },
                        {
                            id: '5',
                            name: '圣安东尼奥马刺',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d61472f27405ef2f.png'
                        },
                        {
                            id: '6',
                            name: '洛杉矶快船',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0d6670544d67158b.png'
                        },
                        {
                            id: '7',
                            name: '菲尼克斯太阳',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0e9dc75130b041bb.png'
                        },
                        {
                            id: '8',
                            name: '洛杉矶湖人',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/4f04d1b4f8a6548a.png'
                        },
                        {
                            id: '9',
                            name: '萨克拉门托国王',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/54b9b9a860d5000d.png'
                        },
                        {
                            id: '10',
                            name: '金州勇士',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e6d876b019135540.png'
                        },
                        {
                            id: '11',
                            name: '俄克拉荷马城雷霆',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/3d06df3d7207e41b.png'
                        },
                        {
                            id: '12',
                            name: '丹佛掘金',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/07eaaf35f02b3a43.png'
                        },
                        {
                            id: '13',
                            name: '明尼苏达森林狼',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/171d8fbb81947872.png'
                        },
                        {
                            id: '14',
                            name: '犹他爵士',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/42e1e1f96e72c9e7.png'
                        },
                        {
                            id: '15',
                            name: '波特兰开拓者',
                            logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/079f9b6b4be966c1.png'
                        },
                    ]
                }
            ],
            teamNews: [],
        };
    },
    methods: {
        fetchTeamNews(teamId) {
            this.activeTeam=teamId;
            const token = localStorage.getItem('token');
            this.haveSelected=true;
            axios.get(`http://192.168.43.201:8088/post/loadnewsCategory`, {
                headers: {'Authorization': token},
                params: {
                    categoryId: teamId,
                    total: 200,
                    size: this.pageSize,
                    current: this.currentPage
                }
            }).then(response => {
                this.teamNews = response.data.data.records;
                this.totalItems = response.data.data.total; // 总新闻数量
            }).catch(error => {
                console.error('Error loading team news:', error);
            });
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
        },
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            if(this.haveSelected){
                this.fetchTeamNews(this.activeTeam);
            }
        },
        handleCurrentChange(newPage) {
            this.currentPage = newPage;
            if(this.haveSelected){
                this.fetchTeamNews(this.activeTeam);
            }
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

.team-menu {
    width: 100%;
}

.team-section h3 {
    text-align: center;
}

.team-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}

.team-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    cursor: pointer;
}

.team-logo {
    width: 40px;
    height: 40px;
}

.news-container {
    margin-top: 20px;
    width: 100%;
}

.news-item {
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 10px;
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

.post-description {
    color: #666;
    font-size: 14px;
    margin-top: 10px;
}

</style>



