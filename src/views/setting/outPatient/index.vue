<template>
  <div class="outPatient">
    <a-button class="settingBtn"> 出诊设置 </a-button>
    <hr class="settingLine" />
    <div class="settingBox">
      <div class="outPatientBox" v-for="(item, index) in data" :key="index">
        <a-row type="flex" justify="start" align="middle">
          <a-col :span="21">
            <div style="float:left;padding:15px;">
              <img v-if="item.consType===1" src="../../../assets/u15327.png" alt="" srcset="" style="width:35px;">
              <img v-else-if="item.consType===2" src="../../../assets/u15297.png" alt="" srcset="" style="width:35px;">
              <img v-else src="../../../assets/u15314.png" alt="" srcset="" style="width:35px;">
            </div>
            <div style="line-height:30px;padding:5px;">
              <p style="font-size:18px;font-weight:bold;">{{item.consName}}</p>
              <p>{{item.consDesc}}</p>
            </div>
          </a-col>
          <a-col :span="2" @click="handleClick">
            <a-switch :checked="item.consStatus===1?true:false" @change="(checked, event)=>changeSwitch(checked, event, item)" />
          </a-col>
          <a-col :span="1">
            <a @click="toDeploy(item)">配置</a>
          </a-col>
        </a-row>
      </div>
    </div>

  </div>
</template>

<script>
import moment from 'moment'
import { getOutAbility, getOutEnable } from '@/api/setting'
export default {
  name: 'outPatient',
  data() {
    return {
      data: [],
    }
  },
  created() {
    this.getSettingList()
  },
  methods: {
    moment,
    getSettingList() {
      getOutAbility()
        .then((res) => {
          if (res.success) {
            this.data = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
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
    changeSwitch(checked, event, item) {
      item.consStatus = checked ? 1 : 2
      getOutEnable(item.consStatus, item.consType)
        .then((res) => {
          if (res.success) {
            this.$message.success(checked ? '启用成功！' : '停用成功！')
          } else {
            item.consStatus = checked ? 2 : 1
            this.$message.warning(res.message)
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toDeploy(item) {
      this.$router.push({ name: 'Deploy', query: { consType: item.consType } })
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
a {
  color: #656ee8;
}
.outPatientBox {
  background-color: rgb(248, 248, 254);
  padding: 10px;
  margin-bottom: 20px;
}
.ant-switch-checked {
  background-color: rgb(69, 213, 133);
}
</style>
