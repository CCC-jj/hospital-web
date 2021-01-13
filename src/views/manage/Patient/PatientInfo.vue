<template>
  <div class="patientInfo">
    <div class="fixedBtnBox">
      <div class="fixedBtn">
        <a-button class="saveBtn" type="primary" icon="save" :loading="iconLoading" :disabled="disabled" @click="saveLoading">
          保存
        </a-button>
      </div>
    </div>
    <p class="title">基本信息</p>

    <div class="patientForm">
      <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
        <a-row class="form-row" :gutter="16">
          <a-col :span="6">
            <a-form-model-item ref="name" label="患者姓名" prop="name">
              <a-input :disabled="disabled" v-model="form.name" style="width: 100%" placeholder="请输入患者姓名" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="身份证号码" required prop="certNo">
              <a-input :disabled="disabled" v-model="form.certNo" placeholder="请输入身份证号码" size="large">
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="患者年龄" prop="age">
              <a-input disabled v-model="form.age" placeholder="请输入数字" type="number" size="large">
                <a-select disabled slot="addonAfter" :value="defaultValue" style="width: 60px;color:rgba(0, 0, 0, 0.65);">
                  <a-select-option value="year"> 岁 </a-select-option>
                  <a-select-option value="month"> 月 </a-select-option>
                  <a-select-option value="day"> 天 </a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="出生日期" prop="birth">
              <a-date-picker :disabled="disabled" valueFormat="value" v-model="form.birth" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" @change="changeDate" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="6">
            <a-form-model-item label="性别" prop="sex">
              <a-select :disabled="disabled" v-model="form.sex" placeholder="请选择患者性别" size="large" @change="changeSex">
                <a-select-option v-for="item in sexList" :key="item.value"> {{item.desc}} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="手机号码" prop="mobile">
              <a-input :disabled="disabled" v-model="form.mobile" placeholder="请输入手机号码" size="large">
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="患者卡号" prop="patientId">
              <a-input :disabled="disabled" v-model="form.patientId" placeholder="请输入患者卡号" size="large">
              </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="患者来源" prop="comeFrom">
              <a-select :disabled="disabled" v-model="form.comeFrom" placeholder="请选择" size="large">
                <a-select-option value="别人介绍"> 别人介绍 </a-select-option>
                <a-select-option value="广告"> 广告 </a-select-option>
                <a-select-option value="自来"> 自来 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="6">
            <a-form-model-item label="会员类型" prop="vipType">
              <a-select :disabled="disabled" v-model="form.vipType" placeholder="请选择会员类型" size="large">
                <a-select-option value="非会员"> 非会员 </a-select-option>
                <a-select-option value="初级会员"> 初级会员 </a-select-option>
                <a-select-option value="高级会员"> 高级会员 </a-select-option>
                <a-select-option value="白银会员"> 白银会员 </a-select-option>
                <a-select-option value="黄金会员"> 黄金会员 </a-select-option>
                <a-select-option value="钻石会员"> 钻石会员 </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="到期时间" prop="expireDate">
              <a-date-picker :disabled="disabled" valueFormat="value" @change="changeExpireDate" v-model="form.expireDate" type="date" style="width: 100%" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="民族" prop="nation">
              <a-input :disabled="disabled" v-model="form.nation" size="large"> </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="婚姻状况" prop="marital">
              <a-select :disabled="disabled" v-model="form.marital" placeholder="请选择" size="large">
                <a-select-option v-for="item in maritalList" :key="item.value"> {{item.desc}} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="18">
            <a-form-model-item label="地址" prop="homeAddress">
              <!--<a-input-group compact size="large" v-model="form.address">
                <a-cascader :options="options" placeholder="请选择" @change="onChangeadd" style="width: 30%" />
              </a-input-group>-->
              <a-input-group compact size="large">
                <a-cascader :disabled="disabled" :options="options" :load-data="loadData" placeholder="请选择" change-on-select @change="onChangeAddr" v-model="choseAddr" style="width: 33%;color:rgba(0, 0, 0, 0.65);" />
                <a-input :disabled="disabled" style="width: 67%" v-model="form.homeAddress" placeholder="请输入详细地址" />
              </a-input-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="学历" prop="education">
              <a-select :disabled="disabled" v-model="form.education" placeholder="请选择" size="large">
                <a-select-option v-for="item in educationList" :key="item.value"> {{item.desc}} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row class="form-row" :gutter="16">
          <a-col :span="6">
            <a-form-model-item label="职业" prop="profession">
              <a-select :disabled="disabled" v-model="form.profession" placeholder="请选择" size="large">
                <a-select-option v-for="item in professionList" :key="item.value"> {{item.desc}} </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="工作单位" prop="company">
              <a-input :disabled="disabled" v-model="form.company" size="large"> </a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="备注" prop="remark">
              <a-input :disabled="disabled" v-model="form.remark" size="large"> </a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }">
        </a-form-model-item>
      </a-form-model>
    </div>

    <!-- <p class="title">关联家庭成员</p>

    <div class="patientFmTable">
      <div class="manageDown">
        <a-table :columns="columns" :data-source="tableData" :pagination="false" :rowKey="
            (record, index) => {
              return record.memUserId;
            }
          ">
          <span slot="kinshipCode" slot-scope="text">
            <span v-if="text==1">父母</span>
            <span v-if="text==2">子女</span>
            <span v-if="text==3">朋友</span>
            <span v-if="text==4">本人</span>
            <span v-if="text==5">配偶</span>
            <span v-if="text==6">亲属</span>
          </span>
          <span slot="sex" slot-scope="text">
            <span v-if="text==0">保密</span>
            <span v-if="text==1">男</span>
            <span v-if="text==2">女</span>
            <span v-if="text==9">未说明</span>
          </span>
          <span class="editBtn" slot="action">
            <a>查看</a>
            <a-divider type="vertical" />
            <a>编辑</a>
            <a-divider type="vertical" />
            <a>取消关联</a>
          </span>
        </a-table>
      </div>
      <a-button class="addFamily" icon="plus-circle" size="large" @click="showModal">
        添加家庭成员
      </a-button>

      <a-modal v-model="visible" title="添加家庭成员" @ok="handleOk">
        <a-form-model ref="familyRuleForm" :model="familyForm" :rules="familyRules" layout="vertical">
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="家庭关系" prop="kinshipCode">
                <a-select v-model="familyForm.kinshipCode" placeholder="请选择家庭关系" size="large">
                  <a-select-option value="父女"> 父女 </a-select-option>
                  <a-select-option value="母女"> 母女 </a-select-option>
                  <a-select-option value="兄弟"> 兄弟 </a-select-option>
                  <a-select-option value="姐妹"> 姐妹 </a-select-option>
                  <a-select-option value="其他"> 其他 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item ref="name" label="患者姓名" prop="name">
                <a-auto-complete v-model="familyForm.name" :data-source="dataSource" style="width: 100%" placeholder="请输入患者姓名" :filter-option="filterOption" size="large" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="患者年龄" prop="age">
                <a-input v-model="familyForm.age" placeholder="请输入数字" type="number" size="large">
                  <a-select slot="addonAfter" :value="defaultValue" style="width: 60px">
                    <a-select-option value="year"> 岁 </a-select-option>
                    <a-select-option value="month"> 月 </a-select-option>
                    <a-select-option value="day"> 天 </a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="出生日期" required prop="birthday">
                <a-date-picker valueFormat="value" v-model="familyForm.birthday" :disabled-date="familyDisabledDate" type="date" style="width: 100%" size="large" @change="familyChangeDate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="性别" required prop="sex">
                <a-select v-model="familyForm.sex" placeholder="请选择患者性别" size="large">
                  <a-select-option value="man"> 男 </a-select-option>
                  <a-select-option value="woman"> 女 </a-select-option>
                  <a-select-option value="unknow"> 未知 </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="12">
              <a-form-model-item label="手机号码" prop="phone">
                <a-input v-model="familyForm.phone" placeholder="请输入手机号码" size="large">
                </a-input>
              </a-form-model-item>
            </a-col>
          </a-row>
        </a-form-model>
      </a-modal>
    </div> -->
  </div>
