<template>
  <div class="newTemplate">
    <div class="newTemplateTop">
      <div>
        新建检查项目模板
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="addDrugBtn" icon="plus-circle" @click="addDrug">添加项目</a-button>
          <a-button class="saveBtn" icon="save" :loading="iconLoading" @click="toSave">{{save}}</a-button>
        </div>
      </div>

      <a-modal centered width="800px" v-model="visible" title="选择药品" @ok="handleOk">
        <a-input-search placeholder="模板编码/模板模板名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 50%" />
        <div class="manageDown">
          <a-table :row-selection="{
                selectedRowKeys: selectedRowKeys,
                onChange: onSelectChange,
                columnWidth: 35,
              }" :columns="columns2" :data-source="data2" :pagination="false" :scroll="{ y: 320 }">
            <template slot="stock" slot-scope="text">
              <span style="color:#656ee8;font-weight:bold;">{{ text.stock }}</span>
            </template>
          </a-table>
        </div>
      </a-modal>
    </div>

    <div class="newTemplateContent">
      <div class="templateInfoBox">
        <a-form-model ref="ruleForm" :model="form" :rules="rules">
          <a-row :gutter="30">
            <a-col :span="6">
              <a-form-model-item label="模板编号" prop="no">
                <a-input style="color:#000;" v-model="form.no" disabled size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="模板类型" prop="types">
                <a-input disabled style="color:#000;" v-model="form.types" size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="模板名称" prop="name">
                <a-input style="color:#000;" v-model="form.name" size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="模板权限" prop="authority">
                <a-radio-group v-model="form.authority">
                  <a-radio value="私人模板">
                    私人模板
                  </a-radio>
                  <a-radio value="公共模板">
                    公共模板
                  </a-radio>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="12">
              <a-form-model-item label="诊断" prop="diagnosis">
                <a-select v-model="form.diagnosis" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
                  <a-select-option v-for="item in diagnosisList" :key="item">{{ item }}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="模板说明" prop="description">
                <a-input style="color:#000;" v-model="form.description" size="large" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row :gutter="30">
            <a-col :span="6">
              <a-form-model-item label="创建人员" prop="creator">
                <a-input style="color:#000;" v-model="form.creator" disabled size="large" />
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="创建时间" prop="time">
                <a-input style="color:#000;" v-model="form.time" disabled size="large" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </div>

      <div class="recordInfoBox">
        <div class="title">
          西/成药模板内容
        </div>
        <div class="leftTable">
          <a-table @change="tableChange" :columns="columns" :data-source="data" :pagination="false" :scroll="{ y: 350 }" style="height: 400px">

            <template slot="location" slot-scope="text">
              <a-input style="width: 100%" :value="text"></a-input>
            </template>
            <template slot="dosage" slot-scope="text">
              <a-input style="width: 100px" :value="text"></a-input>
              <span>{{ unit }}</span>
            </template>

            <template slot="usage">
              <a-select show-search placeholder="请选择" option-filter-prop="children" style="width: 120px" :filter-option="filterOption" @change="handleChange">
                <a-select-option v-for="item in usage" :key="item.id">
                  {{item.name}}
                </a-select-option>
              </a-select>
            </template>
            <template slot="remark" slot-scope="text">
              <a-input style="width: 100%" :value="text"></a-input>
            </template>
            <template slot="delete" slot-scope="text, record">
              <a-popconfirm v-if="data.length" title="确定删除吗?" @confirm="() => onDelete(record.key)">
                <a href="javascript:;" style="font-size: 20px; color: #656ee8">
                  <a-icon type="delete"></a-icon>
                </a>
              </a-popconfirm>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getReceiveDiagnosis } from '@/api/admission'
