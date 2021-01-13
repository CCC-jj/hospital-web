<template>
  <div class="charge">
    <div class="chargeTop">
      <div>
        订单详情-已收费
      </div>
      <div class="fixedBtnBox">
        <div class="fixedBtn">
          <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
          <a-button class="chargeBtn" icon="wallet" @click="toRefund">退费</a-button>
        </div>
      </div>
    </div>

    <div class="bottomBox">
      <div class="projectDetail">
        <span class="projectTitle">
          <a-icon type="file-text" /> 项目明细
        </span>
        <div class="detailTabs">
          <a-tabs type="card" @change="callback" :tabBarGutter="10">
            <a-tab-pane v-for="item in panes" :key="item.recipeId" :tab="item.recipeName">
              <div class="detailTable">
                <a-table style="padding: 0" :columns="columns" :data-source="item.item" bordered :pagination="false" :rowKey="(record, index) => {return record.recipeItemId;}">
                </a-table>
                <!-- <div class="attachPrice">
                  <div>处理费：15.00元</div>
                  <div>注射费：20.00元</div>
                </div> -->
              </div>
              <div class="sumPrice">
                合计：
                <span style="font-size: 20px; font-weight: bold">{{item.recipeAmount}} 元</span>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
      </div>
      <div class="peopleInfo">
        <div class="orderInfo">
          <span class="projectTitle">
            <a-icon type="book" /> 订单信息
          </span>
          <table border="1" cellspacing="5px" bordercolor="#dddddd" width="100%" class="infoTable">
            <tbody>
              <tr>
                <td width="100%" colspan="2">订单编号：{{orderInfo.orderNo}}</td>
              </tr>
              <tr>
                <td width="50%">应收金额（元）：{{orderInfo.receiveFee}}</td>
                <td width="50%">实收金额（元）：<span style="color: rgb(255, 199, 28);">{{orderInfo.payFee}}</span></td>
              </tr>
              <tr>
                <td width="50%">支付方式：{{orderInfo.payMode}}</td>
                <td width="50%">找零（元）：{{orderInfo.changeFee}}</td>
              </tr>
              <tr>
                <td width="50%">收费日期：{{orderInfo.payTime}}</td>
                <td width="50%">收费员：{{orderInfo.operatorName}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="userInfo">
          <span class="projectTitle">
            <a-icon type="user" /> 人员信息
          </span>
          <table border="1" cellspacing="5px" bordercolor="#dddddd" width="100%" class="infoTable">
            <tbody>
              <tr>
                <td width="50%">患者编号：{{patientInfo.patientId}}</td>
                <td width="50%">患者姓名：<span style="color: #656ee8;">{{patientInfo.patientName}}</span></td>
              </tr>
              <tr>
                <td width="50%">年龄：{{patientInfo.patientAge}}</td>
                <td v-if="patientInfo.patientSex==1" width="50%">性别：男</td>
                <td v-else-if="patientInfo.patientSex==2" width="50%">性别：女</td>
                <td v-else width="50%">性别：保密</td>
              </tr>
              <tr>
                <td width="50%">手机：{{patientInfo.patientMobile}}</td>
                <td width="50%"></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="userInfo">
          <span class="projectTitle">
            <a-icon type="book" /> 接诊信息
          </span>
          <table border="1" cellspacing="5px" bordercolor="#dddddd" width="100%" class="infoTable">
            <tbody>
              <tr>
                <td width="100%">门诊编号：{{receiveInfo.outpatientNo}}</td>
              </tr>
              <tr>
                <td width="100%">科室：{{receiveInfo.deptName}}</td>
              </tr>
              <tr>
                <td width="100%">接诊医生：{{receiveInfo.doctorName}}</td>
              </tr>
              <tr>
                <td width="100%">接诊日期：{{receiveInfo.receiveTime}}</td>
              </tr>
              <tr>
                <td width="100%">接诊类型：{{receiveInfo.receiveName}}</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { getPaidBaseInfo, getPaidItemInfo } from '@/api/charge'
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '收费名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '单价（元）',
    dataIndex: 'price',
    align: 'center',
  },
  {
    title: '总量',
    dataIndex: 'number',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
  },
  {
    title: '零售金额（元）',
    dataIndex: 'payFee',
    align: 'center',
  },
  // {
  //   title: '折扣',
  //   dataIndex: 'discount',
  //   align: 'center',
  // },
  // {
  //   title: '折后金额（元）',
  //   dataIndex: 'discountPrice',
  //   align: 'center',
  // },
]

