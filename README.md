# el-tree-transfer-vue3

## 简介
现在 还是 个人测试版
el-tree-fransfer-vue3 是一个基于 VUE3 和 elementPlus 的树形穿梭框组件，使用前请确认已经引入[element-plus](https://element-plus.org/zh-CN/guide/installation.html)！
此组件功能类似于`element-plus`的[transfer](https://element-plus.org/zh-CN/component/transfer.html)组件，但是里面的数据是树形结构！
实际上，el-tree-transfer 依赖的 element-plus 组件分别是[Checkbox 多选框](https://element-plus.org/zh-CN/component/checkbox.html)，[Button 按钮](https://element-plus.org/zh-CN/component/button.html)，和最主要的[Tree 树形控件](https://element-plus.org/zh-CN/component/tree.html)写成！参考了借鉴 vue2 版本`el-tree-transfer`(https://www.npmjs.com/package/el-tree-transfer)

## 快速上手

> 先 npm 下载插件

`npm install el-tree-transfer-vue3 --save`

或

`npm i el-tree-transfer-vue3 -S`

> 然后你可以像使用普通组件一样使用 el-tree-transfer

```js
   <template>
  <div class="text-tree-transfer">
    <ElTreeTransferCom
      width="800px"
      height="500px"
      from_title="测试"
      to_title="到测试"
      v-model:from_data="fromData"
      v-model:to_data="toData"
      @addBtn="addBtn"
      @removeBtn="removeBtn"
    />
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import ElTreeTransferCom from 'el-tree-transfer-vue3'
import 'el-tree-transfer-vue3/dist/style.css'
import { transferData } from './data'
const fromData = ref(transferData.ruleInfo.diff)
const toData = ref(transferData.ruleInfo.auth)
const addBtn = (v: any) => {
  // console.error(v)
  fromData.value = v
}
const removeBtn = (v: any) => {
  // console.error("to", v)
  toData.value = v
}
</script>

<style lang="scss">
</style>
```
###
目前 还不是很完善
## 文档

| 序号 | 参数                                                    | 说明                                                                         | 类型                                   | 默认值                                                                                                                                                                                                                                                                                                                                                                                                  | 补充                                                                                                                                                                                                                               |
| ---- | ------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- | ----------------------------------------- |
| 1    | width                                                   | 宽度                                                                         | String                                 | 100%                                                                                                                                                                                                                                                                                                                                                                                                    | 建议在外部盒子设定宽度和位置                                                                                                                                                                                                       |
| 2    | height                                                  | 高度                                                                         | String                                 | 320px                                                                                                                                                                                                                                                                                                                                                                                                   | -                                                                                                                                                                                                                                  |
| 3    | from_title                                                   | 标题                                                                         | String                                 | ["源列表", "]                                                                                                                                                                                                                                                                                                                                                                                  | -                                                                                                                                                                                                                                  |
| 4    |to_title                                      | 标题                                                                     | String                                 | -     目标列表"                                                                                                                                                                                                                                                                                                                                                                                                 | -                                                                                                                                                                                                                                  |
| 5    | from_data                                               | 源数据                                                                       | Array                                  | -                                                                                                                                                                                                                                                                                                                                                                                                       | 数据格式同 element-ui tree 组件，但必须有 id 和 pid                                                                                                                                                                                |
| 6    | to_data                                                 | 目标数据                                                                     | Array                                  | -                                                                                                                                                                                                                                                                                                                                                                                                       | 数据格式同 element-ui tree 组件，但必须有 id 和 pid                                                                                                                                                                                |
| 7    | defaultProps                                            | 配置项-同 el-tree 中 props                                                   | Object                                 | { label: "label", children: "children", isLeaf: "leaf", disable: "disable" }                                                                                                                                                                                                                                                                                                                            | 用法和 el-tree 的 props 一样                                                                                                                                                                                                       |
| 8    | node_key                                                | 自定义 node-key 的值，默认为 id                                              | String                                 | id                                                                                                                                                                                                                                                                                                                                                                                                      | 必须与 treedata 数据内的 id 参数名一致，必须唯一                                                                                                                                                                                   
