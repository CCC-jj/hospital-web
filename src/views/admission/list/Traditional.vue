<template>
  <div class="traditional">
    <a-row :gutter="16">
      <a-col :span="16">
        <div class="leftBox">
          <div class="leftTop">
            <div class="leftToptitle">Rp</div>
            <div class="leftTopset">
              <!--<span @click="startBatchset">
                <a-icon type="setting"></a-icon> 批量设置
              </span>-->
            </div>
          </div>
          <div class="leftTable">
            <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ y: 350 }" style="height: 350px" :rowKey="(record, index) => {return index;}">
              <template slot="usageNumber" slot-scope="text, record">
                <a-input :disabled="recipe.recipeOrderStatus!=0" @change="(e) => dosageChange(e, record)" style="width: 70%;color:#000;" v-model="record.usageNumber"></a-input>
                <span>{{ record.usageUnit }}</span>
              </template>
              <template slot="dosageNumber" slot-scope="text, record">
                <a-input :disabled="recipe.recipeOrderStatus!=0" v-model="record.dosageNumber" @change="(e) => quantityChange(e, record)" style="width: 70%;color:#000;"></a-input>
                <span>{{ qtUnit }}</span>
              </template>
              <template slot="usage" slot-scope="text,record">
                <a-select :disabled="recipe.recipeOrderStatus!=0" v-model="record.usage" show-search placeholder="请选择" option-filter-prop="children" style="width: 100%;color:#000;" :filter-option="filterOption" @change="handleChange">
                  <a-select-option v-for="item in usage" :key="item.id">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </template>
              <template slot="rateName" slot-scope="text,record">
                <a-select :disabled="recipe.recipeOrderStatus!=0" v-model="record.rateName" show-search placeholder="请选择" option-filter-prop="children" style="width: 100%;color:#000;" :filter-option="filterOption" @change="handleChange">
                  <a-select-option v-for="item in frequency" :key="item.id">
                    {{item.name}}
                  </a-select-option>
                </a-select>
              </template>

              <template slot="drugPrice" slot-scope="text, record">
                <a-input :disabled="recipe.recipeOrderStatus!=0" style="width: 100%;color:#000;" v-model="record.drugPrice" @change="(e) => priceChange(e, record)"></a-input>
              </template>
              <template slot="totalFee" slot-scope="text,record">
                <a-input disabled style="width: 100%;color:#000;" v-model="record.totalFee"></a-input>
              </template>
              <template slot="delete" slot-scope="text, record">
                <a-popconfirm v-show="recipe.recipeOrderStatus==0" v-if="data.length" title="确定删除吗?" @confirm="() => onDelete(record)">
                  <a :disabled="recipe.recipeOrderStatus!=0" href="javascript:;" style="font-size: 20px; color: #656ee8">
                    <a-icon type="delete"></a-icon>
                  </a>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
          <div class="leftBottom">
            <div>
              <!--附加费用-->
              <!--<a-button
                class="addPrice"
                icon="plus-circle"
                @click="showAddPrice"
                >附加费用</a-button
              >-->
              <!-- <a-modal class="addPriceModal" width="450px" v-model="addVisible" title="附加费用" @ok="addHandleOk">
                <template slot="footer">
                  <a-button key="back" @click="addHandleCancel">
                    取消
                  </a-button>
                  <a-button key="submit" type="primary" @click="addHandleOk">
                    添加
                  </a-button>
                </template>
                <p>名称与金额可在【系统设置-处方费用设置】进行设置</p>
                <a-table :row-selection="{
                    selectedRowKeys: selectedRowKeys3,
                    onChange: onSelectChange3,
                  }" :columns="columns3" :data-source="data3" :pagination="false" :scroll="{ y: 330 }">
                  <span slot="stock" slot-scope="text">
                    <a-input :value="text"></a-input>
                  </span>
                  <span slot="price" slot-scope="text">
                    <a-input :value="text"></a-input>
                  </span>
                </a-table>
              </a-modal> -->
            </div>
            <div>
              <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol" style="width: 380px">
                <a-row>
                  <a-col :span="10">
                    <a-form-model-item label="科室" prop="room">
                      <a-input style="width:100px;color:#000;" v-model="form.deptName" disabled>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                  <a-col :span="14">
                    <a-form-model-item label="接诊医生" prop="doctor">
                      <a-input style="width:100px;color:#000;" v-model="form.doctorName" disabled>
                      </a-input>
                    </a-form-model-item>
                  </a-col>
                </a-row>
              </a-form-model>
            </div>
            <div class="leftBottomPrice">
              <span>此方合计：<span style="color: red; font-weight: bold">{{
                  Number(prPrice).toFixed(2)
                }}</span>
                元；</span>
              <span>共
                <span style="color: red; font-weight: bold">{{ allPrInfo.total }}</span>
                个处方，共计：<span style="color: red; font-weight: bold">{{
                  Number(allPrInfo.totalFee).toFixed(2)
                }}</span>
                元
              </span>
            </div>
          </div>
        </div>
      </a-col>
      <a-col :span="8">
        <div class="rightBox">
          <div class="rightBoxTop">
            <span>药品分类</span>
            <a-select default-value="" style="width: 30%" @change="handleChangeDrug">
              <a-select-option value=""> 全部分类 </a-select-option>
              <a-select-option v-for="item in DrugCategoryList" :key="item.id"> {{item.name}} </a-select-option>
            </a-select>
            <a-input-search placeholder="输入药品中文或拼音名称" style="width: 45%; margin-left: 5px" @change="onChangeSearch" @search="onSearch" />
          </div>
          <div class="rightBoxMiddle">
            <a-table :loading="drugLoading" :row-selection="{
                selectedRowKeys: selectedRowKeys2,
                onChange: onSelectChange2,
              }" :columns="columns2" :data-source="data2" @change="changeDurgTable" :pagination="{ showQuickJumper: true, pageSize: 10, total: drugTotal, current:queryDrugList.page,  simple: true, size: 'small', }" :scroll="{ y: 375 }" :rowKey="
              (record, index) => {return index;}">
            </a-table>
          </div>
          <div class="rightBoxBottom">
            <a-button :disabled="recipe.recipeOrderStatus!=0" class="addDrug" @click="addDrug">添加药品</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getDrugCategory, getAdviceUsage, getAdviceFrequency } from '@/api/common'
