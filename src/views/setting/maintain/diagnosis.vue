<template>
  <div class="maintain">
    <div class="manageTop">
      <a-input-search placeholder="搜索内容" enter-button @search="onSearch" @change="onChangeSearch" style="width: 40%" />
    </div>
    <div class="manageDown">
      <!--患者列表-->
      <a-spin :spinning="spinning">
        <a-table :columns="columns" :data-source="tableData" @change="tableChange" :pagination="{ showQuickJumper: true, pageSize: 10, total: total, showTotal: ((total) => {
        return `每页10条，共 ${total} 条`;
      }) }" :rowKey="
          (record, index) => {
            return record.id;
          }
        ">
          <span class="editBtn" slot="action" slot-scope="text,record">
            <a @click="InfoEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm v-if="tableData.length" title="确定删除吗?" @confirm="() => onDelete(record.id)">
              <a href="javascript:;"> 删除 </a>
            </a-popconfirm>
          </span>
        </a-table>
      </a-spin>
      <a-modal centered v-model="visible" title="编辑诊断信息" @ok="handleOk">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-model-item label="诊断信息" prop="content">
            <a-textarea v-model="form.content" :rows="4" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getDiagnosisList, editDiagnosisList, deleteDiagnosisList } from '@/api/setting'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '诊断内容',
    align: 'center',
    dataIndex: 'content',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center',
  },
  {
    title: '创建人',
    dataIndex: 'creator',
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
      visible: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 19 },
      form: {
        id: '',
        content: '',
      },
      rules: {
        content: [{ required: true, message: '请输入信息', trigger: 'blur' }],
      },
      columns,
      tableData: [],
      total: 0,
      params: {
        content: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
      },
    }
  },
  created() {
    this.getMaintainList()
  },
  methods: {
    // 获取诊断信息列表
    getMaintainList() {
      this.spinning = true
      getDiagnosisList(this.params).then((res) => {
        this.tableData = res.data
        this.total = res.count
        this.spinning = false
      })
    },
    onSearch(value) {
      this.params.content = value
      this.getMaintainList()
    },
    onChangeSearch(e) {
      this.params.content = e.target.value
      this.getMaintainList()
    },
    onDelete(id) {
      deleteDiagnosisList(id).then((res) => {
        if (res.success) {
          this.$message.success('删除成功！')
          const data = [...this.tableData]
          this.tableData = data.filter((item) => item.id !== id)
          this.getMaintainList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    tableChange(pagination, filters, sorter) {
      this.params.page = pagination.current
      this.getMaintainList()
    },
    InfoEdit(record) {
      this.visible = true
      this.form.id = record.id
      this.form.content = record.content
    },
    handleOk(e) {
      editDiagnosisList(this.form).then((res) => {
        if (res.success) {
          this.$message.success('修改成功！')
          this.getMaintainList()
          this.visible = false
        } else {
          this.$message.error(res.message)
        }
      })
    },
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
