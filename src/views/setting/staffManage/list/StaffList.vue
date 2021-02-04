<template>
  <div class="manageBox">
    <div class="manageTop">
      <span>&nbsp;所属科室</span>
      <a-select v-model="queryInfo.code" style="width: 12%" @change="handleChange">
        <a-select-option value=""> 全部 </a-select-option>
        <a-select-option v-for="item in departmentList" :key="item.code"> {{item.name}} </a-select-option>
      </a-select>
      &nbsp;
      <a-input-search placeholder="员工姓名" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :loading="tableLoading" :columns="columns" :data-source="tableData" @change="changeTable" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, current: queryInfo.page, showTotal: ((total) => {return `每页10条，共 ${total} 条`}) }" :rowKey="(record, index) => {return record.code}">
        <span slot="sex" slot-scope="text">
          <span v-if="text == 0">保密</span>
          <span v-if="text == 1">男</span>
          <span v-if="text == 2">女</span>
          <span v-if="text == 9">未说明</span>
        </span>
        <span slot="status" slot-scope="text, record">
          <a-switch :checked="record.status===1 ? true : false" @change="(checked)=>onChangeStatus(checked,record)" />
        </span>
        <span class="editBtn" slot="action" slot-scope="text, record">
          <a @click="toEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="删除后无法恢复，确定要删除此员工信息吗？" @confirm="() => onDelete(record.code)">
            <a href="javascript:;"> 删除 </a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
  </div>
</template>

<script>
import {
  getEmployDoctorList,
  getDoctorStatus,
  deleteDoctor,
  getDoctorDepartmentList,
} from '@/api/setting'
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '工号',
    align: 'center',
    dataIndex: 'code',
  },
  {
    title: '员工姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '员工性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' },
    align: 'center',
  },
  {
    title: '员工年龄',
    dataIndex: 'age',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '所属诊所',
    dataIndex: 'clinic',
    align: 'center',
  },
  {
    title: '所属科室',
    dataIndex: 'deptName',
    align: 'center',
  },
  {
    title: '角色',
    dataIndex: 'roleName',
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
    title: '员工状态',
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
  name: 'Staff',
  data() {
    return {
      columns,
      tableData: [],
      tableLoading: false,
      total: 0,
      queryInfo: {
        code: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchWord: '',
      },
      queryDepartment: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchWord: '',
      },
      departmentList: [],
    }
  },
  created() {
    getDoctorDepartmentList(this.queryDepartment).then((res) => {
      this.departmentList = res.data
    })
    this.getInfoList()
  },
  methods: {
    getInfoList() {
      this.tableLoading = true
      getEmployDoctorList(this.queryInfo)
        .then((res) => {
          this.tableLoading = false
          this.tableData = res.data
          this.total = res.count
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleChange(value) {
      this.getInfoList()
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
      getDoctorStatus({ code: record.code, id: record.id, status: status })
        .then((res) => {
          if (res.success) {
            if (checked) {
              record.status = 1
              this.$message.success('员工启用成功')
            } else {
              record.status = 0
              this.$message.success('员工停用成功')
            }
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {})
    },
    toEdit(record) {
      this.$router.push({ name: 'StaffInfo', query: { info: record } })
    },
    onDelete(key) {
      deleteDoctor(key)
        .then((res) => {
          if (res.success) {
            const data = [...this.tableData]
            this.tableData = data.filter((item) => item.code !== key)
            this.$message.success('删除成功！')
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {})
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
