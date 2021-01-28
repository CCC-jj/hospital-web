<template>
  <div class="manageBox">
    <div class="manageTop">
      <span>&nbsp;所属科室</span>
      <a-select default-value="全部" style="width: 12%" @change="handleChange">
        <a-select-option value="全部"> 全部 </a-select-option>
        <a-select-option value="全科"> 全科 </a-select-option>
        <a-select-option value="内科"> 内科 </a-select-option>
				<a-select-option value="儿科"> 儿科 </a-select-option>
      </a-select>
      &nbsp;
      <a-input-search placeholder="员工姓名" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
    </div>
    <div class="manageDown">
      <a-table :columns="columns" :data-source="tableData" :pagination="{ showQuickJumper: true, pageSize: 10, total: 20, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="(record, index) => {return index;}">
				<span slot="status" slot-scope="text, record">
					<a-switch v-model="record.status" @change="onChangeStatus" />
				</span>
        <span class="editBtn" slot="action" slot-scope="text, record">
          <a @click="toEdit">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="tableData.length" title="删除后无法恢复，确定要删除此员工信息吗？" @confirm="() => onDelete(record.key)">
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
    title: '工号',
    align: 'center',
    dataIndex: 'orderNum',
  },
  {
    title: '员工姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '员工性别',
    dataIndex: 'sex',
    align: 'center',
  },
  {
    title: '员工年龄',
    dataIndex: 'age',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '所属诊所',
    dataIndex: 'clinic',
    align: 'center',
	},
	{
    title: '所属科室',
    dataIndex: 'room',
    align: 'center',
	},
	{
    title: '角色',
    dataIndex: 'roles',
    align: 'center',
	},
	{
    title: '创建时间',
    dataIndex: 'creatTime',
    align: 'center',
	},
	{
    title: '创建人员',
    dataIndex: 'doPeople',
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

const tableData = []
for (let i = 0; i < 14; i++) {
  tableData.push(
    {
      key: i,
      orderNum: 1030,
      name: '李四',
			sex: '男',
			age: '25',
			phone: 17754138769,
			clinic: '支所1',
			room: '全科',
			roles: '医生',
      creatTime: '2019-11-12 12:08:12',
			doPeople: '林鹤',
			status: true,
    }
  )
}

export default {
  name: 'Staff',
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
		onChangeStatus(checked) {
			console.log(`a-switch to ${checked}`)
			if (checked) {
        this.$message.success('员工启用成功')
      } else {
        this.$message.success('员工停用成功')
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
.ant-switch-checked{
	background-color: rgb(69,213,133);
}
</style>
