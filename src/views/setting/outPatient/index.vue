<template>
  <div class="outPatient">
    <a-button class="settingBtn"> 出诊设置 </a-button>
    <hr class="settingLine" />
    <div class="settingBox">
      <a-collapse :activeKey="activeKey" :bordered="false" expandIconPosition="right" @change="changeCollapse">
        <template #expandIcon="props">
          <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
        </template>
        <a-collapse-panel key="1" :style="customStyle" :forceRender="true">
          <template slot="header">
            <a-row type="flex" justify="start" align="middle">
              <a-col :span="22">
                <div style="float:left;padding:15px;">
                  <img src="../../../assets/u15327.png" alt="" srcset="" style="width:35px;">
                </div>
                <div style="line-height:30px;padding:5px;">
                  <p style="font-size:18px;font-weight:bold;">图文问诊</p>
                  <p>这是一段支付方式介绍这是一段支付方式介绍这是一段支付方式介绍</p>
                </div>
              </a-col>
              <a-col :span="2" @click="handleClick">
                <a-switch :checked="picChecked" @change="(checked, event)=>changeSwitch(checked, event, '1', 'picRuleForm')" />
              </a-col>
            </a-row>
          </template>
          <div style="padding:10px;">
            <a-form-model layout="inline" ref="picRuleForm" :model="picForm" :rules="picRules">
              <a-form-model-item label="价格（元）：" prop="price">
                <a-input-number v-model="picForm.price" :min="0"></a-input-number>
              </a-form-model-item>
              <a-form-model-item label="开始时间：" prop="startTime">
                <a-time-picker v-model="picForm.startTime" :default-open-value="moment('00:00:00', 'HH:mm:ss')" @change="onChangeTime" />
              </a-form-model-item>
              <a-form-model-item label="结束时间：" prop="endTime">
                <a-time-picker v-model="picForm.endTime" :default-open-value="moment('00:00:00', 'HH:mm:ss')" @change="onChangeTime" />
              </a-form-model-item>
            </a-form-model>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="2" :style="customStyle" :forceRender="true">
          <template slot="header">
            <a-row type="flex" justify="start" align="middle">
              <a-col :span="22">
                <div style="float:left;padding:15px;">
                  <img src="../../../assets/u15297.png" alt="" srcset="" style="width:35px;">
                </div>
                <div style="line-height:30px;padding:5px;">
                  <p style="font-size:18px;font-weight:bold;">视频问诊</p>
                  <p>这是一段支付方式介绍这是一段支付方式介绍这是一段支付方式介绍</p>
                </div>
              </a-col>
              <a-col :span="2" @click="handleClick">
                <a-switch :checked="videoChecked" @change="(checked, event)=>changeSwitch(checked, event, '2', 'videoRuleForm')" />
              </a-col>
            </a-row>
          </template>
          <div style="padding:10px;">
            <a-form-model layout="inline" ref="videoRuleForm" :model="videoForm" :rules="videoRules">
              <a-form-model-item label="价格（元）：" prop="price">
                <a-input-number v-model="videoForm.price" :min="0"></a-input-number>
              </a-form-model-item>
              <a-form-model-item label="开始时间：" prop="startTime">
                <a-time-picker v-model="videoForm.startTime" :default-open-value="moment('00:00:00', 'HH:mm:ss')" @change="onChangeTime" />
              </a-form-model-item>
              <a-form-model-item label="结束时间：" prop="endTime">
                <a-time-picker v-model="videoForm.endTime" :default-open-value="moment('00:00:00', 'HH:mm:ss')" @change="onChangeTime" />
              </a-form-model-item>
            </a-form-model>
          </div>
        </a-collapse-panel>
        <a-collapse-panel key="3" header="预约挂号" :style="customStyle">
          <p>{{ text }}</p>
        </a-collapse-panel>
      </a-collapse>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'outPatient',
  data() {
    return {
      activeKey: [],
      picChecked: false,
      videoChecked: false,
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      customStyle:
        'background: rgb(248,248,254);border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
      picForm: {
        price: '',
        startTime: '',
        endTime: '',
      },
      picRules: {
        price: [{ required: true, message: '请输入价格', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
      },
      videoForm: {
        price: '',
        startTime: '',
        endTime: '',
      },
      videoRules: {
        price: [{ required: true, message: '请输入价格', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
      },
    }
  },
  created() {},
  methods: {
    moment,
    changeCollapse(key) {
      this.activeKey = key
      console.log(key, this.activeKey)
    },
    onChangeTime(time, timeString) {
      console.log(time, timeString)
    },
    handleClick(event) {
      // If you don't want click extra trigger collapse, you can prevent this:
      event.stopPropagation()
    },
    changeSwitch(checked, event, key, ruleForm) {
      // console.log(checkedStatus);
      if (checked) {
        this.$refs[ruleForm].validate((valid) => {
          if (valid) {
            switch (key) {
              case '1':
                this.picChecked = true
                break
              case '2':
                this.videoChecked = true
                break
            }
            this.$message.success('启用成功！')
          } else {
            if (this.activeKey.filter((item) => item === key).length === 0) {
              this.activeKey.push(key)
            }
            this.$message.warning('请填写信息后再启用')
            return false
          }
        })
      } else {
        switch (key) {
          case '1':
            this.picChecked = false
            break
          case '2':
            this.videoChecked = false
            break
        }
        this.$message.success('停用成功！')
      }
    },
  },
}
</script>

<style lang="" scoped>
.outPatient {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.settingBtn {
  color: #656ee8;
  font-weight: bold;
  border: 1px solid #656ee8;
  /* margin-left: 1020px; */
  width: 120px;
}
.settingBtn:hover {
  color: #ffffff;
  background: #656ee8;
}
.settingLine {
  border: 1px solid rgb(241, 241, 241);
  margin-top: 20px;
  margin-bottom: 25px;
}
.settingBox /deep/ .ant-collapse {
  background-color: #ffffff;
}
/* .settingBox /deep/ .ant-collapse-header {
  display: flex;
} */
p {
  margin-bottom: 0 !important;
}
</style>
