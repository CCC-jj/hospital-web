import request from "@/utils/request";

// 修改密码
export function changePwd(oldPwd, newPwd) {
  return request({
    url: "setting/change/password",
    method: "post",
    data: {
      newPassword: newPwd,
      oldPassword: oldPwd
    }
  });
}

// 操作日志
export function getOperateLog(params) {
  return request({
    url: "setting/query/operate_log",
    method: "post",
    data: params
  });
}

export function deleteOperateLog(logId) {
  return request({
    url: "setting/delete/operate_log/{logId}",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      logId: logId
    }
  });
}

export function getOperator() {
  return request({
    url: "setting/query/operator",
    method: "post"
  });
}

// 查看操作日志
export function getLogDetail(logId) {
  return request({
    url: "setting/log/detail",
    method: "get",
    headers: { "Content-Type": "x-www-form-urlencoded" },
    params: {
      logId: logId
    }
  });
}
