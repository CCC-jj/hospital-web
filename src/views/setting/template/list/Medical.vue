<template>
  <div class="medicalBox">
    <div class="medicalTop">
      <span>&nbsp;模板权限</span>
      <a-select default-value="全部" style="width: 12%" @change="handleChange">
        <a-select-option value="全部"> 全部 </a-select-option>
        <a-select-option value="私人模板"> 私人模板 </a-select-option>
        <a-select-option value="公共模板"> 公共模板 </a-select-option>
      </a-select>
      &nbsp;
      <a-input-search placeholder="模板编码/模板模板名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: 50 }" :rowKey="(record, index) => {return index;}">
        <span class="editBtn" slot="action" slot-scope="text, record">
          <a @click="toEdit">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.key)">
            <a href="javascript:;"> 删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '模板编号',
    align: 'center',
    dataIndex: 'orderNum',
    key: 'orderNum',
  },
  {
    title: '模板名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '诊断',
    key: 'phone',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '模板权限',
    key: 'room',
    dataIndex: 'room',
    align: 'center',
  },
  {
    title: '创建时间',
    key: 'creatTime',
    dataIndex: 'creatTime',
    align: 'center',
  },
  {
    title: '创建人员',
    key: 'doDoctor',
    dataIndex: 'doDoctor',
    align: 'center',
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' },
    align: 'center',
  },
]

const tableData = []
for (let i = 0; i < 14; i++) {
  tableData.push(
    {
      key: i,
      orderNum: 201912090030,
      name: '李四',
      room: '全科',
      phone: 17754138769,
      creatTime: '2019-11-12 12:08:12',
      doDoctor: '林鹤',
    },
    {
      key: i + 1,
      orderNum: 201912090031,
      types: '检查开方',
      creatTime: '2019-11-12 12:08:12',
    }
  )
}

export default {
  name: 'ToCharge',
  data() {
    return {
      columns,
      tableData,
    }
  },
  methods: {
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    onSearch(value) {
      // console.log(value)
    },
    onChangeSearch(e) {
      // console.log(e.target.value)
    },
    toEdit() {
      // const page = this.$route.name
      // this.$router.push({
      //   name: 'Western',
      //   params: {
      //     page: page,
      //   },
      // })
    },
    onDelete(key) {
      const data = [...this.tableData]
      this.tableData = data.filter((item) => item.key !== key)
    },
  },
}
</script>

<style lang="" scoped>
.ant-divider {
  height: auto;
}
.manageDown {
  margin-top: 25px;
}
.editBtn a {
  color: #656ee8;
}
</style>
