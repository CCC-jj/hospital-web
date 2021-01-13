<template>
  <div class="maintain">
    <div class="maintainTop">
      <a-button class="addBtn" icon="plus-circle" @click="addClick">新增</a-button>
    </div>
    <hr class="exportLine" />
    <div class="manageContent">
      <div class="maintainTabs">
        <a-radio-group button-style="solid" v-model="value" @change="onChange">
          <a-radio-button :style="radioStyle" value="Diagnosis">
            诊断信息
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="Advice">
            医嘱信息
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="Complaint">
            主诉信息
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="PresentIllness">
            现病史
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="HistoryIllness">
            既往史
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="HistoryAllergy">
            过敏史
          </a-radio-button>
          <!-- <a-radio-button :style="radioStyle" value="HistoryPerson">
            个人史
          </a-radio-button> -->
          <a-radio-button :style="radioStyle" value="AuxiliaryCheck">
            辅助检查
          </a-radio-button>
          <a-radio-button :style="radioStyle" value="PersonOpinion">
            治疗意见
          </a-radio-button>
        </a-radio-group>
      </div>

      <a-modal centered v-model="addVisible" :title="modalTitle" @ok="handleOk">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item v-if="value=='Diagnosis'" label="诊断信息" prop="diagnosisDesc">
            <a-textarea v-model="form.diagnosisDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='Advice'" label="医嘱信息" prop="adviceDesc">
            <a-textarea v-model="form.adviceDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='Complaint'" label="主诉类型" prop="complaintType">
            <a-select v-model="form.complaintType" placeholder="请选择">
              <a-select-option v-for="item in complaintTypesList" :key="item.typeCode">
                {{item.typeName}}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item v-if="value=='Complaint'" label="主诉信息" prop="complaintDesc">
            <a-textarea v-model="form.complaintDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='PresentIllness'" label="现病史内容" prop="presentIllnessDesc">
            <a-textarea v-model="form.presentIllnessDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='HistoryIllness'" label="既往史内容" prop="historyIllnessDesc">
            <a-textarea v-model="form.historyIllnessDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='HistoryAllergy'" label="过敏史内容" prop="historyAllergyDesc">
            <a-textarea v-model="form.historyAllergyDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='HistoryPerson'" label="个人史内容" prop="historyPersonDesc">
            <a-textarea v-model="form.historyPersonDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='AuxiliaryCheck'" label="辅助检查内容" prop="auxiliaryCheckDesc">
            <a-textarea v-model="form.auxiliaryCheckDesc" :rows="4" />
          </a-form-model-item>
          <a-form-model-item v-if="value=='PersonOpinion'" label="治疗意见" prop="personOpinionDesc">
            <a-textarea v-model="form.personOpinionDesc" :rows="4" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>

      <div class="maintainMain">
        <router-view ref="maintainChild"></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addDiagnosisList,
  addAdviceList,
  getComplaintTypes,
  addComplaintList,
  addP_illnessList,
  addH_illnessList,
  addAllergyList,
  addCheckList,
  addTreatmentList,
} from '@/api/setting'
export default {
  name: 'Maintain',
  data() {
    return {
      value: 'Diagnosis',
      modalTitle: '新增诊断信息',
      radioStyle: {
        display: 'block',
        height: '45px',
        lineHeight: '45px',
      },
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      form: {
        diagnosisDesc: '',
        adviceDesc: '',
        complaintType: undefined,
        complaintDesc: '',
        presentIllnessDesc: '',
        historyIllnessDesc: '',
        historyAllergyDesc: '',
        historyPersonDesc: '',
        auxiliaryCheckDesc: '',
        personOpinionDesc: '',
      },
      rules: {
        diagnosisDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        adviceDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        complaintType: [{ required: true, message: '请选择类型', trigger: 'change' }],
        complaintDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        presentIllnessDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        historyIllnessDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        historyAllergyDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        historyPersonDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        auxiliaryCheckDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
        personOpinionDesc: [{ required: true, message: '请输入信息', trigger: 'blur' }],
      },
      addVisible: false,
      complaintTypesList: [],
    }
  },
  created() {
    this.value = this.$route.name
    let title
    switch (this.value) {
      case 'Diagnosis':
        title = '新增诊断信息'
        break
      case 'Advice':
        title = '新增医嘱信息'
        break
      case 'Complaint':
        title = '新增主诉信息'
        break
      case 'PresentIllness':
        title = '新增现病史'
        break
      case 'HistoryIllness':
        title = '新增既往史'
        break
      case 'HistoryAllergy':
        title = '新增过敏史'
        break
      case 'HistoryPerson':
        title = '新增个人史'
        break
      case 'AuxiliaryCheck':
        title = '新增辅助检查情况'
        break
      case 'PersonOpinion':
        title = '新增治疗意见'
    }
    this.modalTitle = title
    getComplaintTypes().then((res) => {
      if (res.success) {
        this.complaintTypesList = res.data
      }
    })
  },
  methods: {
    onChange(e) {
      // console.log('radio checked', e.target.value)
      this.$router.push({ name: e.target.value })
      let value = e.target.value
      let title
      switch (value) {
        case 'Diagnosis':
          title = '新增诊断信息'
          break
        case 'Advice':
          title = '新增医嘱信息'
          break
        case 'Complaint':
          title = '新增主诉信息'
          break
        case 'PresentIllness':
          title = '新增现病史'
          break
        case 'HistoryIllness':
          title = '新增既往史'
          break
        case 'HistoryAllergy':
          title = '新增过敏史'
          break
        case 'HistoryPerson':
          title = '新增个人史'
          break
        case 'AuxiliaryCheck':
          title = '新增辅助检查情况'
          break
        case 'PersonOpinion':
          title = '新增治疗意见'
      }
      this.modalTitle = title
    },
    addClick() {
      this.addVisible = true
    },
    handleOk(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          switch (this.modalTitle) {
            case '新增诊断信息':
              addDiagnosisList(this.form.diagnosisDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.diagnosisDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增医嘱信息':
              addAdviceList(this.form.adviceDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.adviceDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增主诉信息':
              addComplaintList(this.form.complaintType, this.form.complaintDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.complaintType = ''
                  this.form.complaintDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增现病史':
              addP_illnessList(this.form.presentIllnessDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.presentIllnessDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增既往史':
              addH_illnessList(this.form.historyIllnessDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.historyIllnessDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增过敏史':
              addAllergyList(this.form.historyAllergyDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.historyAllergyDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增个人史':
              this.$message.info('暂未开通服务')
              break
            case '新增辅助检查情况':
              addCheckList(this.form.auxiliaryCheckDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.auxiliaryCheckDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
              break
            case '新增治疗意见':
              addTreatmentList(this.form.personOpinionDesc).then((res) => {
                if (res.success) {
                  this.$message.success('新增成功！')
                  this.addVisible = false
                  this.form.personOpinionDesc = ''
                  this.$refs['maintainChild'].getMaintainList()
                } else {
                  this.$message.error(res.message)
                }
              })
          }

          // this.$refs.ruleForm.resetFields()
        } else {
          this.$message.info('请填写信息后再提交')
          return false
        }
      })
    },
  },
}
</script>

<style lang="" scoped>
.maintain {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.maintainTop {
  display: flex;
  justify-content: flex-end;
}
.ant-btn {
  font-weight: bold;
  width: 110px;
}
.addBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: none;
}
.addBtn:hover {
  color: #ffffff;
  background-color: #9096ea;
}
.addBtn:focus {
  color: #ffffff;
  background-color: #656ee8;
}
.exportLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.manageContent {
  display: flex;
  justify-content: space-between;
}
.maintainTabs {
  width: 12%;
}
.maintainMain {
  width: 85%;
}
.ant-radio-group {
  width: 100%;
}
.ant-radio-button-wrapper {
  text-align: center;
  border-radius: 0;
}
.ant-radio-button-wrapper {
  /* font-weight: bold; */
  border: 1px #ececec solid;
}
.ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-radio-button-wrapper:not(:first-child)::before {
  position: absolute;
  top: 0;
  left: 0px;
  display: block;
  width: 0px;
  height: 100%;
  content: '';
}
</style>
