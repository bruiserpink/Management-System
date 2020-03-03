import {request} from "./request"

export function GetRolesMenuData() {
  return request({
    url: `/roles`,
  })
}
export function PutNewRoleInfo(addRoleInfo) {
  return request({
    url: '/roles',
    method: "post",
    data: addRoleInfo
  })
}
export function PutModifyRoleInfo(ModifyRoleInfo) {
  return request({
    url: `/roles/${ModifyRoleInfo.id}`,
    method: "put",
    data: {
      roleName: ModifyRoleInfo.roleName,
      roleDesc: ModifyRoleInfo.roleDesc
    }
  })
}
export function DeleteRoleInfo(DeleteRoleId) {
  return request({
    url: `/roles/${DeleteRoleId}`,
    method: 'delete'
  })
}
export function DeleteRoleRights(DeleteRoleId,DeleteRoleRights) {
  return request({
    url: `/roles/${DeleteRoleId}/rights/${DeleteRoleRights}`,
    method: 'delete'
  })
}
export function PutRoleRights(RoleId,rightsList) {
  return request({
    url: `/roles/${RoleId}/rights`,
    method: 'post',
    data: {
      rids: rightsList
    }
  })
}