import { getReceiveDrugList, deleteRecipeItem } from '@/api/admission'
const columns = [
  {
    title: '序号',
    width: 35,
    align: 'center',
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '名称',
    dataIndex: 'drugName',
  },
  {
    title: '单剂量',
    width: 80,
    dataIndex: 'usageNumber',
    scopedSlots: {
      customRender: 'usageNumber',
    },
  },
  {
    title: '付数',
    width: 80,
    dataIndex: 'dosageNumber',
    scopedSlots: {
      customRender: 'dosageNumber',
    },
  },
  {
    title: '用法',
    width: 110,
    dataIndex: 'usage',
    scopedSlots: {
      customRender: 'usage',
    },
  },
  {
    title: '频率',
    width: 110,
    dataIndex: 'rateName',
    scopedSlots: {
      customRender: 'rateName',
    },
  },
  {
    title: '单价',
    width: 70,
    dataIndex: 'drugPrice',
    scopedSlots: {
      customRender: 'drugPrice',
    },
  },
  {
    title: '金额',
    width: 70,
    dataIndex: 'totalFee',
    scopedSlots: {
      customRender: 'totalFee',
    },
  },
  {
    title: '编辑',
    width: 40,
    dataIndex: 'delete',
    scopedSlots: {
      customRender: 'delete',
    },
  },
]

const columns2 = [
  {
    title: '名称',
    dataIndex: 'goodsName',
  },
  {
    title: '规格',
    dataIndex: 'specs',
  },
  {
    title: '库存',
    dataIndex: 'stockNum',
  },
  {
    title: '价格',
    dataIndex: 'price',
  },
]

const columns3 = [
  {
    title: '序号',
    width: 50,
    customRender: (text, record, index) => `${index + 1}`,
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '数量',
    dataIndex: 'stock',
    scopedSlots: { customRender: 'stock' },
  },
  {
    title: '价格',
    dataIndex: 'price',
    scopedSlots: { customRender: 'price' },
  },
]

const data3 = []
for (let i = 0; i < 4; i++) {
  data3.push({
    key: i,
    name: '注射费',
    stock: '1',
    price: '5.00',
  })
}

