<template>
  <div class="template">
    <div class="templateTop">
      <a-radio-group :default-value="value" button-style="solid" @change="rdChange">
        <a-radio-button value="StaffList"> 员工列表 </a-radio-button>
        <a-radio-button value="DepartmentList"> 科室列表 </a-radio-button>
        <a-radio-button value="RoleList"> 角色列表 </a-radio-button>
      </a-radio-group>
      <a-button class="ant-dropdown-link addBtn" icon="plus-circle" @click="addTemplate">
        新增
      </a-button>
    </div>
    <hr class="exportLine" />
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 'StaffList',
    }
  },
  created() {
    this.value = this.$route.name
  },
  methods: {
    rdChange(e) {
      this.$router.push({ name: e.target.value })
      this.value = e.target.value
    },
    addTemplate() {
      switch (this.value) {
        case 'StaffList':
          this.$router.push({ name: 'StaffInfo' })
          break
        case 'DepartmentList':
          this.$router.push({ name: 'DepartmentInfo' })
          break
        case 'RoleList':
          this.$router.push({ name: 'RoleInfo' })
      }
    },
    // addPrTemplate({ item, key }) {
    //   this.$router.push({name: key})
    // },
  },
}
</script>

<style lang="" scoped>
.template {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.templateTop {
  display: flex;
  justify-content: space-between;
}
.ant-btn {
  font-weight: bold;
  width: 110px;
}
.addBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: none;
}
.addBtn:hover {
  color: #ffffff;
  background-color: #9096ea;
}
.addBtn:focus {
  color: #ffffff;
  background-color: #656ee8;
}
.exportLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.ant-radio-button-wrapper {
  text-align: center;
}
.ant-radio-button-wrapper {
  font-weight: bold;
}
.ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
</style>
