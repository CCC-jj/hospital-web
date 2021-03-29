<template>
  <div class="admissionBox">
    <div :class="['loadingPage',{collapsedLoading: collapsed}]" v-show="iconLoading1">
      <a-spin class="loadingPic" size="large">
        <a-icon slot="indicator" type="loading" style="font-size: 80px;color:#ffffff;" spin />
      </a-spin>
      <div class="loadingText" style="font-size: 30px;color: #ffffff;">保存中 ● ● ●</div>
    </div>
    <div class="admissionBoxTop">
      <div class="tabsBtn">
        <a-radio-group :default-value="tabs" button-style="solid" @change="rdChange">
          <a-radio-button value="a">处方</a-radio-button>
          <a-radio-button value="b">病历</a-radio-button>
        </a-radio-group>
      </div>
      <div class="typesBtn">
        <a-button class="picBtn" style="width: 100px" icon="rollback" @click="goBack" v-if="page">
          返回
        </a-button>
        <a-button-group>
          <a-button :disabled="this.form.receiveTypeId!==200" class="picBtn" @click="showModal">图文资料</a-button>
          <!-- <a-button :disabled="this.form.receiveTypeId!==300" class="picBtn" @click="showModal">视频对话</a-button> -->
          <a-button class="picBtn" @click="showVideo">视频对话</a-button>
        </a-button-group>
      </div>

      <a-modal v-model="visible" title="图文资料" @ok="handleOk">
        <div v-if="sickInfo">
          <div class="picTitle">病情描述</div>
          <br />
          <div class="picDescription">病情描述：{{sickInfo.description}}</div>
          <br />
          <div class="picDescription">患病时长：{{sickInfo.sickTime}}</div>
          <br />
          <div class="picDescription">是否就诊：{{sickInfo.seeDoctor?'是':'否'}}</div>
          <br />

          <div class="picTitle">
            检查报告或患处照片
            <span>（点击放大）</span>
          </div>
          <br />
          <viewer class="prPic" :images="sickInfo.images">
            <img v-for="(item,index) in sickInfo.images" :src="item" :key="index" :title="item" />
          </viewer>
        </div>
      </a-modal>

      <a-modal width="600px" v-model="videoVisible" :maskClosable="false" title="视频对话" @ok="videoHandleOk" @cancel="videoCancel" :footer="null">
        <CallbyVideo ref="videoChild" v-if="videoVisible"></CallbyVideo>
      </a-modal>
    </div>

    <!--新开就诊表单-->
    <div class="admissionForm">
      <div :class="['formFlex',{formContent: openChat}]">
        <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-model-item label="患者姓名" prop="patientName">
                <!--<a-auto-complete v-model="form.name" :data-source="dataSource" style="width: 100%" placeholder="请输入患者姓名" :filter-option="filterOption" size="large" />-->
                <a-auto-complete v-model="form.patientName" size="large" style="width: 100%" placeholder="患者姓名/手机号码/证件号码/卡号" option-label-prop="value" @change="searchPatientChange" @select="selectPatient">
                  <template slot="dataSource">
                    <a-select-option v-for="item in dataSource" :key="item.patientId" :title="item.patientName">
                      <span>{{item.patientName}} </span>
                      <span v-if="item.patientSex==0">保密 </span>
                      <span v-else-if="item.patientSex==1">男 </span>
                      <span v-else-if="item.patientSex==2">女 </span>
                      <span v-else>未说明 </span>
                      <span>{{item.patientAge}}岁 </span>
                      <span>{{item.patientMobile}}</span>
                    </a-select-option>
                  </template>
                </a-auto-complete>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="身份证号码" required prop="patientCertNo">
                <a-input v-model="form.patientCertNo" placeholder="请输入身份证号码" size="large"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="患者年龄" prop="patientAge">
                <a-input disabled v-model="form.patientAge" placeholder="请输入数字" type="number" size="large">
                  <a-select disabled slot="addonAfter" v-model="defaultValue" style="width: 60px;color:rgba(0, 0, 0, 0.65);">
                    <a-select-option value="year">岁</a-select-option>
                    <a-select-option value="month">月</a-select-option>
                    <a-select-option value="day">天</a-select-option>
                  </a-select>
                </a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="出生日期" prop="patientBirth">
                <a-date-picker valueFormat="value" v-model="form.patientBirth" :disabled-date="disabledDate" type="date" style="width: 100%" size="large" @change="changeDate" />
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :span="6">
              <a-form-model-item label="性别" prop="patientSex">
                <a-select v-model="form.patientSex" placeholder="请选择患者性别" size="large">
                  <a-select-option v-for="item in sexList" :key="item.value">{{item.desc}}</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="手机号码" prop="patientMobile">
                <a-input v-model="form.patientMobile" placeholder="请输入手机号码" size="large"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="患者卡号" prop="patientCardNo">
                <a-input v-model="form.patientCardNo" placeholder="请输入患者卡号" size="large"></a-input>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="接诊类型" prop="receiveTypeId">
                <a-select :disabled="!receiveTypeFlag" v-model="form.receiveTypeId" placeholder="请选择" size="large" @change="handleChangeType">
                  <a-select-option v-for="item in typesList" :key="item.typeCode" :disabled="item.typeCode===200 || item.typeCode===300"> {{item.typeName}} </a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </a-row>
          <a-row class="form-row" :gutter="16">
            <a-col :span="12">
              <a-form-model-item label="地址" prop="patientAddr">
                <a-input-group compact size="large">
                  <!-- <a-cascader :options="options" placeholder="请选择" @change="onChangeAddr" v-model="choseAddr" style="width: 25%" /> -->
                  <a-cascader :options="options" :load-data="loadData" placeholder="请选择" change-on-select @change="onChangeAddr" v-model="choseAddr" style="width: 33%" />
                  <a-input @input="onInputAddr" v-model="form.patientAddr" style="width: 67%" placeholder="请输入详细地址" />
                </a-input-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="初复诊" prop="visitType">
                <a-radio-group button-style="solid" v-model="form.visitType" style="width:100%;" size="large">
                  <a-radio-button style="width:50%;" value="0">
                    初诊
                  </a-radio-button>
                  <a-radio-button style="width:50%;" value="1">
                    复诊
                  </a-radio-button>
                </a-radio-group>
              </a-form-model-item>
            </a-col>
            <a-col :span="6">
              <a-form-model-item label="确定接诊" required>
                <a-button class="confirmBtn" :loading="iconLoadingConfirmInfo" @click="clickConfirmInfo" style="width:100%;" size="large">接诊</a-button>
              </a-form-model-item>
            </a-col>
          </a-row>

          <a-form-model-item :wrapper-col="{ span: 14, offset: 4 }"></a-form-model-item>
        </a-form-model>

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
      </div>
      <div :class="['chatFlex',{chatContent: openChat}]">
        <conversation ref="conversationChild"></conversation>
      </div>
    </div>

    <!--底部浮动编辑-->
    <div class="admissionBoxBottom">
      <div class="bottomsBox">
        <span style="margin-right: 15px" @click="showModalPr">
          <a-icon type="file-text" theme="filled" />
          {{ prtransfer }}
        </span>
        <span style="margin-right: 15px" @click="showModalSave">
          <a-icon type="save" theme="filled" />存为模板
        </span>
        <a-button :disabled="disabledBtn" :class="['saveBtn', {disabledBtn: disabledBtn}]" icon="save" :loading="iconLoading1" @click="saveLoading">{{ save }}</a-button>
        <a-button :disabled="disabledBtn" :class="['endBtn', {disabledBtn: disabledBtn}]" icon="poweroff" :loading="iconLoading2" @click="endLoading">{{ end }}</a-button>
      </div>
    </div>

    <!--添加处方-->
    <div class="prescriptionBox">
      <a-spin :spinning="spinning">
        <router-view :disabledBtn="disabledBtn" :outpatientNo="outpatientNo" :patientId="patientId" :regOrderNo="regOrderNo" v-on:caseForm="caseForm" v-on:recipe="recipe" ref="childRules"></router-view>
      </a-spin>
    </div>

    <!--处方调用对话框-->
    <a-modal :centered="true" v-model="prVisible" width="1050px" title="调用处方模板" :footer="null">
      <div class="transferPrTop">
        <span>&nbsp;处方类别：</span>
        <a-select default-value="全部" style="width: 12%" @change="handleChange">
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="西/成药处方">西/成药处方</a-select-option>
          <a-select-option value="中药处方">中药处方</a-select-option>
          <a-select-option value="检查项目">检查项目</a-select-option>
        </a-select>
        <span>&nbsp;模板权限：</span>
        <a-select default-value="全部" style="width: 12%" @change="handleChange">
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="私人模板">私人模板</a-select-option>
          <a-select-option value="公共模板">公共模板</a-select-option>
        </a-select>&nbsp;
        <a-input-search placeholder="模板编码/模板名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 35%" />
      </div>
      <div class="transferPrBottom">
        <a-table :scroll="{ y: 300 }" :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="false" :expandIconAsCell="false" :expandIconColumnIndex="9" :expandIcon="(props) => this.customExpandIcon(props)">
          >
          <a slot="operation">
            <a-divider type="vertical" />调用
          </a>
          <a-table slot="expandedRowRender" :columns="innerColumns" :data-source="innerData" :pagination="false"></a-table>
        </a-table>
      </div>
    </a-modal>

    <!--新增处方模板对话框-->
    <a-modal :centered="true" title="新增处方模板" width="850px" :visible="saveVisible" :confirm-loading="saveConfirmLoading" @ok="saveHandleOk" @cancel="saveHandleCancel">
      <template slot="footer">
        <a-button key="back" @click="saveHandleCancel">取消</a-button>
        <a-button class="saveBtn" key="submit" type="primary" :loading="saveConfirmLoading" @click="saveHandleOk">保存</a-button>
      </template>

      <a-form-model ref="saveRuleForm" :model="saveForm" :rules="saveRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="模板编号" prop="number">
              <a-input v-model="saveForm.number" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="创建人" prop="creator">
              <a-input v-model="saveForm.creator" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="模板名称" prop="name">
              <a-input v-model="saveForm.name" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="模板权限" prop="authority">
              <a-radio-group class="authority" v-model="saveForm.authority">
                <a-radio value="1">私人模板</a-radio>
                <a-radio value="2">公共模板</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="科室" prop="room">
              <a-select v-model="saveForm.room">
                <a-select-option value="全科">全科</a-select-option>
                <a-select-option value="儿科">儿科</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="处方类别" prop="types">
              <a-select v-model="saveForm.types">
                <a-select-option value="西药处方模板">西药处方模板</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="诊断" prop="diagnosis" :labelCol="{ span: 2 }" :wrapperCol="{ span: 22 }">
          <a-select v-model="saveForm.diagnosis" mode="tags" style="width: 100%" :token-separators="[',']" @change="handleChange">
            <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">{{ (i + 9).toString(36) + i }}</a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="模板说明" prop="description" :labelCol="{ span: 2 }" :wrapperCol="{ span: 22 }">
          <a-input v-model="saveForm.description" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <!--病历调用对话框-->
    <a-modal :centered="true" v-model="caseVisible" width="1050px" title="调用病历模板" :footer="null">
      <div class="transferPrTop">
        <a-select default-value="全部" style="width: 12%" @change="handleChange">
          <a-select-option value="全部">全部</a-select-option>
          <a-select-option value="私人模板">私人模板</a-select-option>
          <a-select-option value="公共模板">公共模板</a-select-option>
        </a-select>&nbsp;
        <a-input-search placeholder="模板编码/模板名称" enter-button @search="onSearch" @change="onChangeSearch" style="width: 35%" />
      </div>
      <div class="transferPrBottom">
        <a-table :scroll="{ y: 300 }" :columns="caseColumns" :data-source="caseData" class="components-table-demo-nested" :pagination="false" :expandIconAsCell="false" :expandIconColumnIndex="9" :expandIcon="(props) => this.customExpandIcon(props)">
          >
          <a slot="operation">
            <a-divider type="vertical" />调用
          </a>
          <p class="openDetails" slot="expandedRowRender" slot-scope="record" style="margin: 0">
            <span>检查所见：</span>
            <span style="color: #7b7b7b">{{ record.checkInfo }}</span>
            <br />
            <span>诊断意见：</span>
            <span style="color: #7b7b7b">{{ record.diagnosisInfo }}</span>
          </p>
        </a-table>
      </div>
    </a-modal>

    <!--新增病历模板对话框-->
    <a-modal :centered="true" title="新增病历模板" width="600px" :visible="saveCaseVisible" @ok="saveCaseHandleOk" @cancel="saveCaseHandleCancel">
      <template slot="footer">
        <a-button key="back" @click="saveCaseHandleCancel">取消</a-button>
        <a-button class="saveBtn" key="submit" type="primary" @click="saveCaseHandleOk">保存</a-button>
      </template>

      <a-form-model ref="saveRuleForm" :model="saveForm" :rules="saveRules" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="模板编号" prop="number">
              <a-input v-model="saveForm.number" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="创建人" prop="creator">
              <a-input v-model="saveForm.creator" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="模板名称" prop="name">
              <a-input v-model="saveForm.name" />
            </a-form-model-item>
          </a-col>

          <a-col :span="12">
            <a-form-model-item label="模板权限" prop="authority">
              <a-radio-group class="authority" v-model="saveForm.authority">
                <a-radio value="1">私人模板</a-radio>
                <a-radio value="2">公共模板</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="模板说明" prop="description" :labelCol="{ span: 3 }" :wrapperCol="{ span: 21 }">
          <a-input v-model="saveForm.description" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
