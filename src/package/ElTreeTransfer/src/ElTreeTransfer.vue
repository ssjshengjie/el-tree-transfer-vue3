
  <template>
  <div class="mint-transfer transfer" :style="{ width, height }">
    <!-- 穿梭框 左侧 -->
    <div class="transfer-left">
      <div class="transfer-left-title">
        <el-checkbox
          v-model="fromChekAll"
          :indeterminate="isFromIndeterminate"
          @change="fromHandleCheckAllChange"
        />
        <span>{{ $props.from_title || '' }}</span>
      </div>
      <!-- 左侧内容区 -->
      <div class="transfer-left-content">
        <el-scrollbar height="100%">
          <el-input
            class="transfer-input"
            v-model="fromFilterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
          <el-tree
            style="padding-left: 10px;"
            :data="$props.from_data"
            :props="$props.defaultProps"
            show-checkbox
            :node-key="$props.node_key"
            current-node-key="current"
            ref="fromtree"
            @check="fromCheck"
            :filter-node-method="fromFilterNode"
            @node-click="fromHandleNodeClick"
          />
        </el-scrollbar>
      </div>
    </div>
    <div class="transfer-button">
      <div class="transfer-button-add">
        <el-button
          size="small"
          type="primary"
          :disabled="checkAllFromDataCache.length > 0 ? false : true"
          @click="add"
        >{{ "添加" }}</el-button>
      </div>
      <div class="transfer-button-remove">
        <el-button
          size="small"
          type="primary"
          :disabled="checkAllToDataCache.length > 0 ? false : true"
          @click="remove"
        >{{ "移除" }}</el-button>
      </div>
    </div>
    <!-- 穿梭框 右侧 -->
    <div class="transfer-right">
      <div class="transfer-right-title">
        <el-checkbox
          v-model="toChekAll"
          :indeterminate="isToIndeterminate"
          @change="toHandleCheckAllChange"
        />
        <span>{{ $props.to_title || '' }}</span>
      </div>
      <!-- 右侧内容区 -->
      <div class="transfer-right-content">
        <el-scrollbar height="100%">
          <el-input
            class="transfer-input"
            v-model="toFilterText"
            placeholder="输入关键字进行过滤"
            clearable
          />
          <el-tree
            style="padding-left: 10px;"
            :data="$props.to_data"
            :props="$props.defaultProps"
            show-checkbox
            :node-key="$props.node_key"
            ref="totree"
            @check="toCheck"
            :filter-node-method="toFilterNode"
            @node-click="toHandleNodeClick"
          />
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { props } from './props'
import { convertTreeData, deepClone, spanningTree, filterPid, dynamicDeletion } from './utils'
export default defineComponent({
  name:'el-tree-transfer',
  props,
  setup(props, { emit }) {
    //fromtree节点
    const fromtree = ref()
    //totree节点
    const totree = ref()
    //过滤的值
    const fromFilterText = ref('')
    const toFilterText = ref('')
    //全选存储值
    const checkAllFromDataCache: any = ref([])
    const checkAllToDataCache: any = ref([])
    //全选或者半选
    const isFromIndeterminate = ref(false)
    const isToIndeterminate = ref(false)
    const fromChekAll = ref(false)
    const toChekAll = ref(false)
    //添加
    const add = () => {
      //是否全选
      if (fromChekAll.value) {
        emit('addBtn', [])
        emit('removeBtn', spanningTree(props.from_data, props.to_data))
      } else {
        // emit('removeBtn', spanningTree(checkAllFromDataCache.value, props.to_data))
        /** 
         * 1） 如果 右侧数据 没有 左测 数据 的 父节点 需要添加  父节点 
         * 2）如果有父节点 就把左侧的数据children 放到 右侧数据相同父节点id 下的children 下
         * 
        */
        // 第一步 合并 左右侧 数据 扁平化 处理 并且 去重
        const renderData: any[] = spanningTree(deepClone(checkAllFromDataCache.value), convertTreeData(deepClone(props.to_data)))
        //左侧添加数据
        emit('removeBtn', renderData)
        console.log(renderData)
        // 第二  删除 右侧 数据  克隆 扁平化   但是如果 删除玩所有children 父节点 无法删除
        const remData = dynamicDeletion(convertTreeData(deepClone(props.from_data)), convertTreeData(deepClone(checkAllFromDataCache.value)))
        let res: any[] = []
        remData.filter((item) => {
          return item.children == null || !item.children ? void (0) : res.push(item)
        })
        emit('addBtn', res)
      }
      checkAllFromDataCache.value = []
    }
    //删除
    const remove = () => {
      //是否全选
      if (toChekAll.value) {
        emit('removeBtn', [])
        emit('addBtn', spanningTree(props.from_data, props.to_data))
      } else {
        // alert(2)
        // emit('addBtn', spanningTree(checkAllToDataCache.value, props.from_data))
        const renderData: any[] = spanningTree(deepClone(checkAllToDataCache.value), convertTreeData(deepClone(props.from_data)))
        //左侧添加数据
        emit('addBtn', renderData)
        console.log(renderData)
        // 第二  删除 右侧 数据  克隆 扁平化   但是如果 删除玩所有children 父节点 无法删除
        const remData = dynamicDeletion(convertTreeData(deepClone(props.to_data)), convertTreeData(deepClone(checkAllToDataCache.value)))
        let res: any[] = []
        remData.filter((item) => {
          return item.children == null || !item.children ? void (0) : res.push(item)
        })
        emit('removeBtn', res)
      }
      checkAllToDataCache.value = []
    }
    const fromHandleNodeClick = (data: any) => {
      console.log(data)
    }
    const toHandleNodeClick = (data: any) => {
      console.log(data)
    }
    //fromdata 全选
    const fromHandleCheckAllChange = (val: boolean) => {
      if (val) {
        fromtree.value.setCheckedNodes(props.from_data)
        const key = fromtree.value.getCheckedNodes()
        const arr = filterPid(deepClone(key), 0)
        checkAllFromDataCache.value = convertTreeData(arr)
      } else {
        fromtree.value.setCheckedNodes([])
        const key = fromtree.value.getCheckedNodes()
        checkAllFromDataCache.value = key
      }
    }
    //todata 全选
    const toHandleCheckAllChange = (val: boolean) => {
      if (val) {
        totree.value.setCheckedNodes(props.to_data)
        const key = totree.value.getCheckedNodes()
        const arr = filterPid(deepClone(key), 0)
        checkAllToDataCache.value = arr
      } else {
        totree.value.setCheckedNodes([])
        const key = totree.value.getCheckedNodes()
        checkAllToDataCache.value = key
      }
    }
    // 树节点点击 节点选择
    const fromCheck = () => {
      const key = fromtree.value.getCheckedNodes(false, true)
      //克隆防止改变源数据 由于 getCheckedNodes 设置 第二参数 true 会 自动获取父节点 及所有children 需要过滤一波 | 也可以 扁平化之后再过滤
      const arr = filterPid(deepClone(key), 0)
      //为了方便 遍历 和 对比差异 扁平化 转成一维数组 好循环 查找 
      checkAllFromDataCache.value = convertTreeData(arr)
      console.error(checkAllFromDataCache.value)
    }
    const toCheck = () => {
      const key = totree.value.getCheckedNodes(false, true)
      const arr = filterPid(deepClone(key), 0)
      checkAllToDataCache.value = convertTreeData(arr)
    }
    // 树节点过滤
    const fromFilterNode = (value: any, data: { label: string | any[] }) => {
      console.log(value, data)
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
    const toFilterNode = (value: any, data: { label: string | any[] }) => {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
    watch(() => checkAllFromDataCache.value, () => {
      //全部转换为一维数组 进行 length 对比
      const fromData = convertTreeData(deepClone(props.from_data))
      const checkAllData = deepClone(checkAllFromDataCache.value)
      // 全选
      if (fromData.length === checkAllData.length) {
        fromChekAll.value = true
        isFromIndeterminate.value = false
      }
      // 半选
      if (checkAllData.length > 0 && fromData.length > checkAllData.length) {
        isFromIndeterminate.value = true
      }
      //为0时 全false
      if (checkAllData.length === 0) {
        fromChekAll.value = false
        isFromIndeterminate.value = false
      }
    })
    watch(() => checkAllToDataCache.value, () => {
      //全部转换为一维数组 进行 length 对比
      const toData = convertTreeData(deepClone(props.to_data))
      const checkAllData = deepClone(checkAllToDataCache.value)
      // 全选
      if (toData.length === checkAllData.length) {
        toChekAll.value = true
        isToIndeterminate.value = false
      }
      // 半选
      if (checkAllData.length > 0 && toData.length > checkAllData.length) {
        isToIndeterminate.value = true
      }
      if (checkAllData.length === 0) {
        isToIndeterminate.value = false
        toChekAll.value = false
      }
    })
    watch(() => fromFilterText.value, (newValue) => {
      fromtree.value.filter(newValue)
    })
    watch(() => toFilterText.value, (newValue) => {
      totree.value.filter(newValue)
    })
    return {
      fromChekAll,
      toChekAll,
      fromtree,
      totree,
      fromFilterText,
      toFilterText,
      isFromIndeterminate,
      isToIndeterminate,
      checkAllFromDataCache,
      checkAllToDataCache,
      fromCheck,
      toCheck,
      add,
      remove,
      fromHandleCheckAllChange,
      toHandleCheckAllChange,
      fromHandleNodeClick,
      toHandleNodeClick,
      fromFilterNode,
      toFilterNode,
    }
  },
})
</script>

<style lang="scss">
.mint-transfer {
  width: 100%;
  height: 100%;
  display: flex;
  // border: 1px solid #ebeef5;
  .transfer-left,
  .transfer-right {
    flex: 1;
  }
  .transfer-button {
    flex-basis: 100px;
    width: 100%;
    height: 100%;
  }
  .transfer-left,
  .transfer-right {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #ebeef5;
    .transfer-left-title,
    .transfer-right-title {
      background: #f5f7fa;
      padding-left: 15px;
      border-bottom: 1px solid #ebeef5;
      span {
        padding-left: 15px;
        font-size: 15px;
        color: black;
        font-weight: 400;
      }
    }
    .transfer-left-content,
    .transfer-right-content {
      height: 100%;
      width: 100%;
      background: #ffffff;
      .transfer-input {
        padding: 10px;
      }
      .el-scrollbar__wrap {
        .el-scrollbar__view {
          height: 100%;
        }
      }
      .el-tree {
        height: 100%;
      }
    }
  }
  .transfer-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .transfer-button-add {
      margin-bottom: 5px;
    }
    .transfer-button-remove {
      margin-top: 5px;
    }
  }
}
</style>