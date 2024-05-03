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

export default {
    data() {
        return {
            mainTeamId: -1,
            mainTeamName: '',
            games: {records: [], total: 0},
            pagination: {current: 1, size: 15},
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
                }
            }).catch(error => {
                console.error('Error fetching game schedule:', error);
            });
        }
    },
    mounted() {
        this.fetchMainTeam();
    },
    filters: {
        gameState(state) {
            const stateMap = {
                0: '未开始',
                1: '进行中',
                2: '已结束',
                3: '已取消'
            };
            return stateMap[state] || '未知状态';
        }
    },
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

/*.dialog-table {
    --el-font-size: 26px!important; !* Element Plus 的字体大小变量 *!
}

.dialog-table .el-table th,
.dialog-table .el-table td {
    padding: 15px; !* 更大的内边距 *!
    font-size: 16px; !* 更大的字体大小 *!
    font-weight: bold; !* 加粗字体 *!
}

.dialog-table .el-table th {
    background-color: #eef1f6; !* 浅蓝背景 *!
    color: #333; !* 更深的文字颜色 *!
}样式修改没有生效
*/
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

.el-button--primary {
    background-color: #409EFF;
    border-color: #409EFF;
}

.el-button--primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

.el-dialog {
    border-radius: 8px; /* 统一对话框圆角 */
}
</style>