<template>
  <div class="charge">
    <div class="chargeTop">
      <div>
        报告审核
      </div>
    </div>

    <div class="admissionBoxBottom">
      <div class="bottomsBox">
        <span style="margin-right: 15px" @click="showModalReport">
          <a-icon type="file-text" theme="filled" />
          模板调用
        </span>
        <span style="margin-right: 15px" @click="showModalSave">
          <a-icon type="save" theme="filled" />存为模板
        </span>
        <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
        <a-button class="chargeBtn" icon="save" :loading="iconLoading" @click="saveLoading" :disabled="disabled">保存</a-button>
      </div>
    </div>

    <!--模板调用对话框-->
    <a-modal :centered="true" v-model="caseVisible" width="1050px" title="调用模板" :footer="null">
      <div class="transferPrTop">
        <span>&nbsp;模板权限</span>
        <a-select default-value="全部" style="width: 12%" @change="handleChange">
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="私人模板">私人模板</a-select-option>
          <a-select-option value="公共模板">公共模板</a-select-option>
        </a-select>&nbsp;
        <a-input-search placeholder="模板编码/模板名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 35%" />
      </div>
      <div class="transferPrBottom">
        <a-table :scroll="{ y: 300 }" :columns="caseColumns" :data-source="caseData" class="components-table-demo-nested" :pagination="false" :expandIconAsCell="false" :expandIconColumnIndex="8" :expandIcon="(props) => this.customExpandIcon(props)">
          >
          <a slot="operation" @click="handleCancel">
            <a-divider type="vertical" />调用
          </a>
          <p class="openDetails" slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <span>检查所见：</span>
            <span style="color: #7b7b7b">{{ record.checkInfo }}</span>
            <br />
            <span>诊断意见：</span>
            <span style="color: #7b7b7b">{{ record.diagnosisInfo }}</span>
          </p>
        </a-table>
      </div>
    </a-modal>

    <!--存为模板对话框-->
    <a-modal :centered="true" title="新增报告模板" width="600px" :visible="saveCaseVisible" @ok="saveCaseHandleOk" @cancel="saveCaseHandleCancel">
      <template slot="footer">
        <a-button key="back" @click="saveCaseHandleCancel">取消</a-button>
        <a-button class="saveBtn" key="submit" type="primary" @click="saveCaseHandleOk">保存</a-button>
      </template>

      <a-form-model ref="saveRuleForm" :model="saveForm" :rules="saveRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="模板编号" prop="number">
              <a-input v-model="saveForm.number" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="创建人" prop="creator">
              <a-input v-model="saveForm.creator" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="模板名称" prop="name">
              <a-input v-model="saveForm.name" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="模板权限" prop="authority">
              <a-radio-group class="authority" v-model="saveForm.authority">
                <a-radio value="1">私人模板</a-radio>
                <a-radio value="2">公共模板</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="模板说明" prop="description" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
          <a-input v-model="saveForm.description" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <div class="bottomBox">
      <div class="patientInfoBox">
        <p class="title">基本信息</p>

        <div class="patientForm">
          <a-form-model ref="patientRuleForm" :model="patient" :rules="patientRules" layout="vertical">
            <a-row class="form-row" :gutter="20" type="flex" justify="center">
              <a-col>
                <a-form-model-item label="患者姓名" prop="patientName">
                  <a-input disabled v-model="patient.patientName" style="width: 100%" placeholder="请输入患者姓名" size="large" />
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="患者卡号" prop="patientId">
                  <a-input disabled v-model="patient.patientId" placeholder="请输入患者卡号" size="large">
                  </a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
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
              <a-col>
                <a-form-model-item label="性别" prop="patientSex">
                  <a-select disabled v-model="patient.patientSex" placeholder="请选择患者性别" size="large">
                    <a-select-option :value="0"> 未知 </a-select-option>
                    <a-select-option :value="1"> 男 </a-select-option>
                    <a-select-option :value="2"> 女 </a-select-option>
                    <a-select-option :value="9"> 保密 </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="手机号码" prop="patientMobile">
                  <a-input disabled v-model="patient.patientPhone" placeholder="请输入手机号码" size="large">
                  </a-input>
                </a-form-model-item>
                <!-- <a-form-model-item label="患者身高" prop="patientHeight">
                  <a-input v-model="form.patientHeight" size="large"></a-input>
                </a-form-model-item> -->
              </a-col>

            </a-row>
          </a-form-model>
          <a-form-model ref="reportRuleForm" :model="report" :rules="reportRules" layout="vertical">
            <a-row class="form-row" :gutter="20" type="flex" justify="center">
              <!-- <a-col >
                
              </a-col>
              <a-col >
                <a-form-model-item label="上机时间" prop="idCard">
                  <a-date-picker v-model="form.machineTime" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" />
                </a-form-model-item>
              </a-col>
              <a-col >
                
              </a-col> -->
              <a-col>
                <a-form-model-item label="核素" prop="nuclearElement">
                  <a-input disabled v-model="report.nuclearElement" size="large"></a-input>
                </a-form-model-item>
                <!-- <a-form-model-item label="患者体重" prop="patientWeight">
                  <a-input v-model="form.patientWeight" size="large"></a-input>
                </a-form-model-item> -->
              </a-col>
              <a-col>
                <a-form-model-item label="药物" prop="drug">
                  <a-input disabled v-model="report.drug" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="剂量" prop="dosageValue">
                  <a-input disabled v-model="report.dosageValue" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="空腹血糖" prop="bloodValue">
                  <a-input disabled v-model="report.bloodValue" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="检查项目" prop="checkItemName">
                  <a-input disabled v-model="report.checkItemName" size="large"></a-input>
                </a-form-model-item>
              </a-col>

            </a-row>
            <a-row class="form-row" :gutter="20" type="flex" justify="center">
              <a-col>
                <a-form-model-item label="检查方式" prop="checkAwayName">
                  <a-input disabled v-model="report.checkAwayName" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="检查时间" prop="checkTime">
                  <a-date-picker disabled valueFormat="value" v-model="report.checkTime" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" />
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="申请医院" prop="applyOrgName">
                  <a-input disabled v-model="report.applyOrgName" size="large"> </a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="申请科室" prop="applyDeptName">
                  <a-input disabled v-model="report.applyDeptName" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="申请时间" prop="applyTime">
                  <a-date-picker disabled valueFormat="value" v-model="report.applyTime" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" />
                </a-form-model-item>
              </a-col>

            </a-row>
            <a-row class="form-row" :gutter="20" type="flex" justify="center">
              <a-col>
                <a-form-model-item label="申请医生" prop="applyDoctorName">
                  <a-input disabled v-model="report.applyDoctorName" size="large"></a-input>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="阴阳性" prop="yinYangResult">
                  <a-select disabled v-model="report.yinYangResult" @change="handleChange" size="large">
                    <a-select-option :value="1">
                      阴性
                    </a-select-option>
                    <a-select-option :value="2">
                      阳性
                    </a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="影像质量" prop="imageQuality">
                  <a-select disabled v-model="report.imageQuality" @change="handleChange" size="large">
                    <a-select-option :value="1">高</a-select-option>
                    <a-select-option :value="2">一般</a-select-option>
                    <a-select-option :value="3">较差</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="回访状态" prop="returnVisitStatus">
                  <a-select disabled v-model="report.returnVisitStatus" @change="handleChange" size="large">
                    <a-select-option :value="0">未回访</a-select-option>
                    <a-select-option :value="1">已回访</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col>
                <a-form-model-item label="报告质量" prop="reportQuality">
                  <a-select disabled v-model="report.reportQuality" @change="handleChange" size="large">
                    <a-select-option :value="1">高</a-select-option>
                    <a-select-option :value="2">一般</a-select-option>
                    <a-select-option :value="3">较差</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <!-- <a-col >
                <a-form-model-item label="开单目的" prop="orderAim">
                  <a-select v-model="form.orderAim" @change="handleChange" size="large">
                    <a-select-option value="确诊">确诊</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col >
                <a-form-model-item label="患者来源" prop="source">
                  <a-select v-model="form.source" @change="handleChange" size="large">
                    <a-select-option value="门诊">门诊</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col> -->
            </a-row>
          </a-form-model>
        </div>
      </div>
      <div class="reportInfoBox">
        <p style="color:#656ee8;font-size:22px;font-weight:bold;">报告信息</p>
        <div>
          <p class="reportInfoTitle">检查所见</p>
          <a-textarea disabled v-model="report.checkResult" :rows="8" />
        </div>
        <div>
          <p class="reportInfoTitle">诊断意见</p>
          <a-textarea disabled v-model="report.diagnosis" :rows="8" />
        </div>
        <div>
          <p class="reportInfoTitle">审核意见</p>
          <a-textarea v-model="auditInfo.auditDesc" :rows="8" />
        </div>
        <div>
          <span> 审核状态 &nbsp; </span>
          <a-select style="width:120px;" v-model="auditInfo.auditStatus">
            <a-select-option :value="0">
              未审核
            </a-select-option>
            <a-select-option :value="1">
              审核通过
            </a-select-option>
            <a-select-option :value="2">
              审核不通过
            </a-select-option>
          </a-select>
        </div>
        <div class="reportDiagnosis">
          <div>
            <span> 报告 &nbsp; </span>
            <a-input disabled v-model="report.diagnosisDoctorName" style="width:100px;" />
          </div>

          <div>
            <span> 诊断日期 &nbsp; </span>
            <a-date-picker disabled show-time format="YYYY-MM-DD HH:mm:ss" v-model="report.diagnosisTime" />
          </div>

          <div>
            <span> 审核 &nbsp; </span>
            <a-input disabled v-model="report.auditDoctorName" style="width:100px;" />
          </div>

          <!-- <div>
            <span> 审核 &nbsp; </span>
            <a-select default-value="张清北" @change="handleChange">
              <a-select-option value="张清北">
                张清北
              </a-select-option>
              <a-select-option value="张清南">
                张清南
              </a-select-option>
            </a-select>
          </div> -->

          <div>
            <span> 审核日期 &nbsp; </span>
            <a-date-picker disabled show-time format="YYYY-MM-DD HH:mm:ss" @change="changeAuditTime" v-model="report.auditTime" :disabled-date="auditTimeDisabledDate" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getPatientInfo,
  getExamineReportInfo,
  getExamineAuditInfo,
  saveExamineAudit,
} from '@/api/admission'
const caseColumns = [
  {
    title: '序号',
    width: 45,
    customRender: (text, record, index) => `${index + 1}`,
  },
  { title: '模板编号', dataIndex: 'number', key: 'number', width: 80 },
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 120 },
  {
    title: '模板说明',
    dataIndex: 'description',
    key: 'description',
    width: 70,
    align: 'center',
  },
  { title: '模板权限', dataIndex: 'authority', key: 'authority', width: 70 },
  { title: '诊断', dataIndex: 'diagnosis', key: 'diagnosis' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: '创建人员', dataIndex: 'creator', key: 'creator', width: 70 },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' },
  },
]