export default {
  name: 'Chinese',
  props: ['prInfo', 'load', 'allPrInfo', 'allRecipe', 'theKey'],
  data() {
    return {
      catId: 3,
      addVisible: false,
      qtUnit: '剂',
      usage: [],
      frequency: [],
      data: [],
      columns,
      data2: [],
      columns2,
      data3,
      columns3,
      selectedRowKeys: [], // Check here to configure the default column
      selectedRowKeys2: [],
      selectedRowKeys3: [],
      loading: false,
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
      form: {
        deptName: '',
        doctorName: '',
      },
      rules: {
        deptName: [
          {
            required: true,
            message: '请选择科室',
            trigger: 'change',
          },
        ],
        doctorName: [
          {
            required: true,
            message: '请选择医生',
            trigger: 'change',
          },
        ],
      },
      prPrice: 0,
      // prNum: 0,
      // sumPrice: '0.00',
      DrugCategoryList: [],
      drugLoading: false,
      queryDrugList: {
        categoryId: '',
        id: '3',
        keyWord: '',
        limit: 10,
        orderFiled: '',
        orderType: 'asc',
        page: 1,
      },
      recipe: {
        deptId: '',
        deptName: '',
        doctorId: '',
        doctorName: '',
        recipeAmount: '',
        recipeCount: 0,
        recipeId: '',
        recipeName: '',
        recipeOrderNo: '',
        recipeOrderStatus: 0,
        recipeType: 0,
        westernMedicine: [],
        chineseMedicine: [],
        examine: [],
      },
      drugTotal: 0,
    }
  },
  watch: {
    data: {
      handler(newVal, oldVal) {
        this.recipe.chineseMedicine = newVal
        this.recipe.recipeAmount = this.prPrice
        this.recipe.recipeCount = newVal.length
        if (this.allRecipe.length > this.theKey) {
          this.$nextTick(function () {
            //方法
            this.allPrInfo.total = this.allRecipe.length
            let sum = 0
            this.allRecipe.forEach((item) => {
              let price = Number(item.recipeAmount) * 100
              sum += price
            })
            this.allPrInfo.totalFee = sum / 100
          })
        }
        this.$emit('chineseMedicine', this.recipe)
      },
      deep: true,
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0
    },
    hasSelected2() {
      return this.selectedRowKeys2.length > 0
    },
    hasSelected3() {
      return this.selectedRowKeys3.length > 0
    },
  },
  created() {
    if (this.load) {
      this.data = []
    }
    // 获取用法
    getAdviceUsage().then((res) => {
      this.usage = res.data
    })
    // 获取频度
    getAdviceFrequency().then((res) => {
      this.frequency = res.data
    })
    // 获取药品分类
    getDrugCategory(this.catId).then((res) => {
      this.DrugCategoryList = res.data
    })
    this.getReceiveDrugList()
    this.form.deptName = this.allPrInfo.deptName
    this.form.doctorName = this.allPrInfo.doctorName
    this.recipe.deptId = this.allPrInfo.deptId
    this.recipe.deptName = this.allPrInfo.deptName
    this.recipe.doctorId = this.allPrInfo.doctorId
    this.recipe.doctorName = this.allPrInfo.doctorName
    if (this.prInfo && (this.prInfo.recipeType == 2 || this.prInfo.recipeType == 3)) {
      this.recipe = this.prInfo
      // this.form.deptName = this.prInfo.deptName
      // this.form.doctorName = this.prInfo.doctorName
      this.prPrice = this.prInfo.recipeAmount
      if (this.prInfo.chineseMedicine) {
        this.prInfo.chineseMedicine.map((item) => {
          item.usage = Number(item.usage)
          item.rateName = Number(item.rateName)
        })
        this.data = this.prInfo.chineseMedicine
        this.getPrSumP()
      }
    }
  },
  methods: {
    getReceiveDrugList() {
      this.drugLoading = true
      getReceiveDrugList(this.queryDrugList).then((res) => {
        this.data2 = res.data.map((item, index) => {
          return {
            id: index,
            ...item,
          }
        })
        this.drugTotal = res.count
        this.drugLoading = false
        this.selectedRowKeys2 = []
      })
    },
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    onSelectChange2(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys2 = selectedRowKeys
    },
    onSelectChange3(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      this.selectedRowKeys3 = selectedRowKeys
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    handleChangeDrug(value) {
      this.queryDrugList.page = 1
      this.queryDrugList.categoryId = value
      this.getReceiveDrugList()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    dosageChange(e, record) {
      const value = e.target.value
      record.usageNumber = value
      record.totalFee =
        (Number(value) * Number(record.dosageNumber) * (Number(record.drugPrice) * 100)) / 100
      this.getPrSumP()
    },
    quantityChange(e, record) {
      const value = e.target.value
      record.dosageNumber = value
      record.totalFee =
        (Number(record.usageNumber) * Number(value) * (Number(record.drugPrice) * 100)) / 100
      this.getPrSumP()
    },
    priceChange(e, record) {
      const value = e.target.value
      record.drugPrice = value
      record.totalFee =
        (Number(record.usageNumber) * Number(record.dosageNumber) * (Number(value) * 100)) / 100
      this.getPrSumP()
    },
    onDelete(record) {
      if (record.recipeItemId) {
        deleteRecipeItem(record.recipeItemId).then((res) => {
          if (res.success) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(res.message)
          }
        })
      }
      const data = [...this.data]
      this.data = data.filter((item) => item.drugId !== record.drugId || item.id !== record.id)
      this.getPrSumP()
    },
    onSearch(value) {
      this.queryDrugList.page = 1
      this.queryDrugList.keyWord = value
      this.getReceiveDrugList()
    },
    onChangeSearch(e) {
      this.queryDrugList.page = 1
      this.queryDrugList.keyWord = e.target.value
      this.getReceiveDrugList()
    },
    // 药品翻页
    changeDurgTable(page, pageSize) {
      this.queryDrugList.page = page.current
      this.getReceiveDrugList()
    },
    addDrug() {
      if (this.selectedRowKeys2.length == 0) {
        this.$message.warning('请选择要添加的药品')
      } else {
        let list = this.data2.map((data, index) => {
          return {
            id: index,
            dosageNumber: '',
            drugId: data.drugId,
            drugName: data.goodsName,
            drugPrice: data.price,
            drugUnit: data.unit,
            itemTypeId: this.queryDrugList.categoryId,
            rateId: '',
            rateName: undefined,
            recipeItemId: '',
            totalFee: '',
            usage: data.usageName == null ? undefined : data.usageName,
            usageNumber: '',
            usageUnit: data.usageUnit,
            statItemId: data.statItemId,
          }
        })
        this.selectedRowKeys2.forEach((item) => {
          let opt = this.data2.filter((data, index) => index === item)
          opt.forEach((items) => {
            let option = list.filter((data) => data.id === items.id)
            if (
              this.data.filter((data) => data.drugId === items.drugId && data.id === items.id)
                .length !== 0
            ) {
              this.$message.info('处方中已有此药品，请不要重复添加！')
            } else {
              this.data.push(option[0])
            }
          })
        })
      }
      this.selectedRowKeys2 = []
      this.getPrSumP()
    },
    showAddPrice() {
      this.addVisible = true
    },
    addHandleOk(e) {
      if (this.selectedRowKeys3.length == 0) {
        this.$message.warning('请选择要添加的费用')
      } else {
        this.selectedRowKeys3 = []
        this.addVisible = false
        this.$message.success('添加成功')
      }
    },
    addHandleCancel(e) {
      this.addVisible = false
    },
    getPrSumP() {
      let sum = 0
      this.data.forEach((item, index) => {
        let price = Number(item.totalFee) * 100
        sum += price
      })
      this.prPrice = sum / 100
    },
  },
}
</script>

<style scoped>
.leftBox {
  box-shadow: 0 0 8px #d4d4d4;
  border-radius: 5px;
  width: 100%;
  height: 550px;
}

.rightBox {
  width: 100%;
  height: 550px;
}

.leftTop {
  height: 75px;
  line-height: 75px;
  display: flex;
  justify-content: space-between;
}

.leftTop div {
  padding: 0 25px;
}

.leftToptitle {
  color: #656ee8;
  font-size: 40px;
  font-weight: bold;
}

.leftTopset {
  font-weight: bold;
}

.leftTopset span:hover {
  color: #656ee8;
  cursor: pointer;
}

.leftBottom {
  padding: 20px 0;
  height: 70px;
  line-height: 30px;
  display: flex;
  margin-top: 50px;
}

.leftBottom .leftBottomPrice {
  margin-left: -40px;
}

.addPrice {
  color: #ffffff;
  background-color: rgb(40, 208, 148);
  border: none;
  font-weight: bold;
}

.addPrice:hover {
  background-color: rgb(83, 217, 169);
}

.addDrug {
  background-color: #656ee8;
  color: #ffffff;
  font-weight: bold;
  border: none;
}

.addDrug:hover {
  color: #ffffff;
  background-color: rgb(148, 154, 239);
}
.addDrug:focus {
  color: #ffffff;
  background-color: #656ee8;
}

.rightBoxBottom {
  padding: 10px 0;
}
</style>
