<template>
  <div class="news-search-page">
    <el-row class="search-container">
      <el-col :span="18">
        <el-input v-model="searchKeyword" style="width: 100%; height:54px" size="large" placeholder="输入关键词"
          :prefix-icon="Search">
          <template #append>
            <el-button class="search-button">
              <svg t="1714813007489" class="icon" viewBox="0 0 1025 1024" version="1.1"
                xmlns="http://www.w3.org/2000/svg" p-id="4206" width="35" height="35">
                <path
                  d="M954.742349 919.778713 756.657398 721.798199c28.399507-32.029181 51.217816-68.139568 67.935815-107.665637 20.543235-48.571072 30.960244-100.152367 30.960244-153.311469s-10.417009-104.739373-30.960244-153.311469c-19.837778-46.902139-48.232166-89.019662-84.395796-125.182268-36.161582-36.162606-78.279105-64.556994-125.182268-84.394772-48.571072-20.543235-100.152367-30.960244-153.311469-30.960244S356.964308 77.389348 308.393236 97.932584c-46.902139 19.837778-89.019662 48.232166-125.182268 84.394772s-64.556994 78.280129-84.394772 125.182268c-20.543235 48.571072-30.960244 100.152367-30.960244 153.311469s10.417009 104.739373 30.960244 153.311469c19.837778 46.903163 48.232166 89.019662 84.394772 125.182268 36.162606 36.162606 78.280129 64.558018 125.182268 84.395796 48.571072 20.543235 100.152367 30.960244 153.311469 30.960244s104.739373-10.417009 153.311469-30.960244c39.188187-16.574656 75.020078-39.145184 106.844481-67.206809l198.14024 198.03478c4.798951 4.796903 11.083559 7.192794 17.371238 7.192794 6.290751 0 12.582527-2.402035 17.380453-7.202009C964.345369 944.930456 964.341274 929.372518 954.742349 919.778713zM461.704705 805.524373c-92.072888 0-178.635225-35.85544-243.741021-100.960212s-100.961236-151.669157-100.961236-243.742045 35.85544-178.635225 100.961236-243.741021 151.668133-100.961236 243.741021-100.961236 178.636249 35.85544 243.742045 100.961236 100.960212 151.668133 100.960212 243.741021-35.85544 178.636249-100.960212 243.742045S553.777593 805.524373 461.704705 805.524373z"
                  fill="#252334" p-id="4207"></path>
              </svg>
            </el-button>
          </template>

        </el-input>
      </el-col>
      <el-col :span="6" class="left-align" id="select">
        <button @click="toggleDropdown" class="dropdown-btn">{{ selectedTeam ? selectedTeam.name : '筛选队伍'
          }}<span class="arrow" v-if="!isDropdownOpen">▼</span><span class="arrow" v-else>▲</span></button>
        <div v-if="isDropdownOpen" class="dropdown-content">
          <div class="conference" v-for="(teams, conference) in groupedTeams" :key="conference">
            <h2 class="conference-title">{{ conference }}</h2>
            <div class="teams">
              <div class="team" v-for="team in teams" :key="team.id" @click="selectTeamLogo(team)">
                <div class="logo-name">
                  <img :src="team.logo" alt="Team Logo" class="team-logo">
                  <span class="team-name">{{ team.name }}</span>
                </div>
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
        { id: '1', name: '达拉斯独行侠', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e27275cb4a9cf56f.png', conference: '西部' },
        { id: '2', name: '新奥尔良鹈鹕', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/c5d7ee3d3999e1a3.png', conference: '西部' },
        { id: '3', name: '休斯顿火箭', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b72de688b7833a63.png', conference: '西部' },
        { id: '4', name: '孟菲斯灰熊', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/906d3cb1d084d39b.png', conference: '西部' },
        { id: '5', name: '圣安东尼奥马刺', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d61472f27405ef2f.png', conference: '西部' },
        { id: '6', name: '洛杉矶快船', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0d6670544d67158b.png', conference: '西部' },
        { id: '7', name: '菲尼克斯太阳', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0e9dc75130b041bb.png', conference: '西部' },
        { id: '8', name: '洛杉矶湖人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/4f04d1b4f8a6548a.png', conference: '西部' },
        { id: '9', name: '萨克拉门托国王', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/54b9b9a860d5000d.png', conference: '西部' },
        { id: '10', name: '金州勇士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/e6d876b019135540.png', conference: '西部' },
        { id: '11', name: '俄克拉荷马城雷霆', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/3d06df3d7207e41b.png', conference: '西部' },
        { id: '12', name: '丹佛掘金', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/07eaaf35f02b3a43.png', conference: '西部' },
        { id: '13', name: '明尼苏达森林狼', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/171d8fbb81947872.png', conference: '西部' },
        { id: '14', name: '犹他爵士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/42e1e1f96e72c9e7.png', conference: '西部' },
        { id: '15', name: '波特兰开拓者', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/079f9b6b4be966c1.png', conference: '西部' },
        { id: '16', name: '波士顿凯尔特人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/58ad76e5013f88cd.png', conference: '东部' },
        { id: '17', name: '纽约尼克斯', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/d1497fa2d3158da7.png', conference: '东部' },
        { id: '18', name: '费城76人', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b4f0980fef76de22.png', conference: '东部' },
        { id: '19', name: '布鲁克林篮网', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8fb395595fe476f7.png', conference: '东部' },
        { id: '20', name: '多伦多猛龙', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/8143ce5275f35b64.png', conference: '东部' },
        { id: '21', name: '奥兰多魔术', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/6c8eb942322783b9.png', conference: '东部' },
        { id: '22', name: '迈阿密热火', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/584ff80b87a21cd8.png', conference: '东部' },
        { id: '23', name: '亚特兰大老鹰', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/1c4b8d2d45a649b9.png', conference: '东部' },
        { id: '24', name: '夏洛特黄蜂', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/30772edf038d248d.png', conference: '东部' },
        { id: '25', name: '华盛顿奇才', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/a76937b225c20218.png', conference: '东部' },
        { id: '26', name: '密尔沃基雄鹿', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/7091f8420b800878.png', conference: '东部' },
        { id: '27', name: '克利夫兰骑士', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/b88b9d38a6685d3c.png', conference: '东部' },
        { id: '28', name: '印第安纳步行者', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/83b033b5c036f590.png', conference: '东部' },
        { id: '29', name: '芝加哥公牛', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/0d490533faca1986.png', conference: '东部' },
        { id: '30', name: '底特律活塞', logo: 'https://gdc.hupucdn.com/gdc/nba/team/logo/86e9f9cbf13706fb.png', conference: '东部' }
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
.news-search-page {
  margin-top: 10px;
}

.search-button {
  display: flex;

}


.dropdown-content {
  display: block;
  /* Override to show the dropdown */
}

/* Additional styles for arrow indicators and dropdown */

.team {
  display: flex;
  flex-direction: column;
  margin: 4px;
  align-items: center;
  
}

.conference {
  display: flex;
  flex-direction: column;
  max-width: 250px;
  flex-wrap: wrap;
  justify-content: center;
}


.dropdown-content {
  margin-top: 12px;
  background-color: rgb(229, 229, 229);
  padding: 23px;
  border-radius: 13px;
  width: 580px;
  position: relative;
  left: -175px;
}

/*

TODO://展示图标

*/

.team-name {
  width: 130px;
}

.logo-name {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.team-logo {
  width: 38px;
  height: 38px;
}

.teams {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 580px;
}

.dropdown-btn {
  height: 56px;
  background-color: #fff;
  border: solid 1px rgb(166, 164, 164);
  width: 130px;
  border-radius: 8px;
  min-width: 130px;
  max-width: 130px;
  position: relative;
  left: -120px;
}
</style>
