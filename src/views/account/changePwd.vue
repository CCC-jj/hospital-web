<template>
  <div class="changePwd">
    <a-button type="primary" @click="submitForm('ruleForm')" size="large">
      确定修改
    </a-button>
    <a-list itemLayout="horizontal">
      <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
        <a-form-model-item has-feedback label="原密码" prop="oldPwd" required>
          <a-input v-model="ruleForm.oldPwd" type="password" autocomplete="off" size="large" placeholder="请输入原密码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="新密码" prop="pass" required>
          <a-input v-model="ruleForm.pass" type="password" autocomplete="off" size="large" placeholder="请输入新密码" />
        </a-form-model-item>
        <a-form-model-item has-feedback label="再次输入" prop="checkPass" required>
          <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" size="large" placeholder="请再次输入新密码" />
        </a-form-model-item>
        <!--<a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
          <a-button type="primary" @click="submitForm('ruleForm')" size="large">
            确定修改
          </a-button>
        </a-form-model-item>-->
      </a-form-model>
    </a-list>
  </div>
</template>

<script>
import { changePwd } from '@/api/user'
import md5 from 'md5'
export default {
  data() {
    let checkOldPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入原密码'))
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
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次密码不一致！'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        pass: '',
        checkPass: '',
        oldPwd: '',
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }],
        oldPwd: [{ validator: checkOldPwd, trigger: 'change' }],
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
      // oldPwd: '',
      // newPwd: '',
      // confirmPwd: '',
      confirmLoading: false,
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          changePwd(md5(this.ruleForm.oldPwd), md5(this.ruleForm.pass)).then((res) => {
            if (res.success) {
              this.$notification.success({
                message: '提示',
                description: '修改成功,请重新登录',
              })
              this.$refs[formName].resetFields()
              localStorage.removeItem('token')
              this.setCookie('account', '', -1)
              this.setCookie('password', '', -1)
              this.$router.push('/')
            } else {
              this.$message.warning(res.message)
            }
          })
          // alert('修改成功')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    // }
  },
}
</script>

<style lang="" scoped>
.changePwd {
  width: 100%;
  background-color: #ffffff;
  padding: 24px 24px 100px 24px;
  position: relative;
  border-radius: 5px;
  margin: 0 auto !important;
}
.changePwd .ant-btn {
  position: absolute;
  right: 30px;
}
.changePwd .ant-list {
  padding-top: 80px;
  width: 500px;
  margin: 0 auto;
}
.ant-btn {
  background-color: #656ee8;
  border: none;
}
.ant-btn:hover {
  background-color: #656ee8;
}
.ant-btn:focus {
  background-color: #656ee8;
}
</style>