export default {
  name: 'ChargedDetails',
  data() {
    return {
      page: '',
      orderNo: '',
      patientId: '',
      columns,
      orderInfo: {},
      patientInfo: {},
      receiveInfo: {},
      panes: [],
    }
  },
  created() {
    this.page = this.$route.params.page
    this.orderNo = this.$route.query.orderNo
    this.patientId = this.$route.query.patientId
    getPaidBaseInfo(this.orderNo, this.patientId).then((res) => {
      if (res.success) {
        this.orderInfo = res.data.orderInfo
        this.patientInfo = res.data.patient
        this.receiveInfo = res.data.receiveInfo
      }
    })
    getPaidItemInfo(this.orderNo).then((res) => {
      if (res.success) {
        this.panes = res.data
      }
    })
  },
  methods: {
    goBack() {
      this.$router.push({ name: 'Charged' })
    },
    toRefund() {
      this.$router.push({
        name: 'RefundDetails',
        query: {
          orderNo: this.orderNo,
          patientId: this.patientId,
          bizType: this.$route.query.bizType,
        },
      })
    },
    callback(key) {
      console.log(key)
    },
  },
}
</script>

<style scoped>
.chargeTop {
  /* display: flex;
  justify-content: space-between; */
  line-height: 35px;
  font-weight: bold;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
  font-size: 18px;
}

.chargeTop > div:nth-child(1) {
  padding-left: 10px;
}

.chargeTop > div:nth-child(1)::before {
  content: '';
  display: block;
  position: absolute;
  background-color: #656ee8;
  top: 31px;
  left: 20px;
  width: 5px;
  height: 20px;
}

.ant-btn {
  font-weight: bold;
}

.chargeBtn {
  background-color: #656ee8;
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 20px;
}

.chargeBtn:hover {
  background-color: #8087e7;
  color: #ffffff;
}
.chargeBtn:focus {
  background-color: #656ee8;
  color: #ffffff;
}

.backBtn {
  color: #656ee8;
  border: 1px solid #656ee8;
}

.backBtn:hover {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
}

.bottomBox {
  display: flex;
  justify-content: space-between;
  margin: 12px auto;
  color: #000000;
}

.bottomBox > div {
  border-radius: 5px;
  padding: 24px;
  background: #fff;
}

.projectDetail {
  width: 65%;
}

.peopleInfo {
  width: 34%;
}

.projectTitle {
  color: #656ee8;
  font-size: 20px;
  font-weight: bold;
}

.detailTabs {
  margin-top: 25px;
}

.ant-tabs {
  width: 100%;
}

.ant-tabs-bar {
  border-bottom: 3px solid #e8e8e8;
}

.detailTable {
  padding: 15px 0;
  border-bottom: 3px solid #f0f0f0;
}

.attachPrice {
  float: right;
  right: 24px;
  margin-top: 15px;
  width: 240px;
  display: flex;
  justify-content: space-between;
  color: #000000;
}

.detailTable:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.detailTable {
  *zoom: 1;
}

.sumPrice {
  color: #000000;
  float: right;
  margin-top: 10px;
}

.peopleInfo > div {
  margin-bottom: 35px;
}

.infoTable {
  margin-top: 20px;
}

.infoTable td {
  padding: 10px;
}
.fixedBtnBox {
  width: 100%;
  margin-left: -1.5%;
  height: 60px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  overflow: visible;
  z-index: 10;
}
.fixedBtn {
  width: 36%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}
</style>