import { getAdviceUsage } from '@/api/common'
const columns = [
  {
    title: '序号',
    width: 50,
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '部位',
    dataIndex: 'location',
    scopedSlots: {
      customRender: 'location',
    },
  },
  {
    title: '数量',
    dataIndex: 'dosage',
    scopedSlots: {
      customRender: 'dosage',
    },
  },
  {
    title: '用法',
    dataIndex: 'usage',
    scopedSlots: {
      customRender: 'usage',
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    scopedSlots: {
      customRender: 'remark',
    },
  },
  {
    title: '编辑',
    width: 50,
    dataIndex: 'delete',
    scopedSlots: {
      customRender: 'delete',
    },
  },
]

const data = []
for (let i = 0; i < 1; i++) {
  data.push({
    key: i,
    name: '拔牙',
    location: '',
    dosage: '1',
    usage: ['口服', '静脉注射', '注射药物', '检查', '皮试', '外用', '雾化'],
    remark: '',
  })
}

const columns2 = [
  {
    title: '序号',
    width: 40,
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '项目编码',
    // width: 140,
    dataIndex: 'id',
  },
  {
    title: '项目名称',
    // width: 140,
    dataIndex: 'name',
  },
  {
    title: '项目类别',
    // width: 140,
    dataIndex: 'types',
  },
  {
    title: '单位',
    // width: 60,
    dataIndex: 'spec',
  },
  {
    title: '金额（元）',
    dataIndex: 'price',
  },
]

const data2 = []
for (let i = 0; i < 8; i++) {
  data2.push({
    key: i,
    id: '1000001',
    name: '煎药费',
    types: '脑电图',
    spec: '次',
    price: '5.00',
  })
}

export default {
  name: 'ChargedDetails',
  inject: ['reload'],
  data() {
    return {
      page: '',
      iconLoading: false,
      save: '保存',
      visible: false,
      form: {
        no: 'RZ00055',
        name: '',
        types: '项目模板',
        authority: '私人模板',
        diagnosis: undefined,
        description: '',
        creator: '王冕',
        time: '2019-10-09  10:39:56',
      },
      rules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
        diagnosis: [{ required: true, message: '请输入模板名称', trigger: 'change' }],
      },
      diagnosisList: [],
      data,
      columns,
      unit: '次',
      usage: [],
      frequency: [],
      data2,
      columns2,
      selectedRowKeys: [],
    }
  },
  created() {
    this.page = this.$route.params.page
    // 获取诊断信息
    getReceiveDiagnosis().then((res) => {
      if (res.success) {
        this.diagnosisList = res.data
      }
    })
    // 获取用法
    getAdviceUsage().then((res) => {
      this.usage = res.data
    })
  },
  methods: {
    onSearch(value) {},
    onChangeSearch(e) {},
    handleOk() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请至少选择一条药品数据')
      } else {
        this.$message.success('添加成功！')
        this.visible = false
        this.data.push({
          name: '拔牙',
          location: '',
          dosage: '1',
          usage: ['口服', '静脉注射', '注射药物', '检查', '皮试', '外用', '雾化'],
          remark: '',
        })
      }
      this.selectedRowKeys = []
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    tableChange(p, f, s) {
      // console.log(p, f, s)
    },
    onDelete(key) {
      const data = [...this.data]
      this.data = data.filter((item) => item.key !== key)
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    addDrug() {
      this.visible = true
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    goBack() {
      this.$router.push({ name: 'PrescriptionList' })
    },
    toSave() {
      this.iconLoading = true
      this.save = '保存中'
      setTimeout(() => {
        this.iconLoading = false
        this.save = '保存'
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$message.success('保存成功')
            this.$router.push({ name: 'PrescriptionList' })
          } else {
            this.$message.warning('请填写信息后再保存')
            return false
          }
        })
      }, 1000)
    },
    callback(key) {
      console.log(key)
    },
  },
}
</script>

<style scoped>
.newTemplate {
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  border-radius: 5px;
}
.newTemplateTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  font-size: 18px;
}

.newTemplateTop > div:nth-child(1) {
  padding-left: 10px;
}

.newTemplateTop > div:nth-child(1)::before {
  content: '';
  display: block;
  position: absolute;
  background-color: #656ee8;
  top: 31px;
  left: 20px;
  width: 5px;
  height: 20px;
}

.ant-btn {
  font-weight: bold;
}

.saveBtn {
  background-color: #656ee8;
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 10px;
}

.saveBtn:hover {
  background-color: #8087e7;
  color: #ffffff;
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
.addDrugBtn {
  background-color: rgb(40, 208, 148);
  color: #ffffff;
  border: none;
  margin-left: 10px;
}
.addDrugBtn:hover {
  background-color: rgb(104, 211, 173);
  color: #ffffff;
}
.addDrugBtn:focus {
  background-color: rgb(40, 208, 148);
  color: #ffffff;
}
.templateInfoBox {
  background-color: rgb(238, 239, 251);
  border-radius: 5px;
  margin-top: 20px;
  padding: 18px;
}
.title {
  color: #656ee8;
  font-weight: bold;
  margin: 20px 0;
  font-size: 18px;
}
.title span {
  color: #cacaca;
  font-size: 12px;
}
.ant-form-item {
  margin-bottom: 0;
}
.manageDown {
  margin-top: 20px;
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
  width: 46%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}
</style>