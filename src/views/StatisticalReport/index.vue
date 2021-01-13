<template>
  <div class="StatisticalReport">
    <a-radio-group :default-value="value" button-style="solid" @change="rdChange">
      <a-radio-button value="a"> 收支明细 </a-radio-button>
      <a-radio-button value="b"> 收费员收费统计 </a-radio-button>
      <a-radio-button value="c"> 科室收费统计 </a-radio-button>
      <a-radio-button value="d"> 医生业绩统计 </a-radio-button>
      <a-radio-button value="e"> 储值明细 </a-radio-button>
    </a-radio-group>
    <hr class="exportLine" />
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      value: "d",
    };
  },
  created() {
    // if(this.$route.name == "ToCharge"){
    //   this.value = "a"
    // }else if(this.$route.name == "Charged"){
    //   this.value = "b"
    // }else{
    //   this.value = "c"
    // }
  },
  methods: {
    rdChange(e){
      // const value = e.target.value
      // if(value == "a"){
      //   this.$router.push({path: "/home/manageCharge/toCharge"})
      // }else if(value == "b"){
      //   this.$router.push({path: "/home/manageCharge/charged"})
      // }else{
      //   this.$router.push({path: "/home/manageCharge/refunded"})
      // }
    }
  },
};
</script>

<style lang="" scoped>
.StatisticalReport{
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
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
