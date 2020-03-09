import {request} from "./request";

//获取商品分类数据的方法
export function getGoodsCateData(queryInfo) {
  return request({
    url: '/categories',
    params: queryInfo
  })
}
//根据商品分类id获取商品分类参数的方法
export function getCateAttributes(cateId,sel) {
  return request({
    url: `/categories/${cateId}/attributes`,
    params: {sel: sel}
  })
}
//根据商品分类id发送新的参数到分类的方法
export function putCateAttributes(cateId,addAttributesInfo) {
  return request({
    url: `/categories/${cateId}/attributes`,
    method: 'post',
    data: addAttributesInfo
  })
}
//根据商品分类id和参数id获取对应参数的信息
export function getCateAttributesInfo(cateId,attrId,attr_sel) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    params: {attr_sel: attr_sel}
  })
}
//提交编辑修改后的参数信息
export function putCateAttributesInfo(cateId,attrId,putInfo) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    method: 'put',
    data: putInfo
  })
}
//删除参数的方法
export function deleteCateAttributes(cateId,attrId) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    method: 'delete',
  })
}
//提交修改后的参数属性的方法
export function putNewAttrInfo(cateId,attrId,putInfo) {
  return request({
    url: `/categories/${cateId}/attributes/${attrId}`,
    method: 'put',
    data: putInfo
  })
}
