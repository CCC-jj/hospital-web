<template>
  <div class="staffManageInfo">
    <div class="staffManageInfoTop">
      <div>
        {{type}}角色信息
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="saveBtn" icon="save" :loading="iconLoading" @click="toSave">{{save}}</a-button>
        </div>
      </div>
    </div>

    <div class="staffManageInfoContent">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="科室编号" prop="code">
              <a-input v-model="form.code" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="科室名称" prop="name">
              <a-input placeholder="请输入姓名" v-model="form.name" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="科室状态" prop="status">
              <a-switch :defaultChecked="form.status===1 ? true : false" @change="onChangeStatus" />
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="30">
          <a-col :span="12">
            <a-form-model-item label="科室简介" prop="intro">
              <a-input placeholder="请输入科室简介" v-model="form.intro" size="large" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <div class="manageDown">
        <p class="rolesTitle">权限分配</p>
        <!-- <a-spin :spinning="spinning"> -->
        <a-table :columns="columns" :data-source="tableData" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, onSelect: onSelectRow, onSelectAll: onSelectAllRow }" :rowKey="(record, index) => {return record.key}">
          <span slot="features" slot-scope="text,record">
            <a-checkbox v-for="item in record.features" :key="item.id" v-model="item.checked" @change="onChangeCheck">
              {{item.name}}
            </a-checkbox>
          </span>
        </a-table>
        <!-- </a-spin> -->
      </div>
    </div>
  </div>
</template>

<script>
import { createRole, modifyRole } from '@/api/setting'
const columns = [
  // {
  //   title: '序号',
  //   align: 'center',
  //   customRender: (text, record, index) => `${index + 1}`,
  // },
  {
    title: '模块',
    align: 'left',
    dataIndex: 'name',
  },
  {
    title: '功能',
    align: 'left',
    dataIndex: 'features',
    scopedSlots: { customRender: 'features' },
  },
]

const tableData = []
for (let i = 0; i < 5; i++) {
  tableData.push({
    key: i,
    name: '模块1',
    features: [
      {
        id: 1,
        name: '功能1',
        checked: false,
      },
      {
        id: 2,
        name: '功能2',
        checked: true,
      },
      {
        id: 3,
        name: '功能3',
        checked: false,
      },
      {
        id: 4,
        name: '功能4',
        checked: false,
      },
      {
        id: 5,
        name: '功能5',
        checked: true,
      },
    ],
  })
}
export default {
  name: 'RoleInfo',
  data() {
    return {
      type: '新增',
      save: '保存',
      iconLoading: false,
      form: {
        code: '',
        name: '',
        intro: '',
        status: 1,
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
      },
      columns,
      tableData,
      selectedRowKeys: [],
    }
  },
  created() {
    if (this.$route.query.info) {
      this.type = '修改'
      this.form = this.$route.query.info
    }
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    onSelectRow(record, selected, selectedRows, nativeEvent) {
      record.features = record.features.map((item) => {
        return {
          id: item.id,
          name: item.name,
          checked: selected ? true : false,
        }
      })
    },
    onSelectAllRow(selected, selectedRows, changeRows) {
      changeRows.forEach((item) => {
        this.onSelectRow(item, selected)
      })
    },
    onChangeStatus(checked) {
      if (checked) {
        this.form.status = 1
        this.$message.success('角色启用')
      } else {
        this.form.status = 0
        this.$message.success('角色停用')
      }
    },
    onChangeCheck(e) {
      console.log(`checked = ${e.target.checked}`)
    },
    goBack() {
      this.$router.push({ name: 'RoleList' })
    },
    toSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.iconLoading = true
          this.save = '保存中'
          if (this.type === '新增') {
            createRole(this.form)
              .then((res) => {
                this.iconLoading = false
                this.save = '保存'
                if (res.success) {
                  this.$message.success('保存成功！')
                  this.$router.push({ name: 'RoleList' })
                } else {
                  this.$message.warning(res.message)
                }
              })
              .catch((err) => {})
          } else {
            modifyRole(this.form)
              .then((res) => {
                this.iconLoading = false
                this.save = '保存'
                if (res.success) {
                  this.$message.success('保存成功！')
                  this.$router.push({ name: 'RoleList' })
                } else {
                  this.$message.warning(res.message)
                }
              })
              .catch((err) => {})
          }
        } else {
          this.$message.warning('请填写信息后再保存')
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.staffManageInfo {
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  border-radius: 5px;
}

.staffManageInfoTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  font-size: 18px;
}

.staffManageInfoTop > div:nth-child(1) {
  padding-left: 10px;
}

.staffManageInfoTop > div:nth-child(1)::before {
  content: '';
  display: block;
  position: absolute;
  background-color: #656ee8;
  top: 31px;
  left: 20px;
  width: 5px;
  height: 20px;
}

.fixedBtnBox {
  width: 100%;
  margin-left: -1.5%;
  height: 60px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  overflow: visible;
  z-index: 10;
}
.fixedBtn {
  width: 36%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}

.ant-btn {
  font-weight: bold;
}

.saveBtn {
  background-color: #656ee8;
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 20px;
}

.saveBtn:hover {
  color: #ffffff;
  background-color: #8087e7;
}

.saveBtn:focus {
  background-color: #656ee8;
  color: #ffffff;
}

.backBtn {
  color: #656ee8;
  border: 1px solid #656ee8;
}

.backBtn:hover {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
}

.backBtn:focus {
  color: not specified;
  border: 1px solid #656ee8;
}

.ant-switch-checked {
  background-color: rgb(69, 213, 133);
}

.staffManageInfoContent {
  margin-top: 30px;
}
.ant-switch {
  margin: 8px 0;
}
.rolesTitle {
  color: #8087e7;
  font-size: 20px;
  font-weight: bold;
}
</style>