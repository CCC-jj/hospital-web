<template>
  <div class="preBox">
    <a-form-model ref="ruleForm2" :model="form2" :rules="rules2" layout="vertical">
      <a-row class="form-row" :gutter="16">
        <a-col :span="12">
          <a-form-model-item label="诊断" prop="diagnosis">
            <a-select :disabled="disabledBtn" v-model="form2.diagnosis" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
              <a-select-option v-for="item in diagnosisList" :key="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
        <a-col :span="12">
          <a-form-model-item label="医嘱" prop="doctorAdvice">
            <a-select :disabled="disabledBtn" v-model="form2.doctorAdvice" mode="tags" style="width: 100%" :token-separators="[',','，']" @change="handleChange" size="large">
              <a-select-option v-for="item in adviceList" :key="item">{{ item }}</a-select-option>
            </a-select>
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <a-spin :spinning="spinning" size="large">
      <div class="preBoxTop">
        <a-row :gutter="10">
          <a-col :span="3">
            <a-select :class="[{addPrBtn: !disabledBtn}]" :disabled="disabledBtn" placeholder="添加处方" style="width: 100%" @change="handleChange">
              <a-select-option v-for="(item,index) in prList" :key="item.id" @click="selected(item.id,item.name,index)">{{item.name}}</a-select-option>
            </a-select>
          </a-col>
          <a-col :span="21">
            <a-tabs v-model="activeKey" hide-add type="editable-card" @edit="onEdit" @change="changeTabto" style="width: 100%">
              <a-tab-pane v-for="(pane,index) in panes" :key="pane.key" :tab="pane.title+(index+1)" :closable="pane.recipeOrderStatus==0">
              </a-tab-pane>
            </a-tabs>
          </a-col>
        </a-row>
        <div class="prPages">
          <component v-on:recipeItem="(val) => recipeItem(val,index)" v-on:chineseMedicine="(val) => chineseMedicine(val,index)" v-on:examine="(val) => examine(val,index)" :class="['prescription',{active: activeKey == item.key}]" v-for="(item,index) in componentList" :key="item.key" :is="item.name" :prInfo="item.prInfo" :allPrInfo="allPrInfo" :allRecipe="recipe" :load="item.load" :theKey="index" :diagnosis="form2.diagnosis" :doctorAdvice="form2.doctorAdvice"></component>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import { getRecipelCategory } from '@/api/common'
