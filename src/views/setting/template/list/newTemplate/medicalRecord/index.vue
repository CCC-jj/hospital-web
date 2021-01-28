<template>
  <div class="newTemplate">
    <div class="newTemplateTop">
      <div>
        新建病历模板
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
              <a-form-model-item label="模板类型" prop="types">
                <a-radio-group v-model="form.types">
                  <a-radio value="西药模板">
                    西药模板
                  </a-radio>
                  <a-radio value="中药模板">
                    中药模板
                  </a-radio>
                </a-radio-group>
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
          病历信息<span>（病历信息可在系统设置-基础设置中的自定义设置）</span>
        </div>
        <a-form-model ref="recordRuleForm" :model="recordForm" :rules="recordRules" layout="vertical">
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="诊断" prop="diagnosis">
                <a-select v-model="recordForm.diagnosis" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
                  <a-select-option v-for="item in diagnosisList" :key="item">
                    {{item}}
                  </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="主诉" prop="complaint">
                <a-select v-model="recordForm.complaint" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
                  <a-select-opt-group v-for="(item,index) in chiefList" :key="index" :label="item.chiefName">
                    <a-select-option v-for="itemChild in item.chiefs" :key="itemChild">
                      {{itemChild}}
                    </a-select-option>
                  </a-select-opt-group>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="现病史" prop="historyIllness">
                <a-textarea v-model="recordForm.historyIllness" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="既往史" prop="pastHistory">
                <a-textarea v-model="recordForm.pastHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="过敏史" prop="allergies">
                <a-textarea v-model="recordForm.allergies" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="个人史" prop="personalHistory">
                <a-textarea v-model="recordForm.personalHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="家族史" prop="familyHistory">
                <a-textarea v-model="recordForm.familyHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="辅助检查" prop="auxiliaryCheck">
                <a-textarea v-model="recordForm.auxiliaryCheck" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="治疗意见" prop="treatmenOpinion">
                <a-textarea v-model="recordForm.treatmenOpinion" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="医嘱" prop="advice">
                <!-- <a-textarea v-model="recordForm.advice" :auto-size="{ minRows: 3, maxRows: 6 }" /> -->
                <a-select v-model="recordForm.advice" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
                  <a-select-option v-for="item in adviceList" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="备注" prop="remark">
                <a-textarea v-model="recordForm.remark" :auto-size="{ minRows: 3, maxRows: 6 }" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import { getReceiveDiagnosis, getReceiveAdvice, getReceiveChief } from '@/api/admission'
export default {
  name: 'ChargedDetails',
  data() {
    return {
      page: '',
      iconLoading: false,
      diagnosisList: [],
      adviceList: [],
      chiefList: [],
      save: '保存',
      form: {
        no: 'RZ00055',
        name: '',
        types: '西药模板',
        authority: '私人模板',
        description: '',
        creator: '王冕',
        time: '2019-10-09',
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      },
      recordForm: {
        diagnosis: undefined,
        complaint: undefined,
        historyIllness: '',
        pastHistory: '',
        allergies: '',
        personalHistory: '',
        familyHistory: '',
        auxiliaryCheck: '',
        treatmenOpinion: '',
        advice: undefined,
        remark: '',
      },
      recordRules: {
        diagnosis: [
          {
            required: true,
            message: '请输入诊断信息',
            trigger: 'blur',
          },
        ],
        complaint: [
          {
            required: true,
            message: '请输入主诉信息',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    // 获取诊断信息
    getReceiveDiagnosis().then((res) => {
      if (res.success) {
        this.diagnosisList = res.data
      }
    })
    // 获取医嘱信息
    getReceiveAdvice().then((res) => {
      if (res.success) {
        this.adviceList = res.data
      }
    })
    // 获取主诉信息
    getReceiveChief().then((res) => {
      if (res.success) {
        this.chiefList = res.data
      }
    })
    this.page = this.$route.params.page
  },
  methods: {
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    goBack() {
      this.$router.push({ name: 'MedicalList' })
    },
    toSave() {
      this.iconLoading = true
      this.save = '保存中'
      setTimeout(() => {
        this.iconLoading = false
        this.save = '保存'
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$refs.recordRuleForm.validate((valid) => {
              if (valid) {
                this.$message.success('保存成功！')
                this.$router.push({ name: 'MedicalList' })
              } else {
                this.$message.warning('请填写信息后再保存')
                return false
              }
            })
          } else {
            this.$message.warning('请填写信息后再保存')
            return false
          }
        })
      }, 1000)
    },
    callback(key) {
      console.log(key)
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