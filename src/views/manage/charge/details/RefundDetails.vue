<template>
  <div class="charge">
    <div class="chargeTop">
      <div>
        订单详情-退费
      </div>
      <div>
        <div class="fixedBtnBox">
          <div class="fixedBtn">
            <a-button class="backBtn" style="width: 100px" icon="rollback" @click="goBack">返回</a-button>
            <a-button class="chargeBtn" icon="check-circle" @click="toRefund">退费</a-button>
          </div>
        </div>
        <a-modal width="800px" v-model="visible" title="退费信息确认" @ok="handleOk" @cancel="handleCancel">
          <div class="refundInfoBox">
            <div class="refundTitle">收费信息</div>
            <div class="refundInfo">
              <div>应收金额：{{orderInfo.receiveFee}} 元</div>
              <div>实收金额：{{orderInfo.payFee}} 元</div>
              <div>可退全额：{{orderInfo.payFee}} 元</div>
              <div>支付方式：{{orderInfo.payMode}}</div>
            </div>
          </div>
          <div class="detailTitle">退费明细</div>
          <div class="detailTable refundDetailTable">
            <a-table :columns="refundInfoColumns" :data-source="refundInfoData" :pagination="false" bordered :rowKey="(record, index) => {return record.recipeItemId}">
            </a-table>
          </div>
          <!-- <div class="refundAddFees">
            <div>附加费用</div>
            <div v-for="(item,index) in additionalFees" :key="index">
              <div>{{item.name}}：{{item.price}} 元</div>
            </div>
          </div> -->
          <div class="refundBottom">
            <div><span class="refundBottomTitle">实退金额：</span>
              <a-input style="width:80px;" :value="refund.actualRefund"></a-input> 元
            </div>
            <div><span class="refundBottomTitle">退费方式：</span>
              <!-- <a-radio-group :options="plainOptions" :default-value="payTypesValue" @change="payTypesChange" /> -->
              <a-radio-group name="payTypesRadioGroup" v-model="refund.payMode" @change="payTypesChange">
                <!-- <a-radio v-for="item in plainOptions" :key="item.typeCode" :value="item.typeCode">
                  {{item.typeName}}
                </a-radio> -->
                <a-radio :value="1">
                  现金
                </a-radio>
                <a-radio :disabled="orderInfo.payMode=='现金'" :value="2">
                  {{orderInfo.payMode}}
                </a-radio>
                <a-radio :disabled="orderInfo.payMode=='现金'" :value="3">
                  银行卡
                </a-radio>
              </a-radio-group>
            </div>
          </div>
          <div class="refundDescription">
            <span>退费说明：</span>
            <a-input v-model="refund.remark" style="width:90%;"></a-input>
          </div>
        </a-modal>

      </div>
    </div>

    <div class="bottomBox">
      <div class="projectDetail">
        <span class="projectTitle">
          <a-icon type="file-text" /> 退费项目
        </span>
        <div class="detailTabs" v-for="item in panes" :key="item.recipeId">
          <a-tabs type="card" @change="callback" :tabBarGutter="10">
            <a-tab-pane :key="item.recipeId" :tab="item.recipeName">
              <div class="detailTable">
                <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange, columnWidth: 50, onSelectAll: onSelectAll,getCheckboxProps:(record)=>({props: {disabled: record.number==record.refundNum}})}" style="padding: 0" :columns="columns" :data-source="item.item" bordered :pagination="false" :rowKey="(record, index) => {return record.recipeItemId}">
                  <template slot="refundableQuantity" slot-scope="text">
                    {{text}}
                  </template>
                  <template slot="refundQuantity" slot-scope="text,record">
                    <a-input type="number" :min="0" @change="(e) => changeRefundQuantity(e, record)" :value="text"></a-input>
                  </template>
                  <template slot="refundPrice" slot-scope="text,record">
                    <a-input disabled @change="(e) => changeRefundPrice(e, record)" :value="text"></a-input>
                  </template>
                </a-table>
                <!-- <div class="attachPrice">
                  <div v-for="(item,index) in additionalFees" :key="index">
                    <span><input class="checkbox" type="checkbox" v-model="checkedList" :value="item.key" @change="(e) => checkBoxChange(e, item.key)" /></span>
                    {{item.name}}：{{item.price}}
                    <input class="ant-input" style="width:60px;" :value="item.price" @input="(e) => changeAttachPrice(e,item.price)" />
                  </div>
                </div> -->
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
import {
  getPaidBaseInfo,
  getPaidItemInfo,
  refundInfoConfirm,
  getPaymentTypes,
  refundOrder,
} from '@/api/charge'
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
    title: '数量',
    dataIndex: 'number',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
  },
  {
    title: '支付金额（元）',
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
  {
    title: '可退数量',
    align: 'center',
    dataIndex: 'refundableQuantity',
    scopedSlots: {
      customRender: 'refundableQuantity',
    },
  },
  {
    title: '已退数量',
    align: 'center',
    dataIndex: 'refundNum',
  },
  {
    title: '退费数量',
    align: 'center',
    width: 75,
    dataIndex: 'refundQuantity',
    scopedSlots: {
      customRender: 'refundQuantity',
    },
  },
  {
    title: '退款金额（元）',
    align: 'center',
    width: 68,
    dataIndex: 'refundPrice',
    scopedSlots: {
      customRender: 'refundPrice',
    },
  },
]

