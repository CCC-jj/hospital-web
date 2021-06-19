<template>
  <div class="staffManageInfo">
    <div class="staffManageInfoTop">
      <div>
        {{type}}员工信息
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
            <a-form-model-item label="员工编号" prop="code">
              <a-input v-model="form.code" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="员工姓名" prop="name">
              <a-input placeholder="请输入姓名" v-model="form.name" size="large" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="6">
            <a-form-model-item label="年龄" prop="age">
              <a-input v-model="form.age" placeholder="请输入数字" type="number" size="large">
                <a-select slot="addonAfter" v-model="defaultValue" style="width: 60px;color:rgba(0, 0, 0, 0.65);">
                  <a-select-option value="year">岁</a-select-option>
                  <a-select-option value="month">月</a-select-option>
                  <a-select-option value="day">天</a-select-option>
                </a-select>
              </a-input>
            </a-form-model-item>
          </a-col> -->
          <a-col :span="6">
            <a-form-model-item label="性别" prop="sex">
              <a-select v-model="form.sex" placeholder="请选择性别" size="large">
                <a-select-option v-for="item in sexList" :key="item.value">{{item.desc}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="手机号码" prop="mobile">
              <a-input placeholder="请输入手机号码" v-model="form.mobile" size="large" />
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="电子邮箱" prop="email">
              <a-input placeholder="请输入电子邮箱" v-model="form.email" size="large" />
            </a-form-model-item>
          </a-col>
          <!-- <a-col :span="6">
            <a-form-model-item label="证件号码" prop="certNo">
              <a-input placeholder="请输入身份证号码" v-model="form.certNo" size="large" />
            </a-form-model-item>
          </a-col> -->
          <a-col :span="6">
            <a-form-model-item label="职位" prop="jobCode">
              <a-select v-model="form.jobCode" placeholder="请选择职位" size="large" @change="changeTitle">
                <a-select-option v-for="item in titleList" :key="item.code" :title="item.name">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>

        <!-- <a-row :gutter="30">
          <a-col :span="18">
            <a-form-model-item label="地址" prop="address">
              <a-input-group compact size="large">
                <a-cascader :options="options" :load-data="loadData" placeholder="请选择" change-on-select @change="onChangeAddr" v-model="choseAddr" style="width: 33%" />
                <a-input v-model="form.address" style="width: 67%" placeholder="请输入详细地址" />
              </a-input-group>
            </a-form-model-item>
          </a-col>
        </a-row> -->

        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="所属科室" prop="departmentCode">
              <a-select show-search :filter-option="false" v-model="form.departmentCode" placeholder="请选择" size="large" @search="searchDepartment">
                <a-select-option v-for="item in departmentList" :key="item.code">{{item.name}}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="角色" prop="roleCode">
              <div class="clickRoleBox" @click="clickRole">
                <a-select class="seleteRole" option-filter-prop="children" mode="multiple" placeholder="选择角色" v-model="form.roleCode" style="width: 100%" @change="handleChangeRoles" size="large">
                  <a-select-option v-for="item in rolesList" :key="item.code">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </div>
            </a-form-model-item>
          </a-col>
        </a-row>

        <a-row :gutter="30">
          <a-col :span="6">
            <a-form-model-item label="密码" prop="password">
              <a-input v-model="form.password" size="large"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="6">
            <a-form-model-item label="员工状态" prop="status">
              <a-switch :defaultChecked="form.status===1 ? true : false" @change="onChangeStatus" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>

      <a-modal centered v-model="visibleRole" title="选择角色">
        <template slot="footer">
          <a-button key="submit" type="primary" @click="handleOkRole">
            确定
          </a-button>
        </template>
        <a-checkbox-group style="width:100%;" @change="onChangeCkeckRole">
          <a-row>
            <a-col :span="12" v-for="item in rolesList" :key="item.code">
              <a-checkbox style="margin-bottom:20px;" :value="item.code">
                {{item.name}}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-modal>
    </div>
  </div>
</template>

<script>
import { getSexList, getProvinceList, getCityList } from '@/api/common'
import {
  getDoctorDepartmentList,
  getDoctorRoleList,
  getDoctorTitleList,
  createDoctor,
  modifyDoctor,
} from '@/api/setting'
const OPTIONS = ['管理员', '医生', '护士', '专家', '前台', '财务']
export default {
  name: 'StaffInfo',
  data() {
    return {
      type: '新增',
      save: '保存',
      iconLoading: false,
      defaultValue: 'year',
      sexList: [],
      options: [], // 省市级联
      choseAddr: [],
      visibleRole: false,
      queryRoles: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchWord: '',
      },
      rolesList: [
        {
          code: 1,
          name: '管理员',
        },
        {
          code: 2,
          name: '医生',
        },
        {
          code: 3,
          name: '护士',
        },
        {
          code: 4,
          name: '专家',
        },
        {
          code: 5,
          name: '前台',
        },
        {
          code: 6,
          name: '财务',
        },
      ],
      queryDepartment: {
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
        searchWord: '',
      },
      departmentList: [],
      titleList: [],
      form: {
        code: '',
        name: '',
        // age: '',
        sex: undefined,
        mobile: '',
        email: '',
        // certNo: '',
        jobCode: undefined,
        jobTitle: '',
        // city: '',
        // provinceCode: '',
        // cityCode: '',
        // address: '',
        departmentCode: undefined,
        roleCode: [],
        password: '',
        status: 1,
      },
      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
        sex: [{ required: true, message: '请选择性别', trigger: 'change' }],
        departmentCode: [{ required: true, message: '请选择科室', trigger: 'change' }],
        roleCode: [{ required: true, message: '请选择角色', trigger: 'change' }],
      },
    }
  },
  // computed: {
  //   filteredOptions() {
  //     return OPTIONS.filter((o) => !this.form.roleCode.includes(o))
  //   },
  // },
  created() {
    // 获取性别编码
    getSexList().then((res) => {
      this.sexList = res.data
    })
    // 获取职位列表
    this.getDoctorTitleList()
    // 获取科室列表
    this.getDoctorDepartmentList()
    // 过去角色列表
    this.getDoctorRoleList()
    if (this.$route.query.info) {
      this.type = '修改'
      this.form = this.$route.query.info
    }
    // 获取省市列表
    // getProvinceList().then((res) => {
    //   if (res.success) {
    //     const list = res.data
    //     const option =
    //       list &&
    //       list.map((item) =>
    //         item.areaCode
    //           ? {
    //               value: item.areaCode,
    //               label: item.areaName,
    //               isLeaf: false,
    //             }
    //           : ''
    //       )
    //     this.options = option
    //   }
    // })
  },
  methods: {
    // onChangeAddr(dates, dateStrings) {
    //   if (dateStrings) {
    //     // this.choseAddrStr = dateStrings.map((item) => item.label).toString()
    //     this.form.provinceCode = dateStrings[0].value
    //     if (dateStrings.length > 1) {
    //       this.form.cityCode = dateStrings[1].value
    //     }
    //   }
    // },
    // loadData(selectedOptions) {
    //   const targetOption = selectedOptions[selectedOptions.length - 1]
    //   targetOption.loading = true

    //   // load options lazily
    //   getCityList(selectedOptions[0].value).then((res) => {
    //     targetOption.loading = false
    //     const list = res.data
    //     targetOption.children =
    //       list &&
    //       list.map((item) =>
    //         item.areaCode
    //           ? {
    //               value: item.areaCode,
    //               label: item.areaName,
    //               isLeaf: true,
    //             }
    //           : ''
    //       )
    //     this.options = [...this.options]
    //   })
    // },
    getDoctorTitleList() {
      getDoctorTitleList()
        .then((res) => {
          this.titleList = res.data
        })
        .catch((err) => {})
    },
    changeTitle(value, option) {
      this.form.jobTitle = option.componentOptions.propsData.title
      console.log(this.form)
    },
    getDoctorDepartmentList() {
      getDoctorDepartmentList(this.queryDepartment).then((res) => {
        this.departmentList = res.data
      })
    },
    searchDepartment(value) {
      this.queryDepartment.searchWord = value
      this.getDoctorDepartmentList()
    },
    getDoctorRoleList() {
      getDoctorRoleList(this.queryRoles)
        .then((res) => {
          this.rolesList = res.data
        })
        .catch((err) => {})
    },
    clickRole(e) {
      this.visibleRole = true
    },
    handleOkRole(e) {
      this.visibleRole = false
    },
    onChangeCkeckRole(checkedValues) {
      console.log('checked = ', checkedValues)
      this.form.roleCode = checkedValues
    },
    handleChangeRoles(selectedItems) {
      this.form.roleCode = selectedItems
    },
    onChangeStatus(checked) {
      if (checked) {
        this.form.status = 1
        this.$message.success('员工启用')
      } else {
        this.form.status = 0
        this.$message.success('员工停用')
      }
    },
    goBack() {
      this.$router.push({ name: 'StaffList' })
    },
    toSave() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.iconLoading = true
          this.save = '保存中'
          if (this.type === '新增') {
            createDoctor(this.form)
              .then((res) => {
                this.iconLoading = false
                this.save = '保存'
                if (res.success) {
                  this.$message.success('保存成功！')
                  this.$router.push({ name: 'StaffList' })
                } else {
                  this.$message.warning(res.message)
                }
              })
              .catch((err) => {})
          } else {
            modifyDoctor(this.form)
              .then((res) => {
                this.iconLoading = false
                this.save = '保存'
                if (res.success) {
                  this.$message.success('保存成功！')
                  this.$router.push({ name: 'StaffList' })
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
.seleteRole {
  pointer-events: none;
}
.clickRoleBox {
  cursor: pointer;
}
</style>