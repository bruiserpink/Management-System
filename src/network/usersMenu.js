import {request} from "./request"

export function getUsersMenuData(queryInfo) {
  return request({
    url: "/users",
    params: queryInfo,
  })
}
export function PutUserState(userInfo) {
  return request({
    url: `/users/${userInfo.id}/state/${userInfo.mg_state}`,
    method: "put"
  })
}
export function PutNewUserInfo(addUserInfo) {
  return request({
    url: '/users',
    method: "post",
    data: addUserInfo
  })
}
export function PutModifyUserInfo(ModifyUserInfo) {
  return request({
    url: `/users/${ModifyUserInfo.id}`,
    method: "put",
    data: {
      email: ModifyUserInfo.email,
      mobile: ModifyUserInfo.mobile
    }
  })
}
export function DeleteUserInfo(DeleteUserId) {
  return request({
    url: `/users/${DeleteUserId}`,
    method: 'delete'
  })
}
export function GetRolesList() {
  return request({
    url: '/roles'
  })
}
export function PutNewRole(userId,roleId) {
  return request({
    url: `/users/${userId}/role`,
    method: 'put',
    data: {
      rid: roleId
    }
  })
}

