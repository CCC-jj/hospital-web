<template>
  <div class="managePatient">
    <div class="managePatientTop">
      <!-- <a-button class="exportBtn" icon="export"> 导出 </a-button> -->
    </div>
    <hr class="exportLine" />
    <div class="manageTop">
      <span>&nbsp;患者状态：</span>
      <a-select v-model="queryInfo.state" style="width: 12%" @change="handleChange">
        <a-select-option value="0"> 全部 </a-select-option>
        <!-- <a-select-option value="1"> 未接诊 </a-select-option> -->
        <a-select-option value="1"> 预约检查 </a-select-option>
        <a-select-option value="2"> 检前查验 </a-select-option>
        <a-select-option value="3"> 检前给药 </a-select-option>
        <a-select-option value="4"> 诊断报告 </a-select-option>
      </a-select>
      <span>&nbsp;创建时间：</span>
      <a-range-picker :ranges="{
          今天: [moment().startOf('day'), moment()],
          昨天: [
            moment().startOf('day').subtract(1, 'days'),
            moment().endOf('day').subtract(1, 'days'),
          ],
          近三天: [
            moment().startOf('day').subtract(2, 'days'),
            moment().endOf('day'),
          ],
          近一周: [moment().startOf('day').subtract(1, 'weeks'), moment()],
          近一月: [moment().startOf('day').subtract(1, 'month'), moment()],
          本月: [moment().startOf('month'), moment()],
        }" @change="onChangeQuery" style="width:30%;" :value="[queryInfo.searchBeginDate,queryInfo.searchEndDate]" :disabled-date="searchDisabledDate" />
      &nbsp;
      <a-input-search placeholder="姓名/手机号/证件号" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :loading="spinning" :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, current:queryInfo.page, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }" @change="tableChange" :rowKey="(record, index) => {return record.recordId;}">
        <span slot="patientSex" slot-scope="text">
          <span v-if="text === 0">保密</span>
          <span v-else-if="text === 1">男</span>
          <span v-else-if="text === 2">女</span>
          <span v-else>未说明</span>
        </span>
        <span class="editBtn" slot="action" slot-scope="text,record">
          <!-- <a @click="toAdmission">接诊></a>
          <a-divider type="vertical" /> -->
          <a-button :class="[{editBtnDisabled:record.regStatus===2},{editBtnHover:record.regStatus!==0},{canDoBtn:record.regStatus===1}]" :disabled="record.regStatus===0" @click="showBookModal(record)">预约检查</a-button>
          <a-button :class="[{editBtnDisabled:record.chkStatus===2},{editBtnHover:record.chkStatus!==0},{canDoBtn:record.chkStatus===1}]" :disabled="record.chkStatus===0" @click="showInspectionModal(record)">检前查验</a-button>
          <a-button :class="[{editBtnDisabled:record.drugStatus===2},{editBtnHover:record.drugStatus!==0},{canDoBtn:record.drugStatus===1}]" :disabled="record.drugStatus===0" @click="toDosingBeforeCheck(record)">检前给药</a-button>
          <a-button :class="[{editBtnDisabled:record.reportStatus===2},{editBtnHover:record.reportStatus!==0},{canDoBtn:record.reportStatus===1}]" :disabled="record.reportStatus===0" @click="toDiagnoseReport(record)">诊断报告</a-button>
          <a-button :class="[{editBtnDisabled:record.auditStatus===2},{editBtnHover:record.auditStatus!==0},{canDoBtn:record.auditStatus===1}]" :disabled="record.auditStatus===0" @click="toReportReview(record)">报告审核</a-button>
        </span>
      </a-table>

      <a-modal :okButtonProps="{ props: { disabled: regDisabled } }" :cancelButtonProps="{ props: { disabled: regDisabled } }" centered width="850px" v-model="bookVisible" title="检查预约" @ok="bookHandleOk" @cancel="bookHandleCancel">
        <div class="bookTop">
          <div>患者ID：{{patientInfo.patientId}}</div>
          <div>姓名：{{patientInfo.patientName}}</div>
          <div>年龄：{{patientInfo.patientAge}}</div>
          <div>性别：{{patientInfo.patientSex}}</div>
          <div>手机号码：{{patientInfo.patientPhone}}</div>
          <div>身份证号码：{{patientInfo.patientCertNo}}</div>
        </div>
        <div class="bookForm">
          <a-form-model ref="bookRuleForm" :model="bookForm" :rules="bookRules">
            <a-row :gutter="50">
              <a-col :span="8">
                <a-form-model-item label="预约医生" prop="doctorName">
                  <a-input disabled v-model="bookForm.doctorName" size="large" />
                </a-form-model-item>
              </a-col>
              <a-col :span="16">
                <a-form-model-item label="预约时段" prop="appointTime">
                  <a-radio-group class="radioGroup" v-model="bookForm.appointTime" button-style="solid" size="large">
                    <a-radio-button value="8:00-8:30">
                      8:00-8:30
                    </a-radio-button>
                    <a-radio-button value="8:30-9:00">
                      8:30-9:00
                    </a-radio-button>
                    <a-radio-button value="9:00-9:30">
                      9:00-9:30
                    </a-radio-button>
                    <a-radio-button value="9:30-10:00">
                      9:30-10:00
                    </a-radio-button>
                    <a-radio-button value="10:00-10:30">
                      10:00-10:30
                    </a-radio-button>
                    <a-radio-button value="10:30-11:00">
                      10:30-11:00
                    </a-radio-button>
                    <a-radio-button value="11:00-11:30">
                      11:00-11:30
                    </a-radio-button>
                    <a-radio-button value="11:30-12:00">
                      11:30-12:00
                    </a-radio-button>
                  </a-radio-group>
                </a-form-model-item>
              </a-col>
            </a-row>
            <a-row class="dateRow" :gutter="50">
              <a-col :span="24">
                <a-form-model-item label="预约日期" prop="appointDate">
                  <a-date-picker :showToday="false" valueFormat="value" style="width:100%;" v-model="bookForm.appointDate" :disabled-date="disabledDate" @change="onChange" size="large" />
                </a-form-model-item>
              </a-col>
            </a-row>
            <div class="formCheckBox">
              <a-form-model-item prop="messageNotify">
                <a-checkbox @change="checkonChange" v-model="bookForm.messageNotify">
                  短信通知患者预约时间
                </a-checkbox>
              </a-form-model-item>
              <a-form-model-item prop="appNotify">
                <a-checkbox @change="checkonChange" v-model="bookForm.appNotify">
                  官网推送检前注意事项、检查流程
                </a-checkbox>
              </a-form-model-item>
            </div>
          </a-form-model>
        </div>
      </a-modal>

      <a-modal :okButtonProps="{ props: { disabled: chkDisabled } }" :cancelButtonProps="{ props: { disabled: chkDisabled } }" centered width="800px" v-model="inspectionVisible" title="检前查验" @ok="inspectionHandleOk" @cancel="inspectionHandleCancel">
        <div class="addBtn">
          <a-select :disabled="chkDisabled" placeholder="添加检查" style="width: 120px">
            <a-select-option v-for="item in checkTypes" :key="item.typeCode" @click="addCheckingChange(item.typeCode,item.typeName)">
              {{item.typeName}}
            </a-select-option>
          </a-select>
        </div>
        <div class="overflowYbox">
          <div class="checkingBox" v-for="(item,index) in checkingData" :key="index">
            <div class="flexBox">
              <div class="checkTitle">{{item.chkName}} {{index+1}}</div>
              <a-icon v-if="!chkDisabled" @click="closeCheckingBox(item.id,index)" class="closeIcon" type="close" />
            </div>
            <div class="resultEntry">结果录入</div>
            <a-textarea :disabled="chkDisabled" :rows="8" v-model="item.chkResult" />
          </div>
        </div>
      </a-modal>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import {
  getDoctorInfo,
  getWorkbenchInfo,
  examineAppointmentInfo,
  examineAppointment,
  getBeforeCheckType,
  getBeforeCheckList,
  addBeforeCheck,
  deleteBeforeCheck,
} from '@/api/admission'
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '患者卡号',
    align: 'center',
    dataIndex: 'patientId',
    key: 'id',
  },
  {
    title: '患者姓名',
    dataIndex: 'patientName',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'patientSex',
    scopedSlots: { customRender: 'patientSex' },
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'patientAge',
    align: 'center',
  },
  {
    title: '身份证号码',
    dataIndex: 'patientCertNo',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'patientPhone',
    align: 'center',
  },
  {
    title: '预约时间',
    dataIndex: 'appointTime',
    align: 'center',
  },
  {
    title: '操作人员',
    dataIndex: 'operator',
    align: 'center',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]

