import {request} from "./request"

export function GetRightsMenuData(type) {
  return request({
    url: `/rights/${type}`,
  })
}
