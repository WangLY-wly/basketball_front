<template>
    <div class="teams-page">
        <el-row :gutter="20">
            <el-col :span="24">
                <h2 class="division-header">东部</h2>
                <div class="division">
                    <el-row :gutter="20">
                        <el-col v-for="team in easternTeams" :key="team.id" :span="6">
                            <el-card @click="openTeamDetails(team)" class="team-card">
                                <img :src="team.images" class="team-logo"/>
                                <div class="team-info">
                                    <h3 class="team-name">{{ team.nameCn }}</h3>
                                    <p class="team-record">{{ team.description }}</p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>

                <h2 class="division-header">西部</h2>
                <div class="division">
                    <el-row :gutter="20">
                        <el-col v-for="team in westernTeams" :key="team.id" :span="6">
                            <el-card @click="openTeamDetails(team)" class="team-card">
                                <img :src="team.images" class="team-logo"/>
                                <div class="team-info">
                                    <h3 class="team-name">{{ team.nameCn }}</h3>
                                    <p class="team-record">{{ team.description }}</p>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <div v-if="showDetailsModal" class="modal">
            <div class="modal-content">
                <span class="close" @click="closeModal">&times;</span>
                <h1>{{ selectedTeam.nameCn }} 详情
                    <button @click="toggleMainTeam" class="main-team-button">{{ mainTeamButtonText }}</button>
                </h1>

                <div class="descriptions">
                    <div class="description-item">
                        <strong>主教练:</strong> {{ selectedTeam.coach }}
                    </div>
                    <div class="description-item">
                        <strong>球队描述:</strong> {{ selectedTeam.description }}
                    </div>
                    <div class="description-item">
                        <strong>主场地:</strong> {{ selectedTeam.home }}
                    </div>
                </div>
                <hr/>
                <div class="descriptions" v-if="detailTeam">
                    <h2 class="t2">球队排名与统计</h2>
                    <div class="description-item" STYLE="font-size: 25px;color: crimson"><strong>排名:</strong> {{ detailTeam.teamRanking.ranking }}</div>
                    <div class="description-item"><strong>胜/负:</strong> {{ detailTeam.teamRanking.wins }}/{{ detailTeam.teamRanking.losses }}</div>
                    <div class="description-item"><strong>胜率:</strong> {{ detailTeam.teamRanking.winPercentage }}</div>
                    <div class="description-item"><strong>胜场差:</strong> {{ detailTeam.teamRanking.gamesBehind }}</div>
                    <div class="description-item"><strong>主场记录:</strong> {{ detailTeam.teamRanking.homeRecord }}</div>
                    <div class="description-item"><strong>客场记录:</strong> {{ detailTeam.teamRanking.awayRecord }}</div>
                    <div class="description-item"><strong>赛区记录:</strong> {{ detailTeam.teamRanking.divisionRecord }}</div>
                    <div class="description-item"><strong>会议记录:</strong> {{ detailTeam.teamRanking.conferenceRecord }}</div>
                    <div class="description-item"><strong>平均得分:</strong> {{ detailTeam.teamRanking.pointsPerGame }}</div>
                    <div class="description-item"><strong>平均失分:</strong> {{ detailTeam.teamRanking.pointsAllowedPerGame }}</div>
                    <div class="description-item"><strong>净胜分:</strong> {{ detailTeam.teamRanking.netPointsPerGame }}</div>
                    <div class="description-item"><strong>连胜/连败:</strong> {{ detailTeam.teamRanking.streak }}</div>
                </div>
                    <!-- Add more stats as needed -->
                </div>

                <div v-if="detailTeam">
                    <h2>最近比赛安排：</h2>
                    <table class="games-table">
                        <tr>
                            <th>日期</th>
                            <th>主队</th>
                            <th>客队</th>
                            <th>时间</th>
                        </tr>
                        <tr v-for="game in detailTeam.gameScheduleList" :key="game.id">
                            <td>{{ game.dateOfMonth }}</td>
                            <td>{{ game.mainTeam }}</td>
                            <td>{{ game.awayTeam }}</td>
                            <td>{{ game.gameTime }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 用于显示消息提示
export default {
    data() {
        return {
            easternTeams: [],
            westernTeams: [],
            showDetailsModal: false,
            selectedTeam: null,
            recentGames: [],
            detailTeam: null,
            isMainTeam: false,
        };
    },
    mounted() {
        this.loadTeams();

    },
    methods: {
        loadTeams() {
            const token = localStorage.getItem('token');
            axios.get('http://192.168.43.201:8088/team/getAll',{
                headers: {
                    'Authorization': token
                }
            })
                .then(response => {
                    this.easternTeams = response.data.data.filter(team => team.area === '东部');
                    this.westernTeams = response.data.data.filter(team => team.area === '西部');
                    this.checkRouteAndOpenModal();
                })
                .catch(error => console.error('Error loading teams:', error));
        },
    checkRouteAndOpenModal() {
        const teamId = this.$route.query.teamId;
        if (teamId) {
            const team = [...this.easternTeams, ...this.westernTeams].find(team => team.id == teamId);
            if (team) {
                this.openTeamDetails(team);
            }
        }
    },
        openTeamDetails(team) {
            this.selectedTeam = team;
            this.showDetailsModal = true;
            this.fetchRecentGames(team.id);
            this.checkIfMainTeam(team.id);
        },
        fetchRecentGames(teamId) {
            // Placeholder for fetching recent games
            const token = localStorage.getItem('token');
            axios.get(`http://192.168.43.201:8088/team/getTeamsStatById`,{
                headers: {
                    'Authorization': token
                },
                params: {
                teamId: teamId
            }
            }).then(response => {
                // this.selectedTeam = response.data.data;
                this.detailTeam = response.data.data;
                console.log(response.data.data);
                console.log(this.detailTeam.teamRanking);
            })
                .catch(error => console.error('Error fetching recent games:', error));
        },
        closeModal() {
            this.$emit('update:showDetailsModal', false);
            this.showDetailsModal=false;
        },
        toggleMainTeam() {
            const teamId = this.selectedTeam.id;
            const token = localStorage.getItem('token');
            const url = this.isMainTeam ? `/delMainTeam/${teamId}` : `/setMainTeam/${teamId}`;

            axios.get(`http://192.168.43.201:8088/user${url}`, {
                headers: { 'Authorization': token }
            }).then(response => {
                this.isMainTeam = !this.isMainTeam;
                ElMessage.success(response.data.data);
            }).catch(error => {
                console.error('Error updating main team:', error);
            });
        },checkIfMainTeam(teamId) {
            const token = localStorage.getItem('token');
            axios.get(`http://192.168.43.201:8088/user/isMainTeam/${teamId}`, {
                headers: { 'Authorization': token }
            }).then(response => {
                this.isMainTeam = response.data.data;
            }).catch(error => {
                console.error('Error checking main team status:', error);
            });
        }
    },
    computed: {
        mainTeamButtonText() {
            return this.isMainTeam ? '取消关注该队' : '设为主队';
        }
    }
}
</script>

<style>
.teams-page .team-card {
    cursor: pointer;
    transition: transform 0.3s;
    min-height: 250px; /* 统一卡片高度 */
}
.teams-page .team-card:hover {
    transform: translateY(-5px);
}
.team-logo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: auto;
}
.team-name {
    font-size: 16px;
    font-weight: bold;
    text-align: center;
}
.team-record {
    font-size: 14px;
    color: #666;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.division-header {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-top: 20px;
    text-align: center;
}

.modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 70%;
    max-width: 960px;
}

.close {
    float: right;
    font-size: 28px;
    cursor: pointer;
}

.descriptions {
    margin: 20px 0;
}

.description-item {
    font-size: 18px;
    margin: 10px 0;
}

.games-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

.games-table th, .games-table td {
    border: 1px solid #772c2c;
    padding: 8px;
    text-align: left;
}

.games-table th {
    background-color: #f4f4f4;
}
.main-team-button {
    padding: 10px 20px;
    background-color: #409EFF; /* Element UI 主题蓝色 */
    border: none;
    color: white;
    border-radius: 5px;
    cursor: pointer;
    margin-left: 20px;
    font-size: 16px;
    transition: background-color 0.3s;
}
.main-team-button:hover {
    background-color: #66b1ff; /* 淡化的背景色 */
}
</style>