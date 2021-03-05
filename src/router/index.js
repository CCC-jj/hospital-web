import Vue from "vue";
import Router from "vue-router";

import User from "@/views/user/index";
import Login from "@/views/user/login";
import Home from "@/views/home/index";
import WorkPlace from "@/views/workplace/index";
// import Western from "@/views/admission/list/Western";
// import Traditional from "@/views/admission/list/Traditional";
// import CheckItem from "@/views/admission/list/CheckItem";

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/user",
      // name: 'User',
      component: User,
      redirect: "/user/login",
      children: [
        {
          path: "/user/login",
          name: "Login",
          component: Login
        },
        {
          path: "/user/forgetpwd",
          name: "ForgetPwd",
          component: () => import("../views/user/forgetPwd")
        }
      ]
    },
    {
      path: "/",
      // name: 'Home',
      component: Home,
      redirect: "/home/workPlace",
      children: [
        {
          path: "/home/changePwd",
          name: "ChangePwd",
          component: () => import("../views/account/changePwd"),
          meta: { title: "修改密码", key: "15", path: "ChangePwd" }
        },
        {
          path: "/home/notification",
          name: "Notification",
          component: () => import("../views/account/Notification"),
          meta: { title: "消息通知", key: "16", path: "Notification" }
        },
        {
          path: "/home/operationLog",
          name: "OperationLog",
          component: () => import("../views/account/OperationLog"),
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
          component: () => import("../views/manage/manageCharge"),
          redirect: "/home/manageCharge/toCharge",
          meta: { title: "收费管理", key: "4", path: "ManageCharge" },
          children: [
            {
              path: "/home/manageCharge/toCharge",
              name: "ToCharge",
              component: () => import("../views/manage/charge/ToCharge"),
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            },
            {
              path: "/home/manageCharge/charged",
              name: "Charged",
              component: () => import("../views/manage/charge/Charged"),
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            },
            {
              path: "/home/manageCharge/refunded",
              name: "Refunded",
              component: () => import("../views/manage/charge/Refunded"),
              meta: { title: "收费管理", key: "4", path: "ManageCharge" }
            }
          ]
        },
        {
          path: "/home/manageCharge/charge",
          name: "Charge",
          component: () => import("../views/manage/charge/index"),
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/chargedDetails",
          name: "ChargedDetails",
          component: () =>
            import("../views/manage/charge/details/ChargedDetails"),
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/refundDetails",
          name: "RefundDetails",
          component: () =>
            import("../views/manage/charge/details/RefundDetails"),
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/manageCharge/refundedDetails",
          name: "RefundedDetails",
          component: () =>
            import("../views/manage/charge/details/RefundedDetails"),
          meta: { title: "收费管理", key: "4", path: "ManageCharge" }
        },
        {
          path: "/home/managePatient",
          name: "ManagePatient",
          component: () => import("../views/manage/managePatient"),
          meta: { title: "患者管理", key: "6", path: "ManagePatient" }
        },
        {
          path: "/home/patient",
          name: "Patient",
          component: () => import("../views/manage/Patient/index"),
          redirect: "/home/patient/patientInfo",
          meta: { title: "患者管理", key: "6", path: "ManagePatient" },
          children: [
            {
              path: "/home/patient/patientInfo",
              name: "PatientInfo",
              component: () => import("../views/manage/Patient/PatientInfo"),
              meta: { title: "患者管理", key: "6", path: "ManagePatient" }
            },
            {
              path: "/home/patient/patientRecord",
              name: "PatientRecord",
              component: () => import("../views/manage/Patient/PatientRecord"),
              meta: { title: "患者管理", key: "6", path: "ManagePatient" }
            }
          ]
        },
        {
          path: "/home/checkWorkplace",
          name: "CheckWorkplace",
          component: () => import("../views/workplace/checkWorkplace"),
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/dosingBeforeCheck",
          name: "DosingBeforeCheck",
          component: () => import("../views/workplace/list/DosingBeforeCheck"),
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/diagnoseReport",
          name: "DiagnoseReport",
          component: () => import("../views/workplace/list/DiagnoseReport"),
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/checkWorkplace/reportReview",
          name: "ReportReview",
          component: () => import("../views/workplace/list/ReportReview"),
          meta: { title: "检查工作台", key: "5", path: "CheckWorkplace" }
        },
        {
          path: "/home/admission",
          name: "Admission",
          component: () => import("../views/admission/Admission"),
          redirect: "/home/admission/prescription",
          meta: { title: "新开就诊", key: "3", path: "Admission" },
          children: [
            {
              path: "/home/admission/prescription",
              name: "Prescription",
              component: () => import("../views/admission/Prescription"),
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
              component: () => import("../views/admission/CaseHistory"),
              meta: { title: "新开就诊", key: "3", path: "Admission" }
            }
          ]
        },
        {
          path: "/home/drugInfoSet",
          name: "DrugInfoSet",
          component: () => import("../views/manage/projectDrugs/DrugInfoSet"),
          meta: { title: "药品信息设置", key: "8", path: "DrugInfoSet" }
        },
        {
          path: "/home/projectSet",
          name: "ProjectSet",
          component: () => import("../views/manage/projectDrugs/ProjectSet"),
          meta: { title: "检查项目设置", key: "9", path: "ProjectSet" }
        },
        {
          path: "/home/statisticalReport",
          name: "StatisticalReport",
          component: () => import("../views/StatisticalReport/index"),
          meta: { title: "医生业绩统计", key: "11", path: "StatisticalReport" },
          redirect: "/home/doctorPerformance",
          children: [
            {
              path: "/home/doctorPerformance",
              name: "DoctorPerformance",
              component: () =>
                import("../views/StatisticalReport/DoctorPerformance"),
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
          component: () => import("../views/setting/maintain/index"),
          meta: { title: "病历信息维护", key: "13", path: "Maintain" },
          redirect: "/home/maintain/diagnosis",
          children: [
            {
              path: "/home/maintain/advice",
              name: "Advice",
              component: () => import("../views/setting/maintain/advice"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/auxiliaryCheck",
              name: "AuxiliaryCheck",
              component: () =>
                import("../views/setting/maintain/auxiliaryCheck"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/complaint",
              name: "Complaint",
              component: () => import("../views/setting/maintain/complaint"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/diagnosis",
              name: "Diagnosis",
              component: () => import("../views/setting/maintain/diagnosis"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyAllergy",
              name: "HistoryAllergy",
              component: () =>
                import("../views/setting/maintain/historyAllergy"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyIllness",
              name: "HistoryIllness",
              component: () =>
                import("../views/setting/maintain/historyIllness"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/historyPerson",
              name: "HistoryPerson",
              component: () =>
                import("../views/setting/maintain/historyPerson"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/personOpinion",
              name: "PersonOpinion",
              component: () =>
                import("../views/setting/maintain/personOpinion"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            },
            {
              path: "/home/maintain/presentIllness",
              name: "PresentIllness",
              component: () =>
                import("../views/setting/maintain/presentIllness"),
              meta: { title: "病历信息维护", key: "13", path: "Maintain" }
            }
          ]
        },
        {
          path: "/home/template",
          name: "Template",
          component: () => import("../views/setting/template/index"),
          meta: { title: "模板维护", key: "14", path: "Template" },
          redirect: "/home/template/medicalList",
          children: [
            {
              path: "/home/template/medicalList",
              name: "MedicalList",
              component: () => import("../views/setting/template/list/Medical"),
              meta: { title: "模板维护", key: "14", path: "Template" }
            },
            {
              path: "/home/template/prescriptionList",
              name: "PrescriptionList",
              component: () =>
                import("../views/setting/template/list/Prescription"),
              meta: { title: "模板维护", key: "14", path: "Template" }
            },
            {
              path: "/home/template/reportList",
              name: "ReportList",
              component: () => import("../views/setting/template/list/Report"),
              meta: { title: "模板维护", key: "14", path: "Template" }
            }
          ]
        },
        {
          path: "/home/template/newMedicalRecordTemplate",
          name: "NewMedicalRecordTemplate",
          component: () =>
            import(
              "../views/setting/template/list/newTemplate/medicalRecord/index"
            ),
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newWesternTemplate",
          name: "NewWesternTemplate",
          component: () =>
            import(
              "../views/setting/template/list/newTemplate/prescription/Western"
            ),
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newChineseTemplate",
          name: "NewChineseTemplate",
          component: () =>
            import(
              "../views/setting/template/list/newTemplate/prescription/Chinese"
            ),
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newCheckItemTemplate",
          name: "NewCheckItemTemplate",
          component: () =>
            import(
              "../views/setting/template/list/newTemplate/prescription/CheckItem"
            ),
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/template/newReportTemplate",
          name: "NewReportTemplate",
          component: () =>
            import("../views/setting/template/list/newTemplate/report/index"),
          meta: { title: "模板维护", key: "14", path: "Template" }
        },
        {
          path: "/home/staffManage",
          name: "StaffManage",
          component: () => import("../views/setting/staffManage/index"),
          meta: { title: "员工管理", key: "18", path: "StaffManage" },
          redirect: "/home/staffManage/staffList",
          children: [
            {
              path: "/home/staffManage/staffList",
              name: "StaffList",
              component: () =>
                import("../views/setting/staffManage/list/StaffList"),
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            },
            {
              path: "/home/staffManage/departmentList",
              name: "DepartmentList",
              component: () =>
                import("../views/setting/staffManage/list/DepartmentList"),
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            },
            {
              path: "/home/staffManage/roleList",
              name: "RoleList",
              component: () =>
                import("../views/setting/staffManage/list/RoleList"),
              meta: { title: "员工管理", key: "18", path: "StaffManage" }
            }
          ]
        },
        {
          path: "/home/staffManage/staffInfo",
          name: "StaffInfo",
          component: () =>
            import("../views/setting/staffManage/list/add/StaffInfo"),
          meta: { title: "员工管理", key: "18", path: "StaffManage" }
        },
        {
          path: "/home/staffManage/departmentInfo",
          name: "DepartmentInfo",
          component: () =>
            import("../views/setting/staffManage/list/add/DepartmentInfo"),
          meta: { title: "员工管理", key: "18", path: "StaffManage" }
        },
        {
          path: "/home/staffManage/roleInfo",
          name: "RoleInfo",
          component: () =>
            import("../views/setting/staffManage/list/add/RoleInfo"),
          meta: { title: "员工管理", key: "18", path: "StaffManage" }
        },
        {
          path: "/home/setting/outPatient",
          name: "OutPatient",
          component: () => import("../views/setting/outPatient/index"),
          meta: { title: "出诊设置", key: "19", path: "OutPatient" }
        },
        {
          path: "/home/setting/outPatient/deploy",
          name: "Deploy",
          component: () => import("../views/setting/outPatient/Deploy.vue"),
          meta: { title: "出诊设置", key: "19", path: "OutPatient" }
        }
      ]
    }
  ]
});