// const data = [
//   {
//     key: '1',
//     name: '肾宝糖浆',
//     unitPrice: '15.00',
//     total: 2,
//     unit: '瓶',
//     retailAmount: '30.00',
//     discount: '9.00',
//     discountPrice: '27.00',
//     refundableQuantity: '2',
//     refundedQuantity: '0',
//     refundQuantity: '',
//     refundPrice: '',
//   },
//   {
//     key: '2',
//     name: '阿莫西林分散片',
//     unitPrice: '25.00',
//     total: 1,
//     unit: '盒',
//     retailAmount: '25.00',
//     discount: '9.00',
//     discountPrice: '22.50',
//     refundableQuantity: '1',
//     refundedQuantity: '0',
//     refundQuantity: '',
//     refundPrice: '',
//   },
//   {
//     key: '3',
//     name: '肾宝糖浆',
//     unitPrice: '20.00',
//     total: 1,
//     unit: '盒',
//     retailAmount: '20.00',
//     discount: '9.00',
//     discountPrice: '18.00',
//     refundableQuantity: '1',
//     refundedQuantity: '0',
//     refundQuantity: '',
//     refundPrice: '',
//   },
// ]

const additionalFees = [
  {
    key: '4',
    name: '处理费',
    price: '15.00',
  },
  {
    key: '5',
    name: '注射费',
    price: '20.00',
  },
]

const refundInfoColumns = [
  {
    title: '编码',
    align: 'center',
    dataIndex: 'recipeItemId',
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
    title: '退费数量',
    dataIndex: 'refundNum',
    align: 'center',
  },
  {
    title: '单位',
    dataIndex: 'unit',
    align: 'center',
  },
  {
    title: '退费金额（元）',
    dataIndex: 'refundFee',
    align: 'center',
  },
]

// const refundInfoData = [
//   {
//     id: '1',
//     code: '100010',
//     name: '阿卡波糖片',
//     unitPrice: '15.00',
//     quantity: '1',
//     unit: '瓶',
//     price: '15.00',
//   },
//   {
//     id: '2',
//     code: '100234',
//     name: '胃镜检查',
//     unitPrice: '25.00',
//     quantity: '1',
//     unit: '次',
//     price: '25.00',
//   },
// ]

