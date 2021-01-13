<template>
  <div class="maintain">
    <div class="manageTop">
      <a-input-search placeholder="搜索内容" enter-button @search="onSearch" @change="onChangeSearch" style="width: 40%" />
    </div>
    <div class="manageDown">
      <!--患者列表-->
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="
          (record, index) => {
            return record.patientId;
          }
        ">
          <span class="editBtn" slot="action" slot-scope="text,record">
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
import { getPatientList } from '@/api/patient'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '个人史',
    align: 'center',
    dataIndex: 'cardNo',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
    align: 'center',
  },
  {
    title: '创建人',
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
      total: 0,
      params: {
        condition: '',
        endDate: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        startDate: '',
      },
    }
  },
  created() {
    // this.getPatientList()
  },
  methods: {
    // 获取患者列表
    getPatientList() {
      getPatientList(this.params).then((res) => {
        this.tableData = res.data
        this.total = res.count
      })
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
      const data = [...this.tableData]
      this.tableData = data.filter((item) => item.patientId !== patientId)
    },
    patientEdit(patientId) {},
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
