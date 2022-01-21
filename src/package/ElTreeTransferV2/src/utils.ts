import type { App } from "vue";

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};
//delayering
export function convertTreeData(data: any[]) {
  for (var i = 0; i < data.length; i++) {
    if (data[i].children != undefined) {
      var temp = data[i].children;
      // Delete child node
      delete data[i].children;
      // Add child nodes to the end of the array
      for (var j = 0; j < temp.length; j++) {
        data.push(temp[j]);
      }
    }
  }
  return duplicateRemoval(data, "id");
}
//Filter parent component children
export function filterPid(data: any[], Pid: string | number) {
  let arr: any[] = [];
  data.forEach((item) => {
    if (item.pid === Pid && item.children.length > 0) {
      item.children = [];
    }
    arr.push(item);
  });
  return arr;
}
//clone
export function deepClone(obj: any) {
  let newObj: any;
  try {
    newObj = obj.push ? [] : {};
  } catch (error) {
    newObj = {};
  }
  for (let attr in obj) {
    if (typeof obj[attr] === "object") {
      newObj[attr] = deepClone(obj[attr]);
    } else {
      newObj[attr] = obj[attr];
    }
  }
  return newObj;
}
//Spanning tree
export function spanningTree(from: any[], to: any[]) {
  /**Spanning tree merging array prevents another merging array for flattening in some places,
   *  and prevents another merging array for flattening in some places
   */
  const arr: any[] = convertTreeData([...from, ...to]);
  //Manual de duplication to ensure unique ID
  const obj = tree(duplicateRemoval(arr, "id"), 0);
  return obj;
}
//Dynamically delete data according to the value transferred
export function dynamicDeletion(data: any[], del: any[]) {
  const set = del.map((item) => {
    if (item.pid !== 0) return item.id;
  });
  console.error(set);
  data = data.filter(function (item) {
    return set.indexOf(item.id) == -1;
  });
  // Turn into a tree
  return spanningTree(data, []);
}
//Tree parent node
function tree(data: string | any[], attrdata: number) {
  //Store returned results
  let result = [];
  if (data && data.length > 0) {
    //Store the returned result to judge whether the incoming array has a value
    for (let key of data) {
      //Loop the array
      if (key.pid == attrdata) {
        //Match first level elements
        let obj: any = {}; //Store the attributes I want
        //You can also add the attributes you want here
        let child = getChild(key.id, data); //Matching children requires its own ID array
        if (child && child.length > 0) {
          obj.children = child;
        }
        obj = Object.assign(key, obj); //Merge data
        result.push(obj);
      }
    }
  }
  return result;
}
//getChild
function getChild(pid: string | number, data: string | any[]) {
  let result = [];
  if (data && data.length > 0) {
    for (let key of data) {
      if (key.pid == pid) {
        let obj: any = {}; //Store the attributes I want
        //You can also add the attributes you want here
        let child = getChild(key.id, data); //Matching children requires its own ID array
        if (child && child.length > 0) {
          obj.children = child;
        }
        obj = Object.assign(key, obj); //Merge data
        result.push(obj); //Add return chidren array
      }
    }
  }
  return result;
}
// duplicate removal
function duplicateRemoval(arr: any[], key: string | any) {
  let newobj = {},
    newArr = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    //@ts-ignore
    if (!newobj[item[key]]) {
      //@ts-ignore
      newobj[item[key]] = newArr.push(item);
    }
  }
  return newArr;
}
