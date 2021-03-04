import Vue from "vue";
import Router from "vue-router";

import User from "@/views/user/index";
import Login from "@/views/user/login";
import ForgetPwd from "@/views/user/forgetPwd";
import Home from "@/views/home/index";
import ChangePwd from "@/views/account/changePwd";
import Notification from "@/views/account/Notification";
import OperationLog from "@/views/account/OperationLog";
import WorkPlace from "@/views/workplace/index";
import ManagePatient from "@/views/manage/managePatient";
import Business from "@/views/business/index";
import Admission from "@/views/admission/Admission";
import Prescription from "@/views/admission/Prescription";
import CaseHistory from "@/views/admission/CaseHistory";

import CheckWorkplace from "@/views/workplace/checkWorkplace";
import ReportReview from "@/views/workplace/list/ReportReview";
// import Western from "@/views/admission/list/Western";
// import Traditional from "@/views/admission/list/Traditional";
// import CheckItem from "@/views/admission/list/CheckItem";

import ManageCharge from "@/views/manage/manageCharge";
import ToCharge from "@/views/manage/charge/ToCharge";
import Charged from "@/views/manage/charge/Charged";
import Refunded from "@/views/manage/charge/Refunded";
import Patient from "@/views/manage/Patient/index";
import PatientInfo from "@/views/manage/Patient/PatientInfo";
import PatientRecord from "@/views/manage/Patient/PatientRecord";
import Charge from "@/views/manage/charge/index";
import ChargedDetails from "@/views/manage/charge/details/ChargedDetails";
import RefundDetails from "@/views/manage/charge/details/RefundDetails";
import RefundedDetails from "@/views/manage/charge/details/RefundedDetails";

import DosingBeforeCheck from "@/views/workplace/list/DosingBeforeCheck";
import DiagnoseReport from "@/views/workplace/list/DiagnoseReport";

import DrugInfoSet from "@/views/manage/projectDrugs/DrugInfoSet";
import ProjectSet from "@/views/manage/projectDrugs/ProjectSet";

import StatisticalReport from "@/views/StatisticalReport/index";
import DoctorPerformance from "@/views/StatisticalReport/DoctorPerformance";

import Maintain from "@/views/setting/maintain/index";
import Advice from "@/views/setting/maintain/advice";
import AuxiliaryCheck from "@/views/setting/maintain/auxiliaryCheck";
import Complaint from "@/views/setting/maintain/complaint";
import Diagnosis from "@/views/setting/maintain/diagnosis";
import HistoryAllergy from "@/views/setting/maintain/historyAllergy";
import HistoryIllness from "@/views/setting/maintain/historyIllness";
import HistoryPerson from "@/views/setting/maintain/historyPerson";
import PersonOpinion from "@/views/setting/maintain/personOpinion";
import PresentIllness from "@/views/setting/maintain/presentIllness";

import Template from "@/views/setting/template/index";
import MedicalList from "@/views/setting/template/list/Medical";
import PrescriptionList from "@/views/setting/template/list/Prescription";
import ReportList from "@/views/setting/template/list/Report";
import NewMedicalRecordTemplate from "@/views/setting/template/list/newTemplate/medicalRecord/index";
import NewWesternTemplate from "@/views/setting/template/list/newTemplate/prescription/Western";
import NewChineseTemplate from "@/views/setting/template/list/newTemplate/prescription/Chinese";
import NewCheckItemTemplate from "@/views/setting/template/list/newTemplate/prescription/CheckItem";
import NewReportTemplate from "@/views/setting/template/list/newTemplate/report/index";