const caseData = []
for (let i = 0; i < 15; ++i) {
  caseData.push({
    key: i,
    number: 'RZ0000' + i,
    name: '处方模板名称' + i,
    description: '通用',
    authority: '私人模板',
    diagnosis: '心悸',
    createdAt: '2014-12-24 23:12:00',
    creator: '王冕',
    checkInfo:
      '红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。',
    diagnosisInfo:
      '红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。',
  })
}
import moment from 'moment'
export default {
  name: 'DosingBeforeCheck',
  inject: ['reload'],
  data() {
    return {
      page: '',
      disabled: false,
      patientId: '',
      recordId: '',
      defaultValue: 'year',
      patient: {
        patientId: '',
        patientName: '',
        patientSex: undefined,
        patientAge: '',
        patientCertNo: '',
        patientPhone: '',
      },
      patientRules: {
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
      },
      report: {
        // machineTime: null,
        nuclearElement: '',
        drug: '',
        dosageValue: '',
        bloodValue: '',
        checkItemName: '',
        checkAwayName: '',
        applyOrgName: '',
        applyDeptName: '',
        applyTime: null,
        applyDoctorName: '',
        yinYangResult: undefined,
        imageQuality: undefined,
        returnVisitStatus: undefined,
        reportQuality: undefined,
        // orderAim: undefined,
        // source: undefined,
        checkResult: '',
        diagnosis: '',
        auditDoctorName: '',
        checkTime: null,
        auditTime: null,
        diagnosisTime: null,
      },
      reportRules: {},
      auditInfo: {
        auditDesc: '',
        auditStatus: 0,
        recordId: '',
      },
      caseVisible: false,
      saveCaseVisible: false,
      saveConfirmLoading: false,
      caseColumns,
      caseData,
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      saveForm: {
        number: 'MZ00001',
        creator: '李明',
        name: '',
        authority: '1',
        room: '全科',
        types: '西药处方模板',
        diagnosis: undefined,
        description: '',
      },
      saveRules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      },
      iconLoading: false,
    }
  },
  created() {
    this.page = this.$route.params.page
    this.disabled = JSON.parse(this.$route.query.disabled)
    this.patientId = this.$route.query.patientId
    this.recordId = this.$route.query.recordId
    getPatientInfo(this.patientId).then((res) => {
      if (res.success) {
        this.patient = res.data
      }
    })
    getExamineReportInfo(this.patientId, this.recordId).then((res) => {
      this.report.auditDoctorName = localStorage.getItem('userName')
      if (res.success) {
        this.report = Object.assign(this.report, res.data.report)
        if (!res.data.report.auditTime) {
          this.report.auditTime = this.getNowTime()
        }
      } else {
        this.$warning({
          title: '提示',
          centered: true,
          content: res.message,
          onOk: () => {
            this.$router.go(-1)
          },
        })
      }
    })
    // getExamineAuditInfo(this.patientId, this.recordId).then((res) => {
    //   if (res.success) {
    //     this.form = Object.assign(this.form, res.data.patient, res.data.report)
    //     this.auditInfo
    //   }
    // })
  },
  methods: {
    // 获取当前年月日时分秒
    getNowTime() {
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      let hh = new Date().getHours()
      let mf =
        new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss =
        new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      return yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    },
    goBack() {
      const page = this.page
      if (page == undefined) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: page })
      }
    },
    onChange(dates, dateStrings) {
      // console.log('From: ', dates[0], ', to: ', dates[1])
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    changeAuditTime(dates, dateStrings) {
      this.report.auditTime = dateStrings
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    auditTimeDisabledDate(current) {
      return current && current < moment().startOf('day')
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    onSearch(value) {
      // console.log(value)
    },
    onChangeSearch(e) {
      // console.log(e.target.value)
    },
    showModalReport() {
      this.caseVisible = true
    },
    showModalSave() {
      this.saveCaseVisible = true
    },
    customExpandIcon(props) {
      if (props.expanded) {
        return (
          <a
            style={{ marginRight: 20 }}
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            关闭详情
          </a>
        )
      } else {
        return (
          <a
            style={{ marginRight: 20 }}
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            查看详情
          </a>
        )
      }
    },
    saveCaseHandleOk(e) {
      this.$refs.saveRuleForm.validate((valid) => {
        if (valid) {
          this.saveCaseVisible = false
          this.$message.success('保存成功')
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.caseVisible = false
    },
    saveCaseHandleCancel(e) {
      this.saveCaseVisible = false
      this.$refs.saveRuleForm.resetFields()
    },
    saveLoading() {
      this.$refs.reportRuleForm.validate((valid) => {
        if (valid) {
          this.iconLoading = true
          this.report.auditTime = this.getNowTime()
          saveExamineAudit({
            auditDesc: this.auditInfo.auditDesc,
            auditStatus: this.auditInfo.auditStatus,
            recordId: this.recordId,
          }).then((res) => {
            if (res.success) {
              this.$message.success('保存成功')
            } else {
              this.$message.warning(res.message)
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
  justify-content: flex-end; */
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
  background-color: #ffffff;
  color: #000000;
}
.ant-btn:hover {
  background-color: #656ee8;
  color: #ffffff;
  border: 1px solid #656ee8;
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

.reportInfoBox > div {
  margin-bottom: 20px;
}
.reportInfoTitle {
  font-weight: bold;
  font-size: 18px;
  color: #606060;
}
.reportDiagnosis {
  display: flex;
}
.reportDiagnosis > div {
  margin-right: 10px;
}
.ant-divider {
  height: auto;
}
a {
  color: #656ee8;
}
.openDetails span {
  line-height: 28px;
}
.saveBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
  margin-right: 15px;
}
.saveBtn:focus {
  color: #ffffff;
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
.admissionBoxBottom {
  width: 100%;
  /* margin-left: -1%; */
  height: 60px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  overflow: visible;
  z-index: 10;
}
.bottomsBox {
  width: 50%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}
.bottomsBox span {
  font-weight: bold;
  color: #383838;
  cursor: pointer;
}
.bottomsBox span:hover {
  color: #656ee8;
}
.ant-col {
  width: 20%;
}
</style>