<template>
  <div class="newTemplate">
    <div class="newTemplateTop">
      <div>
        新建检查报告模板
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="saveBtn" icon="save" :loading="iconLoading" @click="toSave">{{save}}</a-button>
        </div>
      </div>
    </div>

    <div class="newTemplateContent">
      <div class="templateInfoBox">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <a-row :gutter="30">
            <a-col :span="6">
              <a-form-model-item label="模板编号" prop="no">
                <a-input style="color:#000;" v-model="form.no" disabled size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="模板名称" prop="name">
                <a-input style="color:#000;" v-model="form.name" size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="模板权限" prop="authority">
                <a-radio-group v-model="form.authority">
                  <a-radio value="私人模板">
                    私人模板
                  </a-radio>
                  <a-radio value="公共模板">
                    公共模板
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="模板说明" prop="description">
                <a-input style="color:#000;" v-model="form.description" size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="创建人员" prop="creator">
                <a-input style="color:#000;" v-model="form.creator" disabled size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="创建时间" prop="time">
                <a-input style="color:#000;" v-model="form.time" disabled size="large" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <div class="recordInfoBox">
        <div class="title">
          报告信息
        </div>
        <div>
          <p class="reportInfoTitle">检查所见</p>
          <a-textarea v-model="checkInfo" :rows="8" />
        </div>
        <div>
          <p class="reportInfoTitle">诊断意见</p>
          <a-textarea v-model="diagnosis" :rows="8" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChargedDetails',
  inject: ['reload'],
  data() {
    return {
      page: '',
      iconLoading: false,
      save: '保存',
      form: {
        no: 'RZ00055',
        name: '',
        authority: '私人模板',
        description: '',
        creator: '王冕',
        time: '2019-10-09',
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.page = this.$route.params.page
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'ReportList' })
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
            this.$router.push({ name: 'ReportList' })
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
.newTemplate {
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  border-radius: 5px;
}
.newTemplateTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  font-size: 18px;
}

.newTemplateTop > div:nth-child(1) {
  padding-left: 10px;
}

.newTemplateTop > div:nth-child(1)::before {
  content: '';
  display: block;
  position: absolute;
  background-color: #656ee8;
  top: 31px;
  left: 20px;
  width: 5px;
  height: 20px;
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
  background-color: #8087e7;
  color: #ffffff;
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

.templateInfoBox {
  background-color: rgb(238, 239, 251);
  border-radius: 5px;
  margin-top: 20px;
  padding: 18px;
}
.title {
  color: #656ee8;
  font-weight: bold;
  margin: 20px 0;
  font-size: 18px;
}
.title span {
  color: #cacaca;
  font-size: 12px;
}
.ant-form-item {
  margin-bottom: 0;
}
.recordInfoBox > div {
  margin-bottom: 20px;
}
.reportInfoTitle {
  font-weight: bold;
  font-size: 18px;
  color: #606060;
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
</style>