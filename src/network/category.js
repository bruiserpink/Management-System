import {request} from "./request";

export function  getCategoriesMenuData(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}
export function  postNewCategories(addCateForm) {
  return request({
    url: '/categories',
    data: addCateForm,
    method: 'post'
  })
}
export function  deleteCategory(cateId) {
  return request({
    url: `/categories/${cateId}`,
    method: 'delete'
  })
}