export default {
  data() {
    return {
      spinning: false,
      columns,
      tableData: [],
      bookVisible: false,
      inspectionVisible: false,
      recordId: '',
      patientInfo: {
        patientId: '',
        patientName: '',
        patientAge: '',
        patientSex: '',
        patientPhone: '',
        patientCertNo: '',
      },
      doctorInfo: {},
      bookForm: {
        recordId: '',
        patientId: '',
        doctorName: '',
        appointDate: '',
        appointTime: '',
        messageNotify: true,
        appNotify: true,
      },
      bookRules: {
        appointDate: [
          {
            required: true,
            message: '请填写预约日期',
            trigger: 'change',
          },
        ],
        appointTime: [
          {
            required: true,
            message: '请选择预约时段',
            trigger: 'change',
          },
        ],
      },
      checkTypes: [],
      checkingData: [],
      queryInfo: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchBeginDate: moment().startOf('day').subtract(1, 'month'),
        searchEndDate: moment().endOf('day'),
        searchWord: '',
        state: '0',
      },
      total: 0,
      regDisabled: false,
      chkDisabled: false,
    }
  },
  created() {
    this.getWorkbenchInfo()
    getDoctorInfo().then((res) => {
      if (res.success) {
        this.doctorInfo = res.data
      }
    })
    getBeforeCheckType().then((res) => {
      this.checkTypes = res.data
    })
  },
  methods: {
    moment,
    getWorkbenchInfo() {
      this.spinning = true
      getWorkbenchInfo(this.queryInfo).then((res) => {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
      })
    },
    // 禁用今日之后日期
    searchDisabledDate(current) {
      return current && current > moment().endOf('day')
    },
    // 禁用今日之前日期
    disabledDate(current) {
      // Can not select days before today and today
      return current && current < moment().endOf('day')
    },
    handleChange(value) {
      this.queryInfo.page = 1
      this.getWorkbenchInfo()
    },
    addCheckingChange(code, name) {
      this.checkingData.push({
        chkName: name,
        chkResult: '',
      })
    },
    onChangeQuery(dates, dateStrings) {
      this.queryInfo.page = 1
      this.queryInfo.searchBeginDate = dateStrings[0]
      this.queryInfo.searchEndDate = dateStrings[1]
      this.getWorkbenchInfo()
    },
    onChange(dates, dateStrings) {
      this.bookForm.appointDate = dateStrings
    },
    checkonChange(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    onSearch(value) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = value
      this.getWorkbenchInfo()
    },
    onChangeSearch(e) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = e.target.value
      this.getWorkbenchInfo()
    },
    tableChange(pagination, filters, sorter) {
      this.queryInfo.page = pagination.current
      this.getWorkbenchInfo()
    },
    toAdmission() {
      const page = this.$route.name
      this.$router.push({
        name: 'Prescription',
        params: {
          page: page,
        },
      })
    },
    addCheck(e) {},
    showBookModal(record) {
      examineAppointmentInfo(record.recordId).then((res) => {
        if (res.success) {
          this.bookForm = Object.assign(this.bookForm, res.data, this.doctorInfo)
          this.bookVisible = true
        } else {
          this.$message.warning(res.message)
        }
      })
      if (record.regStatus === 2) {
        this.regDisabled = true
      }
      this.patientInfo.patientId = record.patientId
      this.patientInfo.patientName = record.patientName
      this.patientInfo.patientAge = record.patientAge
      this.patientInfo.patientPhone = record.patientPhone
      this.patientInfo.patientCertNo = record.patientCertNo
      let sex
      switch (record.patientSex) {
        case 0:
          sex = '保密'
          break
        case 1:
          sex = '男'
          break
        case 2:
          sex = '女'
          break
        case 9:
          sex = '未说明'
      }
      this.patientInfo.patientSex = sex
      // this.bookForm.patientId = record.patientId
      // this.bookForm.recordId = record.recordId
    },
    bookHandleOk(e) {
      this.$refs.bookRuleForm.validate((valid) => {
        if (valid) {
          examineAppointment(this.bookForm).then((res) => {
            if (res.success) {
              this.$message.success('提交成功')
              this.bookVisible = false
              this.regDisabled = false
              this.getWorkbenchInfo()
            } else {
              this.$message.info(res.message)
            }
          })
          // this.bookVisible = false
        } else {
          this.$message.warning('请填写信息后确认')
          return false
        }
      })
    },
    bookHandleCancel() {
      this.regDisabled = false
    },
    showInspectionModal(record) {
      if (record.chkStatus === 2) {
        this.chkDisabled = true
      }
      this.recordId = record.recordId
      getBeforeCheckList(record.recordId).then((res) => {
        if (res.success && res.data) {
          this.inspectionVisible = true
          this.checkingData = res.data
        } else {
          this.inspectionVisible = true
          this.checkingData = []
        }
      })
    },
    inspectionHandleOk(e) {
      addBeforeCheck(this.checkingData, this.recordId).then((res) => {
        this.inspectionVisible = false
        this.chkDisabled = false
        this.$message.info(res.message)
        this.getWorkbenchInfo()
      })
    },
    inspectionHandleCancel() {
      this.chkDisabled = false
    },
    closeCheckingBox(id, index) {
      if (id) {
        deleteBeforeCheck(id, this.recordId).then((res) => {
          this.$message.info(res.message)
          if (res.success) {
            this.checkingData.splice(index, 1)
          }
        })
      } else {
        this.checkingData.splice(index, 1)
      }
    },
    toDosingBeforeCheck(record) {
      let disabled = false
      if (record.drugStatus === 2) {
        disabled = true
      }
      this.$router.push({
        name: 'DosingBeforeCheck',
        query: { recordId: record.recordId, patientId: record.patientId, disabled: disabled },
      })
    },
    toDiagnoseReport(record) {
      let disabled = false
      if (record.reportStatus === 2) {
        disabled = true
      }
      this.$router.push({
        name: 'DiagnoseReport',
        query: {
          recordId: record.recordId,
          patientId: record.patientId,
          disabled: disabled,
        },
      })
    },
    toReportReview(record) {
      let disabled = false
      if (record.auditStatus === 2) {
        disabled = true
      }
      this.$router.push({
        name: 'ReportReview',
        query: {
          recordId: record.recordId,
          patientId: record.patientId,
          disabled: disabled,
        },
      })
    },
  },
}
</script>

