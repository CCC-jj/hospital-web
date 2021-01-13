<template>
  <div class="managePatient">
    <a-radio-group :default-value="value" button-style="solid" @change="rdChange">
      <a-radio-button value="a"> 待收费 </a-radio-button>
      <a-radio-button value="b"> 已收费 </a-radio-button>
      <a-radio-button value="c"> 已退费 </a-radio-button>
    </a-radio-group>
    <hr class="exportLine" />
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  data() {
    return {
      value: "a",
    };
  },
  created() {
    if(this.$route.name == "ToCharge"){
      this.value = "a"
    }else if(this.$route.name == "Charged"){
      this.value = "b"
    }else{
      this.value = "c"
    }
  },
  methods: {
    rdChange(e){
      const value = e.target.value
      if(value == "a"){
        this.$router.push({path: "/home/manageCharge/toCharge"})
      }else if(value == "b"){
        this.$router.push({path: "/home/manageCharge/charged"})
      }else{
        this.$router.push({path: "/home/manageCharge/refunded"})
      }
    }
  },
};
</script>

<style lang="" scoped>
.managePatient{
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
  width: 80px;
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
