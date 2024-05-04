<template>
    <div class="user-center">
      <h1>个人中心</h1>
      <el-form :model="userData">
        <el-form-item label="用户名 ">
          <el-input v-model="userData.userName" :disabled="!isEditing"></el-input>
        </el-form-item>
        <el-form-item label="邮箱 2 ">
          <el-input v-model="userData.email" :disabled="!isEditing"></el-input>
        </el-form-item>
        <el-form-item label="性别  " v-if="!isEditing">
            <!-- <span>{{ genderText[userData.gender] }}</span> -->
            <el-tag :type="'info'">{{ genderText[userData.gender] }}</el-tag>
          </el-form-item>
        <el-form-item label="性别  " v-if="isEditing">
          <el-radio-group v-model="userData.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="userData.sign" :disabled="!isEditing"></el-input>
        </el-form-item>
        <el-form-item label="角色  ">
          <el-tag :type="roleColor[userData.roleId]">{{ roleText[userData.roleId] }}</el-tag>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="toggleEdit">{{ isEditing ? '保存' : '修改信息' }}</el-button>
          <el-button v-if="userData.roleId === 2" type="success" @click="goToAdminPanel">管理员后台</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        userData: {},
        isEditing: false,
        roleText: {
          1: 'User',
          2: 'Administrator'
        },
        roleColor: {
          1: 'info',
          2: 'warning'
        },
        genderText: {
          1: '男',
          2: '女'
        }
      };
    },
    methods: {
      fetchUserData() {
        const token = localStorage.getItem('token');
        axios.get('http://192.168.43.201:8088/user/getUserById2', {
          headers: { 'Authorization': token }
        }).then(response => {
          if (response.data.code === 200) {
            this.userData = response.data.data;
          }
        }).catch(error => {
          console.error('Failed to fetch user data:', error);
        });
      },
      toggleEdit() {
        if (this.isEditing) {
          // 这里添加保存逻辑
          this.saveUserData();
        }
        this.isEditing = !this.isEditing;
      },
      saveUserData() {
        // 提交用户信息更新
        const token = localStorage.getItem('token');
        axios.post('http://192.168.43.201:8088/user/update', this.userData, {
          headers: { 'Authorization': token }
        }).then(response => {
          console.log('Update response:', response);
        }).catch(error => {
          console.error('Update failed:', error);
        });
      },
      goToAdminPanel() {
        this.$router.push('/admin');
      }
    },
    mounted() {
      this.fetchUserData();
    }
  }
  </script>
  
  <style scoped>
  .user-center {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  }
  
  .user-center h1 {
    text-align: center;
    color: #409EFF;
    font-size: 24px;
  }
  
  .el-form-item {
    margin-bottom: 20px;
  }
  
  .el-input, .el-radio {
    font-size: 16px; /* Increased font size for better readability */
  }
  
  .el-tag {
    font-size: 16px;
    line-height: 30px; /* Increased line height for better alignment with inputs */
  }
  
  .el-button {
    font-size: 16px;
  }
  </style>
  