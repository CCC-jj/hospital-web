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
            <a-table :columns="columns" :data-source="data" :pagination="false" :scroll="{ y: 350 }" style="height: 350px" :rowKey="(record, index) => {return record.examineId;}">
              <template slot="partName" slot-scope="text,record">
                <!-- <a-auto-complete :disabled="recipe.recipeOrderStatus!=0" v-model="record.partName" style="width: 100%;color:#000;" optionLabelProp="value" @select="(value, option)=>selectPatient(value,option,record)" @search="(value)=>partInput(value,record)">
                  <template slot="dataSource">
                    <a-select-option v-for="item in dataSource" :key="item.partName" :title="`${item.id}`">
                      {{item.partName}}
                    </a-select-option>
                  </template>
                </a-auto-complete> -->
                <a-select style="width:100%;" optionLabelProp="title" show-search placeholder="选择部位" :show-arrow="false" :filter-option="false" v-model="record.partName" @select="(value, option)=>selectPatient(value,option,record)" @search="(value)=>partInput(value,record)">
                  <a-select-option v-for="item in dataSource" :key="item.id" :title="item.partName">
                    {{item.partName}}
                  </a-select-option>
                </a-select>
              </template>
              <template slot="number" slot-scope="text, record">
                <a-input :disabled="recipe.recipeOrderStatus!=0" @change="(e) => quantityChange(e, record)" style="width: 70%;color:#000;" v-model="record.number"></a-input>
                <span>{{ record.unit }}</span>
              </template>
              <template slot="examineType" slot-scope="text">
                {{text}}
              </template>
              <template slot="examinePrice" slot-scope="text, record">
                <a-input disabled style="width: 100%;color:#000;" v-model="record.examinePrice" @change="(e) => priceChange(e, record)"></a-input>
              </template>
              <template slot="examineFee" slot-scope="text,record">
                <a-input disabled style="width: 100%;color:#000;" v-model="record.examineFee"></a-input>
              </template>
              <template slot="remark" slot-scope="text,record">
                <a-input :disabled="recipe.recipeOrderStatus!=0" style="width: 100%;color:#000;" v-model="record.remark"></a-input>
              </template>
              <template slot="delete" slot-scope="text, record">
                <a-popconfirm v-show="recipe.recipeOrderStatus==0" v-if="data.length" title="确定删除吗?" @confirm="() => onDelete(record.examineId,record.recipeItemId)">
                  <a :disabled="recipe.recipeOrderStatus!=0" href="javascript:;" style="font-size: 20px; color: #656ee8">
                    <a-icon type="delete"></a-icon>
                  </a>
                </a-popconfirm>
              </template>
            </a-table>
          </div>
          <div class="leftBottom">
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
            <span>项目分类</span>
            <a-select default-value="" style="width: 30%" @change="handleChangeDrug">
              <a-select-option value=""> 全部分类 </a-select-option>
              <a-select-option v-for="item in DrugCategoryList" :key="item.id"> {{item.name}} </a-select-option>
            </a-select>
            <a-input-search placeholder="输入项目中文或拼音名称" style="width: 45%; margin-left: 5px" @change="onChangeSearch" @search="onSearch" />
          </div>
          <div class="rightBoxMiddle">
            <a-table :loading="drugLoading" :row-selection="{
                selectedRowKeys: selectedRowKeys2,
                onChange: onSelectChange2,
              }" :columns="columns2" :data-source="data2" @change="changeDurgTable" :pagination="{ showQuickJumper: true, pageSize: 10, total: drugTotal, current:queryDrugList.page,  simple: true, size: 'small', }" :scroll="{ y: 375 }" :rowKey="
              (record, index) => {return record.id;}">
            </a-table>
          </div>
          <div class="rightBoxBottom">
            <a-button :disabled="recipe.recipeOrderStatus!=0" class="addDrug" @click="addDrug">添加项目</a-button>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { getDrugCategory, getBodyPart } from '@/api/common'
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
    dataIndex: 'examineName',
  },
  {
    title: '部位',
    dataIndex: 'partName',
    scopedSlots: {
      customRender: 'partName',
    },
  },
  {
    title: '数量',
    width: 80,
    dataIndex: 'number',
    scopedSlots: {
      customRender: 'number',
    },
  },
  {
    title: '类型',
    // width: 120,
    dataIndex: 'examineType',
    scopedSlots: {
      customRender: 'examineType',
    },
  },
  {
    title: '单价',
    width: 70,
    dataIndex: 'examinePrice',
    scopedSlots: {
      customRender: 'examinePrice',
    },
  },
  {
    title: '金额',
    width: 70,
    dataIndex: 'examineFee',
    scopedSlots: {
      customRender: 'examineFee',
    },
  },
  {
    title: '备注',
    width: 100,
    dataIndex: 'remark',
    scopedSlots: {
      customRender: 'remark',
    },
  },
  {
    title: '编辑',
    width: 35,
    dataIndex: 'delete',
    scopedSlots: {
      customRender: 'delete',
    },
  },
]

