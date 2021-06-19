import request from "@/utils/request";

// 获取工作台列表
export function getWorkplaceList(params) {
  return request({
    url: "treat/workbench/info",
    method: "post",
    data: params
  });
}

// 工作台去接诊
export function getWorkbenchReceive(outpatientNo, patientId, regOrderNo) {
  return request({
    url: "treat/workbench/receive",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      outpatientNo: outpatientNo,
      patientId: patientId,
      regOrderNo: regOrderNo
    }
  });
}

// 就诊信息
export function getReceiveSickInfo(orderNo) {
  return request({
    url: "treat/receive/sick/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orderNo: orderNo
    }
  });
}

// 获取诊断
export function getReceiveDiagnosis() {
  return request({
    url: "treat/receive/diagnosis",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}
// 获取医嘱
export function getReceiveAdvice() {
  return request({
    url: "treat/receive/advice",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}
// 获取主诉
export function getReceiveChief() {
  return request({
    url: "treat/receive/chief",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}
// 搜索患者
export function searchPatient(words) {
  return request({
    url: "treat/receive/search",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      words: words
    }
  });
}

// 选定患者订单信息
export function getQueryRegister(patientId) {
  return request({
    url: "treat/receive/query/register",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId
    }
  });
}

// 接诊患者信息
export function getReceivePatientInfo(patient, regOrderNo) {
  return request({
    url: "treat/receive/patient/info",
    method: "post",
    data: {
      patient: patient,
      regOrderNo: regOrderNo
    }
  });
}

// 获取病历信息
export function getRecordsInfo(outpatientNo, patientId, regOrderNo) {
  return request({
    url: "treat/receive/records/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      outpatientNo: outpatientNo,
      patientId: patientId,
      regOrderNo: regOrderNo
    }
  });
}

// 获取处方信息
export function getRecipeInfo(outpatientNo, patientId, regOrderNo) {
  return request({
    url: "treat/receive/recipe/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      outpatientNo: outpatientNo,
      patientId: patientId,
      regOrderNo: regOrderNo
    }
  });
}

// 删除处方明细
export function deleteRecipeItem(recipeItemId) {
  return request({
    url: "treat/receive/recipe/item/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      recipeItemId: recipeItemId
    }
  });
}

// 删除处方
export function deleteReceiveRecipe(recipeId) {
  return request({
    url: "treat/receive/recipe/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      recipeId: recipeId
    }
  });
}

// 暂存处方
export function tSaveReceivePrescription(
  outpatientNo,
  patient,
  recipe,
  regOrderNo
) {
  return request({
    url: "treat/receive/prescription/temporary/save",
    method: "post",
    data: {
      outpatientNo: outpatientNo,
      patient: patient,
      recipe: recipe,
      regOrderNo: regOrderNo
    }
  });
}

// 保存处方
export function saveReceivePrescription(
  outpatientNo,
  patient,
  recipe,
  regOrderNo
) {
  return request({
    url: "treat/receive/prescription/save",
    method: "post",
    data: {
      outpatientNo: outpatientNo,
      patient: patient,
      recipe: recipe,
      regOrderNo: regOrderNo
    }
  });
}

// 保存病历
export function saveReceiveRecords(params) {
  return request({
    url: "treat/receive/records/save",
    method: "post",
    data: params
  });
}

// 结束就诊
export function getReceiveFinish(regOrderNo) {
  return request({
    url: "treat/receive/finish",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      regOrderNo: regOrderNo
    }
  });
}

// 药品-检查搜索
export function getReceiveDrugList(params) {
  return request({
    url: "treat/receive/drug/search",
    method: "post",
    data: params
  });
}

// 检查工作台
export function getWorkbenchInfo(params) {
  return request({
    url: "examine/workbench/info",
    method: "post",
    data: params
  });
}

// 预约信息
export function examineAppointmentInfo(recordId) {
  return request({
    url: "examine/appointment/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      recordId: recordId
    }
  });
}

// 预约检查
export function examineAppointment(params) {
  return request({
    url: "examine/appointment/make",
    method: "post",
    data: params
  });
}

// 获取检查查验类型
export function getBeforeCheckType() {
  return request({
    url: "examine/before/check/type",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}

// 获取检前查验记录
export function getBeforeCheckList(recordId) {
  return request({
    url: "examine/before/check/list",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      recordId: recordId
    }
  });
}

// 添加检前查验记录
export function addBeforeCheck(items, recordId) {
  return request({
    url: "examine/before/check/add",
    method: "post",
    data: {
      items: items,
      recordId: recordId
    }
  });
}

// 删除检前查验记录
export function deleteBeforeCheck(id, recordId) {
  return request({
    url: "examine/before/check/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id,
      recordId: recordId
    }
  });
}

// 查询患者检前给药信息
export function getBeforeDrugInfo(patientId, recordId) {
  return request({
    url: "examine/before/drug/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId,
      recordId: recordId
    }
  });
}

// 获取检前给药方式类型
export function getBeforeDrugType(params) {
  return request({
    url: "examine/before/drug/type",
    method: "post",
    data: params
  });
}

// 保存患者检前给药信息
export function saveBeforeDrugInfo(params) {
  return request({
    url: "examine/before/drug/save",
    method: "post",
    data: params
  });
}

// 获取患者基础信息
export function getPatientInfo(patientId) {
  return request({
    url: "examine/patient/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId
    }
  });
}

// 获取医生基础信息
export function getDoctorInfo() {
  return request({
    url: "examine/doctor/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}

// 查看诊断报告信息
export function getExamineReportInfo(patientId, recordId) {
  return request({
    url: "examine/report/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId,
      recordId: recordId
    }
  });
}

// 保存诊断报告信息
export function saveExamineReportInfo(params) {
  return request({
    url: "examine/report/save",
    method: "post",
    data: params
  });
}

// 查看诊断报告审核信息
export function getExamineAuditInfo(patientId, recordId) {
  return request({
    url: "examine/audit/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId,
      recordId: recordId
    }
  });
}

// 保存诊断报告审核信息
export function saveExamineAudit(params) {
  return request({
    url: "examine/audit/save",
    method: "post",
    data: params
  });
}
