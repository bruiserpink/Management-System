import Vue from 'vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//模块组件
import {Form,FormItem,Input,Button} from "element-ui"
//全局挂载在Vue实例上的组件
import {Message} from "element-ui"

//模块组件实例化
Vue.use(Element)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)

//挂载全局组件
Vue.prototype.$message = Message
