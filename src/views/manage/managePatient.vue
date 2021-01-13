<template>
  <div class="managePatient">
    <!--<a-button class="exportBtn" icon="export"> 导出 </a-button>-->
    <hr class="exportLine" />
    <div class="manageTop">
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
        }" @change="onDateChange" style="width:25%" :value="[params.startDate,params.endDate]" :disabled-date="disabledDate" />
      &nbsp;
      <a-input-search placeholder="患者姓名/手机号码" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">

      <!--患者列表-->
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" @change="tableChange" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="
          (record, index) => {
            return record.patientId;
          }
        ">
          <span slot="sex" slot-scope="text,record">
            <span v-if="record.sex==0">保密</span>
            <span v-if="record.sex==1">男</span>
            <span v-if="record.sex==2">女</span>
            <span v-if="record.sex==9">未说明</span>
          </span>
          <span class="editBtn" slot="action" slot-scope="text,record">
            <a @click="toAdmission(record.patientId)">接诊</a>
            <a-divider type="vertical" />
            <a @click="toPatientInfo(record.patientId)">查看</a>
            <a-divider type="vertical" />
            <a @click="patientEdit(record.patientId)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.patientId)">
              <a href="javascript:;"> 删除 </a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getRecipelCategory } from '@/api/common'
import { getPatientList, deletePatient } from '@/api/patient'

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
  },
  {
    title: '患者姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '性别',
    scopedSlots: { customRender: 'sex' },
    align: 'center',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    align: 'center',
  },
  {
    title: '身份证号码',
    dataIndex: 'certNo',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
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
  name: 'ManagePatient',
  data() {
    return {
      spinning: false,
      columns,
      tableData: [],
      total: 0,
      params: {
        condition: '',
        endDate: moment().endOf('day'),
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        startDate: moment().startOf('day').subtract(1, 'month'),
      },
    }
  },
  created() {
    this.getPatientList()
  },
  methods: {
    moment,
    // 获取患者列表
    getPatientList() {
      this.spinning = true
      getPatientList(this.params).then((res) => {
        // if (res.success) {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
        // } else {
        //   this.$message.info(res.message)
        // }
      })
    },
    // 禁用一个月之前日期
    disabledDate(current) {
      return (
        (current && current < moment().startOf('day').subtract(1, 'month')) ||
        (current && current > moment().endOf('day'))
      )
    },
    onDateChange(dates, dateStrings) {
      this.params.startDate = dateStrings[0]
      this.params.endDate = dateStrings[1]
      this.getPatientList()
    },
    onSearch(value) {
      this.params.condition = value
      this.getPatientList()
    },
    onChangeSearch(e) {
      this.params.condition = e.target.value
      this.getPatientList()
    },
    onDelete(patientId) {
      deletePatient(patientId).then((res) => {
        if (res.success) {
          this.$message.success('删除成功！')
          const data = [...this.tableData]
          this.tableData = data.filter((item) => item.patientId !== patientId)
        } else {
          this.$message.error(res.message)
        }
      })
      this.getPatientList()
    },
    tableChange(pagination, filters, sorter) {
      this.params.page = pagination.current
      this.getPatientList()
    },
    toPatientInfo(patientId) {
      const page = this.$route.name
      this.$router.push({
        name: 'PatientInfo',
        params: {
          page: page,
        },
        query: {
          patientId: patientId,
          disabled: true,
        },
      })
    },
    patientEdit(patientId) {
      const page = this.$route.name
      this.$router.push({
        name: 'PatientInfo',
        params: {
          page: page,
        },
        query: {
          patientId: patientId,
          disabled: false,
        },
      })
    },
    toAdmission(patientId) {
      const page = this.$route.name
      this.$router.push({
        name: 'Prescription',
        params: {
          page: page,
          patientId: patientId,
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
.ant-divider-vertical {
  height: auto;
}
.manageDown {
  margin-top: 25px;
}
.editBtn a {
  color: #656ee8;
}
</style>
