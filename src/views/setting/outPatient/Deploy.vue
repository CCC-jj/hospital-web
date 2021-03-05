<template>
  <div class="deploy">
    <div class="deployTop">
      <a-radio-group :value="value" button-style="solid" @change="rdChange">
        <a-radio-button value="roster"> 排班设置 </a-radio-button>
        <a-radio-button value="personNum"> 预约人数 </a-radio-button>
        <a-radio-button value="price"> 价格设置 </a-radio-button>
      </a-radio-group>

      <a-button class="saveBtn" icon="save" @click="saveOutpatient">
        保存
      </a-button>
    </div>

    <hr class="exportLine" />

    <div class="deployBottom">
      <div v-show="value==='roster'">
        <a-checkbox-group @change="onChangeCheckbox">
          <a-row type="flex" justify="space-around" align="middle" style="width:70%;margin:0 auto;">
            <a-col :span="8">
              <a-checkbox value="Monday1">
                周一 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Monday2">
                周一 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Monday3">
                周一 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday1">
                周二 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday2">
                周二 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday3">
                周二 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday1">
                周三 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday2">
                周三 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday3">
                周三 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Monday1">
                周一 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Monday2">
                周一 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Monday3">
                周一 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday1">
                周二 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday2">
                周二 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Tuesday3">
                周二 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday1">
                周三 8:00-12:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday2">
                周三 13:00-18:00
              </a-checkbox>
            </a-col>
            <a-col :span="8">
              <a-checkbox value="Wednesday3">
                周三 18:00-22:00
              </a-checkbox>
            </a-col>
            <a-col :span="8" style="margin-top:20px;">
              <a-row type="flex" justify="space-around" align="middle">
                <a-col :span="16">
                  <p>循环排班</p>
                  <p>开启后将按周自动生成排班</p>
                </a-col>
                <a-col :span="4">
                  <a-switch style="float:right;"></a-switch>
                </a-col>
              </a-row>
            </a-col>
            <a-col :span="8"></a-col>
            <a-col :span="8"></a-col>
          </a-row>
        </a-checkbox-group>
      </div>
      <div v-show="value==='personNum'">
        <div class="title">选择人数</div>
        <a-radio-group class="radioGroup" button-style="solid">
          <a-radio-button value="10">
            10
          </a-radio-button>
          <a-radio-button value="20">
            20
          </a-radio-button>
          <a-radio-button value="30">
            30
          </a-radio-button>
          <a-radio-button value="40">
            40
          </a-radio-button>
          <a-radio-button value="50">
            50
          </a-radio-button>
          <a-radio-button value="60">
            60
          </a-radio-button>
          <a-radio-button value="70">
            70
          </a-radio-button>
          <a-radio-button value="80">
            80
          </a-radio-button>
        </a-radio-group>
				<div class="title">自定义</div>
				<a-input-number :min="0" placeholder="请输入人数" style="width:30%;" size="large"></a-input-number>
      </div>
      <div v-show="value==='price'">
				 <div class="title"> 选择咨询价格（元）</div>
        <a-radio-group class="radioGroup" button-style="solid">
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
				<a-input-number :min="0" placeholder="建议价格在0-200元" style="width:30%;" size="large"></a-input-number>
			</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Deploy',
  data() {
    return {
      value: 'roster',
    }
  },
  methods: {
    rdChange(e) {
      this.value = e.target.value
    },
    saveOutpatient() {},
    onChangeCheckbox(checkedValues) {
      console.log('checked = ', checkedValues)
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

.deployBottom{
	padding: 0 20px;
}

.title{
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