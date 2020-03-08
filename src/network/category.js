import {request} from "./request";

export function  getCategoriesMenuData(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}
export function  postNewCategoriesInfo(addCateForm) {
  return request({
    url: '/categories',
    data: addCateForm,
    method: 'post'
  })
}