<style lang="" scoped>
.managePatient {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.managePatientTop {
  display: flex;
  justify-content: flex-end;
}
.exportBtn {
  color: #656ee8;
  font-weight: bold;
  border: 1px solid #656ee8;
  margin-left: 1020px;
  width: 100px;
}
.exportBtn:hover {
  color: #ffffff;
  background: #656ee8;
  border: 1px solid #656ee8;
}
.exportLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 52px;
  margin-bottom: 25px;
}
.ant-calendar-picker {
  width: 300px;
}
.ant-divider {
  height: 14px;
}
.manageDown {
  margin-top: 25px;
}
.editBtn /deep/ .editBtnHover:hover {
  color: #656ee8;
  border-color: #656ee8;
}
.editBtn /deep/ .ant-btn:focus {
  color: #656ee8;
  border-color: #656ee8;
}
.editBtnDisabled {
  /* color: #8a8a8a !important;
  pointer-events: none; */
  border: 1px dashed #d2d2d2;
}
.canDoBtn {
  color: #656ee8;
  border-color: #656ee8;
}
.ant-divider-vertical {
  height: auto;
}
.bookTop {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #d2d2d2;
  padding-bottom: 20px;
}
.ant-radio-button-wrapper {
  width: 23%;
  margin: 10px 10px 10px 0;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
}
.ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}
.ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  box-shadow: none !important;
}
.ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-radio-button-wrapper-checked:not(:first-child)::before {
  content: none;
}
.bookForm {
  height: 250px;
}
.ant-form-item {
  margin-bottom: 0 !important;
}
.dateRow {
  top: -70px;
  width: 35%;
}
.formCheckBox {
  position: absolute;
  bottom: 50px;
}
.addBtn {
  background-color: #ffffff;
  padding: 10px 0;
}
.checkingBox {
  background-color: rgb(242, 242, 242);
  margin-top: 5px;
  padding: 10px;
}
.overflowYbox {
  overflow-y: auto;
  height: 60vh;
}
.flexBox {
  display: flex;
  justify-content: space-between;
}
.closeIcon {
  cursor: pointer;
  width: 25px;
  height: 25px;
  line-height: 25px;
}
.checkTitle {
  color: #656ee8;
  margin-bottom: 5px;
}
.resultEntry {
  margin-bottom: 10px;
}
.radioGroup {
  text-align: center;
}
</style>
