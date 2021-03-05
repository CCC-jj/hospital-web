<template>
  <div class="forgetPwd">
    <h1>找回密码</h1>
    <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
      <a-form-model-item prop="mobile">
        <a-input class="changebgInput" v-model="ruleForm.mobile" type="mobile" autocomplete="off" placeholder="请输入手机号码" size="large">
          <img src="../../assets/u181.png" slot="prefix" />
        </a-input>
      </a-form-model-item>

      <a-form-model-item class="codeBox" prop="code">
        <a-row :gutter="16">
          <a-col :span="14">
            <div class="codeInput">
              <a-input class="changebgInput" v-model="ruleForm.code" type="text" autocomplete="off" placeholder="请输入验证码" size="large">
                <img src="../../assets/speaker_notes_u223.png" slot="prefix" />
              </a-input>
            </div>
          </a-col>
          <a-col :span="10">
            <div class="codeBtn">
              <a-button size="large" block :class="['getcode',{disabledBtn:!disabledCodeBtn}]" type="primary" @click="sendCode" tabindex="-1" :disabled="!disabledCodeBtn">
                {{ codeText }}
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-form-model-item>

      <a-form-model-item prop="password">
        <a-input class="changebgInput" v-model="ruleForm.password" type="password" autocomplete="off" placeholder="请输入新密码" size="large">
          <img src="../../assets/u175.png" slot="prefix" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item prop="checkPass">
        <a-input class="changebgInput" v-model="ruleForm.checkPass" type="password" autocomplete="off" placeholder="再次输入新密码" size="large">
          <img src="../../assets/u175.png" slot="prefix" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 24, offset: 0 }">
        <a-button class="forgetPwdBtn" type="primary" block size="large" @click="submitForm('ruleForm')">
          确定修改
        </a-button>
      </a-form-model-item>
      <div class="hastoLogin">
        <router-link to="/user/login">已有账号，去登录</router-link>
      </div>
    </a-form-model>
  </div>
</template>

<script>
import { getCode, retrievePassword } from '@/api/login'
import md5 from 'md5'
export default {
  name: 'forgetPwd',
  data() {
    let checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号码'))
      }
      callback()
    }
    let checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入验证码'))
      }
      callback()
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      codeText: '发送验证码',
      disabledCodeBtn: true,
      ruleForm: {
        password: '',
        checkPass: '',
        mobile: '',
        code: '',
      },
      rules: {
        password: [
          {
            validator: validatePass,
            trigger: 'change',
          },
        ],
        checkPass: [
          {
            validator: validatePass2,
            trigger: 'change',
          },
        ],
        mobile: [
          {
            validator: checkMobile,
            trigger: 'change',
          },
        ],
        code: [
          {
            validator: checkCode,
            trigger: 'change',
          },
        ],
      },
      layout: {
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 24,
        },
      },
    }
  },
  methods: {
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
    // 修改密码
    submitForm(formName) {
      let serialNumber = localStorage.getItem('serialNumber')
      this.$refs[formName].validate((valid) => {
        if (valid) {
          retrievePassword(
            this.ruleForm.mobile,
            this.ruleForm.code,
            md5(this.ruleForm.password),
            serialNumber
          ).then((res) => {
            if (res.success == true) {
              this.setCookie('account', '', -1)
              this.setCookie('password', '', -1)
              this.$message.success('密码修改成功')
              this.$router.push({ path: '/user/login' })
            } else if (res.code == 'ILLEGAL_ARGUMENT') {
              this.$message.warning('请重新获取验证码')
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    verifyPhone() {
      if (!this.ruleForm.mobile) {
        return '请输入手机号'
      } else if (this.ruleForm.mobile.length !== 11) {
        return '请输入正确的手机号码'
      } else {
        return false
      }
    },
    // 倒计时方法
    countDown(time) {
      if (time === 0) {
        this.disabledCodeBtn = true
        this.codeText = '发送验证码'
        return
      } else {
        this.disabledCodeBtn = false
        this.codeText = '重新发送(' + time + ')'
        time--
      }
      setTimeout(() => {
        this.countDown(time)
      }, 1000)
    },
    // 发送验证码
    sendCode() {
      if (this.verifyPhone()) {
        this.$message.info(this.verifyPhone())
      } else {
        getCode(this.ruleForm.mobile, '0000000001').then((res) => {
          localStorage.removeItem('serialNumber')
          if (res.success == true) {
            localStorage.setItem('serialNumber', res.data.smsId)
            this.$message.info('发送成功')
            this.countDown(res.data.sendInterval)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },
  },
}
</script>

<style lang="" scoped>
.forgetPwd {
  width: 350px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.forgetPwd h1 {
  font-weight: bold;
}

.ant-form-item-children {
  display: flex;
  /* position: relative; */
}
.changebgInput .ant-input {
  background-color: #f0f1fd;
  border: 1px solid #f0f1fd;
  padding-bottom: 10px;
  font-size: 14px;
  padding-left: 40px !important;
}
.hastoLogin {
  margin-top: -15px;
  text-align: center;
}
.forgetPwdBtn {
  background-color: #656ee8;
  border: none;
}
.forgetPwdBtn:hover {
  background-color: #656ee8;
  box-shadow: 0px 2px 10px #656ee8;
}
.forgetPwdBtn:focus {
  background-color: #656ee8;
}
.hastoLogin a {
  color: #656ee8;
}
.getcode {
  background-color: #656ee8;
  color: #ffffff;
  border: none;
}
.getcode:hover {
  background-color: #656ee8;
  color: #ffffff;
}
.getcode:focus {
  background-color: #656ee8;
  color: #ffffff;
}
.disabledBtn{
  background-color: #c4c4c4;
}
</style>
