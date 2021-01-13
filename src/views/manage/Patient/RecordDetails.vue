<template>
  <div class="recordDetails">

    <div class="detailsTop">
      <a-spin :spinning="childSpinning" size="large">
        <div style="background-color:rgb(40,208,148)" class="types" v-if="record.firstVisit==0">初诊</div>
        <div style="background-color:rgb(255,199,28)" class="types" v-if="record.firstVisit==1">复诊</div>
        <!-- <div class="detailBtns">
        <a-button icon="edit" style="margin-right: 10px" @click="editRecord">编辑病历</a-button>
        <a-button icon="printer">打印病历</a-button>
      </div> -->
        <div class="detailMainTop">
          <div class="detaiTitle">体格信息</div>
          <div class="physicalInfo">
            <a-row>
              <a-col :span="6">
                <div>体温：{{record.physique.temperature}}</div>
              </a-col>
              <a-col :span="6">
                <div>呼吸：{{record.physique.breathing}}</div>
              </a-col>
              <a-col :span="6">
                <div>脉搏：{{record.physique.pulse}}</div>
              </a-col>
              <a-col :span="6">
                <div>血压：{{record.physique.bloodPressure}}</div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="6">
                <div>血糖：{{record.physique.bloodSugar}}</div>
              </a-col>
              <a-col :span="6">
                <div>血脂：{{record.physique.bloodFat}}</div>
              </a-col>
              <a-col :span="6">
                <div>身高：{{record.physique.height}}</div>
              </a-col>
              <a-col :span="6">
                <div>体重：{{record.physique.weight}}</div>
              </a-col>
            </a-row>
          </div>
        </div>
        <div class="detailMainMiddle">
          <div class="detaiTitle">病历信息</div>
          <div class="detailInfo">
            <div><span class="colorInfo">发病日期：</span>{{record.history.accidentTime}}</div>
            <div><span class="colorInfo">主诉：</span><span v-for="(item,index) in record.history.chiefComplaint" :key="index">{{item}}、</span></div>
            <div>现病史：{{record.history.medicalHistory}}</div>
            <div>既往史：{{record.history.pastHistory}}</div>
            <div>过敏史：{{record.history.allergyHistory}}</div>
            <div>个人史：{{record.history.selfHistory}}</div>
            <div>家族史：{{record.history.familyHistory}}</div>
            <div>辅助检查：{{record.history.assitCheck}}</div>
            <div>初步诊断：</div>
            <div>治疗意见：{{record.history.treatmentAdvice}}</div>
            <div>备注：{{record.history.remark}}</div>
            <div>医嘱：<span class="doctorSay"></span></div>
          </div>
        </div>
        <div class="detailMainBottom">
          <div class="detaiTitle">处方信息</div>
          <div class="detailInfo" v-for="(item,index) in record.recipe" :key="index">
            <div class="colorInfo">{{item.recipeName}}</div>
            <div class="prInfo" v-for="(items,indexs) in item.recipeItem" :key="indexs">
              <span class="serialNumber">{{indexs+1}}</span>&nbsp;&nbsp;
              <span class="name">{{items.name}}</span>&nbsp;&nbsp;
              <span v-if="items.specs" class="unit">{{items.specs}}{{items.numUnit}}</span>&nbsp;&nbsp;
              <span v-if="items.nums" class="quantity">共{{items.nums}}{{items.numUnit}}</span>&nbsp;&nbsp;
              <span v-if="items.usage" class="usage">用法:
                <span v-for="useItem in usage" :key="useItem.id">
                  <span v-if="useItem.id==items.usage">
                    {{useItem.name}}
                  </span>
                </span>
                <span v-for="freItem in frequency" :key="'0'+freItem.id">
                  <span v-if="freItem.id==items.rate">
                    ({{freItem.name}})
                  </span>
                </span>
              </span>&nbsp;&nbsp;
              <span v-if="items.days!=''" class="days">{{items.days}}天</span>
            </div>
          </div>
        </div>
      </a-spin>
    </div>

  </div>
</template>

<script>
import { getAdviceUsage, getAdviceFrequency } from '@/api/common'
import { getPatientRmrDetail } from '@/api/patient'
export default {
  props: ['recordId'],
  data() {
    return {
      record: {
        childSpinning: false,
        firstVisit: 0,
        usage: [],
        frequency: [],
        history: {
          accidentTime: '',
          allergyHistory: '',
          assitCheck: '',
          chiefComplaint: [],
          familyHistory: '',
          medicalHistory: '',
          medicalRecordId: '',
          pastHistory: '',
          remark: '',
          selfHistory: '',
          treatmentAdvice: '',
        },
        physique: {
          bloodFat: '',
          bloodPressure: '',
          bloodSugar: '',
          breathing: '',
          height: '',
          pulse: '',
          temperature: '',
          weight: '',
        },
        recipe: [
          {
            itemTypeId: '',
            recipeItemId: '',
            statItemId: '',
          },
        ],
      },
    }
  },
  watch: {
    recordId: {
      handler(newVal, oldVal) {
        this.getPatientRmrDetail(newVal)
      },
    },
  },
  created() {
    getAdviceUsage().then((res) => {
      this.usage = res.data
    })
    // 获取频度
    getAdviceFrequency().then((res) => {
      this.frequency = res.data
    })
    this.getPatientRmrDetail(this.recordId)
  },
  methods: {
    getPatientRmrDetail(recordId) {
      this.childSpinning = true
      getPatientRmrDetail(recordId).then((res) => {
        if (res.success) {
          this.record = res.data
          this.childSpinning = false
        }
      })
    },
    editRecord() {
      this.$router.push({ path: '/home/admission/caseHistory' })
    },
  },
}
</script>

<style scoped>
.types {
  float: left;
  line-height: 32px;
  text-align: center;
  border-radius: 15px;
  color: #ffffff;
  font-weight: bold;
  font-size: 16px;
  width: 80px;
  height: 30px;
}
.detailBtns {
  float: right;
}
.ant-btn {
  font-weight: bold;
  color: #656ee8;
  border: 1px solid #656ee8;
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
.detailMainTop {
  border-bottom: 3px solid rgb(238, 238, 238);
  padding: 50px 0 20px 0;
}
.detailMainMiddle {
  border-bottom: 3px solid rgb(238, 238, 238);
  padding: 20px 0;
}
.detailMainBottom {
  border-bottom: 3px solid rgb(238, 238, 238);
  padding: 20px 0;
}
.detaiTitle {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}
.physicalInfo .ant-row {
  padding-bottom: 6px;
}
.detailInfo > div {
  padding: 4px 0;
}
.colorInfo {
  color: #656ee8;
}
.doctorSay {
  background-color: #656ee8;
  color: #ffffff;
  padding: 5px;
  border-radius: 5px;
}
.name {
  font-weight: bold;
}
</style>