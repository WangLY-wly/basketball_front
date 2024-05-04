<template>
  <div class="news-search-page">
    <el-row class="search-container">
      <el-col :span="18">
        <el-input v-model="searchKeyword" style="width: 100%; height:54px" size="large" placeholder="Please Input"
          :prefix-icon="Search" />
      </el-col>
      <el-col :span="6" class="left-align" id="select">
        <button @click="toggleDropdown" class="dropdown-btn">{{ selectedTeam ? selectedTeam.name : 'Select a Team'
          }}<span class="arrow" v-if="!isDropdownOpen">▼</span><span class="arrow" v-else>▲</span></button>
        <div v-if="isDropdownOpen" class="dropdown-content">
          <div class="conference" v-for="(teams, conference) in groupedTeams" :key="conference">
            <h2 class="conference-title">{{ conference }}</h2>
            <div class="teams">
              <div class="team" v-for="team in teams" :key="team.id" @click="selectTeamLogo(team)">
                <img :src="team.logo" alt="Team Logo" class="team-logo">
                <!-- <span>{{ team.name }}</span> -->
              </div>

            </div>

          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      panelVisible: false,
      isDropdownOpen: false,
      searchKeyword: '',
      selectedTeam: null,
      teams: [
        { id: '1', name: '达拉斯独行侠', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e27275cb4a9cf56f.png', conference: 'west' },
        { id: '2', name: '新奥尔良鹈鹕', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/c5d7ee3d3999e1a3.png', conference: 'west' },
        { id: '3', name: '休斯顿火箭', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b72de688b7833a63.png', conference: 'west' },
        { id: '4', name: '孟菲斯灰熊', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/906d3cb1d084d39b.png', conference: 'west' },
        { id: '5', name: '圣安东尼奥马刺', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d61472f27405ef2f.png', conference: 'west' },
        { id: '6', name: '洛杉矶快船', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0d6670544d67158b.png', conference: 'west' },
        { id: '7', name: '菲尼克斯太阳', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0e9dc75130b041bb.png', conference: 'west' },
        { id: '8', name: '洛杉矶湖人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/4f04d1b4f8a6548a.png', conference: 'west' },
        { id: '9', name: '萨克拉门托国王', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/54b9b9a860d5000d.png', conference: 'west' },
        { id: '10', name: '金州勇士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e6d876b019135540.png', conference: 'west' },
        { id: '11', name: '俄克拉荷马城雷霆', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/3d06df3d7207e41b.png', conference: 'west' },
        { id: '12', name: '丹佛掘金', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/07eaaf35f02b3a43.png', conference: 'west' },
        { id: '13', name: '明尼苏达森林狼', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/171d8fbb81947872.png', conference: 'west' },
        { id: '14', name: '犹他爵士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/42e1e1f96e72c9e7.png', conference: 'west' },
        { id: '15', name: '波特兰开拓者', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/079f9b6b4be966c1.png', conference: 'west' },
        { id: '16', name: '波士顿凯尔特人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/58ad76e5013f88cd.png', conference: 'east' },
        { id: '17', name: '纽约尼克斯', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d1497fa2d3158da7.png', conference: 'east' },
        { id: '18', name: '费城76人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b4f0980fef76de22.png', conference: 'east' },
        { id: '19', name: '布鲁克林篮网', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8fb395595fe476f7.png', conference: 'east' },
        { id: '20', name: '多伦多猛龙', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8143ce5275f35b64.png', conference: 'east' },
        { id: '21', name: '奥兰多魔术', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/6c8eb942322783b9.png', conference: 'east' },
        { id: '22', name: '迈阿密热火', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/584ff80b87a21cd8.png', conference: 'east' },
        { id: '23', name: '亚特兰大老鹰', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/1c4b8d2d45a649b9.png', conference: 'east' },
        { id: '24', name: '夏洛特黄蜂', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/30772edf038d248d.png', conference: 'east' },
        { id: '25', name: '华盛顿奇才', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/a76937b225c20218.png', conference: 'east' },
        { id: '26', name: '密尔沃基雄鹿', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/7091f8420b800878.png', conference: 'east' },
        { id: '27', name: '克利夫兰骑士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b88b9d38a6685d3c.png', conference: 'east' },
        { id: '28', name: '印第安纳步行者', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/83b033b5c036f590.png', conference: 'east' },
        { id: '29', name: '芝加哥公牛', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0d490533faca1986.png', conference: 'east' },
        { id: '30', name: '底特律活塞', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/86e9f9cbf13706fb.png', conference: 'east' }
      ]

    };
  },
  computed: {
    groupedTeams() {
      return this.teams.reduce((group, team) => {
        (group[team.conference] = group[team.conference] || []).push(team);
        return group;
      }, {});
    },
  },
  methods: {
    selectTeamLogo(team) {
      this.selectedTeam = team;
      this.isDropdownOpen = false; // Close dropdown after selection
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
  }
};
</script>

<style scoped>
/* Add your existing styles here */
.dropdown-content {
  display: block;
  /* Override to show the dropdown */
}

/* Additional styles for arrow indicators and dropdown */

.team {
  display: flex;
  flex-direction: row;
}

.conference {
  display: flex;
  flex-direction: column;
  max-width: 250px;
  flex-wrap: wrap;
}

.team-logo {
  width: 30px;
  height: 30px;
}

.teams {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 250px;
}

.dropdown-btn {
  height: 56px;
  background-color: #fff;
  border: solid 1px #333;
  width: 120px;
  min-width: 120px;
  max-width: 120px
}
</style>
