<template>
  <div class="managePatient">
    <div class="managePatientTop">
      <!-- <a-button class="syncMedicineBtn" icon="plus-circle">同步项目</a-button>
      <a-button class="exportBtn" icon="import"> 导入 </a-button>
      <a-button class="exportBtn" icon="export"> 导出 </a-button> -->
    </div>
    <hr class="exportLine" />
    <div class="manageTop">
      <div style="width:19%">
        <span>项目状态</span>
        <a-select default-value="全部" style="width:70%" @change="handleChange">
          <a-select-option value="全部"> 全部 </a-select-option>
          <a-select-option value="启用"> 启用 </a-select-option>
          <a-select-option value="停用"> 停用 </a-select-option>
        </a-select>
      </div>
      <div style="width:29%">
        <a-input-search placeholder="项目名称/项目编号" enter-button @search="onSearch" @change="onChangeSearch" />
      </div>
    </div>
    <div class="manageDown">
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: 50, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }" :rowKey="
          (record, index) => {
            return index;
          }
        ">
          <span class="editBtn" slot="action">
            <a>编辑</a>
            <a-divider type="vertical" />
            <a>停用</a>
          </span>
        </a-table>
      </a-spin>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '项目编码',
    align: 'center',
    dataIndex: 'drugSpecId',
  },
  {
    title: '项目名称',
    dataIndex: 'drugName',
    align: 'center',
  },
  {
    title: '项目类别',
    dataIndex: 'statItemId',
    align: 'center',
  },
  {
    title: '发票项目',
    dataIndex: 'invoice',
    align: 'center',
  },
  {
    title: '零售价（元）',
    dataIndex: 'biddingPrice',
    align: 'center',
  },
  {
    title: '成本价（元）',
    dataIndex: 'retailPrice',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'manufacturer',
    align: 'center',
  },
  {
    title: '项目状态',
    dataIndex: 'status',
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

const tableData = []
for (let i = 0; i < 30; i++) {
  tableData.push({
    key: i,
    drugSpecId: '1',
    drugName: '去痛片(农)',
    statItemId: '脑电图',
    invoice: '注射费',
    biddingPrice: '15.00',
    retailPrice: '13.00',
    manufacturer: '次',
    status: '启用',
    createTime: '2020-11-18 08:57:09',
  })
}

export default {
  data() {
    return {
      spinning: false,
      columns,
      tableData,
    }
  },
  methods: {
    moment,
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    onChange(dates, dateStrings) {
      // console.log('From: ', dates[0], ', to: ', dates[1])
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    onSearch(value) {
      // console.log(value)
    },
    onChangeSearch(e) {
      // console.log(e.target.value)
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