import StaffManage from '@/views/setting/staffManage/index'
import StaffList from '@/views/setting/staffManage/list/StaffList'
import DepartmentList from '@/views/setting/staffManage/list/DepartmentList'
import RoleList from '@/views/setting/staffManage/list/RoleList'
import StaffInfo from '@/views/setting/staffManage/list/add/StaffInfo'
import DepartmentInfo from '@/views/setting/staffManage/list/add/DepartmentInfo'
import RoleInfo from '@/views/setting/staffManage/list/add/RoleInfo'
import OutPatient from '@/views/setting/outPatient/index'


Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      // name: 'User',
      component: User,
      redirect: "/login",
      children: [
        {
          path: "/login",
          name: "Login",
          component: Login
        },
        {
          path: "/forgetpwd",
          name: "ForgetPwd",
          component: ForgetPwd
        }
      ]
    },
    {
      path: "/home",
      // name: 'Home',
      component: Home,
      redirect: "/home/workPlace",
      children: [
        {
          path: "/home/changePwd",
          name: "ChangePwd",
          component: ChangePwd,
          meta: { title: "修改密码", key: "15", path: "ChangePwd" }
        },
        {
          path: "/home/notification",
          name: "Notification",
          component: Notification,
          meta: { title: "消息通知", key: "16", path: "Notification" }
        },
        {
          path: "/home/operationLog",
          name: "OperationLog",
          component: OperationLog,
          meta: { title: "操作日志", key: "17", path: "OperationLog" }
        },
        // {
        //   path: "/home/business",
        //   name: "Business",
        //   component: Business,
        //   meta: { title: "经营概况", key: "1" }
        // },
        {
          path: "/home/workPlace",
          name: "WorkPlace",
          component: WorkPlace,
          meta: { title: "接诊工作台", key: "2", path: "WorkPlace" }
        },
        {
          path: "/home/manageCharge",
          name: "ManageCharge",
          component: ManageCharge,
          redirect: "/home/manageCharge/toCharge",
          meta: { title: "收费管理", key: "4", path: "ManageCharge" },
          children: [
            {
              path: "/home/manageCharge/toCharge",
              name: "ToCharge",
              component: ToCharge,
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            },
            {
              path: "/home/manageCharge/charged",
              name: "Charged",
              component: Charged,
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            },
            {
              path: "/home/manageCharge/refunded",
              name: "Refunded",
              component: Refunded,
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            }
          ]
        },
        {
          path: "/home/manageCharge/charge",
          name: "Charge",
          component: Charge,
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/chargedDetails",
          name: "ChargedDetails",
          component: ChargedDetails,
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/refundDetails",
          name: "RefundDetails",
          component: RefundDetails,
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/refundedDetails",
          name: "RefundedDetails",
          component: RefundedDetails,
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/managePatient",
          name: "ManagePatient",
          component: ManagePatient,
          meta: { title: "患者管理", key: "6", path: "ManagePatient" }
        },
        {
          path: "/home/patient",
          name: "Patient",
          component: Patient,
          redirect: "/home/patient/patientInfo",
          meta: { title: "患者管理", key: "6", path: "ManagePatient" },
          children: [
            {
              path: "/home/patient/patientInfo",
              name: "PatientInfo",
              component: PatientInfo,
              meta: { title: "患者管理", key: "6", path: "ManagePatient" }
            },
            {
              path: "/home/patient/patientRecord",
              name: "PatientRecord",
              component: PatientRecord,
              meta: { title: "患者管理", key: "6", path: "ManagePatient" }
            }
          ]
        },
        {
          path: "/home/checkWorkplace",
          name: "CheckWorkplace",
          component: CheckWorkplace,
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/dosingBeforeCheck",
          name: "DosingBeforeCheck",
          component: DosingBeforeCheck,
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/diagnoseReport",
          name: "DiagnoseReport",
          component: DiagnoseReport,
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/reportReview",
          name: "ReportReview",
          component: ReportReview,
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/admission",
          name: "Admission",
          component: Admission,
          redirect: "/home/admission/prescription",
          meta: { title: "新开就诊", key: "3", path: "Admission" },
          children: [
            {
              path: "/home/admission/prescription",
              name: "Prescription",
              component: Prescription,
              // redirect: "/home/admission/prescription",
              meta: { title: "新开就诊", key: "3", path: "Admission" }
              // children: [
              //   {
              //     path: "/home/admission/prescription/western",
              //     name: "Western",
              //     component: Western,
              //     meta: { title: "新开就诊", key: "3" }
              //   },
              //   {
              //     path: "/home/admission/prescription/traditional",
              //     name: "Traditional",
              //     component: Traditional,
              //     meta: { title: "新开就诊", key: "3" }
              //   },
              //   {
              //     path: "/home/admission/prescription/checkitem",
              //     name: "CheckItem",
              //     component: CheckItem,
              //     meta: { title: "新开就诊", key: "3" }
              //   }
              // ]
            },
            {
              path: "/home/admission/caseHistory",
              name: "CaseHistory",
              component: CaseHistory,
              meta: { title: "新开就诊", key: "3", path: "Admission" }
            }
          ]
        },
        {
          path: "/home/drugInfoSet",
          name: "DrugInfoSet",
          component: DrugInfoSet,
          meta: { title: "药品信息设置", key: "8", path: "DrugInfoSet" }
        },
        {
          path: "/home/projectSet",
          name: "ProjectSet",
          component: ProjectSet,
          meta: { title: "检查项目设置", key: "9", path: "ProjectSet" }
        },
        {
          path: "/home/statisticalReport",
          name: "StatisticalReport",
          component: StatisticalReport,
          meta: { title: "医生业绩统计", key: "11", path: "StatisticalReport" },
          redirect: "/home/doctorPerformance",
          children: [
            {
              path: "/home/doctorPerformance",
              name: "DoctorPerformance",
              component: DoctorPerformance,
              meta: {
                title: "医生业绩统计",
                key: "11",
                path: "StatisticalReport"
              }
            }
          ]
        },
        {
          path: "/home/maintain",
          name: "Maintain",
          component: Maintain,
          meta: { title: "病历信息维护", key: "13", path: "Maintain" },
          redirect: "/home/maintain/diagnosis",
          children: [
            {
              path: "/home/maintain/advice",
              name: "Advice",
              component: Advice,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/auxiliaryCheck",
              name: "AuxiliaryCheck",
              component: AuxiliaryCheck,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/complaint",
              name: "Complaint",
              component: Complaint,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/diagnosis",
              name: "Diagnosis",
              component: Diagnosis,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyAllergy",
              name: "HistoryAllergy",
              component: HistoryAllergy,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyIllness",
              name: "HistoryIllness",
              component: HistoryIllness,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyPerson",
              name: "HistoryPerson",
              component: HistoryPerson,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/personOpinion",
              name: "PersonOpinion",
              component: PersonOpinion,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/presentIllness",
              name: "PresentIllness",
              component: PresentIllness,
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            }
          ]
        },
        {
          path: "/home/template",
          name: "Template",
          component: Template,
          meta: { title: "模板维护", key: "14", path: "Template" },
          redirect: "/home/template/medicalList",
          children: [
            {
              path: "/home/template/medicalList",
              name: "MedicalList",
              component: MedicalList,
              meta: { title: "模板维护", key: "14", path: "Template" }
            },
            {
              path: "/home/template/prescriptionList",
              name: "PrescriptionList",
              component: PrescriptionList,
              meta: { title: "模板维护", key: "14", path: "Template" }
            },
            {
              path: "/home/template/reportList",
              name: "ReportList",
              component: ReportList,
              meta: { title: "模板维护", key: "14", path: "Template" }
            }
          ]
        },
        {
          path: "/home/template/newMedicalRecordTemplate",
          name: "NewMedicalRecordTemplate",
          component: NewMedicalRecordTemplate,
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newWesternTemplate",
          name: "NewWesternTemplate",
          component: NewWesternTemplate,
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newChineseTemplate",
          name: "NewChineseTemplate",
          component: NewChineseTemplate,
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newCheckItemTemplate",
          name: "NewCheckItemTemplate",
          component: NewCheckItemTemplate,
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newReportTemplate",
          name: "NewReportTemplate",
          component: NewReportTemplate,
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/staffManage",
          name: "StaffManage",
          component: StaffManage,
          meta: { title: "员工管理", key: "18", path: "StaffManage" },
          redirect: "/home/staffManage/staffList",
          children: [
            {
              path: "/home/staffManage/staffList",
              name: "StaffList",
              component: StaffList,
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            },
            {
              path: "/home/staffManage/departmentList",
              name: "DepartmentList",
              component: DepartmentList,
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            },
            {
              path: "/home/staffManage/roleList",
              name: "RoleList",
              component: RoleList,
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            }
          ]
        },
        {
          path: "/home/staffManage/staffInfo",
          name: "StaffInfo",
          component: StaffInfo,
          meta: { title: "员工管理", key: "18", path: "StaffManage" },
        },
        {
          path: "/home/staffManage/departmentInfo",
          name: "DepartmentInfo",
          component: DepartmentInfo,
          meta: { title: "员工管理", key: "18", path: "StaffManage" },
        },
        {
          path: "/home/staffManage/roleInfo",
          name: "RoleInfo",
          component: RoleInfo,
          meta: { title: "员工管理", key: "18", path: "StaffManage" },
        },
        {
          path: "/home/setting/outPatient",
          name: "OutPatient",
          component: OutPatient,
          meta: { title: "出诊设置", key: "19", path: "OutPatient" },
        }
      ]
    }
  ]
});
