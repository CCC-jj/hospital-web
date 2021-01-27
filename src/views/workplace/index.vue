<template>
  <div class="workPlace">
    <div class="worktop">
      <span>就诊时间:</span>
      <a-range-picker :value="[params.orderStartDate,params.orderFinishDate]" :ranges="{
          今天: [moment().startOf('day'), moment()],
          昨天: [
            moment().startOf('day').subtract(1, 'days'),
            moment().endOf('day').subtract(1, 'days'),
          ],
          近三天: [
            moment().startOf('day').subtract(2, 'days'),
            moment().endOf('day'),
          ],
          近一周: [moment().startOf('day').subtract(1, 'weeks'), moment()],
          近一月: [moment().startOf('day').subtract(1, 'month'), moment()],
          本月: [moment().startOf('month'), moment()],
        }" @change="onChange" style="width:22%;" :disabled-date="disabledDate" />
      <span>&nbsp;接诊状态:</span>
      <a-select default-value="" style="width: 12%" @change="handleChange">
        <a-select-option value=""> 全部 </a-select-option>
        <a-select-option v-for="item in stateList" :key="item.typeCode"> {{item.typeName}} </a-select-option>
      </a-select>
      <span>&nbsp;问诊类型:</span>
      <a-select default-value="" style="width: 12%" @change="handleChange2">
        <a-select-option value=""> 全部 </a-select-option>
        <a-select-option v-for="item in typesList" :key="item.typeCode"> {{item.typeName}} </a-select-option>
      </a-select>
      <a-input-search placeholder="输入患者姓名" enter-button @search="onSearch" @change="onChangeSearch" style="width: 25%" />
    </div>
    <a-spin :spinning="spinning" size="large">
      <a-empty style="margin-top:50px;" v-if="dataSource.length==0" />
      <div class="workdown">
        <div class="peopleCard" v-for="(item, index) in dataSource" :key="index">
          <div class="cardTop">
            <div class="avatar">
              <div>
                <img v-if="item.sex==2" style="width: 70px; height: 70px; border-radius: 50%" src="../../assets/p1.png" />
                <img v-else style="width: 70px; height: 70px; border-radius: 50%" src="../../assets/p0.png" />
              </div>
            </div>
            <div class="cardRight">
              <div class="title">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.sex==0">保密</span>
                <span v-if="item.sex==1">男</span>
                <span v-if="item.sex==2">女</span>
                <span v-if="item.sex==9">未说明</span>
                <span class="age">{{ item.age }}</span>
              </div>
              <div class="worktypes">
                <span class="pictype" v-if="item.bizType=='图文问诊'">{{ item.bizType }}</span>
                <span class="pictype" v-if="item.bizType=='窗口'">{{ item.bizType }}</span>
                <span class="pictype" v-if="item.bizType=='视频问诊'" style="background-color:rgb(40,208,148)">{{ item.bizType }}</span>
                <span class="pictype" v-if="item.bizType=='检查开单'" style="background-color:rgb(116,130,231)">{{ item.bizType }}</span>
                <span class="workstatus" v-if="item.status=='待接诊'">{{ item.status }}</span>
                <span class="workstatus" v-else-if="item.status=='接诊中'" style="background-color:rgb(40,208,148)">{{ item.status }}</span>
                <span class="workstatus" v-else-if="item.status=='已完成'" style="background-color:rgb(204,204,204)">{{ item.status }}</span>
                <span class="workstatus" v-else style="background-color:rgb(204,204,204)">{{ item.status }}</span>
              </div>
              <div class="creatTime">就诊时间：{{ item.orderTime }}</div>
              <div class="doctor">
                <span>科室：{{ item.orderDept }}</span>
                <span>医生：{{ item.orderDoctor }}</span>
              </div>
              <div class="phoneNumber">手机号码：{{ item.mobile }}</div>
            </div>
          </div>
          <div class="cardDown">
            <div :class="['admission', { disabled: !item.receiveFlag }]" @click="toAdmission(item.patientId,item.regOrderNo,item.outpatientNo)">接诊</div>
            <div class="patientInfo" @click="toPatientInfo(item.patientId)">查看患者信息</div>
          </div>
        </div>
      </div>
    </a-spin>
    <div class="paginationBox">
      <a-pagination v-model="params.page" show-quick-jumper :pageSize='9' :total="total" :showTotal="((total) => {return `每页 9 条，共 ${total} 条`;})" @change="pageOnChange" />
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { getWorkplaceList } from '@/api/admission'
import { getTreatState, getTreatTypes } from '@/api/common'

