<template>
  <div class="text-tree-transfer">
    <ElTreeTransfer width="800px" height="500px" from_title="测试" to_title="到测试" v-model:from_data="fromData"
      v-model:to_data="toData" @addBtn="addBtn" @removeBtn="removeBtn" />
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
//@ts-ignore
import ElTreeTransfer from 'el-tree-transfer-vue3'
import { transferData } from './data'
const fromData = ref(transferData.ruleInfo.diff)
const toData = ref(transferData.ruleInfo.auth)
const addBtn = (v: any) => {
  fromData.value = v
}
const removeBtn = (v: any) => {
  toData.value = v
}
</script>

<style lang="scss">
</style>



