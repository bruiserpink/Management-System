import {request} from "./request"
export function getMenuData() {
  return request({
    url: "/menus",
  })
}