// import options from '@/dist/data.js'
import moment from 'moment'
import conversation from '@/components/conversation'
import CallbyVideo from '@/components/CallbyVideo'
import { getUserSigbyOrder } from '@/api/chat'
import {
  getReceiveDiagnosis,
  getReceiveAdvice,
  getReceiveChief,
  searchPatient,
  saveReceiveRecords,
  getReceiveFinish,
  getQueryRegister,
  getWorkbenchReceive,
  getReceivePatientInfo,
  saveReceivePrescription,
  getRecipeInfo,
  getReceiveSickInfo,
} from '@/api/admission'
import { getSexList, getTreatTypes, getProvinceList, getCityList } from '@/api/common'
import { getPatientReceive } from '@/api/patient'

const columns = [
  {
    title: '序号',
    width: 45,
    customRender: (text, record, index) => `${index + 1}`,
  },
  { title: '模板编号', dataIndex: 'number', key: 'number', width: 80 },
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 120 },
  {
    title: '模板说明',
    dataIndex: 'description',
    key: 'description',
    width: 70,
    align: 'center',
  },
  { title: '处方类型', dataIndex: 'types', key: 'types', width: 90 },
  { title: '模板权限', dataIndex: 'authority', key: 'authority', width: 70 },
  { title: '诊断', dataIndex: 'diagnosis', key: 'diagnosis' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: '创建人员', dataIndex: 'creator', key: 'creator', width: 70 },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' },
  },
]

