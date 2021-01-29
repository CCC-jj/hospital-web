<template>
  <div class="staffManageInfo">
    <div class="staffManageInfoTop">
      <div>
        新增科室信息
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="saveBtn" icon="save" :loading="iconLoading" @click="toSave">{{save}}</a-button>
        </div>
      </div>
    </div>

    <div class="staffManageInfoContent">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="科室编号" prop="code">
              <a-input v-model="form.code" disabled size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="科室名称" prop="name">
              <a-input placeholder="请输入姓名" v-model="form.name" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="科室状态" prop="status">
              <a-switch :defaultChecked="form.status===1 ? true : false" @change="onChangeStatus" />
            </a-form-model-item>
          </a-col>

        </a-row>

        <a-row :gutter="30">
          <a-col :span="12">
            <a-form-model-item label="科室简介" prop="intro">
              <a-input placeholder="请输入科室简介" v-model="form.intro" size="large" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="创建人" prop="creator">
              <a-input disabled v-model="form.creator" size="large"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="创建时间" prop="createTime">
              <a-date-picker disabled style="width:100%;" v-model="form.createTime" show-time placeholder="选择时间" size="large" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DepartmentInfo',
  data() {
    return {
      save: '保存',
      iconLoading: false,
      form: {
        code: '10010',
        name: '',
        status: 1,
        creator: '李明',
        createTime: '2021-01-30 15:12:55',
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
    }
  },
  methods: {
    onChangeStatus(checked) {
      if (checked) {
        this.form.status = 1
        this.$message.success('科室启用成功')
      } else {
        this.form.status = 0
        this.$message.success('科室停用成功')
      }
    },
    goBack() {
      this.$router.push({ name: 'DepartmentList' })
    },
    toSave() {
      this.iconLoading = true
      this.save = '保存中'
      setTimeout(() => {
        this.iconLoading = false
        this.save = '保存'
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$message.success('保存成功！')
            this.$router.push({ name: 'DepartmentList' })
          } else {
            this.$message.warning('请填写信息后再保存')
            return false
          }
        })
      }, 1000)
    },
  },
}
</script>

<style scoped>
.staffManageInfo {
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  border-radius: 5px;
}

.staffManageInfoTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  font-size: 18px;
}

.staffManageInfoTop > div:nth-child(1) {
  padding-left: 10px;
}

.staffManageInfoTop > div:nth-child(1)::before {
  content: '';
  display: block;
  position: absolute;
  background-color: #656ee8;
  top: 31px;
  left: 20px;
  width: 5px;
  height: 20px;
}

.fixedBtnBox {
  width: 100%;
  margin-left: -1.5%;
  height: 60px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  overflow: visible;
  z-index: 10;
}
.fixedBtn {
  width: 36%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}

.ant-btn {
  font-weight: bold;
}

.saveBtn {
  background-color: #656ee8;
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 20px;
}

.saveBtn:hover {
  color: #ffffff;
  background-color: #8087e7;
}

.saveBtn:focus {
  background-color: #656ee8;
  color: #ffffff;
}

.backBtn {
  color: #656ee8;
  border: 1px solid #656ee8;
}

.backBtn:hover {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
}

.backBtn:focus {
  color: not specified;
  border: 1px solid #656ee8;
}

.ant-switch-checked {
  background-color: rgb(69, 213, 133);
}

.staffManageInfoContent {
  margin-top: 30px;
}
.ant-switch {
  margin: 8px 0;
}
</style>