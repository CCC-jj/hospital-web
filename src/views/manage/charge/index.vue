<template>
  <div class="charge">
    <div class="chargeTop">
      <div>应收金额：<span class="chargePrice">{{totalPayAmount}}</span> &nbsp; 元</div>
      <div>
        <div class="fixedBtnBox">
          <div class="fixedBtn">
            <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">
              返回
            </a-button>
            <a-button class="chargeBtn" icon="dollar" @click="showChargeModal">收费</a-button>
          </div>
        </div>
        <a-modal :okButtonProps="{ props: { disabled: orderTime==0 } }" centered style="color: #000" width="700px" v-model="visible" title="收费" @ok="handleOk" @cancel="handleCancel">
          <div class="totalPayAmount">
            <a-row class="countDown">
              <a-col :span="6" style="height:30px;">
                应收金额
                <span style="font-size: 20px; font-weight: bold">{{bill.payAmount}}</span> 元
              </a-col>
              <a-col :span="7">
                <!-- <span style="margin-left:20px;">当前订单剩余支付时间：<span style="color:red;">{{orderTime}}</span></span> -->
                <span style="margin-left:20px;">当前订单剩余支付时间：
                </span>
              </a-col>
              <a-col :span="6">
                <a-statistic-countdown valueStyle="color:red;font-size:14px;line-height:30px;" :value="deadline" format="H 时 m 分 s 秒" />
              </a-col>
            </a-row>
          </div>

          <div class="bill">
            <!-- <a-row>
              <a-col :span="3" style="line-height: 30px"> 优惠金额 </a-col>
              <a-col :span="8">
                <a-input v-model="bill.discountedPrice" type="number" style="width: 85%" @change="changeDiscountedPrice" />
                元
              </a-col>
              <a-col :span="10" style="padding-left: 20px">
                折扣
                <a-input v-model="bill.discount" type="number" min='0' max='1' style="width: 30%" @change="changeDiscount" />
                折
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="3" style="line-height: 30px"> 医保支付 </a-col>
              <a-col :span="8">
                <a-input v-model="bill.medicarePay" type="number" style="width: 85%" @change="changeMedicarePay" />
                元
              </a-col>
            </a-row> -->
            <a-form-model ref="ruleForm" :model="bill" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-form-model-item label="实收金额" prop="totalAmount">
                <a-input :disabled="disabledCharge" v-model="bill.totalAmount" type="number" min="0" style="
                    width: 85%;
                    color: rgb(255, 199, 28) !important;
                    font-size: 20px;
                    font-weight: bold;
                  " @change="changeActualAmount" />
                元
              </a-form-model-item>
              <a-form-model-item label="找零" prop="backAmount">
                <a-input v-model="bill.backAmount" disabled type="number" style="width: 85%; color: #000" />
                元
              </a-form-model-item>
              <a-form-model-item label="支付方式" prop="payMode">
                <a-radio-group name="payTypesRadioGroup" v-model="bill.payMode" @change="payTypesChange">
                  <a-radio v-for="item in plainOptions" :key="item.typeCode" :value="item.typeCode">
                    {{item.typeName}}
                  </a-radio>
                </a-radio-group>
                <!-- <a-radio-group :options="plainOptions" v-model="bill.payTypes" @change="payTypesChange" /> -->
              </a-form-model-item>
              <a-form-model-item label="收款备注" prop="remark">
                <a-input v-model="bill.remark" style="width: 85%" />
              </a-form-model-item>
            </a-form-model>
          </div>
        </a-modal>

        <a-modal centered v-model="ScanCodeVisible" title="收费" :footer="null">
          <a-input ref="barCodeInput" v-model="bill.payCode" @pressEnter="payCode" @keyup.native="codeKeyup"></a-input>
        </a-modal>

        <a-modal centered v-model="payStatusVisible" title="支付状态" :footer="null">
          <a-steps :current="payStatus" :status="status">
            <a-step :title="payingTitle">
              <a-icon slot="icon" :type="payingStatus" />
            </a-step>
            <a-step title="支付成功">
              <a-icon slot="icon" :type="payedStatus" />
            </a-step>
          </a-steps>
        </a-modal>

      </div>
    </div>

    <div class="bottomBox">
      <div class="projectDetail">
        <span class="projectTitle">
          <a-icon type="file-text" /> 项目明细
        </span>
        <div class="detailTable">
          <a-table :loading="tableLoading" style="padding: 0" :columns="columns" :data-source="data" bordered :pagination="false" :rowKey="(record, index) => {return record.costItemId;}">
          </a-table>
          <!-- <div class="attachPrice">
            <div>处理费：15.00元</div>
            <div>注射费：20.00元</div>
          </div> -->
        </div>
        <div class="sumPrice">
          合计：<span style="font-size: 20px; font-weight: bold">{{totalPayAmount}} 元</span>
        </div>
      </div>
      <div class="peopleInfo">
        <span class="projectTitle">
          <a-icon type="user" />人员信息
        </span>
        <table border="1" cellspacing="5px" bordercolor="#dddddd" width="100%" class="infoTable">
          <tbody>
            <tr>
              <td width="50%">患者编号：{{patientInfo.patientId}}</td>
              <td width="50%">患者姓名：{{patientInfo.patientName}}</td>
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
    </div>
  </div>
