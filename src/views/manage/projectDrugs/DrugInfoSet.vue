<template>
  <div class="managePatient">
    <div class="managePatientTop">
      <!-- <a-button class="syncMedicineBtn" icon="plus-circle" @click="syncDrug">同步药品</a-button>
      <a-button class="exportBtn" icon="import" @click="importDrug"> 导入 </a-button> -->
    </div>
    <hr class="exportLine" />
    <div class="manageTop">
      <div style="width:19%">
        <span>处方类别</span>
        <a-select v-model="queryInfo.recipeType" style="width:70%" @change="handleChange">
          <a-select-option value=""> 全部 </a-select-option>
          <a-select-option v-for="item in recipelCategoryList" :key="item.id"> {{item.name}}</a-select-option>
        </a-select>
      </div>
      <div style="width:19%">
        <span>药品状态</span>
        <a-select default-value="全部" style="width:70%" @change="handleChange">
          <a-select-option value="全部"> 全部 </a-select-option>
          <a-select-option value="启用"> 启用 </a-select-option>
          <a-select-option value="停用"> 停用 </a-select-option>
        </a-select>
      </div>
      <div style="width:29%">
        <span>创建时间</span>
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
        }" @change="onChange" style="width:80%" />
      </div>
      <div style="width:29%">
        <a-input-search placeholder="输入药品名称/编码/生产厂家" enter-button @search="onSearch" @change="onChangeSearch" />
      </div>
    </div>
    <div class="manageDown">
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, current:queryInfo.page, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }" @change="tableChange" :rowKey="
          (record, index) => {
            return record.drugSpecId;
          }
        ">
          <span slot="status" slot-scope="text">
            <span v-if="text==1">启用</span>
            <span v-if="text==0">停用</span>
          </span>
          <span class="editBtn" slot="action" slot-scope="text,record">
            <a @click="showInfoModal(record)">查看</a>
            <!-- <a-divider type="vertical" />
            <a>复制</a>
            <a-divider type="vertical" />
            <a @click="useStop(record.drugSpecId)">停用</a> -->
          </span>
        </a-table>
      </a-spin>

      <!-- <a-modal centered v-model="visible" title="药品信息" on-ok="handleOk">
        <template slot="footer"> -->
      <!-- <a-button key="back" @click="handleCancel">
            Return
          </a-button> -->
      <!-- <a-button key="submit" type="primary" @click="handleOk">
            关闭
          </a-button>
        </template>
        <p>Some contents...</p>
      </a-modal> -->

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getRecipelCategory } from '@/api/common'
import { getDrugList, closeDrug, syncDrugs, importDrugs } from '@/api/manage'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '编码',
    align: 'center',
    dataIndex: 'drugSpecId',
  },
  {
    title: '药品名称',
    dataIndex: 'drugName',
    align: 'center',
  },
  {
    title: '规格',
    dataIndex: 'drugSpec',
    align: 'center',
  },
  {
    title: '收费类别',
    dataIndex: 'statItemId',
    align: 'center',
  },
  {
    title: '采购价',
    dataIndex: 'biddingPrice',
    align: 'center',
  },
  {
    title: '售药价',
    dataIndex: 'retailPrice',
    align: 'center',
  },
  {
    title: '生产厂家',
    dataIndex: 'manufacturer',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]

// const tableData = []
// for (let i = 0; i < 30; i++) {
//   tableData.push({
//     key: i,
//     drugSpecId: '1',
//     drugName: '去痛片(农)',
//     drugSpec: '100片(复方)',
//     statItemId: '01',
//     biddingPrice: '0.0',
//     retailPrice: '0.0',
//     manufacturer: null,
//     status: 1,
//     createTime: '2020-11-18 08:57:09',
//   })
// }

export default {
  data() {
    return {
      spinning: false,
      visible: false,
      recipelCategoryList: [],
      columns,
      tableData: [],
      total: 0,
      queryInfo: {
        drugStatus: '1',
        endDate: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        recipeType: '',
        searchWords: '',
        startDate: '',
      },
    }
  },
  created() {
    getRecipelCategory().then((res) => {
      if (res.success) {
        this.recipelCategoryList = res.data
      }
    })
    this.getDrugList()
  },
  methods: {
    moment,
    getDrugList() {
      this.spinning = true
      getDrugList(this.queryInfo).then((res) => {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
      })
    },
    tableChange(pagination, filters, sorter) {
      this.queryInfo.page = pagination.current
      this.getDrugList()
    },
    handleChange(value) {
      this.queryInfo.page = 1
      this.getDrugList()
    },
    onChange(dates, dateStrings) {
      this.queryInfo.page = 1
      this.queryInfo.startDate = dateStrings[0]
      this.queryInfo.endDate = dateStrings[1]
      this.getDrugList()
    },
    onSearch(value) {
      this.queryInfo.page = 1
      this.queryInfo.searchWords = value
      this.getDrugList()
    },
    onChangeSearch(e) {
      this.queryInfo.page = 1
      this.queryInfo.searchWords = e.target.value
      this.getDrugList()
    },
    syncDrug() {
      syncDrugs().then((res) => {
        if (res.success) {
          this.$message.success('数据同步成功')
        } else {
          this.$message.info(res.message)
        }
      })
    },
    importDrug() {
      importDrugs().then((res) => {
        if (res.success) {
          this.$message.success('数据导入成功')
        } else {
          this.$message.info(res.message)
        }
      })
    },
    useStop(drugSpecId) {
      this.$confirm({
        title: '停用确认',
        content: '确定要停用此药品信息吗？',
        onOk: () => {
          closeDrug(drugSpecId).then((res) => {
            if (res.success) {
              this.$message.success('停用成功！')
              this.getDrugList()
            } else {
              this.$message.info('药品正在使用，不能停用！')
            }
          })
        },
      })
    },
    showInfoModal(record) {
      let status
      switch (record.status) {
        case 0:
          status = '停用'
          break
        case 1:
          status = '启用'
      }
      this.$info({
        title: '药品信息',
        centered: true,
        maskClosable: true,
        content: (
          <div>
            <br />
            <p>药品编码：{record.drugSpecId}</p>
            <p>药品名称：{record.drugName}</p>
            <p>规格：{record.drugSpec}</p>
            <p>收费类别：{record.statItemId}</p>
            <p>采购价：{record.biddingPrice}</p>
            <p>售药价：{record.retailPrice}</p>
            <p>生产厂家：{record.manufacturer}</p>
            <p>状态：{status}</p>
            <p>创建时间：{record.createTime}</p>
          </div>
        ),
        okText: '关闭',
      })
    },
    handleOk() {
      this.visible = false
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
.managePatientTop > button {
  margin-left: 20px;
}
.ant-btn {
  font-weight: bold;
  width: 110px;
}
.syncMedicineBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: none;
}
.syncMedicineBtn:hover {
  color: #ffffff;
  background-color: #9096ea;
}
.syncMedicineBtn:focus {
  color: #ffffff;
  background-color: #656ee8;
}
.exportBtn {
  color: #656ee8;
  border: 1px solid #656ee8;
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
.manageTop {
  display: flex;
  justify-content: flex-start;
}
.manageTop > div {
  margin-right: 1%;
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
.editBtn a {
  color: #656ee8;
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
  margin: 10px 25px 10px 0;
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
</style>
