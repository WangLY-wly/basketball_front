<template>
    <div class="game-schedule-page" v-if="mainTeamId !== -1">
        <h1>{{ mainTeamName }} 赛程表</h1>
        <table class="game-schedule-table">
            <thead>
            <tr>
                <th>日期</th>
                <th>星期</th>
                <th>时间</th>
                <th>主队</th>
                <th>客队</th>
                <th>状态</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="game in games.records" :key="game.id">
                <td>{{ game.dateOfMonth }}</td>
                <td>{{ game.dateOfWeek }}</td>
                <td>{{ game.gameTime }}</td>
                <td>{{ game.mainTeam }}</td>
                <td>{{ game.awayTeam }}</td>
                <td>{{ gameState(game.state) }}</td>
                <td>
                    <el-button v-if="game.state === 2" @click="fetchPlayerStats(game.id)" class="analysis-button"
                               size="mini">数据分析
                    </el-button>
                    <el-button v-if="game.state === 2" @click="openScoreModal(game.id)" class="score-button"
                               size="mini">我要评分
                    </el-button>
                </td>
            </tr>
            </tbody>
        </table>
        <el-dialog v-model:="showStatsModal" title="全场数据统计" width="80%">
            <el-table :data="[gameDetails]" style="width: 100%" class="dialog-table">
                <el-table-column prop="gameTime" label="开赛时间"></el-table-column>
                <el-table-column prop="arena" label="球馆"></el-table-column>
                <el-table-column prop="attendance" label="上座人数"></el-table-column>
                <el-table-column label="主队四节得分与总分" :formatter="formatHomeScore"></el-table-column>
                <el-table-column label="客队四节得分与总分" :formatter="formatAwayScore"></el-table-column>
            </el-table>
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
        <el-dialog v-model="showScoreModal" title="评分" width="30%" class="score-dialog">
            <div>
                <el-rate v-model="score"></el-rate>
            </div>
            <span class="dialog-footer">
        <el-button size="small" @click="showScoreModal = false">取消</el-button>
        <el-button type="primary" size="small" @click="submitScore">提交评分</el-button>
    </span>
        </el-dialog>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagination.current"
                :page-sizes="[10, 15, 20, 30]"
                :page-size="pagination.size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="games.total">
        </el-pagination>
    </div>
    <div v-else>
        <p>请先前往球队榜页面关注一个主队。</p>
    </div>
</template>

<script>
import axios from 'axios';
import {ElMessage} from "element-plus";

export default {
    data() {
        return {
            mainTeamId: -1,
            mainTeamName: '',
            games: {records: [], total: 0},
            pagination: {current: 1, size: 15},
            playerStats: [],
            showStatsModal: false,
            score: 0,
            currentGameId: null,
            showScoreModal: false,
            gameDetails: {}, // 新增存储比赛总数据
        };
    },
    methods: {
        fetchMainTeam() {
            const token = localStorage.getItem('token');
            axios.get('http://192.168.43.201:8088/user/getMainTeamByUserId', {headers: {'Authorization': token}})
                .then(response => {
                    if (response.data !== -1) {
                        this.mainTeamId = response.data.data;
                        this.fetchGameSchedule();
                    }
                }).catch(error => {
                console.error('Error fetching main team:', error);
            });
        },
        fetchGameSchedule() {
            const params = {
                teamId: this.mainTeamId,
                total: 200,
                size: this.pagination.size,
                current: this.pagination.current
            };
            const token = localStorage.getItem('token');
            axios.get('http://192.168.43.201:8088/gameSchedule/getScheduleByTeamId', {
                headers: {'Authorization': token},
                params
            }).then(response => {
                if (response.data.code === 200) {
                    this.games = response.data.data;
                    console.log(this.games.records);
                }
            }).catch(error => {
                console.error('Error fetching game schedule:', error);
            });
        },gameState(state) {
            const stateMap = {
                0: '未开始',
                1: '进行中',
                2: '已结束',
                3: '已取消'
            };
            return stateMap[state] || '未知状态';
        },fetchPlayerStats(gameId) {
            const token = localStorage.getItem('token');
            this.showStatsModal = true;
            axios.all([
                axios.get(`http://192.168.43.201:8088/playerStats/getStatByGameId`, { headers: { 'Authorization': token }, params: { gameId } }),
                axios.get(`http://192.168.43.201:8088/gameDetails/getById`, { headers: { 'Authorization': token }, params: { gameId } })
            ])
                .then(axios.spread((playerStatsResponse, gameDetailsResponse) => {
                    if (playerStatsResponse.data.code === 200) {
                        this.playerStats = playerStatsResponse.data.data;
                    }
                    if (gameDetailsResponse.data.code === 200) {
                        this.gameDetails = gameDetailsResponse.data.data;
                    }
                }))
                .catch(error => {
                    console.error('Error fetching data:', error);
                    this.showStatsModal = false;
                });
        },openScoreModal(gameId) {
            this.currentGameId = gameId;
            this.showScoreModal = true;
            this.score = 0; // 重置评分
        },
        submitScore() {
            const token = localStorage.getItem('token');
            const params = {
                id: 0, // 根据实际情况调整
                userId: 0, // 可以是用户登录信息中获取
                gameId: this.currentGameId,
                score: this.score
            };
            axios.post('http://192.168.43.201:8088/gameScore', params, {
                headers: { 'Authorization': token }
            }).then(response => {
                this.showScoreModal = false;
                ElMessage.success(response.data.msg);
            }).catch(error => {
                console.error('Error submitting score:', error);
                ElMessage.error('提交失败');
            });
        },
        formatHomeScore(row) {
            return `${row.homeScoreQ1}, ${row.homeScoreQ2}, ${row.homeScoreQ3}, ${row.homeScoreQ4} (总分: ${row.homeScoreTotal})`;
        },
        formatAwayScore(row) {
            return `${row.awayScoreQ1}, ${row.awayScoreQ2}, ${row.awayScoreQ3}, ${row.awayScoreQ4} (总分: ${row.awayScoreTotal})`;
        }
    },
    mounted() {
        this.fetchMainTeam();

    }
}
</script>
<style scoped>
.game-schedule-page {
    padding: 20px;
    font-family: 'Segoe UI', Arial, sans-serif;
    color: #333;
}

h1 {
    text-align: center;
    color: #409EFF;
}

.game-schedule-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.game-schedule-table th, .game-schedule-table td {
    border: 1px solid #ccc;
    padding: 10px;
    text-align: center;
    vertical-align: middle;
}

.game-schedule-table th {
    background-color: #f4f4f4;
}

.analysis-button, .score-button {
    margin-right: 5px;
}

.el-dialog {
    border-radius: 8px;
}

.dialog-footer {
    margin-top: 20px;
    text-align: right;
}

.score-dialog .el-dialog__header {
    color: #409EFF;
    font-size: 20px;
    font-weight: bold;
    text-align: center;
}

.score-dialog .el-dialog__body {
    font-size: 16px;
    color: #666;
}

.score-dialog .el-rate {
    margin: 15px 0; /* 增加上下边距 */
    text-align: center; /* 保证评分星星居中 */
}

.score-dialog .dialog-footer {
    padding-top: 10px;
    border-top: 1px solid #ebeef5; /* 添加顶部边框 */
    text-align: center; /* 按钮居中 */
}

.score-dialog .el-button {
    margin: 0 10px; /* 增加按钮之间的间距 */
}


</style>