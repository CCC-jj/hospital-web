<template>
  <div class="electronicRecord">
    <!-- <a-button class="addBtn" type="primary" icon="plus-circle" @click="addRecord">
      新增病历
    </a-button> -->
    <a-spin :spinning="spinning" size="large">
      <a-empty v-if="record.length==0" />
      <div class="recordDataBox">
        <div class="recordDataBoxLeft">
          <div class="recordBox" v-for="(item, index) in record" :key="index">
            <div :class="['point', { active: currentTab == index }]"></div>
            <div :class="['recordDate', { active: currentTab == index }]" @click="clickPatientList(item.recordId,index)">{{ item.recordTime }}</div>
            <div :class="['recordInfo', { active: currentTab == index }]" @click="clickPatientList(item.recordId,index)">
              <a-row :gutter="10">
                <a-col :span="12">
                  <span>门诊编号：{{ item.recordId }}</span>
                </a-col>
                <a-col :span="12">
                  <span>诊断：<span v-for="(items,indexs) in item.diagnosis" :key="indexs" style="color:#656ee8">{{ items }}，</span></span>
                </a-col>
              </a-row>
              <a-row :gutter="10">
                <a-col :span="12">
                  <span>接诊科室：{{ item.department }}</span>
                </a-col>
                <a-col :span="12">
                  <span>接诊医生：{{ item.doctor }}</span>
                </a-col>
              </a-row>
            </div>
          </div>
        </div>
        <div v-if="recordId" class="recordDataBoxRight">
          <Details :recordId="recordId"></Details>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import Details from './RecordDetails'
import { getPatientRmrList } from '@/api/patient'
export default {
  name: 'goods',
  components: { Details },
  data() {
    return {
      spinning: false,
      patientId: '',
      recordId: '',
      currentTab: 0,
      record: [],
    }
  },
  created() {
    this.patientId = this.$route.query.patientId
    this.getPatientRmrList()
  },
  methods: {
    getPatientRmrList() {
      this.spinning = true
      getPatientRmrList(this.patientId).then((res) => {
        if (res.success) {
          this.record = res.data.list
          this.recordId = res.data.list[0].recordId
          this.spinning = false
        } else {
          this.spinning = false
        }
      })
    },
    clickPatientList(recordId, index) {
      this.currentTab = index
      this.recordId = recordId
    },
    addRecord() {
      this.$router.push({ path: '/home/admission/caseHistory', params: { page: this.$route.name } })
    },
  },
}
</script>

<style scoped>
.addBtn {
  width: 100px;
  font-weight: bold;
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
  position: absolute;
  right: 140px;
  top: 24px;
}
.addBtn:focus {
  color: #ffffff;
}
.recordDataBox {
  color: #000000;
  width: 100%;
  display: flex;
}
.recordDataBoxLeft {
  width: 36%;
  border-right: 3px solid #f3f3f3;
}
.recordDataBoxRight {
  width: 64%;
  box-shadow: 0 0 6px 2px #dae9eb;
  border-radius: 5px;
  margin-left: 20px;
  padding: 20px;
}
.recordBox {
  position: relative;
}
.point {
  width: 12px;
  height: 12px;
  background-color: #ffffff;
  border: 1px solid rgb(182, 182, 182);
  border-radius: 50%;
  position: absolute;
  top: 49px;
  right: -7.5px;
}
.point.active {
  width: 12px;
  height: 12px;
  background-color: #656ee8;
  border: 1px solid #656ee8;
  border-radius: 50%;
  position: absolute;
  top: 49px;
  right: -7.5px;
}
.recordDate {
  position: absolute;
  top: -45px;
  right: 20px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  width: 45%;
  height: 35px;
  border: 1px solid #656ee8;
  color: #656ee8;
  border-radius: 5px;
  cursor: pointer;
}
.recordDate.active {
  position: absolute;
  top: -45px;
  right: 20px;
  text-align: center;
  line-height: 30px;
  font-weight: bold;
  width: 45%;
  height: 35px;
  border: 1px solid #656ee8;
  color: #ffffff;
  background-color: #656ee8;
  border-radius: 5px;
  cursor: pointer;
}
.recordInfo {
  /* width: 413px; */
  /* height: 88px; */
  background: url('../../../assets/u9088.png') center no-repeat;
  background-size: 100% 88px;
  margin: 45px 20px 70px 0;
  padding: 3% 5% 3% 5%;
  cursor: pointer;
}
.recordInfo.active {
  /* width: 413px; */
  /* height: 88px; */
  background: url('../../../assets/u9088_selected.png') center no-repeat;
  background-size: 102% 95px;
  margin: 45px 20px 70px 0;
  padding: 3% 5% 3% 5%;
  cursor: pointer;
}
.recordInfo span {
  line-height: 28px;
}
</style>