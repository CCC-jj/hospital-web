<template>
  <div class="login">
    <div class="loginLeft">
      <img src="../../assets/u137.svg" />
    </div>
    <div class="loginRight">
      <h1>互联网医院医生端</h1>
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" @keyup.enter.native="submitForm('ruleForm')">
        <a-form-model-item has-feedback label="" prop="mobile">
          <a-input class="changebgInput" v-model="ruleForm.mobile" size="large" placeholder="请输入手机号码">
            <img slot="prefix" src="../../assets/u181.png" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="" prop="password">
          <a-input class="changebgInput" v-model="ruleForm.password" size="large" type="password" autocomplete="off" placeholder="请输入密码">
            <img slot="prefix" src="../../assets/u175.png" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item has-feedback label="" prop="hospital">
          <a-select class="changebgSelect" placeholder="请选择医院" v-model="ruleForm.hospital" size="large" @change="handleChange">
            <!-- <img slot="prefix" slot-scope="menu" src="../../assets/account_balance_u169.png" /> -->
            <a-select-option v-for="item in hospitalList" :key="item.orgCode"> {{item.orgName}} </a-select-option>
          </a-select>
        </a-form-model-item>

        <div class="forget">
          <a-checkbox v-model="ruleForm.checked" @change="onChange"> 1个月内免登陆 </a-checkbox>
          <router-link to="/user/forgetpwd">忘记密码</router-link>
        </div>

        <a-form-model-item :wrapper-col="{ span: 24, offset: 0 }">
          <a-button class="loginBtn" size="large" block type="primary" @click="submitForm('ruleForm')">
            登录
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import { loginByMobile, getHospitalList } from '@/api/login'
import md5 from 'md5'
export default {
  data() {
    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      callback()
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      }
      callback()
    }
    return {
      ruleForm: {
        mobile: '',
        password: '',
        hospital: undefined,
        proCode: '',
        checked: false,
      },
      rules: {
        password: [
          {
            validator: validatePass,
            trigger: 'change',
          },
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: 'change',
          },
        ],
        hospital: [
          {
            required: true,
            message: '请选择医院',
            trigger: 'change',
          },
        ],
      },
      layout: {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 24,
        },
      },
      hospitalList: [],
    }
  },
  created() {
    getHospitalList().then((res) => {
      this.hospitalList = res.data
      this.ruleForm.hospital = res.data[0].orgCode
      this.ruleForm.proCode = res.data[0].proCode
    })
    // 在页面加载时从cookie获取登录信息
    let account = this.getCookie('account')
    let password = this.getCookie('password')
    // 如果存在赋值给表单，并且将记住密码勾选
    if (account) {
      this.ruleForm.mobile = account
      this.ruleForm.password = password
      this.ruleForm.checked = true
    }
  },
  methods: {
    // 储存表单信息
    setUserInfo: function () {
      // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
      // 如果没有勾选，储存的信息为空
      if (this.ruleForm.checked) {
        // 加密密码后在存入cookie
        if (!this.getCookie('password') || this.ruleForm.password != this.getCookie('password')) {
          this.setCookie('account', '', -1)
          this.setCookie('password', '', -1)
          const account = this.ruleForm.mobile
          const passWord = md5(this.ruleForm.password)
          this.setCookie('account', account, 30)
          this.setCookie('password', passWord, 30)
        }
      } else {
        this.setCookie('account', '', -1)
        this.setCookie('password', '', -1)
      }
    },
    // 获取cookie
    getCookie: function (key) {
      if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(key + '=')
        if (start !== -1) {
          start = start + key.length + 1
          var end = document.cookie.indexOf(';', start)
          if (end === -1) end = document.cookie.length
          return unescape(document.cookie.substring(start, end))
        }
      }
      return ''
    },
    // 保存cookie
    setCookie: function (cName, value, expiredays) {
      var exdate = new Date()
      exdate.setDate(exdate.getDate() + expiredays)
      document.cookie =
        cName +
        '=' +
        decodeURIComponent(value) +
        (expiredays == null ? '' : ';expires=' + exdate.toGMTString())
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let password = md5(this.ruleForm.password)
          if (this.getCookie('password') && this.ruleForm.password == this.getCookie('password')) {
            password = this.getCookie('password')
          }
          loginByMobile(
            this.ruleForm.mobile,
            password,
            this.ruleForm.hospital,
            this.ruleForm.proCode
          ).then((res) => {
            // this.$store.dispatch('userInfo',res.data)
            if (res.success) {
              localStorage.setItem('token', res.data.token)
              localStorage.setItem('photoUrl', res.data.photoUrl)
              localStorage.setItem('userName', res.data.userName)
              localStorage.setItem('userSex', res.data.userSex)
              localStorage.setItem('orgName', res.data.orgName)
              localStorage.setItem('orgUrl', res.data.orgUrl)
              this.setUserInfo()
              this.$router.push('/')
              this.$message.success('登录成功')
            } else {
              this.$message.warning(res.message)
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
      // let org = this.hospital
      const org = this.hospitalList.filter((item) => item.orgCode == value)
      this.ruleForm.proCode = org[0].proCode
    },
    onChange(e) {
      // console.log(`checked = ${e.target.checked}`)
    },
  },
}
</script>

<style scoped>
.loginLeft {
  position: absolute;
  top: 120px;
  left: 68px;
}

.loginLeft img {
  width: 400px;
  height: 283px;
}

.loginRight {
  position: absolute;
  width: 280px;
  height: 300px;
  top: 80px;
  right: 60px;
}

.loginRight h1 {
  text-align: center;
  font-weight: bold;
  margin-bottom: 30px;
}

.changebgInput .ant-input {
  background-color: #f0f1fd;
  border: 1px solid #f0f1fd;
  padding-bottom: 10px;
  font-size: 14px;
  padding-left: 40px !important;
}

.changebgSelect .ant-select-selection {
  font-size: 14px;
  color: #2c2c2c;
  background-color: #f0f1fd;
  border: 1px solid #f0f1fd;
}

.forget {
  position: relative;
  margin-top: -10px;
  margin-bottom: 10px;
}
.forget a {
  position: absolute;
  color: #656ee8;
  right: 0;
}
.loginBtn {
  background-color: #656ee8;
  border: none;
}
.loginBtn:hover {
  background-color: #656ee8;
  box-shadow: 0px 5px 15px #656ee8;
}
.loginBtn:focus {
  background-color: #656ee8;
}
</style>
