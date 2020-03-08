import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
//模块组件
import {
  Form, FormItem, Input, Button, Menu, Submenu, MenuItem, Aside,
  Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch,
  Tooltip, Pagination, Dialog, Tag, Tree, Scrollbar, Select,Option,Cascader,
  Alert,TabPane,Tabs} from "element-ui"
//全局挂载在Vue实例上的组件
import {Message,MessageBox} from "element-ui"
const ELCpnList = [Form,FormItem,Input,Button,Menu,Submenu,MenuItem,Aside,
  Breadcrumb,BreadcrumbItem,Card,Row,Col,Table,TableColumn,Switch,
  Tooltip,Pagination,Dialog,Tag,Tree,Scrollbar,Select,Option,Cascader,Alert,
  TabPane,Tabs]
//模块组件实例化,
ELCpnList.some((item) => {
  Vue.use(item);
})
//挂载全局组件
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
