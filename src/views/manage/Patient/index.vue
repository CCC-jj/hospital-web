<template>
  <div class="patient">
    <div class="patientTop">
      <div class="tabsBtn">
        <a-radio-group v-model="value" button-style="solid" @change="rdChange">
          <a-radio-button value="a"> 个人信息 </a-radio-button>
          <a-radio-button value="b"> 电子病历 </a-radio-button>
        </a-radio-group>
      </div>
      <div class="typesBtn">
        <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">
          返回
        </a-button>
      </div>
    </div>

    <div class="patientBottom">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: '',
      value: 'a',
      patientId: '',
      disabled: false,
    }
  },
  created() {
    if (this.$route.name == 'PatientInfo') {
      this.value = 'a'
    } else {
      this.value = 'b'
    }
    this.page = this.$route.params.page
    this.patientId = this.$route.query.patientId
    if (this.$route.query.disabled) {
      this.disabled = JSON.parse(this.$route.query.disabled)
    }
  },
  methods: {
    rdChange(e) {
      const value = e.target.value
      if (value == 'a') {
        this.$router.push({
          path: '/home/patient/patientInfo',
          query: { patientId: this.patientId, disabled: this.disabled },
        })
      } else {
        this.$router.push({
          path: '/home/patient/patientRecord',
          query: { patientId: this.patientId, disabled: this.disabled },
        })
      }
    },
    goBack() {
      const page = this.page
      if (page) {
        this.$router.push({ name: page })
      } else {
        this.$router.push({ name: 'ManagePatient' })
      }
    },
  },
}
</script>

<style scoped>
.patient {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.ant-radio-button-wrapper {
  width: 100px;
  text-align: center;
}
.patientTop {
  display: flex;
  justify-content: space-between;
}
.ant-radio-button-wrapper {
  font-weight: bold;
  color: rgb(172, 172, 172);
}
.ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-btn {
  font-weight: bold;
}
.ant-btn:hover {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
}
.ant-btn:focus {
  color: not specified;
  border: 1px solid #656ee8;
}
.backBtn {
  color: #656ee8;
  border: 1px solid #656ee8;
}
.patientBottom {
  margin-top: 30px;
}
</style>