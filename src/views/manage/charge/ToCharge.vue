<template>
  <div class="managePatientBox">
    <div class="manageTop">
      <span>&nbsp;订单类型：</span>
      <a-select v-model="queryInfo.receiveType" style="width: 12%" @change="handleChange">
        <a-select-option value=""> 全部 </a-select-option>
        <a-select-option v-for="item in orderTypes" :key="item.typeCode"> {{item.typeName}} </a-select-option>
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
        }" @change="onChange" style="width:25%;" :value="[queryInfo.startDate,queryInfo.endDate]" :disabled-date="disabledDate" />
      &nbsp;
      <a-input-search placeholder="姓名/手机/证件号/订单号" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="OperationBtn" style="margin-top:20px;">
      <a-button :disabled="selectedRowKeys.length===0" type="primary" @click="toCharge(selectedRowKeys)">批量收费</a-button>
    </div>
    <div class="manageDown">
      <a-table :loading="spinning" :row-selection="{selectedRowKeys: selectedRowKeys,onChange: onSelectChange}" :columns="columns" :data-source="tableData" @change="tableChange" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, current:queryInfo.page, showTotal: ((total) => {return `每页10条，共 ${total} 条`;})}" :rowKey="(record, index) => {return record.orderNo;}" :customRow="customRow">
        <span slot="sex" slot-scope="text">
          <span v-if="text == 0">保密</span>
          <span v-if="text == 1">男</span>
          <span v-if="text == 2">女</span>
          <span v-if="text == 9">未说明</span>
        </span>
        <span slot="bizTypeName" slot-scope="text">
          <span>{{text}}</span>
        </span>
        <span slot="validStatus" slot-scope="text">
          <span v-if="!text" style="color: #44c765">待收费</span>
          <span v-else style="color: #b4b4b4">已失效</span>
        </span>
        <!-- <span class="editBtn" slot="action" slot-scope="text, record">
          <a :disabled="record.validStatus" :style="record.validStatus?'color:rgba(0, 0, 0, 0.5)':''" @click="toCharge(record.orderNo)">收费</a> -->
        <!-- <a-divider type="vertical" />
          <a :disabled="record.validStatus" :style="record.validStatus?'color:rgba(0, 0, 0, 0.5)':''" @click="toEdit(record.patientId)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.orderNo)">
            <a :disabled="record.validStatus" :style="record.validStatus?'color:rgba(0, 0, 0, 0.5)':''" href="javascript:;"> 删除 </a>
          </a-popconfirm> -->
        <!-- </span> -->
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getOrderTypes } from '@/api/common'
import { getQueryWait, deleteUnpaidList } from '@/api/charge'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '订单编号',
    align: 'center',
    dataIndex: 'orderNo',
  },
  {
    title: '订单类型',
    align: 'center',
    dataIndex: 'bizTypeName',
    scopedSlots: { customRender: 'bizTypeName' },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    align: 'center',
    scopedSlots: { customRender: 'sex' },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '科室',
    dataIndex: 'department',
    align: 'center',
  },
  {
    title: '接诊医生',
    dataIndex: 'doctor',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '应收金额（元）',
    dataIndex: 'payAmount',
    align: 'center',
  },
  {
    title: '收费状态',
    dataIndex: 'validStatus',
    scopedSlots: { customRender: 'validStatus' },
    align: 'center',
  },
]

export default {
  name: 'ToCharge',
  data() {
    return {
      spinning: false,
      orderTypes: [],
      columns,
      tableData: [],
      selectedRowKeys: [],
      total: 0,
      queryInfo: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        receiveType: '',
        startDate: moment().startOf('day'),
        endDate: moment().endOf('day'),
        searchWord: '',
      },
    }
  },
  created() {
    this.addDate()
    getOrderTypes().then((res) => {
      if (res.success) {
        this.orderTypes = res.data
      }
    })
    this.getQueryWait()
  },
  methods: {
    moment,
    // 当前时间
    addDate() {
      let nowDate = new Date()
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      }
      this.queryInfo.startDate = date.year + '-' + date.month + '-' + date.date
      this.queryInfo.endDate = date.year + '-' + date.month + '-' + date.date
    },
    getQueryWait() {
      this.spinning = true
      getQueryWait(this.queryInfo).then((res) => {
        // if (res.success) {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
        // } else {
        //   this.$message.info('获取订单列表失败！')
        // }
      })
    },
    // 禁用一个月前后日期
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    onChange(dates, dateStrings) {
      this.queryInfo.page = 1
      this.queryInfo.startDate = dateStrings[0]
      this.queryInfo.endDate = dateStrings[1]
      this.getQueryWait()
    },
    handleChange(value) {
      this.queryInfo.page = 1
      this.getQueryWait()
    },
    onSearch(value) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = value
      this.getQueryWait()
    },
    onChangeSearch(e) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = e.target.value
      this.getQueryWait()
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 点击表格行
    customRow(record) {
      return {
        on: {
          // 鼠标单击行
          click: () => {
            if (this.selectedRowKeys.filter(item => item === record.orderNo).length === 0) {
              this.selectedRowKeys.push(record.orderNo)
            } else {
              this.selectedRowKeys = this.selectedRowKeys.filter(item => item !== record.orderNo)
            }
          },
        },
      }
    },
    toCharge(orderNo) {
      // const page = this.$route.name
      let list = JSON.stringify(orderNo)
      this.$router.push({
        name: 'Charge',
        query: {
          orderNo: list,
        },
      })
    },
    toEdit(patientId) {
      const page = this.$route.name
      this.$router.push({
        name: 'Prescription',
        params: {
          page: page,
          patientId: patientId,
        },
      })
    },
    onDelete(key) {
      deleteUnpaidList(key).then((res) => {
        if (res.success) {
          this.$message.success('删除成功！')
          const data = [...this.tableData]
          this.tableData = data.filter((item) => item.orderNo !== key)
        }
      })
    },
    tableChange(pagination, filters, sorter) {
      this.queryInfo.page = pagination.current
      this.getQueryWait()
    },
  },
}
</script>

<style lang="" scoped>
.ant-calendar-picker {
  width: 300px;
}
.ant-divider {
  height: 14px;
}
.manageDown {
  margin-top: 20px;
}
.editBtn a {
  color: #656ee8;
}
</style>
