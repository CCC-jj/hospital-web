import request from "@/utils/request";

// 用户登录
export function login(sign, timestamp, loginType, mobile, password) {
  return request({
    url: "union/login",
    method: "post",
    headers: { sign: sign, timestamp: timestamp },
    data: {
      loginType: loginType,
      mobile: mobile,
      password: password
    }
  });
}

// 获取医生关联医院
export function loginHospitalList() {
  return request({
    url: "login/hospital/list",
    method: "post"
  });
}

// 确定关联医院
export function loginHospitalConfirm(orgCode, proCode) {
  return request({
    url: "login/hospital/confirm",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orgCode: orgCode,
      proCode: proCode
    }
  });
}

// 获取验证码
export function getCode(mobile, proCode) {
  return request({
    url: "login/send",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      mobile: mobile,
      proCode: proCode
    }
  });
}

// 找回密码
export function retrievePassword(mobile, code, password, serialNumber) {
  return request({
    url: "login/retrieve",
    method: "post",
    data: {
      code: code,
      mobile: mobile,
      password: password,
      serialNumber: serialNumber
    }
  });
}

// 退出登录
export function logout() {
  return request({
    url: "union/logout",
    method: "get"
    // headers: { "Content-Type": "x-www-form-urlencoded" },
  });
}
