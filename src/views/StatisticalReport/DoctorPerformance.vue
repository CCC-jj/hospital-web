<template>
  <div class="DoctorPerformance">
    <!--<a-button class="exportBtn" icon="export"> 导出 </a-button>-->
    <!-- <hr class="exportLine" /> -->
    <div class="manageTop">
      <span>&nbsp;订单时间</span>
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
        }" @change="onDateChange" style="width:25%" />
      &nbsp;
      <span>&nbsp;医生</span>
      <a-select default-value="全部" style="width: 10%" @change="handleChange">
        <a-select-option value="全部">
          全部
        </a-select-option>
        <a-select-option v-for="item in operator" :key="item.operatorId">
          {{item.operatorName}}
        </a-select-option>
      </a-select>
    </div>
    <div class="manageDown">

      <!--患者列表-->
      <a-table bordered :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="
          (record, index) => {
            return record.logId;
          }
        ">
        <a-table-column-group>
          <a-table-column :customRender="(text, record, index) => `${index + 1}`">
            <span slot="title">序号</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">医生</span>
          <a-table-column width="80px" data-index="operatorName">
            <span slot="title">合计</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">应收金额（元）</span>
          <a-table-column>
              <span slot="title">{{sum.receivablePrice}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">优惠金额（元）</span>
          <a-table-column>
            <span slot="title">{{sum.discountedPrice}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">实收金额（元）</span>
          <a-table-column>
            <span slot="title">{{sum.actualPrice}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">接诊人次</span>
          <a-table-column>
            <span slot="title">{{sum.visits}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">初诊人次</span>
          <a-table-column>
            <span slot="title">{{sum.firstVisits}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">复诊人次</span>
          <a-table-column>
            <span slot="title">{{sum.againVisits}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">西/成药费（元）</span>
          <a-table-column>
            <span slot="title">{{sum.WesternFee}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">中药费（元）</span>
          <a-table-column>
            <span slot="title">{{sum.ChineseFee}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">检查项目（元）</span>
          <a-table-column>
            <span slot="title">{{sum.checkItem}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">挂号费（元）</span>
          <a-table-column>
            <span slot="title">{{sum.registrationFee}}</span>
          </a-table-column>
        </a-table-column-group>
        <a-table-column-group>
          <span slot="title">诊疗费（元）</span>
          <a-table-column>
            <span slot="title">{{sum.medicalFees}}</span>
          </a-table-column>
        </a-table-column-group>
        <span class="editBtn" slot="action" slot-scope="text,record">
          <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.logId)">
            <a href="javascript:;"> 删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getOperateLog, deleteOperateLog, getOperator } from '@/api/user'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '医生',
    align: 'center',
    dataIndex: 'operatorId',
  },
  {
    title: '应收金额（元）',
    dataIndex: 'operatorName',
    align: 'center',
  },
  {
    title: '优惠金额（元）',
    dataIndex: 'ip',
    align: 'center',
  },
  {
    title: '实收金额（元）',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '接诊人次',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '初诊人次',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '复诊人次',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '西/成药费（元）',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '中药费（元）',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '检查项目（元）',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '挂号费（元）',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '诊疗费（元）',
    dataIndex: 'operateTime',
    align: 'center',
  },
]

export default {
  name: 'DoctorPerformance',
  data() {
    return {
      columns,
      tableData: [],
      total: 0,
      operator: [],
      params: {
        endDate: '',
        limit: 10,
        operatorId: '',
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        startDate: '',
      },
      sum: {
        receivablePrice: 0,
        discountedPrice: 0,
        actualPrice: 0,
        visits: 0,
        firstVisits: 0,
        againVisits: 0,
        WesternFee: 0,
        ChineseFee: 0,
        checkItem: 0,
        registrationFee: 0,
        medicalFees: 0,
      }
    }
  },
  created() {
    getOperator().then((res) => {
      this.operator = res.data
    })
    // this.getOperateLog()
  },
  methods: {
    moment,
    // 获取操作日志
    getOperateLog() {
      getOperateLog(this.params).then((res) => {
        // console.log(res)
        this.tableData = res.data
        this.total = res.count
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    onDateChange(dates, dateStrings) {
      this.params.startDate = dateStrings[0]
      this.params.endDate = dateStrings[1]
      // this.getOperateLog()
    },
    onDelete(logId) {
      // console.log(logId)
      const data = [...this.tableData]
      this.tableData = data.filter((item) => item.logId !== logId)
      // deleteOperateLog(logId).then((res) => {
      //   if (res.success) {
      //     this.$message.success('删除成功！')
      //     this.getOperateLog()
      //   } else {
      //     this.$message.info(res.message)
      //   }
      // })
    },
  },
}
</script>

<style lang="" scoped>
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