const data = []
for (let i = 0; i < 15; ++i) {
  data.push({
    key: i,
    number: 'RZ0000' + i,
    name: '处方模板名称' + i,
    description: '通用',
    types: '西/成药处方',
    authority: '私人模板',
    diagnosis: '心悸',
    createdAt: '2014-12-24 23:12:00',
    creator: '王冕',
  })
}

const caseColumns = [
  {
    title: '序号',
    width: 45,
    customRender: (text, record, index) => `${index + 1}`,
  },
  { title: '模板编号', dataIndex: 'number', key: 'number', width: 80 },
  { title: '模板名称', dataIndex: 'name', key: 'name', width: 120 },
  {
    title: '模板说明',
    dataIndex: 'description',
    key: 'description',
    width: 70,
    align: 'center',
  },
  { title: '处方类型', dataIndex: 'types', key: 'types', width: 90 },
  { title: '模板权限', dataIndex: 'authority', key: 'authority', width: 70 },
  { title: '诊断', dataIndex: 'diagnosis', key: 'diagnosis' },
  { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt', width: 140 },
  { title: '创建人员', dataIndex: 'creator', key: 'creator', width: 70 },
  {
    title: '操作',
    key: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' },
  },
]

const caseData = []
for (let i = 0; i < 15; ++i) {
  caseData.push({
    key: i,
    number: 'RZ0000' + i,
    name: '处方模板名称' + i,
    description: '通用',
    types: '西/成药处方',
    authority: '私人模板',
    diagnosis: '心悸',
    createdAt: '2014-12-24 23:12:00',
    creator: '王冕',
    checkInfo:
      '红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。',
    diagnosisInfo:
      '红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。红细胞计数4×1012/L，血红蛋白120g/L。白细胞计数5.7×109/L，中性57%，嗜酸10%，嗜碱2%，淋巴30%，单核1%。尿常规阴性，粪常规蛔虫卵++。趾间鳞屑及甲屑直接镜检可见大量真菌丝。',
  })
}

const innerColumns = [
  {
    title: '序号',
    customRender: (text, record, index) => `${index + 1}`,
    align: 'center',
  },
  { title: '组号', dataIndex: 'gradeNum', key: 'gradeNum' },
  { title: '药品名称', dataIndex: 'name', key: 'name' },
  { title: '单次用量', dataIndex: 'dosage', key: 'dosage' },
  { title: '用法', dataIndex: 'usage', key: 'usage' },
  { title: '频度', dataIndex: 'frequency', key: 'frequency' },
  { title: '天数', dataIndex: 'days', key: 'days' },
  { title: '数量', dataIndex: 'total', key: 'total' },
  { title: '单价', dataIndex: 'price', key: 'price' },
]

const innerData = []
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    gradeNum: '1',
    name: '头孢丙烯分散片',
    dosage: '1片',
    usage: '温水吞服',
    frequency: '一天三次',
    days: '2天',
    total: '6片',
    price: '6元',
  })
}

