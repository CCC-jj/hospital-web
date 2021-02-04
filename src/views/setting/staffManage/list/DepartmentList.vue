<template>
  <div class="manageBox">
    <div class="manageTop">
      <a-input-search placeholder="科室名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :loading="tableLoading" :columns="columns" :data-source="tableData" @change="changeTable" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, current: queryInfo.page, showTotal: ((total) => {return `每页10条，共 ${total} 条`;}) }" :rowKey="(record, index) => {return record.code}">
        <span slot="status" slot-scope="text, record">
          <a-switch :checked="record.status===1 ? true : false" @change="(checked)=>onChangeStatus(checked,record)" />
        </span>
        <span class="editBtn" slot="action" slot-scope="text, record">
          <a @click="toEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="科室正在使用，确定要删除此科室吗？" @confirm="() => onDelete(record.code)">
            <a href="javascript:;"> 删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import { getDepartmentList, getDepartmentStatus, deleteDepartment } from '@/api/setting'
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

export default {
  name: 'Department',
  data() {
    return {
      columns,
      tableData: [],
      tableLoading: false,
      total: 0,
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
      this.tableLoading = true
      getDepartmentList(this.queryInfo)
        .then((res) => {
          this.tableLoading = false
          this.tableData = res.data
          this.total = res.count
        })
        .catch((err) => {
          console.log(err)
        })
    },
    onSearch(value) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = value
      this.getInfoList()
    },
    onChangeSearch(e) {
      this.queryInfo.page = 1
      this.queryInfo.searchWord = e.target.value
      this.getInfoList()
    },
    onChangeStatus(checked, record) {
      const status = checked ? 1 : 0
      getDepartmentStatus({ code: record.code, status: status })
        .then((res) => {
          if (res.success) {
            if (checked) {
              record.status = 1
              this.$message.success('科室启用成功')
            } else {
              record.status = 0
              this.$message.success('科室停用成功')
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {})
    },
    toEdit(record) {
      this.$router.push({ name: 'DepartmentInfo', query: { info: record } })
    },
    onDelete(key) {
      deleteDepartment(key)
        .then((res) => {
          if (res.success) {
            const data = [...this.tableData]
            this.tableData = data.filter((item) => item.code !== key)
            this.$message.success('删除成功！')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    changeTable(pagination, filters, sorter) {
      this.queryInfo.page = pagination.current
      this.getInfoList()
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
