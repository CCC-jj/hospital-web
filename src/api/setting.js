import request from "@/utils/request";

// 新增诊断信息
export function addDiagnosisList(content) {
  return request({
    url: "setting/maintain/diagnosis/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 查询诊断信息
export function getDiagnosisList(params) {
  return request({
    url: "setting/maintain/diagnosis/list",
    method: "post",
    data: params
  });
}

// 编辑诊断信息
export function editDiagnosisList(params) {
  return request({
    url: "setting/maintain/diagnosis/edit",
    method: "post",
    data: params
  });
}

// 删除诊断信息
export function deleteDiagnosisList(id) {
  return request({
    url: "setting/maintain/diagnosis/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 新增医嘱信息
export function addAdviceList(content) {
  return request({
    url: "setting/maintain/advice/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 查询医嘱信息
export function getAdviceList(params) {
  return request({
    url: "setting/maintain/advice/list",
    method: "post",
    data: params
  });
}

// 编辑医嘱信息
export function editAdviceList(params) {
  return request({
    url: "setting/maintain/advice/edit",
    method: "post",
    data: params
  });
}

// 删除医嘱信息
export function deleteAdviceList(id) {
  return request({
    url: "setting/maintain/advice/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 获取主诉分类
export function getComplaintTypes() {
  return request({
    url: "setting/maintain/complaint/getTypes",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}

// 新增主诉信息
export function addComplaintList(chiefType, content) {
  return request({
    url: "setting/maintain/complaint/add",
    method: "post",
    data: {
      chiefType: chiefType,
      content: content
    }
  });
}

// 查询主诉信息
export function getComplaintList(params) {
  return request({
    url: "setting/maintain/complaint/list",
    method: "post",
    data: params
  });
}

// 编辑主诉信息
export function editComplaintList(params) {
  return request({
    url: "setting/maintain/complaint/edit",
    method: "post",
    data: params
  });
}

// 删除主诉信息
export function deleteComplaintList(id) {
  return request({
    url: "setting/maintain/complaint/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 查询现病史
export function getP_illnessList(params) {
  return request({
    url: "setting/maintain/p_illness/search",
    method: "post",
    data: params
  });
}

// 新增现病史
export function addP_illnessList(content) {
  return request({
    url: "setting/maintain/p_illness/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 编辑现病史
export function editP_illnessList(params) {
  return request({
    url: "setting/maintain/p_illness/edit",
    method: "post",
    data: params
  });
}

// 删除现病史
export function deleteP_illnessList(id) {
  return request({
    url: "setting/maintain/p_illness/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 查询既往史
export function getH_illnessList(params) {
  return request({
    url: "setting/maintain/h_illness/search",
    method: "post",
    data: params
  });
}

// 新增既往史
export function addH_illnessList(content) {
  return request({
    url: "setting/maintain/h_illness/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 编辑既往史
export function editH_illnessList(params) {
  return request({
    url: "setting/maintain/h_illness/edit",
    method: "post",
    data: params
  });
}

// 删除既往史
export function deleteH_illnessList(id) {
  return request({
    url: "setting/maintain/h_illness/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 查询过敏史
export function getAllergyList(params) {
  return request({
    url: "setting/maintain/allergy/search",
    method: "post",
    data: params
  });
}

// 新增过敏史
export function addAllergyList(content) {
  return request({
    url: "setting/maintain/allergy/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 编辑过敏史
export function editAllergyList(params) {
  return request({
    url: "setting/maintain/allergy/edit",
    method: "post",
    data: params
  });
}

// 删除过敏史
export function deleteAllergyList(id) {
  return request({
    url: "setting/maintain/allergy/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 查询辅助检查
export function getCheckList(params) {
  return request({
    url: "setting/maintain/check/search",
    method: "post",
    data: params
  });
}

// 新增辅助检查
export function addCheckList(content) {
  return request({
    url: "setting/maintain/check/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 编辑辅助检查
export function editCheckList(params) {
  return request({
    url: "setting/maintain/check/edit",
    method: "post",
    data: params
  });
}

// 删除辅助检查
export function deleteCheckList(id) {
  return request({
    url: "setting/maintain/check/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 查询治疗意见
export function getTreatmentList(params) {
  return request({
    url: "setting/maintain/treatment/search",
    method: "post",
    data: params
  });
}

// 新增治疗意见
export function addTreatmentList(content) {
  return request({
    url: "setting/maintain/treatment/add",
    method: "post",
    data: {
      content: content
    }
  });
}

// 编辑治疗意见
export function editTreatmentList(params) {
  return request({
    url: "setting/maintain/treatment/edit",
    method: "post",
    data: params
  });
}

// 删除治疗意见
export function deleteTreatmentList(id) {
  return request({
    url: "setting/maintain/treatment/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      id: id
    }
  });
}

// 员工管理

// 搜索查询员工列表
export function getEmployDoctorList(params) {
  return request({
    url: "setting/employ/doctor/list",
    method: "post",
    data: params
  });
}

// 修改员工状态
export function getDoctorStatus(params) {
  return request({
    url: "setting/employ/doctor/status",
    method: "post",
    data: params
  });
}

// 获取科室列表
export function getDoctorDepartmentList(params) {
  return request({
    url: "setting/employ/doctor/department",
    method: "post",
    data: params
  });
}

// 获取角色列表
export function getDoctorTitleList(searchWord) {
  return request({
    url: "setting/employ/doctor/title",
    method: "post",
    data: {
      searchWord: searchWord
    }
  });
}

// 搜索查询职称列表
export function getDoctorRoleList(params) {
  return request({
    url: "setting/employ/doctor/role",
    method: "post",
    data: params
  });
}

// 创建新员工信息
export function createDoctor(params) {
  return request({
    url: "setting/employ/doctor/create",
    method: "post",
    data: params
  });
}

// 修改员工信息
export function modifyDoctor(params) {
  return request({
    url: "setting/employ/doctor/modify",
    method: "post",
    data: params
  });
}

// 删除员工
export function deleteDoctor(code) {
  return request({
    url: "setting/employ/doctor/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      code: code
    }
  });
}

// 搜索查询科室列表
export function getDepartmentList(params) {
  return request({
    url: "setting/employ/department/list",
    method: "post",
    data: params
  });
}

// 修改科室状态
export function getDepartmentStatus(params) {
  return request({
    url: "setting/employ/department/status",
    method: "post",
    data: params
  });
}

// 创建新科室信息
export function createDepartment(params) {
  return request({
    url: "setting/employ/department/create",
    method: "post",
    data: params
  });
}

// 修改科室信息
export function modifyDepartment(params) {
  return request({
    url: "setting/employ/department/modify",
    method: "post",
    data: params
  });
}

// 删除科室
export function deleteDepartment(code) {
  return request({
    url: "setting/employ/department/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      code: code
    }
  });
}

// 搜索查询角色列表
export function getRoleList(params) {
  return request({
    url: "setting/employ/role/list",
    method: "post",
    data: params
  });
}

// 修改角色状态
export function getRoleStatus(params) {
  return request({
    url: "setting/employ/role/status",
    method: "post",
    data: params
  });
}

// 创建新角色信息
export function createRole(params) {
  return request({
    url: "setting/employ/role/create",
    method: "post",
    data: params
  });
}

// 修改角色信息
export function modifyRole(params) {
  return request({
    url: "setting/employ/role/modify",
    method: "post",
    data: params
  });
}

// 删除角色
export function deleteRole(code) {
  return request({
    url: "setting/employ/role/delete",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      code: code
    }
  });
}

// 获取问诊服务设置信息
export function getOutAbility() {
  return request({
    url: "setting/out-call/get/ability",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" }
  });
}

// 问诊状态设置
export function getOutEnable(consStatus, consType) {
  return request({
    url: "setting/out-call/enable",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      consStatus: consStatus,
      consType: consType
    }
  });
}

// 获取问诊详细配置信息
export function getOutConfiguration(consType) {
  return request({
    url: "setting/out-call/get/configuration",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      consType: consType
    }
  });
}

// 设置问诊详细配置信息
export function setOutAbility(params) {
  return request({
    url: "setting/out-call/set/ability",
    method: "post",
    data: params
  });
}
