<template>
  <div class="CasehistoryBox" v-show="!disabledBtn">
    <div class="title">体格信息</div>
    <div>
      <a-row :gutter="20">
        <a-col :span="4">
          <span> 体温 &nbsp;</span>
          <a-input v-model="caseForm.physique.temperature" style="width: 80px" size="large" />
          <span>&nbsp; ℃ </span>
        </a-col>
        <a-col :span="4">
          <span> 呼吸 &nbsp;</span>
          <a-input v-model="caseForm.physique.breathing" style="width: 80px" size="large" />
          <span>&nbsp; 次/分 </span>
        </a-col>
        <a-col :span="4">
          <span> 脉搏 &nbsp;</span>
          <a-input v-model="caseForm.physique.pulse" style="width: 80px" size="large" />
          <span>&nbsp; 次/分 </span>
        </a-col>
        <a-col :span="4">
          <span> 血压 &nbsp;</span>
          <a-input v-model="caseForm.physique.bloodPressure" style="width: 80px" size="large" />
          <!-- <a-input-group v-model="physique.bloodPressure" compact size="large">
                <a-input style="width: 80px; text-align: center; border-right: 0" />
                <a-input style="
                    width: 30px;
                    border-left: 0;
                    pointer-events: none;
                    background-color: #fff;
                  " placeholder="/" disabled />
                <a-input style="width: 80px; text-align: center; border-left: 0" />
              </a-input-group> -->
          <span style="line-height: 40px"> mmHg </span>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="4">
          <span> 身高 &nbsp;</span>
          <a-input v-model="caseForm.physique.height" style="width: 80px" size="large" />
          <span>&nbsp; cm </span>
        </a-col>
        <a-col :span="4">
          <span> 体重 &nbsp;</span>
          <a-input v-model="caseForm.physique.weight" style="width: 80px" size="large" />
          <span>&nbsp; Kg </span>
        </a-col>
        <a-col :span="4">
          <span> 血糖 &nbsp;</span>
          <a-input v-model="caseForm.physique.bloodSugar" style="width: 80px" size="large" />
          <span>&nbsp; mmol/l </span>
        </a-col>
        <a-col :span="10">
          <span> 血脂 &nbsp;</span>
          <a-input v-model="caseForm.physique.bloodFat" style="width: 80px" size="large" />
          <span>&nbsp; mmol/l </span>
        </a-col>
      </a-row>
    </div>

    <div class="title">
      病历信息<span>（病历信息可在系统设置-基础设置中的自定义设置）</span>
    </div>
    <a-form-model ref="ruleForm" :model="caseForm.form" :rules="rules" layout="vertical">
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-model-item label="发病日期" prop="accidentTime">
            <a-date-picker valueFormat="value" v-model="caseForm.form.accidentTime" :disabled-date="disabledDate" @change="onChange" size="large" style="width: 100%" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="主诉" prop="chiefComplaint">
            <a-select v-model="caseForm.form.chiefComplaint" mode="tags" style="width: 100%" :token-separators="[',']" @change="handleChange" size="large">
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
          <a-form-model-item label="现病史" prop="medicalHistory">
            <a-textarea v-model="caseForm.form.medicalHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
            <!--<a-input size="large">
              <a-icon class="searchIcon" type="search" slot="suffix" style="color: rgba(0, 0, 0, 0.45)" />
            </a-input>-->
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="既往史" prop="pastHistory">
            <a-textarea v-model="caseForm.form.pastHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-model-item label="过敏史" prop="allergyHistory">
            <a-textarea v-model="caseForm.form.allergyHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="个人史" prop="selfHistory">
            <a-textarea v-model="caseForm.form.selfHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-model-item label="家族史" prop="familyHistory">
            <a-textarea v-model="caseForm.form.familyHistory" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="辅助检查" prop="assitCheck">
            <a-textarea v-model="caseForm.form.assitCheck" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="30">
        <a-col :span="12">
          <a-form-model-item label="治疗意见" prop="treatmentAdvice">
            <a-textarea v-model="caseForm.form.treatmentAdvice" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="备注" prop="remark">
            <a-textarea v-model="caseForm.form.remark" :auto-size="{ minRows: 3, maxRows: 6 }" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <br />
    <br />
    <br />
    <br />
  </div>
</template>

<script>
import moment from 'moment'
import { getRecordsInfo, getReceiveChief } from '@/api/admission'
export default {
  props: {
    outpatientNo: String,
    patientId: String,
    regOrderNo: String,
    disabledBtn: Boolean,
  },
  data() {
    return {
      chiefList: [],
      caseForm: {
        physique: {
          bloodFat: '',
          bloodPressure: '',
          bloodSugar: '',
          breathing: '',
          height: '',
          pulse: '',
          temperature: '',
          weight: '',
        },
        form: {
          accidentTime: null,
          allergyHistory: '',
          assitCheck: '',
          chiefComplaint: undefined,
          familyHistory: '',
          medicalHistory: '',
          medicalRecordId: '',
          pastHistory: '',
          remark: '',
          selfHistory: '',
          treatmentAdvice: '',
        },
      },
      rules: {
        chiefComplaint: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'change',
          },
        ],
      },
    }
  },
  watch: {
    caseForm: {
      handler(newVal, oldVal) {
        this.$emit('caseForm', newVal)
      },
      deep: true,
    },
    outpatientNo: {
      handler(newVal, oldVal) {
        if (newVal) {
          getRecordsInfo(this.outpatientNo, this.patientId, this.regOrderNo).then((res) => {
            if (res.success) {
              this.caseForm.physique = res.data.physique
              this.caseForm.form = res.data.medical
              if (!res.data.medical.chiefComplaint) {
                this.caseForm.form.chiefComplaint = undefined
              }
              if (!res.data.medical.accidentTime) {
                this.caseForm.form.accidentTime = null
              }
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      },
    },
  },
  created() {
    getReceiveChief().then((res) => {
      if (res.success) {
        this.chiefList = res.data
      }
    })
    if (this.outpatientNo) {
      getRecordsInfo(this.outpatientNo, this.patientId, this.regOrderNo).then((res) => {
        if (res.success) {
          this.caseForm.physique = res.data.physique
          this.caseForm.form = res.data.medical
          if (!res.data.medical.chiefComplaint) {
            this.caseForm.form.chiefComplaint = undefined
          }
          if (!res.data.medical.accidentTime) {
            this.caseForm.form.accidentTime = null
          }
        } else {
          this.$message.warning(res.message)
        }
      })
    }
    // if (this.outpatientNo) {
    //   getRecordsInfo(this.outpatientNo, this.patientId, this.regOrderNo).then((res) => {
    //     console.log(res)
    //     if (res.success) {
    //       this.caseForm.physique = res.data.physique
    //       this.caseForm.form = res.data.medical
    //       if (!res.data.medical.chiefComplaint) {
    //         this.caseForm.form.chiefComplaint = undefined
    //       }
    //       if (!res.data.medical.accidentTime) {
    //         this.caseForm.form.accidentTime = null
    //       }
    //     }else{
    //       this.$message.warning(res.message)
    //     }
    //   })
    // }
  },
  methods: {
    caseValidateForm() {
      let flag = null
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          flag = true
        } else {
          flag = false
        }
      })
      return flag
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    onChange(date, dateString) {
      console.log(date, dateString)
      this.caseForm.form.accidentTime = dateString
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
  },
}
</script>

<style scoped>
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
.ant-row {
  margin-bottom: 6px;
}
.searchIcon:hover {
  cursor: pointer;
}
</style>