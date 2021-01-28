<template>
  <div class="manageBox">
    <div class="manageTop">
      <a-input-search placeholder="角色名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 30%" />
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
          <a-popconfirm v-if="tableData.length" title="角色正在使用，确定要删除此科室吗？" @confirm="() => onDelete(record.key)">
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
    title: '科室编号',
    align: 'center',
    dataIndex: 'orderNum',
  },
  {
    title: '科室名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '科室简介',
    dataIndex: 'info',
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
  tableData.push(
    {
      key: i,
      orderNum: '04',
      name: '超级管理',
			info: '通用',
      creatTime: '2019-11-12 12:08:12',
			doPeople: '王冕',
			status: true,
    }
  )
}

export default {
  name: 'Role',
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
        this.$message.success('角色启用成功')
      } else {
        this.$message.success('角色停用成功')
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
