import {
  ElButton,
  ElCheckbox,
  ElInput,
  ElScrollbar,
  ElTree,
} from "element-plus";
import { defineComponent, watch, ref } from "vue";
import {
  convertTreeData,
  deepClone,
  spanningTree,
  filterPid,
  dynamicDeletion,
} from "./utils";
import "./styles/index.scss";
// props
export const ElTreeTransferProps = {
  width: {
    type: String,
    default: "100%",
  },
  height: {
    type: String,
    default: "320px",
  },
  from_title: {
    type: String,
  },
  to_title: {
    type: String,
  },
  from_data: {
    type: Array,
    default: [],
  },
  to_data: {
    type: Array,
    default: [],
  },
  defaultProps: {
    type: Object,
    default: () => {
      return { label: "label", children: "children" };
    },
  },
  node_key: {
    type: String,
    default: "id",
  },
} as const;
const Props = {
  ...ElTreeTransferProps,
};
export default defineComponent({
  name: "ElTreeTransfer",
  props: Props,
  setup(props, { emit }) {
    // ----------------------- variable
    //Fromtree node
    const fromtree = ref();
    //Totree node
    const totree = ref();
    //Filtered values
    const fromFilterText = ref<string>();
    const toFilterText = ref<string>();
    //Select all stored values
    const checkAllFromDataCache = ref<any>([]);
    const checkAllToDataCache = ref<any>([]);
    //Select all or half
    const isFromIndeterminate = ref<boolean>(false);
    const isToIndeterminate = ref<boolean>(false);
    const fromChekAll = ref<boolean>(false);
    const toChekAll = ref<boolean>(false);
    //-------funtion
    //Add
    const add = () => {
      // Select all
      if (fromChekAll.value) {
        emit("addBtn", []);
        emit("removeBtn", spanningTree(props.from_data, props.to_data));
      } else {
        // emit('removeBtn', spanningTree(checkAllFromDataCache.value, props.to_data))
        /**
         *1) if the data on the right has no parent node of the data on the left, you need to add a parent node
         *2) if there is a parent node, put the data children on the left under the children with the same parent node ID on the right
         */
        //The first step is to merge the left and right data, flatten the processing and remove the duplication
        const renderData: any[] = spanningTree(
          deepClone(checkAllFromDataCache.value),
          convertTreeData(deepClone(props.to_data))
        );
        //Add data on the left
        emit("removeBtn", renderData);
        console.log(renderData);
        // Second delete the right data clone flat, but if you delete all children parent nodes, you can't delete it.
        const remData = dynamicDeletion(
          convertTreeData(deepClone(props.from_data)),
          convertTreeData(deepClone(checkAllFromDataCache.value))
        );
        let res: any[] = [];
        remData.filter((item) => {
          return item.children == null || !item.children
            ? void 0
            : res.push(item);
        });
        emit("addBtn", res);
      }
      checkAllFromDataCache.value = [];
    };
    //Remove
    const remove = () => {
      // Select all
      if (toChekAll.value) {
        emit("removeBtn", []);
        emit("addBtn", spanningTree(props.from_data, props.to_data));
      } else {
        // emit('addBtn', spanningTree(checkAllToDataCache.value, props.from_data))
        const renderData: any[] = spanningTree(
          deepClone(checkAllToDataCache.value),
          convertTreeData(deepClone(props.from_data))
        );
        //Add data on the left
        emit("addBtn", renderData);
        console.log(renderData);
        /**
         * Second, delete the flattening of the right data clone, but if you delete all children's parent nodes, you cannot delete them
         */
        const remData = dynamicDeletion(
          convertTreeData(deepClone(props.to_data)),
          convertTreeData(deepClone(checkAllToDataCache.value))
        );
        let res: any[] = [];
        remData.filter((item) => {
          return item.children == null || !item.children
            ? void 0
            : res.push(item);
        });
        emit("removeBtn", res);
      }
      checkAllToDataCache.value = [];
    };
    //Fromdata select all
    const fromHandleCheckAllChange = (val: boolean) => {
      console.log(val, fromChekAll.value);
      if (val) {
        fromtree.value.setCheckedNodes(props.from_data);
        const key = fromtree.value.getCheckedNodes();
        const arr = filterPid(deepClone(key), 0);
        checkAllFromDataCache.value = convertTreeData(arr);
      } else {
        fromtree.value.setCheckedNodes([]);
        const key = fromtree.value.getCheckedNodes();
        checkAllFromDataCache.value = key;
      }
    };
    //Todata  select all
    const toHandleCheckAllChange = (val: boolean) => {
      if (val) {
        totree.value.setCheckedNodes(props.to_data);
        const key = totree.value.getCheckedNodes();
        const arr = filterPid(deepClone(key), 0);
        checkAllToDataCache.value = arr;
      } else {
        totree.value.setCheckedNodes([]);
        const key = totree.value.getCheckedNodes();
        checkAllToDataCache.value = key;
      }
    };
    //Tree node click node selection
    const fromCheck = () => {
      const key = fromtree.value.getCheckedNodes(false, true);
      /**
       * Cloning prevents changing the source data. Setting the second parameter true of getcheckednodes will automatically
       * obtain the parent node and all children. It needs to be filtered. It can also be flattened before filtering
       */
      const arr = filterPid(deepClone(key), 0);
      /**
       * In order to facilitate traversal and comparison, the difference is flattened into a one-dimensional array for circular search
       */
      checkAllFromDataCache.value = convertTreeData(arr);
      console.error(checkAllFromDataCache.value);
    };
    const toCheck = () => {
      const key = totree.value.getCheckedNodes(false, true);
      const arr = filterPid(deepClone(key), 0);
      checkAllToDataCache.value = convertTreeData(arr);
    };
    //Tree node filtering
    const fromFilterNode = (value: any, data: { label: string | any[] }) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };
    const toFilterNode = (value: any, data: { label: string | any[] }) => {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    };
    //Other
    const fromHandleNodeClick = (data: any) => {
      console.log(data);
    };
    const toHandleNodeClick = (data: any) => {
      console.log(data);
    };
    //-----------watch
    watch(
      () => checkAllFromDataCache.value,
      () => {
        /**
         * All are converted to one-dimensional arrays for length comparison
         */
        const fromData = convertTreeData(deepClone(props.from_data));
        const checkAllData = deepClone(checkAllFromDataCache.value);
        // Select all
        if (fromData.length === checkAllData.length) {
          fromChekAll.value = true;
          isFromIndeterminate.value = false;
        }
        // Semi selection
        if (checkAllData.length > 0 && fromData.length > checkAllData.length) {
          isFromIndeterminate.value = true;
        }
        //All false when 0
        if (checkAllData.length === 0) {
          fromChekAll.value = false;
          isFromIndeterminate.value = false;
        }
      }
    );
    watch(
      () => checkAllToDataCache.value,
      () => {
        /**
         * All are converted to one-dimensional arrays for length comparison
         */
        const toData = convertTreeData(deepClone(props.to_data));
        const checkAllData = deepClone(checkAllToDataCache.value);
        // Select all
        if (toData.length === checkAllData.length) {
          toChekAll.value = true;
          isToIndeterminate.value = false;
        }
        // Semi selection
        if (checkAllData.length > 0 && toData.length > checkAllData.length) {
          isToIndeterminate.value = true;
        }
        if (checkAllData.length === 0) {
          isToIndeterminate.value = false;
          toChekAll.value = false;
        }
      }
    );
    watch(
      () => fromFilterText.value,
      (newValue) => {
        fromtree.value.filter(newValue);
      }
    );
    watch(
      () => toFilterText.value,
      (newValue) => {
        totree.value.filter(newValue);
      }
    );
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
      add,
      remove,
      fromHandleCheckAllChange,
      toHandleCheckAllChange,
      fromCheck,
      toCheck,
      fromFilterNode,
      toFilterNode,
      fromHandleNodeClick,
      toHandleNodeClick,
    };
  },
  render() {
    let {
      $props,
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
      add,
      remove,
      fromHandleCheckAllChange,
      toHandleCheckAllChange,
      fromCheck,
      toCheck,
      fromFilterNode,
      toFilterNode,
      fromHandleNodeClick,
      toHandleNodeClick,
    } = this;
    const {
      width,
      height,
      from_title,
      to_title,
      from_data,
      to_data,
      defaultProps,
      node_key,
    } = $props;
    return (
      <div class="el-transfer-tree" style={{ width, height }}>
        {/* transfer left */}
        <div class="transfer-left">
          {/* title */}
          <div class="transfer-left-title">
            <ElCheckbox
              v-model={fromChekAll}
              indeterminate={isFromIndeterminate}
              onChange={fromHandleCheckAllChange}
            />
            <span>{from_title || ""}</span>
          </div>
          {/* content */}
          <div class="transfer-left-content">
            <ElScrollbar height="100%">
              <ElInput
                class="transfer-input"
                v-model={fromFilterText}
                placeholder="输入关键字进行过滤"
                clearable
              />
              <ElTree
                style={{ paddingLeft: "10px" }}
                data={from_data}
                props={defaultProps as any}
                showCheckbox
                nodeKey={node_key}
                currentNodeKey="current"
                ref={fromtree}
                onCheck={fromCheck}
                filterNodeMethod={fromFilterNode as any}
                node-click={fromHandleNodeClick}
              />
            </ElScrollbar>
          </div>
        </div>
        {/* button */}
        <div class="transfer-button">
          <div class="transfer-button-add">
            <ElButton
              size="small"
              type="primary"
              disabled={checkAllFromDataCache.length > 0 ? false : true}
              onClick={add}
            >
              添加
            </ElButton>
          </div>
          <div class="transfer-button-remove">
            <ElButton
              size="small"
              type="primary"
              disabled={checkAllToDataCache.length > 0 ? false : true}
              onClick={remove}
            >
              移除
            </ElButton>
          </div>
        </div>
        {/* transfer right*/}
        <div class="transfer-right">
          {/* title */}
          <div class="transfer-right-title">
            <ElCheckbox
              v-model={toChekAll}
              indeterminate={isToIndeterminate}
              onChange={toHandleCheckAllChange}
            />
            <span>{to_title || ""}</span>
          </div>
          {/* content */}
          <div class="transfer-right-content">
            <ElScrollbar height="100%">
              <ElInput
                class="transfer-input"
                v-model={toFilterText}
                placeholder="输入关键字进行过滤"
                clearable
              />
              <ElTree
                style={{ paddingLeft: "10px" }}
                data={to_data}
                props={defaultProps as any}
                showCheckbox
                nodeKey={node_key}
                ref={totree}
                onCheck={toCheck}
                filterNodeMethod={toFilterNode as any}
                node-click={toHandleNodeClick}
              />
            </ElScrollbar>
          </div>
        </div>
      </div>
    );
  },
});
