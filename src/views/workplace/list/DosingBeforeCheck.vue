<template>
  <div class="charge">
    <div class="chargeTop">
      <div>
        检前给药
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="chargeBtn" icon="wallet" :loading="iconLoading" @click="toSave" :disabled="disabled">保存</a-button>
        </div>
      </div>
    </div>

    <div class="bottomBox">
      <div class="patientInfoBox">
        <p class="title">基本信息</p>

        <div class="patientForm">
          <a-form-model ref="patientRuleForm" :model="patient" :rules="rules" layout="vertical">
            <a-row class="form-row" :gutter="16">
              <a-col :span="6">
                <a-form-model-item label="患者姓名" prop="patientName">
                  <a-input disabled v-model="patient.patientName" style="width: 100%" placeholder="请输入患者姓名" size="large" />
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="身份证号码" prop="patientCertNo">
                  <a-input disabled v-model="patient.patientCertNo" placeholder="请输入证件号码" size="large">
                  </a-input>
                </a-form-model-item>

              </a-col>
              <a-col :span="6">
                <a-form-model-item label="患者年龄" prop="patientAge">
                  <a-input disabled v-model="patient.patientAge" placeholder="请输入数字" type="number" size="large">
                    <a-select disabled slot="addonAfter" v-model="defaultValue" style="width: 60px">
                      <a-select-option value="year"> 岁 </a-select-option>
                      <a-select-option value="month"> 月 </a-select-option>
                      <a-select-option value="day"> 天 </a-select-option>
                    </a-select>
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="出生日期" required prop="patientBirth">
                  <a-date-picker disabled valueFormat="value" v-model="patient.patientBirth" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" @change="changeDate" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :span="6">
                <a-form-model-item label="性别" required prop="patientSex">
                  <a-select disabled v-model="patient.patientSex" placeholder="请选择患者性别" size="large">
                    <a-select-option v-for="item in sexList" :key="item.value">{{item.desc}}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="手机号码" prop="patientPhone">
                  <a-input disabled v-model="patient.patientPhone" placeholder="请输入手机号码" size="large">
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="患者卡号" prop="patientId">
                  <a-input disabled v-model="patient.patientId" placeholder="请输入患者卡号" size="large">
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="问诊医生" prop="visitDoctor">
                  <a-input v-model="InjectionForm.visitDoctor" size="large"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>

            <a-row class="form-row" :gutter="16">
              <a-col :span="6">
                <a-form-model-item label="核素" prop="nuclearElement">
                  <a-input v-model="InjectionForm.nuclearElement" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="检查药物" prop="execDrug">
                  <a-input v-model="InjectionForm.execDrug" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="检查部位" prop="execPart">
                  <a-input v-model="InjectionForm.execPart" size="large"> </a-input>
                </a-form-model-item>
              </a-col>
              <a-col :span="6">
                <a-form-model-item label="检查方式" prop="execWay">
                  <a-input v-model="InjectionForm.execWay" size="large"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row class="form-row" :gutter="16">
              <a-col :span="24">
                <a-form-model-item label="备注" prop="remark">
                  <a-input v-model="InjectionForm.remark" size="large"></a-input>
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="InjectionInfoBox">
        <p style="color:#656ee8;font-size:22px;font-weight:bold;">注射信息</p>
        <a-form-model ref="InjectionRuleForm" :model="InjectionForm" :rules="InjectionRules" layout="vertical">
          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="给药方式" prop="execDrugTypeName">
                <a-select placeholder="请选择给药方式" v-model="InjectionForm.execDrugTypeId" size="large" @change="changeDrugType">
                  <a-select-option v-for="item in drugTypes" :key="item.typeCode" :title="item.typeName"> {{item.typeName}} </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="注射部位" prop="execDrugPart">
                <a-input v-model="InjectionForm.execDrugPart" size="large">
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="注射人" prop="doctorName">
                <a-input v-model="InjectionForm.doctorName" size="large">
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="污染" prop="pollute">
                <a-input v-model="InjectionForm.pollute" size="large">
                </a-input>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="实际注射剂量" prop="realDosageValue">
                <a-input v-model="InjectionForm.realDosageValue" type="number" size="large">
                  <a-select slot="addonAfter" v-model="InjectionForm.realDosageUnit" style="width: 80px">
                    <a-select-option value="mCi"> mCi </a-select-option>
                    <a-select-option value="KBq"> KBq </a-select-option>
                    <a-select-option value="Bq"> Bq </a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="注射前剂量" prop="beforeDosageValue">
                <a-input v-model="InjectionForm.beforeDosageValue" type="number" size="large">
                  <a-select v-model="InjectionForm.beforeDosageUnit" slot="addonAfter" style="width: 80px">
                    <a-select-option value="mCi"> mCi </a-select-option>
                    <a-select-option value="KBq"> KBq </a-select-option>
                    <a-select-option value="Bq"> Bq </a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="药物来源" prop="drugSource">
                <a-input v-model="InjectionForm.drugSource" size="large">
                </a-input>
              </a-form-model-item>
            </a-col>

          </a-row>

          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="处方剂量" prop="prescriptionDose">
                <a-input v-model="InjectionForm.prescriptionDose" type="number" size="large">
                  <a-select slot="addonAfter" defaultValue="mCi" style="width: 80px">
                    <a-select-option value="mCi"> mCi </a-select-option>
                    <a-select-option value="KBq"> KBq </a-select-option>
                    <a-select-option value="Bq"> Bq </a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="注射后剂量" prop="afterDosageValue">
                <a-input v-model="InjectionForm.afterDosageValue" type="number" size="large">
                  <a-select slot="addonAfter" v-model="InjectionForm.afterDosageUnit" style="width: 80px">
                    <a-select-option value="mCi"> mCi </a-select-option>
                    <a-select-option value="KBq"> KBq </a-select-option>
                    <a-select-option value="Bq"> Bq </a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item class="redLabel" label="注射时间" prop="execDrugTime">
                <!-- <a-date-picker show-time v-model="InjectionForm.execDrugTime" size="large" style="width: 100%" @change="changeExecDrugTime">
                </a-date-picker> -->
                <a-date-picker mode="time" format="YYYY-MM-DD HH:mm:ss" :disabled-date="(current)=>execDrugTimeDisabledDate(current,InjectionForm.execDrugTime)" v-model="InjectionForm.execDrugTime" @change="changeExecDrugTime" show-time size="large" style="width: 100%" :showToday="false">
                  <template slot="renderExtraFooter">
                    <div style="width:95%;height:35px;background:#fff;position: absolute;z-index:9;"></div>
                  </template>
                </a-date-picker>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item class="remakesBox" label="备注" prop="remark">
                <a-textarea v-model="InjectionForm.remark" :rows="6" />
              </a-form-model-item>
            </a-col>

          </a-row>

        </a-form-model>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getSexList } from '@/api/common'
