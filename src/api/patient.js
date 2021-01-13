import request from "@/utils/request";

// 患者列表
export function getPatientList(params) {
  return request({
    url: "patient/index",
    method: "post",
    data: params
  });
}

// 接诊患者
export function getPatientReceive(patientId) {
  return request({
    url: "patient/receive",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId
    }
  });
}

// 查看患者
export function getPatientInfo(patientId) {
  return request({
    url: "patient/info",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      patientId: patientId
    }
  });
}

// 编辑患者
export function changePatientInfo(params) {
  return request({
    url: "patient/info/change",
    method: "post",
    data: params
  });
}

// 删除患者
export function deletePatient(patientId) {
  return request({
    url: "patient/delete",
    method: "get",
    params: {
      patientId: patientId
    }
  });
}

// 患者电子病历列表
export function getPatientRmrList(patientId) {
  return request({
    url: "patient/emr/list",
    method: "get",
    params: {
      patientId: patientId
    }
  });
}

// 患者电子病历详细
export function getPatientRmrDetail(recordId) {
  return request({
    url: "patient/emr/detail",
    method: "get",
    params: {
      recordId: recordId
    }
  });
}