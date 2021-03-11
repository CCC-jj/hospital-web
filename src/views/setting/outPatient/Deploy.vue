<template>
  <div class="deploy">
    <div class="deployTop">
      <a-radio-group :value="value" button-style="solid" @change="rdChange">
        <a-radio-button value="roster"> 排班设置 </a-radio-button>
        <a-radio-button value="personNum"> 预约人数 </a-radio-button>
        <a-radio-button value="price"> 价格设置 </a-radio-button>
      </a-radio-group>

      <a-button class="saveBtn" icon="save" :loading="iconLoading" @click="saveOutpatient">
        保存
      </a-button>
    </div>

    <hr class="exportLine" />

    <div class="deployBottom">
      <div v-show="value==='roster'">
        <a-row type="flex" justify="space-around" align="middle" style="width:70%;margin:0 auto;">
          <a-col :span="8">
            <a-checkbox @change="changeCheckBoxAll">全选</a-checkbox>
          </a-col>
          <a-col :span="8"></a-col>
          <a-col :span="8"></a-col>
          <a-col v-for="(item,index) in this.form.schedule" :key="index" :span="8">
            <a-checkbox :checked="item.status===1?true:false" :value="`${item.weekDay}${item.dayNoon}`" @change="changeScheule">
              周{{item.weekDay}} &nbsp; {{item.startTime}}-{{item.finishTime}}
            </a-checkbox>
          </a-col>
          <a-col :span="8" v-if="form.schedule[0]">
            开始时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[0].startTime, 'HH:mm')" @change="(time,timeString) => onChangeStartTime(time,timeString,1)" format="HH:mm" /><br />
            结束时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[0].finishTime, 'HH:mm')" @change="(time,timeString) => onChangeFinishTime(time,timeString,1)" format="HH:mm" />
          </a-col>
          <a-col :span="8" v-if="form.schedule[1]">
            开始时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[1].startTime, 'HH:mm')" @change="(time,timeString) => onChangeStartTime(time,timeString,2)" format="HH:mm" /><br />
            结束时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[1].finishTime, 'HH:mm')" @change="(time,timeString) => onChangeFinishTime(time,timeString,2)" format="HH:mm" />
          </a-col>
          <a-col :span="8" v-if="form.schedule[2]">
            开始时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[2].startTime, 'HH:mm')" @change="(time,timeString) => onChangeStartTime(time,timeString,3)" format="HH:mm" /><br />
            结束时间：
            <a-time-picker :default-open-value="moment('00:00:00', 'HH:mm:ss')" :default-value="moment(form.schedule[2].finishTime, 'HH:mm')" @change="(time,timeString) => onChangeFinishTime(time,timeString,3)" format="HH:mm" />
          </a-col>
          <a-col :span="8" style="margin-top:20px;">
            <a-row type="flex" justify="space-around" align="middle">
              <a-col :span="16">
                <p>循环排班</p>
                <p>开启后将按周自动生成排班</p>
              </a-col>
              <a-col :span="4">
                <a-switch :checked="form.isSchedule===1?true:false" style="float:right;" @change="changeSchedule"></a-switch>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="8" style="margin-top:20px;">
            排班日期：
            <a-range-picker :value="[form.beginDate,form.endDate]" @change="onChange" />
          </a-col>
          <a-col :span="8"></a-col>
        </a-row>
      </div>
      <div v-show="value==='personNum'">
        <div class="title">选择人数</div>
        <a-radio-group v-model="form.consLimitMax" class="radioGroup" button-style="solid">
          <a-radio-button :value="10">
            10
          </a-radio-button>
          <a-radio-button :value="20">
            20
          </a-radio-button>
          <a-radio-button :value="30">
            30
          </a-radio-button>
          <a-radio-button :value="40">
            40
          </a-radio-button>
          <a-radio-button :value="50">
            50
          </a-radio-button>
          <a-radio-button :value="60">
            60
          </a-radio-button>
          <a-radio-button :value="70">
            70
          </a-radio-button>
          <a-radio-button :value="80">
            80
          </a-radio-button>
        </a-radio-group>
        <div class="title">自定义</div>
        <a-input-number :min="0" v-model="form.consLimitMax" placeholder="请输入人数" style="width:30%;" size="large"></a-input-number>
      </div>
      <div v-show="value==='price'">
        <div class="title"> 选择咨询价格（元）</div>
        <a-radio-group v-model="form.price" class="radioGroup" button-style="solid">
          <a-radio-button value="0.00">
            0.00
          </a-radio-button>
          <a-radio-button value="20.00">
            20.00
          </a-radio-button>
          <a-radio-button value="40.00">
            40.00
          </a-radio-button>
          <a-radio-button value="60.00">
            60.00
          </a-radio-button>
          <a-radio-button value="80.00">
            80.00
          </a-radio-button>
          <a-radio-button value="100.00">
            100.00
          </a-radio-button>
          <a-radio-button value="120.00">
            120.00
          </a-radio-button>
          <a-radio-button value="140.00">
            140.00
          </a-radio-button>
        </a-radio-group>
        <div class="title">自定义价格（元）</div>
        <a-input type="number" min="0" v-model="form.price" placeholder="建议价格在0-200元" style="width:30%;" size="large"></a-input>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getOutConfiguration, setOutAbility } from '@/api/setting'