</template>

<script>
// import options from '@/dist/data.js'
import moment from 'moment'
import { getPatientInfo, changePatientInfo } from '@/api/patient'
import {
  getSexList,
  getMaritalList,
  getProfessionList,
  getEducationList,
  getProvinceList,
  getCityList,
} from '@/api/common'

const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '家庭关系',
    align: 'center',
    dataIndex: 'kinshipCode',
    scopedSlots: { customRender: 'kinshipCode' },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    scopedSlots: { customRender: 'sex' },
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'company',
    align: 'center',
  },
  {
    title: '出生日期',
    dataIndex: 'birth',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createDate',
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
  data() {
    let validateIdCard = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value)) {
        this.inputIdCard(value.length)
        callback()
      } else if (value == '') {
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    }
    return {
      patientId: '',
      disabled: false,
      sexList: [],
      maritalList: [],
      professionList: [],
      educationList: [],
      iconLoading: false,
      dataSource: [],
      visible: false,
      columns,
      tableData: [],
      options: [],
      choseAddr: [],
      defaultValue: 'year',
      form: {
        name: '',
        patientId: '',
        age: '',
        sex: '',
        birth: null,
        mobile: '',
        certNo: '',
        comeFrom: undefined,
        vipType: undefined,
        expireDate: '',
        nation: '',
        marital: '',
        provinceCode: '',
        cityCode: '',
        homeAddress: '',
        education: undefined,
        profession: undefined,
        company: '',
        remark: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入患者姓名',
            trigger: 'blur',
          },
        ],
        age: [
          {
            required: true,
            message: '请输入患者年龄',
            trigger: 'blur',
          },
        ],
        sex: [
          {
            required: true,
            message: '请选择患者性别',
            trigger: 'change',
          },
        ],
        birth: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change',
          },
        ],
        certNo: [{ validator: validateIdCard, trigger: 'change' }],
        vipType: [
          {
            required: false,
            message: '请选择会员类型',
            trigger: 'change',
          },
        ],
      },
      familyForm: {
        kinshipCode: undefined,
        name: '',
        age: '',
        sex: undefined,
        birthday: null,
        phone: '',
      },
      familyRules: {
        kinshipCode: [
          {
            required: true,
            message: '请选择家庭关系',
            trigger: 'change',
          },
        ],
        name: [
          {
            required: true,
            message: '请输入患者姓名',
            trigger: 'blur',
          },
        ],
        age: [
          {
            required: true,
            message: '请输入患者年龄',
            trigger: 'blur',
          },
        ],
        sex: [
          {
            required: true,
            message: '请选择患者性别',
            trigger: 'change',
          },
        ],
        birthday: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change',
          },
        ],
      },
    }
  },
  created() {
    this.patientId = this.$route.query.patientId
    if (this.$route.query.disabled) {
      this.disabled = JSON.parse(this.$route.query.disabled)
    }
    // 获取性别列表
    getSexList().then((res) => {
      if (res.success) {
        this.sexList = res.data
      }
    })
    // 获取婚姻列表
    getMaritalList().then((res) => {
      if (res.success) {
        this.maritalList = res.data
      }
    })
    // 获取职业列表
    getProfessionList().then((res) => {
      if (res.success) {
        this.professionList = res.data
      }
    })
    // 获取学历列表
    getEducationList().then((res) => {
      if (res.success) {
        this.educationList = res.data
      }
    })
    // 获取省市列表
    getProvinceList().then((res) => {
      if (res.success) {
        const list = res.data
        const option =
          list &&
          list.map((item) =>
            item.areaCode
              ? {
                  value: item.areaCode,
                  label: item.areaName,
                  isLeaf: false,
                }
              : ''
          )
        this.options = option
        // 获取省市列表之后再获取患者信息
        this.getPatientInfo()
      }
    })
  },
  methods: {
    getPatientInfo() {
      getPatientInfo(this.patientId).then((res) => {
        if (res.success) {
          let data = res.data.baseInfo
          this.form = data
          if (data.provinceCode) {
            const list = this.options.filter((item) => item.value == data.provinceCode)
            this.loadData(list)
            this.choseAddr.push(data.provinceCode, data.cityCode)
          }
          // if (res.data.baseInfo.sex == null) {
          //   this.form.sex = undefined
          // }
          // if (res.data.baseInfo.maritalCode == null) {
          //   this.form.maritalCode = undefined
          // }
          // if (res.data.baseInfo.professionCode == null) {
          //   this.form.professionCode = undefined
          // }
          // if (res.data.baseInfo.educationCode == null) {
          //   this.form.educationCode = undefined
          // }
          this.tableData = res.data.contacts
        }
      })
    },
    changeSex(value) {
      // console.log(value)
    },
    // 选择级联省市
    onChangeAddr(dates, dateStrings) {
      if (dateStrings) {
        // this.choseAddrStr = dateStrings.map((item) => item.label).toString()
        this.form.provinceCode = dateStrings[0].value
        if (dateStrings.length > 1) {
          this.form.cityCode = dateStrings[1].value
        }
      }
    },
    loadData(selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      // load options lazily
      getCityList(selectedOptions[0].value).then((res) => {
        targetOption.loading = false
        const list = res.data
        targetOption.children =
          list &&
          list.map((item) =>
            item.areaCode
              ? {
                  value: item.areaCode,
                  label: item.areaName,
                  isLeaf: true,
                }
              : ''
          )
        this.options = [...this.options]
      })
    },
    onChangeadd(e) {
      // console.log(e)
    },
    onChange(dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    changeExpireDate(dates, dateStrings) {
      this.form.expireDate = dateStrings
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    // 修改生日获得年龄
    changeDate(dates, dateStrings) {
      this.form.birth = dateStrings
      let duration = moment.duration(moment().diff(dateStrings))
      if (duration._data.years > 0) {
        this.defaultValue = 'year'
        this.form.age = duration._data.years
      } else if (duration._data.years == 0 && duration._data.months > 0) {
        this.defaultValue = 'month'
        this.form.age = duration._data.months
      } else if (
        duration._data.years == 0 &&
        duration._data.months == 0 &&
        duration._data.days > 0
      ) {
        this.defaultValue = 'day'
        this.form.age = duration._data.days
      } else {
        this.form.age = 0
      }
    },
    // 通过身份证号码判断生日和性别
    inputIdCard(value) {
      let idCard = this.form.certNo
      let sex = null
      let birth = null
      if (!this.iconLoading) {
        if (value === 18) {
          birth =
            idCard.substring(6, 10) +
            '-' +
            idCard.substring(10, 12) +
            '-' +
            idCard.substring(12, 14)
          sex = idCard.substring(16, 17)
          this.changeDate(value, birth)
        }
        if (value === 15) {
          birth =
            '19' +
            idCard.substring(6, 8) +
            '-' +
            idCard.substring(8, 10) +
            '-' +
            idCard.substring(10, 12)
          sex = idCard.substring(13, 14)
          this.changeDate(value, birth)
        }
        if (sex % 2 === 0) {
          sex = 2
        } else {
          sex = 1
        }
        this.form.sex = sex
      }
    },
    familyDisabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    familyChangeDate(dates, dateStrings) {
      let duration = moment.duration(moment().diff(dateStrings))
      if (duration._data.years > 0) {
        this.defaultValue = 'year'
        this.familyForm.age = duration._data.years
      } else if (duration._data.years == 0 && duration._data.months > 0) {
        this.defaultValue = 'month'
        this.familyForm.age = duration._data.months
      } else if (
        duration._data.years == 0 &&
        duration._data.months == 0 &&
        duration._data.days > 0
      ) {
        this.defaultValue = 'day'
        this.familyForm.age = duration._data.days
      } else {
        this.familyForm.age = 0
      }
    },
    loadAll() {
      return [
        {
          value: '张三',
          id: '01',
          sex: '男',
          age: '25岁',
        },
        {
          value: '李四',
          id: '02',
          sex: '男',
          age: '25岁',
        },
        {
          value: '王五',
          id: '03',
          sex: '男',
          age: '25岁',
        },
        {
          value: '555',
          id: '04',
          sex: '男',
          age: '25岁',
        },
        {
          value: '666',
          id: '05',
          sex: '男',
          age: '25岁',
        },
      ]
    },
    showModal() {
      this.visible = true
      let Data = this.loadAll()
      Data.forEach((item) => {
        this.dataSource.push(item.value)
      })
    },
    handleOk(e) {
      this.$refs.familyRuleForm.validate((valid) => {
        if (valid) {
          this.$message.success('添加成功')
          this.visible = false
          this.tableData.push({
            kinshipCode: '父子',
            name: '王五',
            sex: '男',
            company: '年龄',
            birth: '1998-09-19',
            mobile: 17789098988,
            createDate: '2019-11-24 10:34:56',
          })
        } else {
          this.$message.warning('请填写信息后再保存')
          return false
        }
      })
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    },
    saveLoading() {
      this.iconLoading = true
      this.save = '保存中'
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          changePatientInfo(this.form).then((res) => {
            if (res.success) {
              this.iconLoading = false
              this.save = '保存'
              this.$message.success('保存成功')
            } else {
              this.iconLoading = false
              this.save = '保存'
              this.$message.error(res.message)
            }
          })
        } else {
          this.iconLoading = false
          this.save = '保存'
          this.$message.warning('请填写信息后再保存')
          return false
        }
      })
    },
  },
}
</script>

<style scoped>
.title {
  color: #656ee8;
  font-size: 24px;
  font-weight: bold;
}
.ant-divider-vertical {
  height: auto;
}
.patientFmTable {
  width: 100%;
}
.addFamily {
  color: #ffffff;
  background-color: rgb(40, 208, 148);
  border: none;
  margin: 60px 50%;
  transform: translateX(-50%);
}
.saveBtn {
  width: 100px;
  font-weight: bold;
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
  /* position: absolute; */
  /* right: 140px; */
  /* top: 24px; */
}
.saveBtn:focus {
  color: #ffffff;
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
  width: 30%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}
</style>