const columns2 = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '类型',
    dataIndex: 'itemType',
  },
  {
    title: '单位',
    dataIndex: 'unit',
  },
  {
    title: '价格',
    dataIndex: 'price',
  },
]

export default {
  name: 'Examine',
  props: ['prInfo', 'load', 'allPrInfo', 'allRecipe', 'theKey'],
  data() {
    return {
      catId: 4,
      addVisible: false,
      qtUnit: '次',
      dataSource: [],
      data: [],
      columns,
      data2: [],
      columns2,
      selectedRowKeys: [], // Check here to configure the default column
      selectedRowKeys2: [],
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
        id: '4',
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
        this.recipe.examine = newVal
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
        this.$emit('examine', this.recipe)
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
  },
  created() {
    if (this.load) {
      this.data = []
    }
    // 获取身体部位
    this.getBodyPart()
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
    if (this.prInfo && this.prInfo.recipeType == 4) {
      this.recipe = this.prInfo
      // this.form.deptName = this.prInfo.deptName
      // this.form.doctorName = this.prInfo.doctorName
      this.prPrice = this.prInfo.recipeAmount
      if (this.prInfo.examine) {
        // this.prInfo.examine.map((item) => {
        //   item.examineType = Number(item.examineType)
        //   // item.rateName = Number(item.rateName)
        // })
        this.data = this.prInfo.examine
        this.getPrSumP()
      }
    }
  },
  methods: {
    getReceiveDrugList() {
      this.drugLoading = true
      getReceiveDrugList(this.queryDrugList).then((res) => {
        this.data2 = res.data
        this.drugTotal = res.count
        this.drugLoading = false
        this.selectedRowKeys2 = []
      })
    },
    // 搜索部位
    getBodyPart(key) {
      getBodyPart(key).then((res) => {
        this.dataSource = res.data
      })
    },
    partInput(value, record) {
      console.log(value)
      if (!value) {
        record.partId = ''
      }
      this.getBodyPart(value)
    },
    filterOptionPart(input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      )
    },
    selectPatient(value, option, record) {
      console.log(value, option, record)
      this.getBodyPart()
      if (option.key == value) {
        record.partId = option.key
        record.partName = option.componentOptions.propsData.title
      }
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onSelectChange2(selectedRowKeys) {
      this.selectedRowKeys2 = selectedRowKeys
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    },
    // 切换分类
    handleChangeDrug(value) {
      this.queryDrugList.page = 1
      this.queryDrugList.categoryId = value
      this.getReceiveDrugList()
    },
    quantityChange(e, record) {
      const value = e.target.value
      record.number = value
      record.examineFee = Number(value) * Number(record.examinePrice)
      this.getPrSumP()
    },
    priceChange(e, record) {
      const value = e.target.value
      record.examinePrice = value
      record.examineFee = Number(record.number) * Number(value)
      this.getPrSumP()
    },
    onDelete(key, recipeItemId) {
      if (recipeItemId) {
        deleteRecipeItem(recipeItemId).then((res) => {
          if (res.success) {
            this.$message.success('删除成功！')
          } else {
            this.$message.error(res.message)
          }
        })
      }
      const data = [...this.data]
      this.data = data.filter((item) => item.examineId !== key)
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
        this.$message.warning('请选择要添加的项目')
      } else {
        let list = this.data2.map((data) => {
          return {
            examineFee: '',
            examineId: data.id,
            examineName: data.name,
            examinePrice: data.price,
            examineType: data.itemType,
            itemTypeId: this.queryDrugList.categoryId,
            number: '',
            partId: '',
            partName: '',
            recipeItemId: '',
            remark: '',
            statItemId: data.statItemId,
            unit: data.unit,
          }
        })
        this.selectedRowKeys2.forEach((item) => {
          let option = list.filter((data) => data.examineId == item)
          if (this.data.filter((data) => data.examineId == item).length != 0) {
            this.$message.info('处方中已有此项目，请不要重复添加！')
          } else {
            this.data.push(option[0])
          }
        })
      }
      this.selectedRowKeys2 = []
      this.getPrSumP()
    },
    getPrSumP() {
      let sum = 0
      this.data.forEach((item, index) => {
        let price = Number(item.examineFee) * 100
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
  margin-top: 50px;
}

.leftBottom .leftBottomPrice {
  float: right;
  margin-right: 10px;
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
