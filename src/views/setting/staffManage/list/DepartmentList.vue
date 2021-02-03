<template>
  <div class="manageBox">
    <div class="manageTop">
      <a-input-search placeholder="科室名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: 20, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="(record, index) => {return index;}">
        <span slot="status" slot-scope="text, record">
          <a-switch :defaultChecked="record.status==1 ? true : false" @change="onChangeStatus" />
        </span>
        <span class="editBtn" slot="action" slot-scope="text, record">
          <a @click="toEdit">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="科室正在使用，确定要删除此科室吗？" @confirm="() => onDelete(record.key)">
            <a href="javascript:;"> 删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDepartmentList } from '@/api/setting'
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '科室编号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '科室名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '科室简介',
    dataIndex: 'intro',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '创建人员',
    dataIndex: 'creator',
    align: 'center',
  },
  {
    title: '科室状态',
    dataIndex: 'status',
    scopedSlots: { customRender: 'status' },
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
for (let i = 0; i < 4; i++) {
  tableData.push({
    key: i,
    code: 104,
    name: '全科',
    intro: '通用',
    createTime: '2019-11-12 12:08:12',
    creator: '王冕',
    status: 1,
  })
}

export default {
  name: 'Department',
  data() {
    return {
      columns,
      tableData,
      queryInfo: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchWord: '',
      },
    }
  },
  created() {
    this.getInfoList()
  },
  methods: {
    getInfoList() {
      getDepartmentList(this.queryInfo)
        .then((result) => {
          console.log(result)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    onSearch(value) {
      // console.log(value)
    },
    onChangeSearch(e) {
      // console.log(e.target.value)
    },
    onChangeStatus(checked) {
      console.log(`a-switch to ${checked}`)
      if (checked) {
        this.tableData.status = 1
        this.$message.success('科室启用成功')
      } else {
        this.tableData.status = 0
        this.$message.success('科室停用成功')
      }
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
.ant-switch-checked {
  background-color: rgb(69, 213, 133);
}
</style>