import {
  getPatientInfo,
  getBeforeDrugInfo,
  getBeforeDrugType,
  saveBeforeDrugInfo,
} from '@/api/admission'
export default {
  name: 'DosingBeforeCheck',
  inject: ['reload'],
  data() {
    return {
      iconLoading: false,
      page: '',
      recordId: '',
      patientId: '',
      disabled: false,
      defaultValue: 'year',
      sexList: [],
      patient: {
        patientId: '',
        patientName: '',
        patientSex: undefined,
        patientAge: '',
        patientCertNo: '',
        patientPhone: '',
        patientBirth: null,
      },
      rules: {
        patientName: [
          {
            required: true,
            message: '请输入患者姓名',
            trigger: 'blur',
          },
        ],
        patientAge: [
          {
            required: true,
            message: '请输入患者年龄',
            trigger: 'blur',
          },
        ],
        patientSex: [
          {
            required: true,
            message: '请选择患者性别',
            trigger: 'change',
          },
        ],
        patientBirth: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change',
          },
        ],
        patientCertNo: [
          {
            required: true,
            message: '请输入身份证号码',
            trigger: 'blur',
          },
        ],
      },
      drugTypes: [],
      InjectionForm: {
        recordId: '',
        execDrug: '',
        execPart: '',
        execWay: '',
        nuclearElement: '',
        visitDoctor: '',
        execDrugTypeId: undefined,
        afterDosageUnit: 'mCi',
        beforeDosageUnit: 'mCi',
        realDosageUnit: 'mCi',
        execDrugTypeName: '',
        execDrugPart: '',
        doctorName: '',
        pollute: '',
        realDosageValue: '',
        beforeDosageValue: '',
        drugSource: '',
        prescriptionDose: '',
        afterDosageValue: '',
        execDrugTime: '',
        remark: '',
      },
      InjectionRules: {
        execDrugTypeName: [
          {
            required: true,
            message: '请选择给药方式',
            trigger: 'change',
          },
        ],
        realDosageValue: [
          {
            required: true,
            message: '请输入实际注射剂量',
            trigger: 'blur',
          },
        ],
        beforeDosageValue: [
          {
            required: true,
            message: '请输入注射前剂量',
            trigger: 'blur',
          },
        ],
        prescriptionDose: [
          {
            required: true,
            message: '请输入处方剂量',
            trigger: 'blur',
          },
        ],
        afterDosageValue: [
          {
            required: true,
            message: '请输入注射后剂量',
            trigger: 'blur',
          },
        ],
        execDrugTime: [
          {
            required: true,
            message: '请选择注射时间',
            trigger: 'change',
          },
        ],
      },
    }
  },
  created() {
    this.page = this.$route.params.page
    this.disabled = JSON.parse(this.$route.query.disabled)
    this.patientId = this.$route.query.patientId
    this.recordId = this.$route.query.recordId
    // 获取性别
    getSexList().then((res) => {
      this.sexList = res.data
    })
    // 获取检前给药方式类型
    getBeforeDrugType({ keyWords: '', limit: 10, orderFiled: '', orderType: 'asc', page: 1 }).then(
      (res) => {
        this.drugTypes = res.data
      }
    )
    getPatientInfo(this.patientId).then((res) => {
      if (res.success) {
        this.patient = res.data
      }
    })
    getBeforeDrugInfo(this.patientId, this.recordId).then((res) => {
      if (res.data && res.success) {
        this.InjectionForm = res.data
      }
      if (!res.data.execDrugTypeId) {
        this.InjectionForm.execDrugTypeId = undefined
      }
      if (!res.data.afterDosageUnit) {
        this.InjectionForm.afterDosageUnit = 'mCi'
      }
      if (!res.data.beforeDosageUnit) {
        this.InjectionForm.beforeDosageUnit = 'mCi'
      }
      if (!res.data.realDosageUnit) {
        this.InjectionForm.realDosageUnit = 'mCi'
      }
    })
  },
  methods: {
    moment,
    goBack() {
      const page = this.page
      if (page == undefined) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: page })
      }
    },
    changeDrugType(value, option) {
      this.InjectionForm.execDrugTypeName = option.componentOptions.propsData.title
    },
    changeExecDrugTime(times, timeStrings) {
      this.InjectionForm.execDrugTime = timeStrings
    },
    execDrugTimeDisabledDate(current) {
      return current
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    changeDate(dates, dateStrings) {
      let duration = moment.duration(moment().diff(dateStrings))
      if (duration._data.years > 0) {
        this.defaultValue = 'year'
        this.InjectionForm.patient.age = duration._data.years
      } else if (duration._data.years == 0 && duration._data.months > 0) {
        this.defaultValue = 'month'
        this.InjectionForm.patient.age = duration._data.months
      } else if (
        duration._data.years == 0 &&
        duration._data.months == 0 &&
        duration._data.days > 0
      ) {
        this.defaultValue = 'day'
        this.InjectionForm.patient.age = duration._data.days
      } else {
        this.InjectionForm.patient.age = 0
      }
    },
    toSave() {
      this.$refs.InjectionRuleForm.validate((valid) => {
        if (valid) {
          this.iconLoading = true
          const form = JSON.parse(JSON.stringify(this.InjectionForm))
          form.execDrugTime = form.execDrugTime.slice(-8)
          saveBeforeDrugInfo(form).then((res) => {
            if (res.success) {
              this.$message.success('保存成功')
            } else {
              this.$message.info(res.message)
            }
            this.iconLoading = false
          })
        } else {
          this.$message.warning('请填写信息后再保存')
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.chargeTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  font-size: 18px;
}

.chargeTop > div:nth-child(1) {
  padding-left: 10px;
}

.chargeTop > div:nth-child(1)::before {
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

.chargeBtn {
  background-color: #656ee8;
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 20px;
}

.chargeBtn:hover {
  background-color: #8087e7;
  color: #ffffff;
}

.chargeBtn:focus {
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

.bottomBox {
  margin: 12px auto;
  color: #000000;
}

.bottomBox > div {
  border-radius: 5px;
  padding: 24px;
  background: #fff;
  margin-bottom: 10px;
}
.title {
  color: #656ee8;
  font-size: 24px;
  font-weight: bold;
}
.redLabel > .ant-form-item-label {
  color: red !important;
}
.remakesBox {
  position: relative;
  top: -100px;
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