<template>
    <div>
        <h1 class="header">今日的比赛</h1>
        <div v-if="games.length > 0">
            <div v-for="game in games" :key="game.id" class="game-card">
                <div class="left-section">
                    <div class="team-section">
                        <div class="team">
                            <img :src="game.imagesForMain" alt="主队logo" class="team-logo">
                            <span>{{ game.mainTeam }} (主队)</span>
                        </div>
                        <div class="score">{{ game.gameDetails.homeScoreTotal }}</div>
                        <div class="vs">vs</div>
                        <div class="score">{{ game.gameDetails.awayScoreTotal }} </div>
                        <div class="team">
                            <img :src="game.imagesForAway" alt="客队logo" class="team-logo">
                            <span>{{ game.awayTeam }} (客队)</span>
                        </div>
                    </div>
                    <div class="game-details">
                        <div class="game-state">{{ gameState(game.state) }}</div>
                        <div v-if="game.state === 2" class="scores-detail">
                            主队得分：Q1: {{ game.gameDetails.homeScoreQ1 }}, Q2: {{ game.gameDetails.homeScoreQ2 }}, Q3: {{ game.gameDetails.homeScoreQ3 }}, Q4: {{ game.gameDetails.homeScoreQ4 }}
                            <br>
                            客队得分：Q1: {{ game.gameDetails.awayScoreQ1 }}, Q2: {{ game.gameDetails.awayScoreQ2 }}, Q3: {{ game.gameDetails.awayScoreQ3 }}, Q4: {{ game.gameDetails.awayScoreQ4 }}
                        </div>
                        <el-button v-if="game.state === 2" @click="fetchPlayerStats(game.id)" class="analysis-button">数据分析</el-button>
                    </div>
                </div>
                <div class="right-section">
                    <div class="game-info">
                        <div class="game-date">比赛日期：{{ game.dateOfMonth }} {{ game.dateOfWeek }}</div>
                        <div class="game-time">比赛时间：{{ game.gameTime }}</div>
                        <div class="game-location">比赛地点：{{ game.gameDetails.arena }}</div>
                        <div class="game-attendance">观众人数：{{ game.gameDetails.attendance }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <p class="no-games">今日无比赛</p>
        </div>
        <el-dialog v-model:="showStatsModal" title="球员统计数据" width="80%">
            <el-table :data="playerStats" style="width: 100%" row-key="statId" :row-style="getRowStyle">
                <el-table-column prop="playerName" label="球员姓名" width="120">
                    <template #default="{ row }">
                    <span style="font-weight: bold;">{{ row.playerName }}</span>
                </template>
                </el-table-column>
                <el-table-column prop="team" label="所属球队" width="120"></el-table-column>
                <el-table-column prop="position" label="位置" width="80"></el-table-column>
                <el-table-column prop="minutesPlayed" label="时间" width="80"></el-table-column>
                <el-table-column prop="fieldGoals" label="投篮"></el-table-column>
                <el-table-column prop="threePoints" label="三分"></el-table-column>
                <el-table-column prop="freeThrows" label="罚球"></el-table-column>
                <el-table-column prop="totalRebounds" label="篮板"></el-table-column>
                <el-table-column prop="assists" label="助攻"></el-table-column>
                <el-table-column prop="steals" label="抢断"></el-table-column>
                <el-table-column prop="blocks" label="封盖"></el-table-column>
                <el-table-column prop="pointsScored" label="得分"></el-table-column>
                <el-table-column prop="plusMinus" label="+/-"></el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { ElDialog, ElTable, ElTableColumn, ElButton } from 'element-plus';
export default {
    components: {
        ElDialog,
        ElTable,
        ElTableColumn,
        ElButton
    },
    data() {
        return {
            games: [],
            playerStats: [],
            showStatsModal: false

        };
    },
    mounted() {
        this.fetchGames();
    }
    ,methods: {
        gameState(value) {
            const states = {0: '未开始', 1: '进行中', 2: '已结束',3: '已取消'};
            return states[value] || '未知状态';
        },
        fetchGames() {
            const token = localStorage.getItem('token'); // 从localStorage中获取token
            axios.get('http://192.168.43.201:8088/gameSchedule/getTodayGame', {
                headers: {
                    'Authorization': `${token}`
                }
            })
                .then(response => {
                    this.games = response.data.data;
                    console.log(this.games);
                })
                .catch(error => {
                    console.error('Error fetching today games:', error);
                });
        },
        fetchPlayerStats(gameId) {
            this.showStatsModal=true;
            const token = localStorage.getItem('token');
            axios.get(`http://192.168.43.201:8088/playerStats/getStatByGameId`, {
                headers: { 'Authorization': token },
                params: { gameId }
            })
                .then(response => {
                    this.playerStats = response.data.data;
                    this.showStatsModal = true;
                })
                .catch(error => {
                    console.error('Error fetching player stats:', error);
                });
        },getRowStyle({rowIndex}) {
            if (rowIndex === 0) return {};
            // 检查当前行的球队与上一行球队是否相同
            if (this.playerStats[rowIndex].team !== this.playerStats[rowIndex - 1].team) {
                console.log(this.playerStats[rowIndex].team, this.playerStats[rowIndex - 1].team);
                return {
                    borderTop: '2px solid #ebeef5 !important' // 在不同球队之间添加分割线  //todo 未生效
                };
            }
            return {};
        },
    }
}
</script>

<style scoped>
.header {
    text-align: center;
    font-size: 24px;
    margin-top: 20px;
}

.game-card {
    display: flex;
    flex-direction: row;  /* 修改这里将布局调整为水平排列 */
    align-items: center;
    justify-content: space-between; /* 这将确保左右两个部分分布在两端 */
    margin: 20px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #f9f9f9;
}

.team-section {
    display: flex;
    align-items: center;
}
h1 {
    text-align: center;
    color: #409EFF;
}
.team {
    display: flex;
    align-items: center;
    margin-right: 20px;
}

.team:last-child {
    margin-right: 0;
}
.right-section {
    display: flex;
    flex-direction: column;
    padding-left: 400px; /* 为右侧部分添加一些内边距 */
}
.left-section {
    display: flex;
    flex-direction: column;
    padding-left: 150px; /* 为右侧部分添加一些内边距 */
}
.team-logo {
    width: 60px;
    height: 60px;
    border-radius: 30px;
    margin-right: 20px;
    margin-left: 20px;
}

.score, .vs {
    font-size: 24px;
    font-weight: bold;
}

.game-details {
    margin-top: 20px;
}

.game-state {
    font-size: 20px;
    font-weight: bold;
}

.scores-detail {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
}

.analysis-button {
    margin-top: 10px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.right-section {
    flex: 1;

}
.game-info {
    background-color: #f0f0f0;
    border-radius: 10px;
    padding: 15px;
    margin-top: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    text-align: left;
}

.game-info > div {
    margin-bottom: 10px;
    font-size: 16px;
    color: #333;
}

.game-time {
    font-size: 18px;  /* 增大字体大小 */
    font-weight: bold;  /* 加粗字体 */
    color: #d32f2f;  /* 特别的颜色突出显示时间 */
    border-left: 4px solid #d32f2f;  /* 添加左侧边框 */
    padding-left: 10px;  /* 左侧填充 */
    margin-top: 10px;  /* 顶部间距 */
    margin-bottom: 20px;  /* 底部间距 */
}

.game-date, .game-location, .game-attendance {
    font-style: italic;  /* 斜体 */
}

</style>