export default {
  name: 'Admission',
  inject: ['reloadCard'],
  components: {
    conversation,
    CallbyVideo,
  },
  props: {
    collapsed: Boolean,
  },
  data() {
    let validateIdCard = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value)) {
        this.inputIdCard(value.length)
        callback()
      } else if (value == '') {
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    }
    return {
      openChat: false,
      spinning: false,
      page: '',
      orderNo: '',
      outNo: '',
      outpatientNo: '',
      patientId: '',
      recipeOrderNo: '',
      regOrderNo: '',
      tabs: 'a',
      prtransfer: '处方调用',
      saveCaseVisible: false,
      caseVisible: false,
      saveVisible: false,
      saveConfirmLoading: false,
      iconLoadingConfirmInfo: false,
      prVisible: false,
      visible: false,
      moment,
      data,
      columns,
      innerColumns,
      innerData,
      caseColumns,
      caseData,
      save: '保存',
      end: '结束就诊',
      iconLoading1: false,
      iconLoading2: false,
      options: [],
      bottom: 15,
      defaultValue: 'year',
      // searchWords: '',
      // loadAll: [],
      dataSource: [],
      images: [
        'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
      ],
      sickInfo: {}, //就诊信息
      choseAddr: [],
      // choseAddrStr: '',
      // inputAddr: '',
      sexList: [],
      typesList: [],
      // provinceList: [],
      // cityListt: [],
      diagnosisList: [],
      adviceList: [],
      receiveTypeFlag: true,
      form: {
        patientId: '',
        patientName: '',
        patientCardNo: '',
        patientAge: '',
        patientSex: undefined,
        patientBirth: null,
        patientMobile: '',
        patientCertNo: '',
        patientAddr: '',
        provinceCode: '',
        cityCode: '',
        receiveTypeId: 400,
        visitType: '1',
      },
      rules: {
        patientName: [
          {
            required: true,
            message: '请输入患者姓名',
            trigger: 'change',
          },
        ],
        patientAge: [
          {
            required: true,
            message: '请输入患者年龄',
            trigger: 'blur',
          },
        ],
        patientSex: [
          {
            required: true,
            message: '请选择患者性别',
            trigger: 'change',
          },
        ],
        patientBirth: [
          {
            required: true,
            message: '请选择出生日期',
            trigger: 'change',
          },
        ],
        patientCertNo: [
          {
            required: true,
            validator: validateIdCard,
            message: '请输入正确身份证号码',
            trigger: 'change',
          },
        ],
        receiveTypeId: [
          {
            required: true,
            message: '请选择接诊类型',
            trigger: 'change',
          },
        ],
        visitType: [
          {
            required: true,
            message: '请选择初复诊',
            trigger: 'change',
          },
        ],
      },
      form2: {
        diagnosis: [],
        doctorAdvice: [],
      },
      rules2: {
        diagnosis: [
          {
            required: true,
            message: '请输入诊断',
            trigger: 'change',
          },
        ],
      },
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      other: '',
      saveForm: {
        number: 'MZ00001',
        creator: '李明',
        name: '',
        authority: '1',
        room: '全科',
        types: '西药处方模板',
        diagnosis: undefined,
        description: '',
      },
      saveRules: {
        name: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
      },
      caseFormInfo: {},
      recipeInfo: [],
      disabledBtn: true,
      videoVisible: false, // 视频对话
    }
  },
  created() {
    if (this.$route.name == 'CaseHistory') {
      this.tabs = 'b'
    }
    this.page = this.$route.params.page
    // 获取性别编码
    getSexList().then((res) => {
      this.sexList = res.data
    })
    // 获取接诊类型
    getTreatTypes().then((res) => {
      if (res.success) {
        this.typesList = res.data
      }
    })
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
    // 获取省市列表
    getProvinceList().then((res) => {
      if (res.success) {
        const list = res.data
        const option =
          list &&
          list.map((item) =>
            item.areaCode
              ? {
                  value: item.areaCode,
                  label: item.areaName,
                  isLeaf: false,
                }
              : ''
          )
        this.options = option
        // 获取省市列表之后再获取患者信息
        if (this.$route.params.patientId && this.$route.params.regOrderNo) {
          this.patientId = this.$route.params.patientId
          this.regOrderNo = this.$route.params.regOrderNo
          if (this.$route.params.outpatientNo) {
            this.outNo = this.$route.params.outpatientNo
          }
          // 从接诊工作台接诊
          this.getWorkbenchReceive()
        } else if (this.$route.params.patientId) {
          this.patientId = this.$route.params.patientId
          getPatientReceive(this.patientId).then((res) => {
            if (res.success) {
              let data = res.data
              this.form = data
              // 搜索患者
              this.searchPatient()
              if (data.provinceCode) {
                const list = this.options.filter((item) => item.value == data.provinceCode)
                this.loadData(list)
                this.choseAddr.push(data.provinceCode, data.cityCode)
              }
            }
          })
        } else if (this.$route.query.patientInfo) {
          if (typeof this.$route.query.patientInfo === 'object') {
            this.writeForm(this.$route.query.patientInfo).then((res) => {
              this.clickConfirmInfo()
            })
          } else {
            this.$route.query.patientInfo = null
          }
        }
      }
    })
  },
  methods: {
    // 处方数据
    recipe(val) {
      this.recipeInfo = val
    },
    // 病历数据
    caseForm(val) {
      this.caseFormInfo = val
    },
    // 搜索患者
    searchPatient() {
      searchPatient(this.form.patientName).then((res) => {
        if (res.success) {
          this.dataSource = res.data
        }
      })
    },
    // 接诊工作台进入获取数据
    getWorkbenchReceive() {
      getWorkbenchReceive(this.outNo, this.patientId, this.regOrderNo).then((res) => {
        if (res.success) {
          this.writeForm(res.data)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    // 填充表单
    writeForm(info) {
      let data = info.patient
      this.form = data
      this.receiveTypeFlag = info.patient.receiveTypeFlag
      // 搜索患者
      this.searchPatient()
      if (data.provinceCode) {
        const list = this.options.filter((item) => item.value == data.provinceCode)
        this.loadData(list)
        this.choseAddr.push(data.provinceCode, data.cityCode)
      }
      return Promise.resolve(/* 这里是需要返回的数据*/)
    },
    searchPatientChange(value) {
      this.searchPatient()
    },
    // 选择搜索到的患者
    selectPatient(value, option) {
      if (option.data.key == value) {
        this.form.patientName = option.componentOptions.propsData.title
        let data = this.dataSource.filter((item) => item.patientId == value)[0]
        this.form = data
        if (!data.receiveTypeId) {
          this.form.receiveTypeId = 400
        }
        if (!data.visitType) {
          this.form.visitType = '1'
        }
        if (data.provinceCode) {
          const list = this.options.filter((item) => item.value == data.provinceCode)
          this.loadData(list)
          this.choseAddr.push(data.provinceCode, data.cityCode)
        } else {
          this.choseAddr = []
        }
      }
    },
    // 身份证验证
    // patientCertNoBlur() {
    //   console.log('blur')
    //   searchPatient('').then((res) => {
    //     console.log(res, this.form.patientCertNo)
    //     let response = res.data
    //     let data = response.filter((item) => item.patientCertNo == this.form.patientCertNo)[0]
    //     console.log(data)
    //     if (data) {
    //       alert('数据库中已有此身份证信息，是否调用此信息？')
    //       if (!data.diagnosis) {
    //         data.diagnosis = undefined
    //       }
    //       if (!data.doctorAdvice) {
    //         data.doctorAdvice = undefined
    //       }
    //       if (data.patientSex == 1) {
    //         data.patientSex = '1'
    //       } else if (data.patientSex == 2) {
    //         data.patientSex = '2'
    //       } else {
    //         data.patientSex = '0'
    //       }
    //       this.form = data
    //       if (data.provinceCode) {
    //         const list = this.options.filter((item) => item.value == data.provinceCode)
    //         this.loadData(list)
    //         this.choseAddr.push(data.provinceCode, data.cityCode)
    //       } else {
    //         this.choseAddr = []
    //       }
    //     } else {
    //       console.log('222')
    //       getQueryRegister('').then((res) => {
    //         console.log(res)
    //         this.outpatientNo = res.outpatientNo
    //       })
    //     }
    //   })
    // },
    // 确定接诊
    clickConfirmInfo() {
      // this.regOrderNo = ''
      // this.disabledBtn = false
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.iconLoadingConfirmInfo = true
          this.spinning = true
          getReceivePatientInfo(this.form, this.regOrderNo).then((res) => {
            if (res.success) {
              this.outpatientNo = res.data.outpatientNo
              this.regOrderNo = res.data.regOrderNo
              this.disabledBtn = false
              this.iconLoadingConfirmInfo = false
              this.$message.success('提交成功！')
              getRecipeInfo(this.outpatientNo, this.patientId, this.regOrderNo).then((res) => {
                if (res.success && res.data) {
                  if (this.form.receiveTypeId === 200 || this.form.receiveTypeId === 300) {
                    getUserSigbyOrder(this.regOrderNo).then((res) => {
                      if (res.success) {
                        this.openChat = true
                        this.$refs.conversationChild.showDrawer(
                          res.data.fromAccount,
                          res.data.userSig,
                          res.data.toAccount
                        )
                      } else {
                        this.$message.warning(res.message)
                      }
                    })
                  }
                  if (!res.data.diagnosis) {
                    this.form2.diagnosis = undefined
                  } else {
                    this.form2.diagnosis = res.data.diagnosis
                  }
                  if (!res.data.doctorAdvice) {
                    this.form2.doctorAdvice = undefined
                  } else {
                    this.form2.doctorAdvice = res.data.doctorAdvice
                  }
                } else {
                  this.$message.warning('处方信息获取失败！')
                }
                this.spinning = false
              })
            } else {
              this.iconLoadingConfirmInfo = false
              this.spinning = false
              this.$message.warning(res.message)
            }
          })
        } else {
          this.$message.warning('请填写信息后再提交')
          return false
        }
      })
    },
    rdChange(e) {
      const value = e.target.value
      if (value == 'a') {
        this.prtransfer = '处方调用'
        this.tabs = 'a'
        this.$router.push({ path: '/home/admission/prescription' })
      } else {
        this.prtransfer = '病历调用'
        this.tabs = 'b'
        this.$router.push({ path: '/home/admission/caseHistory' })
      }
    },
    handleChange(value) {
      // console.log(`selected ${value}`)
    },
    disabledDate(current) {
      // Can not select days before today and today
      return current && current > moment().endOf('day')
    },
    // 修改生日获得年龄
    changeDate(dates, dateStrings) {
      this.form.patientBirth = dateStrings
      let duration = moment.duration(moment().diff(dateStrings))
      if (duration._data.years > 0) {
        this.defaultValue = 'year'
        this.form.patientAge = duration._data.years
      } else if (duration._data.years == 0 && duration._data.months > 0) {
        this.defaultValue = 'month'
        this.form.patientAge = duration._data.months
      } else if (
        duration._data.years == 0 &&
        duration._data.months == 0 &&
        duration._data.days > 0
      ) {
        this.defaultValue = 'day'
        this.form.patientAge = duration._data.days
      } else {
        this.form.patientAge = 0
      }
    },
    // 通过身份证号码判断生日和性别
    inputIdCard(value) {
      let idCard = this.form.patientCertNo
      let sex = null
      let birth = null
      // 当保存时不调用此方法
      if (!this.iconLoading1 && !this.iconLoadingConfirmInfo) {
        if (value === 18) {
          birth =
            idCard.substring(6, 10) +
            '-' +
            idCard.substring(10, 12) +
            '-' +
            idCard.substring(12, 14)
          sex = idCard.substring(16, 17)
          this.changeDate(value, birth)
        }
        if (value === 15) {
          birth =
            '19' +
            idCard.substring(6, 8) +
            '-' +
            idCard.substring(8, 10) +
            '-' +
            idCard.substring(10, 12)
          sex = idCard.substring(13, 14)
          this.changeDate(value, birth)
        }
        if (sex % 2 === 0) {
          sex = 2
        } else {
          sex = 1
        }
        this.form.patientSex = sex
      }
    },
    handleSelect(item) {
      // console.log(item)
    },
    saveLoading() {
      this.iconLoading1 = true
      this.save = '保存中'
      // this.iconLoading1 = false
      // this.save = '保存'
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$refs.ruleForm2.validate((valid) => {
            if (valid) {
              if (this.tabs == 'a') {
                saveReceivePrescription(
                  this.form2.diagnosis,
                  this.form2.doctorAdvice,
                  this.outpatientNo,
                  this.form,
                  this.recipeInfo,
                  this.regOrderNo
                )
                  .then((res) => {
                    if (res.success) {
                      this.iconLoading1 = false
                      this.save = '保存'
                      this.$message.success('保存处方成功')
                      this.$refs['childRules'].getRecipeInfo()
                    } else {
                      this.iconLoading1 = false
                      this.save = '保存'
                      this.$message.error(res.message)
                    }
                  })
                  .catch((err) => {
                    this.iconLoading1 = false
                    this.save = '保存'
                    this.$message.error('请求失败！')
                  })
              } else {
                let flag = this.$refs['childRules'].caseValidateForm()
                if (flag) {
                  saveReceiveRecords({
                    diagnosis: this.form2.diagnosis,
                    doctorAdvice: this.form2.doctorAdvice,
                    firstVisit: this.form.visitType,
                    medical: this.caseFormInfo.form,
                    outpatientNo: this.outpatientNo,
                    patient: this.form,
                    physique: this.caseFormInfo.physique,
                    recipeOrderNo: this.recipeOrderNo,
                    regOrderNo: this.regOrderNo,
                  })
                    .then((res) => {
                      if (res.success) {
                        this.iconLoading1 = false
                        this.save = '保存'
                        this.$message.success('保存病历成功')
                      } else {
                        this.iconLoading1 = false
                        this.save = '保存'
                        this.$message.error(res.message)
                      }
                    })
                    .catch((err) => {
                      this.iconLoading1 = false
                      this.save = '保存'
                      this.$message.error('请求失败！')
                    })
                } else {
                  this.iconLoading1 = false
                  this.save = '保存'
                  this.$message.warning('请填写信息后再保存')
                  return false
                }
              }
            } else {
              this.iconLoading1 = false
              this.save = '保存'
              this.$message.warning('请填写信息后再保存')
              return false
            }
          })
        } else {
          this.iconLoading1 = false
          this.save = '保存'
          this.$message.warning('请填写信息后再保存')
          return false
        }
      })
    },
    endLoading() {
      this.iconLoading2 = true
      this.end = '保存中'
      setTimeout(() => {
        this.iconLoading2 = false
        this.end = '结束就诊'
        this.$confirm({
          title: '结束确认',
          content: '确定要结束此次就诊吗？',
          centered: true,
          onOk: () => {
            getReceiveFinish(this.regOrderNo).then((res) => {
              if (res.success) {
                this.$message.success('结束就诊成功！')
                Object.assign(this.$route.params, {
                  patientId: '',
                  outpatientNo: '',
                  regOrderNo: '',
                })
                this.reloadCard()
              }
            })
          },
          onCancel: () => {},
        })
      }, 500)
    },
    // 图文资料对话框
    showModal() {
      this.visible = true
      getReceiveSickInfo(this.regOrderNo).then((res) => {
        this.sickInfo = res.data
        if (!res.success) {
          this.$message.warning(res.message)
        }
      })
    },
    showTalkModal() {},
    // 视频对话对话框
    showVideo() {
      this.videoVisible = true
    },
    videoHandleOk() {},
    videoCancel() {
      this.$refs.videoChild.leaveRoom()
    },
    showModalPr() {
      if (this.prtransfer == '处方调用') {
        this.prVisible = true
      } else {
        this.caseVisible = true
      }
    },
    handleOk(e) {
      this.visible = false
    },
    onChange(dates, dateStrings) {
      // console.log('From: ', dates[0], ', to: ', dates[1])
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    },
    handleChangeType(value) {
      this.form.receiveTypeId = value
    },
    onChangeAddr(dates, dateStrings) {
      if (dateStrings) {
        // this.choseAddrStr = dateStrings.map((item) => item.label).toString()
        this.form.provinceCode = dateStrings[0].value
        if (dateStrings.length > 1) {
          this.form.cityCode = dateStrings[1].value
        }
      }
    },
    loadData(selectedOptions) {
      // if (!selectedOptions) {
      const targetOption = selectedOptions[selectedOptions.length - 1]
      targetOption.loading = true

      // load options lazily
      getCityList(selectedOptions[0].value).then((res) => {
        targetOption.loading = false
        const list = res.data
        targetOption.children =
          list &&
          list.map((item) =>
            item.areaCode
              ? {
                  value: item.areaCode,
                  label: item.areaName,
                  isLeaf: true,
                }
              : ''
          )
        this.options = [...this.options]
      })
      // }
    },
    onInputAddr(e) {
      this.form.patientAddr = e.target.value
    },
    onSearch(value) {
      // console.log(value)
    },
    onChangeSearch(e) {
      // console.log(e.target.value)
    },
    customExpandIcon(props) {
      // if(props.record.children.length > 0){
      if (props.expanded) {
        return (
          <a
            style={{ marginRight: 20 }}
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            关闭详情
          </a>
        )
      } else {
        return (
          <a
            style={{ marginRight: 20 }}
            onClick={(e) => {
              props.onExpand(props.record, e)
            }}
          >
            查看详情
          </a>
        )
      }
    },
    showModalSave() {
      if (this.prtransfer == '处方调用') {
        this.saveVisible = true
      } else {
        this.saveCaseVisible = true
      }
    },
    saveHandleOk(e) {
      this.$refs.saveRuleForm.validate((valid) => {
        if (valid) {
          this.saveVisible = false
          this.$message.success('保存成功')
        } else {
          return false
        }
      })
    },
    saveHandleCancel(e) {
      this.saveVisible = false
      this.$refs.saveRuleForm.resetFields()
    },
    saveCaseHandleOk(e) {
      this.$refs.saveRuleForm.validate((valid) => {
        if (valid) {
          this.saveCaseVisible = false
          this.$message.success('保存成功')
        } else {
          return false
        }
      })
    },
    saveCaseHandleCancel(e) {
      this.saveCaseVisible = false
      this.$refs.saveRuleForm.resetFields()
    },
    goBack() {
      const page = this.page
      this.$router.push({ name: page })
    },
  },
  mounted() {
    this.searchPatient()
  },
}
</script>

