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

    <a-modal class="orgModal" centered v-model="visible" title="进入机构" :footer="null" :keyboard="false" :maskClosable="false" :closable="false">
      <p class="subtitle">请选择您的机构</p>
      <div class="orgBox" v-for="item in orgInfoList" :key="item.orgCode" @click="chooseOrg(item)">{{item.orgName}}
        <a-icon style="float:right;line-height:60px;color:#888;" type="right" />
      </div>
    </a-modal>
  </div>
</template>

<script>
import { login, loginHospitalList, loginHospitalConfirm } from '@/api/login'
import { getCommonTitle } from '@/api/common'
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
      visible: false,
      ruleForm: {
        mobile: '',
        password: '',
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
      },
      layout: {
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 24,
        },
      },
      orgInfoList: [],
    }
  },
  created() {
    getCommonTitle()
      .then((res) => {
        window.document.title = res.data
      })
      .catch((err) => {
        console.log(err)
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
    setUserInfo() {
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
    getCookie(key) {
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
    setCookie(cName, value, expiredays) {
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
          let timestamp = Math.round(new Date().getTime() / 1000)
          let sign = md5(timestamp + ':123456')
          login(sign, timestamp, 2, this.ruleForm.mobile, password).then((res) => {
            // this.$store.dispatch('userInfo',res.data)
            if (res.success) {
              localStorage.setItem('token', res.data)
              loginHospitalList()
                .then((res) => {
                  if (res.success) {
                    this.orgInfoList = res.data.orgInfo
                    
                    localStorage.setItem('photoUrl', res.data.photoUrl)
                    localStorage.setItem('userName', res.data.userName)
                    localStorage.setItem('userSex', res.data.userSex)
                    localStorage.setItem('orgInfoList', JSON.stringify(res.data.orgInfo))
                    this.setUserInfo()
                    if (res.data.tokenInfo.status === 1) {
                      localStorage.setItem('token', res.data.tokenInfo.token)
                      localStorage.setItem('orgInfo', JSON.stringify(res.data.orgInfo[0]))
                      this.$router.push('/')
                      this.$message.success('登录成功')
                    } else {
                      this.visible = true
                      this.$message.info('请选择机构')
                    }
                  } else {
                    this.$message.warning(res.message)
                  }
                })
                .catch((err) => {
                  console.error(err)
                })
              // localStorage.setItem('orgUrl', res.data.orgUrl)
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
    chooseOrg(item) {
      loginHospitalConfirm(item.orgCode, item.proCode)
        .then((res) => {
          if (res.success) {
            localStorage.setItem('token', res.data.token)
            localStorage.setItem('orgInfo', JSON.stringify(item))
            this.$router.push('/')
            this.$message.success('登录成功')
          } else {
            this.$message.warning(res.message)
          }
        })
        .catch((err) => {})
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
  top: 110px;
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
.orgModal /deep/ .ant-modal-title {
  font-size: 22px;
  font-weight: bold;
}
.subtitle {
  font-size: 18px;
}
.orgBox {
  cursor: pointer;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  border-top: 1px solid #eee;
  padding: 0 20px;
}
.orgBox:hover {
  background: #eee;
}
</style>
