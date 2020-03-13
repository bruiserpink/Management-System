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
export function putEditCate(cateInfo) {
  return request ({
    url: `/categories/${cateInfo.cat_id}`,
    method: 'put',
    data: {
      cat_name: cateInfo.cat_name
    }
  })
}