<style lang="" scoped>
.admissionBox {
  position: relative;
  border-radius: 5px;
  width: 100%;
  margin: 0 auto !important;
  padding: 24px;
  background: #fff;
}
.ant-radio-button-wrapper {
  width: 80px;
  text-align: center;
}

.admissionBoxTop {
  display: flex;
  justify-content: space-between;
}
.ant-radio-button-wrapper {
  font-weight: bold;
}
.ant-radio-button-wrapper:hover {
  color: #656ee8;
}
.ant-radio-button-wrapper-checked {
  background-color: #656ee8 !important;
  border: 1px solid #656ee8 !important;
}
.ant-btn {
  font-weight: bold;
}
.ant-btn:hover {
  color: #ffffff;
  background-color: #656ee8;
  border: 1px solid #656ee8;
}
.admissionForm {
  display: flex;
  margin-top: 25px;
}
.ant-form-item {
  margin-bottom: 5px;
}
.confirmBtn {
  background-color: #656ee8;
  color: #ffffff;
  border: none !important;
}
.confirmBtn:hover {
  background-color: #9399e9;
}
.confirmBtn:focus {
  background-color: #656ee8;
  color: #ffffff;
}
.admissionBoxBottom {
  width: 100%;
  margin-left: -2%;
  height: 60px;
  background-color: #ffffff;
  position: fixed;
  bottom: 0;
  overflow: visible;
  z-index: 10;
}
.bottomsBox {
  width: 46%;
  padding: 0 30px;
  line-height: 60px;
  float: right;
}
.bottomsBox span {
  font-weight: bold;
  color: #383838;
  cursor: pointer;
}
.bottomsBox span:hover {
  color: #656ee8;
}
.saveBtn {
  color: #ffffff;
  background-color: #656ee8;
  border: none !important;
  margin-right: 15px;
}
.saveBtn:focus {
  color: #ffffff;
  background-color: #656ee8;
}
.endBtn {
  color: #ffffff;
  background-color: rgb(255, 199, 28);
  border: 1px solid rgb(255, 199, 28);
  border: none !important;
}
.endBtn:hover {
  color: #ffffff;
  background-color: rgb(255, 199, 28);
  border: 1px solid rgb(255, 199, 28);
}
.endBtn:focus {
  color: #ffffff;
  background-color: rgb(255, 199, 28);
  border: 1px solid rgb(255, 199, 28);
}
.prescriptionBox {
  color: #000000;
  margin-top: 20px;
  width: 100%;
  padding-bottom: 80px;
}
.picTitle {
  font-weight: bold;
}
.picTitle span {
  font-weight: 500;
  font-size: 12px;
}
.picDescription {
  padding-left: 30px;
}
.prPic {
  display: flex;
  /* justify-content: space-between; */
  flex-direction: row;
  flex-wrap: wrap;
}
.prPic img {
  max-width: 10%;
  /* height: ; */
  margin-right: 1%;
  margin-bottom: 10px;
}
.ant-divider {
  height: auto;
}
a {
  color: #656ee8;
}
.saveBtn {
  background-color: #656ee8;
}
.openDetails span {
  line-height: 28px;
}
.disabledBtn {
  background-color: #adadad;
}
.loadingPage {
  position: fixed;
  top: 0;
  left: 200px;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 9;
}
.collapsedLoading {
  left: 80px;
}
.loadingPage .loadingPic {
  position: absolute;
  top: 48%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.loadingPage .loadingText {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.formFlex {
  flex: 1;
}
.chatFlex {
  flex: 0;
}
.formContent {
  width: 60%;
  flex: 6;
}
.chatContent {
  width: 40%;
  flex: 4;
}
</style>