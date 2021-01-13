<template>
  <div class="operationLog">
    <!--<a-button class="exportBtn" icon="export"> 导出 </a-button>-->
    <hr class="exportLine" />
    <div class="manageTop">
      <span>&nbsp;操作时间：</span>
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
      <span>&nbsp;操作人员：</span>
      <a-select v-model="params.operatorId" style="width: 10%" @change="handleChange">
        <a-select-option value="">
          全部
        </a-select-option>
        <a-select-option v-for="item in operator" :key="item.operatorId">
          {{item.operatorName}}
        </a-select-option>
      </a-select>
    </div>
    <div class="manageDown">
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" @change="tableChange" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="
          (record, index) => {
            return record.logId;
          }
        ">
          <span class="editBtn" slot="action" slot-scope="text,record">
            <!-- <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.logId)">
              <a href="javascript:;"> 删除 </a>
            </a-popconfirm> -->
            <a @click="showInfoModal(record)">查看</a>
          </span>
        </a-table>
      </a-spin>
    </div>
    <a-modal centered width="550px" v-model="visible" title="日志详情" on-ok="handleOk">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">
          关闭
        </a-button>
      </template>
      <p>日志标题：{{modalInfo.title}}</p>
      <p>操作人：{{modalInfo.operator}}</p>
      <p>操作时间：{{modalInfo.operateTime}}</p>
      <p>请求json：<json-viewer :value="modalInfo.request" :expand-depth=2></json-viewer>
      </p>
      <p>返回json：<json-viewer :value="modalInfo.response"></json-viewer>
      </p>
    </a-modal>
  </div>
</template>

<script>
import moment from 'moment'
import { getOperateLog, deleteOperateLog, getOperator, getLogDetail } from '@/api/user'
import Vue from 'vue'
import JsonViewer from 'vue-json-viewer'
Vue.use(JsonViewer)
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '员工工号',
    align: 'center',
    dataIndex: 'operatorId',
  },
  {
    title: '员工姓名',
    dataIndex: 'operatorName',
    align: 'center',
  },
  {
    title: 'ip地址',
    dataIndex: 'ip',
    align: 'center',
  },
  {
    title: '操作内容',
    dataIndex: 'content',
    align: 'center',
  },
  {
    title: '操作时间',
    dataIndex: 'operateTime',
    align: 'center',
  },
  {
    title: '',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]

export default {
  name: 'operationLog',
  data() {
    return {
      visible: false,
      spinning: false,
      columns,
      tableData: [],
      total: 0,
      operator: [],
      params: {
        endDate: moment().endOf('day'),
        limit: 10,
        operatorId: '',
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        startDate: moment().startOf('day').subtract(1, 'month'),
      },
      modalInfo: {
        title: '',
        operator: '',
        operateTime: '',
        request: '',
        response: '',
      },
    }
  },
  created() {
    getOperator().then((res) => {
      if (res.success) {
        this.operator = res.data
      }
    })
    this.getOperateLog()
  },
  methods: {
    moment,
    // 获取操作日志
    getOperateLog() {
      this.spinning = true
      getOperateLog(this.params).then((res) => {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
      this.getOperateLog()
    },
    // 禁用一个月前后日期
    disabledDate(current) {
      return (
        (current && current < moment().startOf('day').subtract(1, 'month')) ||
        (current && current > moment().endOf('day'))
      )
    },
    onDateChange(dates, dateStrings) {
      this.params.startDate = dateStrings[0]
      this.params.endDate = dateStrings[1]
      this.getOperateLog()
    },
    tableChange(pagination, filters, sorter) {
      this.params.page = pagination.current
      this.getOperateLog()
    },
    onDelete(logId) {
      // console.log(logId)
      deleteOperateLog(logId).then((res) => {
        // console.log(res)
        if (res.success) {
          const data = [...this.tableData]
          this.tableData = data.filter((item) => item.logId !== logId)
          this.$message.success('删除成功！')
          this.getOperateLog()
        } else {
          this.$message.info(res.message)
        }
      })
    },
    showInfoModal(record) {
      getLogDetail(record.logId).then((res) => {
        if (res.success) {
          this.modalInfo = res.data
          this.modalInfo.request = JSON.parse(res.data.request)
          this.modalInfo.response = JSON.parse(res.data.response)
          this.visible = true
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    handleOk(e) {
      this.visible = false
    },
  },
}
</script>

<style lang="" scoped>
.operationLog {
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
