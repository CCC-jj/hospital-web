<template>
  <div class="outPatient">
    <a-button class="settingBtn"> 出诊设置 </a-button>
    <hr class="settingLine" />
    <div class="settingBox">
      <div class="outPatientBox">
        <a-row type="flex" justify="start" align="middle">
          <a-col :span="21">
            <div style="float:left;padding:15px;">
              <img src="../../../assets/u15327.png" alt="" srcset="" style="width:35px;">
            </div>
            <div style="line-height:30px;padding:5px;">
              <p style="font-size:18px;font-weight:bold;">图文问诊</p>
              <p>这是一段支付方式介绍这是一段支付方式介绍这是一段支付方式介绍</p>
            </div>
          </a-col>
          <a-col :span="2" @click="handleClick">
            <a-switch :checked="picChecked" @change="(checked, event)=>changeSwitch(checked, event, '1', 'picRuleForm')" />
          </a-col>
          <a-col :span="1">
            <a @click="toDeploy()">配置</a>
          </a-col>
        </a-row>
      </div>
      <div class="outPatientBox">
        <a-row type="flex" justify="start" align="middle">
          <a-col :span="21">
            <div style="float:left;padding:15px;">
              <img src="../../../assets/u15297.png" alt="" srcset="" style="width:35px;">
            </div>
            <div style="line-height:30px;padding:5px;">
              <p style="font-size:18px;font-weight:bold;">视频问诊</p>
              <p>这是一段支付方式介绍这是一段支付方式介绍这是一段支付方式介绍</p>
            </div>
          </a-col>
          <a-col :span="2" @click="handleClick">
            <a-switch :checked="videoChecked" @change="(checked, event)=>changeSwitch(checked, event, '2', 'videoRuleForm')" />
          </a-col>
          <a-col :span="1">
            <a @click="toDeploy()">配置</a>
          </a-col>
        </a-row>
      </div>
      <div class="outPatientBox">
        <a-row type="flex" justify="start" align="middle">
          <a-col :span="21">
            <div style="float:left;padding:15px;">
              <img src="../../../assets/u15314.png" alt="" srcset="" style="width:35px;">
            </div>
            <div style="line-height:30px;padding:5px;">
              <p style="font-size:18px;font-weight:bold;">视频问诊</p>
              <p>这是一段支付方式介绍这是一段支付方式介绍这是一段支付方式介绍</p>
            </div>
          </a-col>
          <a-col :span="2" @click="handleClick">
            <a-switch :checked="videoChecked" @change="(checked, event)=>changeSwitch(checked, event, '2', 'videoRuleForm')" />
          </a-col>
          <a-col :span="1">
            <a @click="toDeploy()">配置</a>
          </a-col>
        </a-row>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'outPatient',
  data() {
    return {
      picChecked: false,
      videoChecked: false,
    }
  },
  created() {},
  methods: {
    moment,
    changeCollapse(key) {
      this.activeKey = key
      console.log(key, this.activeKey)
    },
    onChangeTime(time, timeString) {
      console.log(time, timeString)
    },
    handleClick(event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation()
    },
    changeSwitch(checked, event, key, ruleForm) {
      // console.log(checkedStatus);
      if (checked) {
        switch (key) {
          case '1':
            this.picChecked = true
            break
          case '2':
            this.videoChecked = true
            break
        }
        this.$message.success('启用成功！')
      } else {
        switch (key) {
          case '1':
            this.picChecked = false
            break
          case '2':
            this.videoChecked = false
            break
        }
        this.$message.success('停用成功！')
      }
    },
    toDeploy() {
      this.$router.push({ name: 'Deploy' })
    },
  },
}
</script>

<style lang="" scoped>
.outPatient {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.settingBtn {
  color: #656ee8;
  font-weight: bold;
  border: 1px solid #656ee8;
  /* margin-left: 1020px; */
  width: 120px;
}
.settingBtn:hover {
  color: #ffffff;
  background: #656ee8;
}
.settingLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.settingBox /deep/ .ant-collapse {
  background-color: #ffffff;
}
/* .settingBox /deep/ .ant-collapse-header {
  display: flex;
} */
p {
  margin-bottom: 0 !important;
}
.outPatientBox {
  background-color: rgb(248, 248, 254);
  padding: 10px;
  margin-bottom: 20px;
}
</style>
