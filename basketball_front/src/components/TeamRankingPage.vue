<template>
    <div class="team-ranking-page">
        <h1>球队排行榜</h1>
        <div v-for="conference in ['东部', '西部']" :key="conference">
            <h2>{{ conference }}</h2>
            <table class="ranking-table">
                <thead>
                <tr>
                    <th>排名</th>
                    <th>队名</th>
                    <th>胜</th>
                    <th>负</th>
                    <th>胜率</th>
                    <th>胜场差</th>
                    <th>主场</th>
                    <th>客场</th>
                    <th>赛区</th>
                    <th>会议</th>
                    <th>得分</th>
                    <th>失分</th>
                    <th>净胜</th>
                    <th>连胜/负</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="team in getTeamsByConference(conference)" :key="team.id">
                    <td v-if="team.ranking <= 8">
                        <span class="rank-circle">{{ team.ranking }}</span>
                    </td>
                    <td v-else>
                    {{ team.ranking }}
                     </td>
                    <!-- 添加点击事件，调用方法以导航和打开弹窗 -->
                    <td @click="navigateToTeam(team.teamId)" class="clickable">{{ team.teamName }}</td>
                    <td>{{ team.wins }}</td>
                    <td>{{ team.losses }}</td>
                    <td>{{ team.winPercentage }}</td>
                    <td>{{ team.gamesBehind }}</td>
                    <td>{{ team.homeRecord }}</td>
                    <td>{{ team.awayRecord }}</td>
                    <td>{{ team.divisionRecord }}</td>
                    <td>{{ team.conferenceRecord }}</td>
                    <td>{{ team.pointsPerGame }}</td>
                    <td>{{ team.pointsAllowedPerGame }}</td>
                    <td>{{ team.netPointsPerGame }}</td>
                    <td>{{ team.streak }}</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            rankings: []
        };
    },
    mounted() {
        this.loadRankings();
    },
    methods: {
        loadRankings() {
            const token = localStorage.getItem('token');
            axios.get('http://192.168.43.201:8088/team/getAllRanking', {
                headers: {
                    'Authorization': token
                }
            })
                .then(response => {
                    this.rankings = response.data.data;
                })
                .catch(error => console.error('Error loading rankings:', error));
        },
        getTeamsByConference(conference) {
            return this.rankings.filter(team => team.conference === conference);
        },navigateToTeam(teamId) {
            this.$router.push({ name: 'TeamsPage', query: { teamId } });
        }
    }
}
</script>

<style scoped>

.team-ranking-page {
    padding: 20px;
    font-family: Arial, sans-serif;
}
h1, h2 {
    text-align: center;
}
.clickable {
    cursor: pointer;
    color: #ea2129; /* 或者其他突出显示颜色 */

}
.ranking-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

.ranking-table th, .ranking-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
}

.ranking-table th {
    background-color: #f4f4f4;
    position: sticky;
    top: 0;
}
h1 {
    text-align: center;
    color: #409EFF;
}
.ranking-table .rank-circle {
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    background-color: #409EFF;
    color: white;
    font-weight: bold;
    display: inline-block;
    margin: auto;
}
</style>