export default {
  name: 'RefundDetails',
  inject: ['reload'],
  data() {
    return {
      page: '',
      orderNo: '',
      patientId: '',
      data: [],
      columns,
      selectedRowKeys: [],
      // selectedRowKeys2: [],
      // selectedRowKeys3: [],
      additionalFees,
      checkedList: [],
      // checkedList2: [],
      // checkedList3: [],
      visible: false,
      refundInfoColumns,
      refundInfoData: [],
      refund: {
        actualRefund: '',
        payMode: null,
        remark: '',
      },
      plainOptions: [],
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
        this.panes = res.data.map((item) => {
          return {
            item: item.item.map((i) => {
              return {
                name: i.name,
                number: i.number,
                payFee: i.payFee,
                price: i.price,
                recipeItemId: i.recipeItemId,
                refundNum: i.refundNum,
                unit: i.unit,
                refundableQuantity: Number(i.number) - Number(i.refundNum),
                refundQuantity: '',
                refundPrice: 0,
                recipeId: item.recipeId,
              }
            }),
            recipeAmount: item.recipeAmount,
            recipeId: item.recipeId,
            recipeName: item.recipeName,
          }
        })
      }
    })
    getPaymentTypes().then((res) => {
      if (res.success) {
        this.plainOptions = res.data
      }
    })
  },
  methods: {
    goBack() {
      const page = this.page
      if (page == undefined) {
        this.$router.go(-1)
      } else {
        this.$router.push({ name: page })
      }
    },
    callback(key) {
      console.log(key)
    },
    onSelectChange(selectedRowKeys) {
      console.log(selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // onSelectChange2(selectedRowKeys) {
    //   this.selectedRowKeys2 = selectedRowKeys
    // },
    // onSelectChange3(selectedRowKeys) {
    //   this.selectedRowKeys3 = selectedRowKeys
    // },

    onSelectAll(selected, selectedRows, changeRows) {
      // let checkboxList = []
      // this.additionalFees.forEach((item) => {
      //   checkboxList.push(item.key)
      // })
      // if (selected) {
      //   this.checkedList = checkboxList
      //   this.selectedRowKeys.push.apply(this.selectedRowKeys, this.checkedList)
      //   this.selectedRowKeys = Array.from(new Set(this.selectedRowKeys))
      // } else {
      //   this.checkedList = []
      //   this.selectedRowKeys = []
      // }
    },

    // onSelectAll2(selected, selectedRows, changeRows) {
    //   let checkboxList = []
    //   this.additionalFees.forEach((item) => {
    //     checkboxList.push(item.key)
    //   })
    //   if (selected) {
    //     this.checkedList2 = checkboxList
    //     this.selectedRowKeys2.push.apply(this.selectedRowKeys2, this.checkedList2)
    //     this.selectedRowKeys2 = Array.from(new Set(this.selectedRowKeys2))
    //   } else {
    //     this.checkedList2 = []
    //     this.selectedRowKeys2 = []
    //   }
    // },
    // onSelectAll3(selected, selectedRows, changeRows) {
    //   let checkboxList = []
    //   this.additionalFees.forEach((item) => {
    //     checkboxList.push(item.key)
    //   })
    //   if (selected) {
    //     this.checkedList3 = checkboxList
    //     this.selectedRowKeys3.push.apply(this.selectedRowKeys3, this.checkedList)
    //     this.selectedRowKeys3 = Array.from(new Set(this.selectedRowKeys3))
    //   } else {
    //     this.checkedList3 = []
    //     this.selectedRowKeys3 = []
    //   }
    // },
    // checkBoxChange(e, key) {
    //   e.target.checked == true
    //     ? this.selectedRowKeys.push(key)
    //     : (this.selectedRowKeys = this.selectedRowKeys.filter((keys) => keys !== key))
    // },
    // checkBoxChange2(e, key) {
    //   e.target.checked == true
    //     ? this.selectedRowKeys2.push(key)
    //     : (this.selectedRowKeys2 = this.selectedRowKeys2.filter((keys) => keys !== key))
    // },
    // checkBoxChange3(e, key) {
    //   e.target.checked == true
    //     ? this.selectedRowKeys3.push(key)
    //     : (this.selectedRowKeys3 = this.selectedRowKeys3.filter((keys) => keys !== key))
    // },
    changeRefundQuantity(e, record) {
      const value = e.target.value
      const refundableQuantity = Number(record.number) - Number(record.refundNum)
      record.refundQuantity = value
      if (value == '') {
        record.refundPrice = 0
      }
      if (value > refundableQuantity) {
        this.$message.warning('退费数量不能大于可退数量！')
        record.refundQuantity = refundableQuantity
        record.refundPrice = record.refundableQuantity * record.price
      } else {
        record.refundPrice = value * record.price
      }
      if (value == 0 || value == '') {
        this.selectedRowKeys = this.selectedRowKeys.filter((item) => item != record.recipeItemId)
      } else if (
        value > 0 &&
        this.selectedRowKeys.filter((item) => item == record.recipeItemId).length == 0
      ) {
        this.selectedRowKeys.push(record.recipeItemId)
      }
      console.log(this.selectedRowKeys)
    },
    changeRefundPrice(e, record) {
      // const value = e.target.value
      // const discountPrice = Number(record.discountPrice)
      // record.refundPrice = value
      // if (value > discountPrice) {
      //   this.$message.warning('退费金额不能大于可退金额！')
      //   record.refundPrice = discountPrice
      // }
    },
    // changeAttachPrice(e, price) {
    //   const value = e.target.value
    //   if (value > Number(price)) {
    //     this.$message.warning('退费金额不能大于可退金额！')
    //     e.target.value = price
    //   }
    // },
    toRefund() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.warning('请选择退费项目')
      } else {
        // let sum1 = 0
        // let sum2 = 0
        // this.refundInfoData.forEach((item, index) => {
        //   const price = Number(item.price)
        //   sum1 += price
        // })
        // this.additionalFees.forEach((item, index) => {
        //   const price = Number(item.price)
        //   sum2 += price
        // })
        this.selectedRowKeys.forEach((item) => {
          this.panes.forEach((i) => {
            const list = i.item.filter((t) => t.recipeItemId == item)
            if (list.length != 0) {
              this.refundInfoData.push({
                recipeId: list[0].recipeId,
                recipeItemId: list[0].recipeItemId,
                name: list[0].name,
                price: list[0].price,
                unit: list[0].unit,
                refundFee: list[0].refundPrice,
                refundNum: list[0].refundQuantity,
              })
            }
          })
        })
        refundInfoConfirm({ items: this.refundInfoData, orderNo: this.orderNo }).then((res) => {
          if (res.success) {
            this.visible = true
            let sum = 0
            this.refundInfoData.forEach((item) => {
              const price = Number(item.refundFee)
              sum += price
            })
            this.refund.actualRefund = sum.toFixed(2)
          } else {
            this.$message.error('退费数量为空或大于可退数量！')
            this.refundInfoData = []
          }
        })
      }
    },
    payTypesChange(e) {
      console.log('radio1 checked', e.target.value)
    },
    handleOk(e) {
      refundOrder({
        bizId: this.$route.query.bizType,
        items: this.refundInfoData,
        orderNo: this.orderNo,
        refundMode: this.refund.payMode,
        remark: this.refund.remark,
      }).then((res) => {
        if (res.success) {
          this.visible = false
          this.$message.success('退费成功')
          this.refundInfoData = []
          this.$router.push({ name: 'Charged' })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancel(e) {
      this.refundInfoData = []
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
  display: flex;
  justify-content: space-between;
  color: #000000;
}
.attachPrice > div {
  margin-left: 20px;
}

.detailTable:after {
  content: '';
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}

.checkbox {
  width: 15px;
  height: 15px;
  cursor: pointer;
  vertical-align: middle;
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

.refundInfoBox {
  width: 100%;
  padding: 15px;
  background-color: rgb(238, 239, 251);
}
.refundTitle {
  font-weight: bold;
  margin-bottom: 10px;
}
.refundInfo {
  display: flex;
  justify-content: space-between;
}
.refundInfo > div {
  width: 25%;
}
.detailTitle {
  color: #656ee8;
  margin-top: 15px;
}
.refundDetailTable {
  border-bottom: none;
}
.refundAddFees {
  display: flex;
  flex-wrap: wrap;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 15px;
}
.refundAddFees > div {
  margin-right: 25px;
}
.refundBottom {
  display: flex;
  justify-content: space-between;
  line-height: 30px;
}
.refundBottom > div {
  margin: 15px 0;
}
.refundBottomTitle {
  color: red;
  font-weight: bold;
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