</template>

<script>
import { getCheckstand, getPaymentTypes, getOrderQuery, payCharge } from '@/api/charge'
const columns = [
  {
    title: '序号',
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '收费名称',
    dataIndex: 'costItemName',
    align: 'center',
  },
  {
    title: '单价（元）',
    dataIndex: 'costItemPrice',
    align: 'center',
  },
  {
    title: '总量',
    dataIndex: 'costItemNum',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'costItemUnit',
    align: 'center',
  },
  {
    title: '零售金额（元）',
    dataIndex: 'costItemRetailPrice',
    align: 'center',
  },
  {
    title: '折扣',
    dataIndex: 'costItemDiscount',
    align: 'center',
  },
  {
    title: '折后金额（元）',
    dataIndex: 'costItemPayAmount',
    align: 'center',
  },
]

export default {
  name: 'Charge',
  inject: ['reload'],
  data() {
    return {
      disabledCharge: true,
      tableLoading: false,
      page: '',
      orderNo: '',
      data: [],
      columns,
      totalPayAmount: '',
      visible: false,
      patientInfo: {
        patientId: '',
        patientName: '',
        patientAge: 0,
        patientSex: 0,
        patientMobile: '',
      },
      labelCol: { span: 4 },
      wrapperCol: { span: 12 },
      orderTime: '',
      bill: {
        discountedPrice: '',
        discount: '1',
        medicarePay: '',
        payAmount: '',
        totalAmount: '',
        payCode: '',
        backAmount: '0.00',
        payMode: 2,
        remark: '',
      },
      rules: {
        totalAmount: [
          {
            required: true,
            message: '请输入实收金额',
            trigger: 'change',
          },
        ],
      },
      plainOptions: [],
      ScanCodeVisible: false,
      arr: [],
      iscontu: false,
      status: 'process',
      payingTitle: '支付中',
      payStatus: 0,
      payStatusVisible: false,
      payingStatus: 'loading',
      payedStatus: 'smile-o',
      timer: null,
      deadline: 0,
    }
  },
  created() {
    // this.page = this.$route.params.page
    this.orderNo = this.$route.query.orderNo
    // 获取支付类型
    getPaymentTypes().then((res) => {
      if (res.success) {
        this.plainOptions = res.data
      }
    })
    this.getCheckstand()
  },
  methods: {
    getCheckstand() {
      this.tableLoading = true
      getCheckstand(this.orderNo).then((res) => {
        if (res.success) {
          this.patientInfo = res.data.patient
          this.data = res.data.items
          this.totalPayAmount = res.data.totalPayAmount
          this.bill.payAmount = res.data.totalPayAmount
          this.bill.totalAmount = res.data.totalPayAmount
        } else {
          this.$message.error(res.message)
        }
        this.tableLoading = false
      })
    },
    goBack() {
      // const page = this.page
      // if (page !== '') {
      //   this.$router.push({ name: page })
      // } else {
      this.$router.go(-1)
      // }
    },
    // 倒计时方法
    countDown(time) {
      if (time === 0) {
        this.orderTime = time
        return
      } else {
        if (time > 60) {
          this.orderTime =
            (Math.floor(time / 60).toString().length < 2
              ? '0' + Math.floor(time / 60).toString()
              : Math.floor(time / 60).toString()) +
            '小时' +
            ((time % 60).toString().length < 2
              ? '0' + (time % 60).toString()
              : (time % 60).toString()) +
            '分钟'
        } else {
          this.orderTime = time + '分钟'
        }
        time--
      }
      this.timer = setTimeout(() => {
        this.countDown(time)
      }, 60000)
    },
    showChargeModal() {
      getOrderQuery(this.orderNo).then((res) => {
        if (res.success) {
          this.visible = true
          if (res.data < 0) {
            this.orderTime = '∞'
          } else {
            console.log(Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30)
            this.deadline = Date.now() + res.data * 60 * 1000
            // this.countDown(res.data)
          }
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleOk(e) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.bill.payMode === 2) {
            this.ScanCodeVisible = true
            this.$nextTick(() => {
              this.$refs['barCodeInput'].focus()
            })
          } else {
            payCharge({
              orderNo: this.orderNo,
              payAmount: this.bill.payAmount,
              payCode: this.bill.payCode,
              payMode: this.bill.payMode,
              remark: this.bill.remark,
              backAmount: this.bill.backAmount,
              totalAmount: this.bill.totalAmount,
            }).then((res) => {
              if (res.success) {
                this.visible = false
                this.$message.success('收费成功')
                this.$router.go(-1)
              } else {
                this.$message.error(res.message)
              }
            })
          }
        } else {
          return false
        }
      })
    },
    handleCancel() {
      clearTimeout(this.timer)
      this.timer = null
    },
    getActualAmount() {
      const totalPayAmount = Number(this.totalPayAmount)
      const discountedPrice = Number(this.bill.discountedPrice)
      const medicarePay = Number(this.bill.medicarePay)
      this.bill.totalAmount = (totalPayAmount - discountedPrice - medicarePay).toFixed(2)
      this.bill.backAmount = (
        discountedPrice +
        medicarePay +
        Number(this.bill.totalAmount) -
        totalPayAmount
      ).toFixed(2)
    },
    changeDiscountedPrice(e) {
      const bill = this.bill
      const discountedPrice = e.target.value
      bill.discount = ((bill.totalAmount - discountedPrice) / bill.totalAmount).toFixed(1)
      this.getActualAmount()
    },
    changeDiscount(e) {
      const bill = this.bill
      const discount = e.target.value
      if (discount == '') {
        bill.discountedPrice = ''
        this.getActualAmount()
      } else {
        bill.discountedPrice = (this.totalPayAmount - discount * this.totalPayAmount).toFixed(2)
        this.getActualAmount()
      }
    },
    changeMedicarePay(e) {
      const bill = this.bill
      const medicarePay = e.target.value
      this.getActualAmount()
    },
    changeActualAmount(e) {
      this.bill.backAmount = (
        Number(this.bill.discountedPrice) +
        Number(this.bill.medicarePay) +
        Number(this.bill.totalAmount) -
        Number(this.totalPayAmount)
      ).toFixed(2)
    },
    payTypesChange(e) {
      switch (e.target.value) {
        case 1:
          this.bill.payMode = 1
          this.disabledCharge = false
          this.bill.totalAmount = ''

          break
        case 2:
          this.bill.payMode = 2
          this.disabledCharge = true
          this.bill.totalAmount = this.bill.payAmount
          this.changeActualAmount()
          break
        case 3:
          this.bill.payMode = 3
          this.disabledCharge = true
          this.bill.totalAmount = this.bill.payAmount
          this.changeActualAmount()
      }
    },
    codeKeyup(e) {
      let timenow = e.timeStamp
      this.arr.push(timenow)
      let i
      for (i in this.arr) {
        if (
          Math.ceil(this.arr[this.arr.length - 1]) - Math.ceil(this.arr[this.arr.length - 2]) <
          30
        ) {
          this.iscontu = true
        } else {
          if (e.target.value.length != 1) {
            this.bill.payCode = ''
          }
          this.iscontu = false
        }
        if (i > 0 && this.arr.length == parseInt(i) + 1) {
          if (this.iscontu == true) {
            return
          }
        }
      }
    },
    payCode() {
      if (this.iscontu == true) {
        this.$message.success('扫码成功')
        this.ScanCodeVisible = false
        this.payStatusVisible = true
        payCharge({
          orderNo: this.orderNo,
          payAmount: this.bill.payAmount,
          payCode: this.bill.payCode,
          payMode: this.bill.payMode,
          remark: this.bill.remark,
          backAmount: this.bill.backAmount,
          totalAmount: this.bill.totalAmount,
        }).then((res) => {
          if (res.success) {
            this.payStatus = 1
            this.status = 'finish'
            this.payingStatus = 'check'
            this.payStatusVisible = false
            this.visible = false
            this.$message.success('支付成功')
            this.$router.go(-1)
          } else {
            this.status = 'error'
            this.payingStatus = 'close'
            this.payingTitle = '支付失败'
            this.$message.error('支付失败')
            this.bill.payCode = ''
          }
        })
        this.status = 'process'
        this.payingStatus = 'loading'
        this.payingTitle = '支付中'
      } else {
        this.$message.error('请使用扫码枪扫码')
      }
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
  max-width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.chargePrice {
  color: rgb(255, 199, 28);
  font-weight: bold;
  font-size: 35px;
}
.ant-btn {
  font-weight: bold;
}
.chargeBtn {
  background-color: rgb(255, 199, 28);
  color: #ffffff;
  width: 100px;
  border: none;
  margin-left: 20px;
}
.chargeBtn:hover {
  color: #ffffff;
  background-color: rgb(252, 211, 90);
}
.chargeBtn:focus {
  background-color: rgb(255, 199, 28);
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
.detailTable {
  margin-top: 10px;
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
  float: right;
  margin-top: 10px;
}
.infoTable {
  margin-top: 20px;
}
.infoTable td {
  padding: 10px;
}
.totalPayAmount {
  background-color: rgb(224, 226, 250);
  padding: 10px;
}
.bill {
  margin-top: 20px;
}
.ant-row {
  margin: 18px 0;
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
.countDown {
  height: 30px;
  line-height: 30px;
  margin: 0;
}
</style>