import {
  getReceiveDiagnosis,
  getReceiveAdvice,
  getRecipeInfo,
  deleteReceiveRecipe,
} from '@/api/admission'
import Western from './list/Western'
import Traditional from './list/Traditional'
import CheckItem from './list/CheckItem'
export default {
  components: {
    Western,
    Traditional,
    CheckItem,
  },
  props: {
    outpatientNo: String,
    patientId: String,
    regOrderNo: String,
    disabledBtn: Boolean,
  },
  data() {
    return {
      diagnosisList: [],
      adviceList: [],
      form2: {
        diagnosis: [],
        doctorAdvice: [],
      },
      rules2: {
        diagnosis: [{ required: true, message: '请输入诊断', trigger: 'change' }],
      },
      spinning: false,
      activeKey: 0,
      activeTitle: '',
      activePath: '',
      newTabIndex: 0,
      panes: [],
      prList: [],
      componentList: [],
      recipe: [],
      RecipeInfoList: [],
      allPrInfo: {},
    }
  },
  created() {
    getRecipelCategory().then((res) => {
      this.prList = res.data
    })
    if (this.outpatientNo) {
      this.getRecipeInfo()
    }
    // 获取诊断信息
    getReceiveDiagnosis().then((res) => {
      if (res.success) {
        this.diagnosisList = res.data
      }
    })
    // 获取医嘱信息
    getReceiveAdvice().then((res) => {
      if (res.success) {
        this.adviceList = res.data
      }
    })
  },
  mounted() {
    // this.$router.push({ name: this.activePath })
  },
  watch: {
    outpatientNo: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.getRecipeInfo()
        }
      },
    },
  },
  methods: {
    // 获取处方信息
    getRecipeInfo() {
      this.spinning = true
      this.panes = []
      this.componentList = []
      getRecipeInfo(this.outpatientNo, this.patientId, this.regOrderNo).then((res) => {
        if (res.success && res.data) {
          this.allPrInfo = res.data
          if (res.data.recipe.length > 0) {
            this.RecipeInfoList = res.data.recipe
            this.activeKey = this.RecipeInfoList.length
            this.RecipeInfoList.forEach((item, index) => {
              let path
              switch (item.recipeType) {
                case 1:
                  path = 'Western'
                  break
                case 3:
                  path = 'Traditional'
                  break
                case 4:
                  path = 'CheckItem'
              }
              this.newTabIndex = this.panes.length
              const activeKey = this.newTabIndex++
              this.panes.push({
                title: item.recipeName,
                key: activeKey,
                path: path,
                recipeOrderStatus: item.recipeOrderStatus,
              })
              this.componentList.push({
                key: activeKey,
                name: path,
                prInfo: item,
              })
              this.activeKey = activeKey
              this.activePath = path
              this.activeTitle = item.recipeName
            })
          }
          this.spinning = false
        }
      })
    },
    recipeItem(val, index) {
      console.log(val);
      this.recipe[index] = val
      this.recipe[index].recipeType = val.recipeType
      this.recipe[index].recipeName = this.panes[index].title
      this.recipe[index].recipeCount = 1
      this.getSumPrice()
      this.$emit('recipe', this.recipe)
    },
    westernData(val, index) {
      // Object.assign(this.recipe, val)
      // this.recipe = this.recipe.concat(val)
      // this.formateArrObjData(this.recipe, val, index)
      // console.log(val, index, this.recipe, this.prList)
      console.log(val,index, this.prList);
      this.recipe[index] = val
      this.recipe[index].recipeType = this.prList[0].id
      this.recipe[index].recipeName = this.panes[index].title
      this.recipe[index].recipeCount = 1
      this.getSumPrice()
      this.$emit('recipe', this.recipe)
    },
    chineseMedicine(val, index) {
      console.log(val,index);
      this.recipe[index] = val
      this.recipe[index].recipeType = this.prList[2].id
      this.recipe[index].recipeName = this.panes[index].title
      this.recipe[index].recipeCount = 1
      this.getSumPrice()
      this.$emit('recipe', this.recipe)
    },
    examine(val, index) {
      this.recipe[index] = val
      this.recipe[index].recipeType = this.prList[3].id
      this.recipe[index].recipeName = this.panes[index].title
      this.recipe[index].recipeCount = 1
      this.getSumPrice()
      this.$emit('recipe', this.recipe)
    },
    getSumPrice() {
      let totalFee = 0
      this.recipe.forEach((item) => {
        let price = Number(item.recipeAmount) * 100
        totalFee += price
      })
      this.allPrInfo.total = this.recipe.length
      this.allPrInfo.totalFee = totalFee / 100
    },
    // formateArrObjData(initialArr, obj, pro) {
    //   let index = initialArr.findIndex((val) => val[pro] === obj[pro])
    //   // 如果有就替换  没有就添加
    //   if (initialArr.findIndex((val) => val[pro] === obj[pro]) !== -1) {
    //     this.recipe.splice(index, 1, obj)
    //   } else {
    //     this.recipe.push(obj)
    //   }
    //   return this.recipe
    // },
    handleChange(value) {
      console.log(`selected ${value}`, typeof value)
    },
    callback(key) {
      console.log(key)
    },
    onEdit(targetKey, action) {
      this[action](targetKey)
    },
    selected(id, name, index) {
      let path
      switch (id) {
        case 1:
          path = 'Western'
          break
        case 2:
          path = 'Traditional'
          break
        case 3:
          path = 'Traditional'
          break
        case 4:
          path = 'CheckItem'
          break
        case 5:
          path = 'CheckItem'
          break
        case 6:
          path = 'CheckItem'
          break
        case 7:
          path = 'CheckItem'
          break
        case 8:
          path = 'CheckItem'
          break
        case 9:
          path = 'CheckItem'
      }
      const panes = this.panes
      const activeKey = this.newTabIndex++
      panes.push({
        title: name,
        key: activeKey,
        path: path,
        recipeOrderStatus: 0,
      })
      this.panes = panes
      this.activeKey = activeKey
      this.activePath = path
      this.activeTitle = name
      this.componentList.push({
        key: activeKey,
        name: path,
        load: true,
      })
    },
    changeTabto(key) {},
    remove(targetKey) {
      this.$confirm({
        title: '删除确认',
        centered: true,
        content: '确定要删除此处方信息吗？',
        onOk: () => {
          let activeKey = this.activeKey
          let activeTitle = this.activeTitle
          let activePath = this.activePath
          let lastIndex
          this.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
              lastIndex = i - 1
              this.recipe.splice(i, 1)
            }
          })
          const panes = this.panes.filter((pane) => pane.key !== targetKey)
          const componentList = this.componentList.filter((pane) => pane.key !== targetKey)
          const deleteList = this.componentList.filter((item) => item.key == targetKey)
          if (deleteList[0].prInfo) {
            deleteReceiveRecipe(deleteList[0].prInfo.recipeId).then((res) => {
              if (res.success) {
                this.$message.success('处方删除成功！')
                if (panes.length && activeKey === targetKey) {
                  if (lastIndex >= 0) {
                    activeKey = panes[lastIndex].key
                    activePath = panes[lastIndex].path
                  } else {
                    activeKey = panes[0].key
                    activePath = panes[0].path
                  }
                }
                this.panes = panes
                this.componentList = componentList
                this.activeKey = activeKey
                this.activeTitle = activeTitle
                this.activePath = activePath
              } else {
                this.$message.error(res.message)
              }
            })
          } else {
            if (panes.length && activeKey === targetKey) {
              if (lastIndex >= 0) {
                activeKey = panes[lastIndex].key
                activePath = panes[lastIndex].path
              } else {
                activeKey = panes[0].key
                activePath = panes[0].path
              }
            }
            this.panes = panes
            this.componentList = componentList
            this.activeKey = activeKey
            this.activeTitle = activeTitle
            this.activePath = activePath
          }
          this.getSumPrice()
        },
        onCancel: () => {},
      })
    },
  },
}
</script>

<style scoped>
.prPages {
  margin-top: 15px;
}
.prescription {
  display: none;
}
.prescription.active {
  display: block;
}
.addPrBtn /deep/ {
  border-radius: 5px;
  color: #656ee8;
}
.addPrBtn /deep/ .ant-select-selection {
  border-color: #656ee8;
}
.addPrBtn /deep/ .ant-select-selection__placeholder {
  color: #656ee8;
}
</style>