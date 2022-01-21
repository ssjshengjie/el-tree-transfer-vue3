<template>
  <div class="text-tree-transfer">
    <!-- <ElTreeTransferCom
      width="800px"
      height="500px"
      from_title="测试"
      to_title="到测试"
      v-model:from_data="fromData"
      v-model:to_data="toData"
      @addBtn="addBtn"
      @removeBtn="removeBtn"
    />-->
    <ElTreeTransfer />
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import ElTreeTransferCom from './package/ElTreeTransfer/index'
import { ElTreeTransfer } from './package/ElTreeTransferV2/index'
// import 'el-tree-transfer-vue3/dist/style.css'
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