export default {
  name: 'WorkPlace',
  data() {
    return {
      spinning: false,
      stateList: [],
      typesList: [],
      dataSource: [],
      params: {
        bizType: '',
        limit: 9,
        orderFiled: '',
        orderFinishDate: moment().endOf('day'),
        orderStartDate: moment().startOf('day'),
        orderStatus: '',
        orderType: 'asc',
        page: 1,
        patientName: '',
      },
      total: 0,
    }
  },
  created() {
    this.addDate()
    getTreatState().then((res) => {
      this.stateList = res.data
    })
    getTreatTypes().then((res) => {
      this.typesList = res.data
    })
    this.getWorkplaceList()
  },
  methods: {
    moment,
    // 当前时间
    addDate() {
      let nowDate = new Date()
      let date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      }
      this.params.orderStartDate = date.year + '-' + date.month + '-' + date.date
      this.params.orderFinishDate = date.year + '-' + date.month + '-' + date.date
    },
    getWorkplaceList() {
      this.spinning = true
      getWorkplaceList(this.params).then((res) => {
        if (res.success) {
          this.dataSource = res.data.item
          this.total = res.count
          this.spinning = false
        } else {
          this.dataSource = []
          this.spinning = false
        }
      })
    },
    onChange(dates, dateStrings) {
      this.params.page = 1
      this.params.orderStartDate = dateStrings[0]
      this.params.orderFinishDate = dateStrings[1]
      this.getWorkplaceList()
    },
    // 禁用一个月前后日期
    disabledDate(current) {
      return current && current > moment().endOf('day')
    },
    handleChange(value) {
      this.params.page = 1
      this.params.orderStatus = value
      this.getWorkplaceList()
    },
    handleChange2(value) {
      this.params.page = 1
      this.params.bizType = value
      this.getWorkplaceList()
    },
    pageOnChange(pageNumber) {
      this.params.page = pageNumber
      this.getWorkplaceList()
    },
    toAdmission(patientId, regOrderNo, outpatientNo) {
      const page = this.$route.name
      this.$router.push({
        name: 'Prescription',
        params: {
          page: page,
          patientId: patientId,
          regOrderNo: regOrderNo,
          outpatientNo: outpatientNo,
        },
      })
    },
    toPatientInfo(patientId) {
      const page = this.$route.name
      this.$router.push({
        name: 'PatientInfo',
        params: {
          page: page,
        },
        query: {
          patientId: patientId,
        },
      })
    },
    onSearch(value) {
      this.params.page = 1
      this.params.patientName = value
      this.getWorkplaceList()
    },
    onChangeSearch(e) {
      this.params.page = 1
      this.params.patientName = e.target.value
      this.getWorkplaceList()
    },
  },
}
</script>

<style scoped>
.workPlace {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.ant-calendar-picker {
  width: 25%;
}

.workdown {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  margin-top: 10px;
}
.peopleCard {
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 0 15px #dedede;
  width: 31%;
  height: 220px;
  margin: 20px 1% 0 1%;
  position: relative;
  overflow: hidden;
}

.avatar {
  position: relative;
  width: 30%;
  height: 170px;
}

.avatar div {
  width: 30%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-100%, -50%);
}

.cardRight {
  width: 70%;
  position: absolute;
  right: 0;
  top: 30px;
  color: #858585;
}

.cardDown {
  position: absolute;
  bottom: 0;
  display: flex;
  width: 100%;
}
.cardDown .admission {
  color: #656ee8;
  font-weight: bold;
}
.cardDown .patientInfo {
  color: #505050;
}
.disabled {
  pointer-events: none;
  color: #6d6d6d !important;
  background-color: gainsboro;
}
.name {
  font-size: 16px;
  font-weight: bold;
  margin-right: 3%;
  color: #000000;
}

.worktypes {
  position: absolute;
  right: 6%;
  top: 0;
}
.worktypes span {
  font-size: 10px;
  background-color: #ff6262;
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 15px;
}
.creatTime {
  margin-top: 10px;
}
.doctor {
  margin-top: 10px;
}
.doctor span:not(:last-child) {
  margin-right: 25px;
}
.phoneNumber {
  margin-top: 10px;
}
.cardDown div {
  flex: 1;
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-top: 1px solid gainsboro;
}
.cardDown div:not(:last-child) {
  border-right: 1px solid gainsboro;
}
.cardDown div:hover {
  background-color: #656ee8;
  color: #ffffff;
  cursor: pointer;
}
.paginationBox {
  width: 100%;
  height: 50px;
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>
