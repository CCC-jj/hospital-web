import request from "@/utils/request";

// 用户登录
export function login(mobile, password, orgCode, proCode) {
  return request({
    url: "login/index",
    method: "post",
    data: {
      mobile: mobile,
      password: password,
      orgCode: orgCode,
      proCode: proCode
    }
  });
}

// 项目医院列表
export function loginHospital(orgCode) {
  return request({
    url: "login/hospital",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      orgCode: orgCode
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
    url: "logout",
    method: "get"
    // headers: { "Content-Type": "x-www-form-urlencoded" },
  });
}