export default {
  name: 'Deploy',
  data() {
    return {
      value: 'roster',
      iconLoading: false,
      scheduleCheck: [],
      form: {
        consLimitMax: 0,
        consType: 0,
        price: '',
        isSchedule: 0,
        beginDate: '',
        endDate: '',
        schedule: [
          { status: 2, weekDay: 1, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 1, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 1, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 2, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 2, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 2, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 3, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 3, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 3, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 4, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 4, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 4, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 5, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 5, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 5, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 6, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 6, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 6, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
          { status: 2, weekDay: 7, dayNoon: 1, startTime: '08:00', finishTime: '12:00' },
          { status: 2, weekDay: 7, dayNoon: 2, startTime: '13:00', finishTime: '18:00' },
          { status: 2, weekDay: 7, dayNoon: 3, startTime: '18:00', finishTime: '20:00' },
        ],
      },
    }
  },
  created() {
    this.getOutConfigurationInfo(this.$route.query.consType)
    let scheduleCheckList = this.form.schedule.map((item) => {
      return `${item.weekDay}${item.dayNoon}`
    })
    this.scheduleCheck = scheduleCheckList
  },
  methods: {
    moment,
    // 更换tab标签
    rdChange(e) {
      this.value = e.target.value
    },
    getOutConfigurationInfo(consType) {
      getOutConfiguration(consType)
        .then((res) => {
          if (res.data) {
            this.form = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 选择开始时间
    onChangeStartTime(time, timeString, key) {
      this.form.schedule.forEach((item) => {
        if (item.dayNoon === key) {
          item.startTime = timeString
        }
      })
    },
    // 选择结束时间
    onChangeFinishTime(time, timeString, key) {
      this.form.schedule.forEach((item) => {
        if (item.dayNoon === key) {
          item.finishTime = timeString
        }
      })
    },
    // 选择排班日期
    onChange(dates, dateStrings) {
      this.form.beginDate = dateStrings[0]
      this.form.endDate = dateStrings[1]
    },
    // 循环排班
    changeSchedule(checked, event) {
      this.form.isSchedule = checked ? 1 : 0
    },
    saveOutpatient() {
      this.iconLoading = true
      this.form.consType = this.$route.query.consType
      setOutAbility(this.form)
        .then((res) => {
          if (res.success) {
            this.$message.success('保存成功！')
            this.$router.go(-1)
          } else {
            this.$message.warning(res.message)
          }
          this.iconLoading = false
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 全选
    changeCheckBoxAll(e) {
      let checked = e.target.checked
      this.form.schedule.forEach((item) => {
        item.status = checked ? 1 : 2
      })
    },
    // 勾选排班设置
    changeScheule(e) {
      let checked = e.target.checked
      let value = e.target.value
      let firstValue = Number(value.substring(0, 1))
      let lastValue = Number(value.substring(1, 2))
      this.form.schedule.forEach((item) => {
        if (item.weekDay === firstValue && item.dayNoon === lastValue) {
          item.status = checked ? 1 : 2
        }
      })
    },
  },
}
</script>

<style scoped>
.deploy {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.deployTop {
  display: flex;
  justify-content: space-between;
}
.ant-btn {
  font-weight: bold;
  width: 110px;
}
.saveBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: none;
}
.saveBtn:hover {
  color: #ffffff;
  background-color: #9096ea;
}
.saveBtn:focus {
  color: #ffffff;
  background-color: #656ee8;
}
.exportLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.deployTop /deep/ .ant-radio-button-wrapper {
  text-align: center;
}
.deployTop /deep/ .ant-radio-button-wrapper {
  font-weight: bold;
}
.deployTop /deep/ .ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.deployTop /deep/ .ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-checkbox-wrapper {
  padding: 20px;
}

.deployBottom {
  padding: 0 20px;
}

.title {
  margin: 10px 0 20px 0;
}

.radioGroup {
  text-align: center;
  width: 50%;
}
.radioGroup /deep/ .ant-radio-button-wrapper {
  width: 20%;
  margin: 10px 10px 10px 0;
  border-radius: 5px;
  border: 1px solid #d9d9d9;
}
.radioGroup /deep/ .ant-radio-button-wrapper:not(:first-child)::before {
  content: none;
}
.radioGroup /deep/ .ant-radio-button-wrapper:hover {
  /* color: currentColor; */
  color: initial;
}
.radioGroup /deep/ .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
  box-shadow: none !important;
}
.radioGroup /deep/ .ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.radioGroup /deep/ .ant-radio-button-wrapper-checked:not(:first-child)::before {
  content: none;
}
</style>