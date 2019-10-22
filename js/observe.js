function observe(obj, vm) {
  if (!obj || typeof obj !== "object") {
    return;
  }

   // 遍历该对象
   Object.keys(obj).forEach(function(key) {
    // 数据响应化
    defineReactive(vm, key, obj[key]);
    // 代理data中的属性到vue实例上
    proxyData(vm, key);
  })
}


function defineReactive(vm, key, val) {
  observe(val); // 递归解决数据嵌套

  const dep = new Dep();

  Object.defineProperty(vm, key, {
    get: function() {
      // JS的浏览器单线程特性，保证这个全局变量在同一时间内，只会有同一个监听器使用
      Dep.target && dep.addSub(Dep.target);
      return val;
    },
    set: function(newVal) {
      if (newVal === val) {
        return;
      }
      val = newVal;
      // console.log(`${key}属性更新了：${val}`);
      dep.notify();       // 作为发布者发出通知
    }
  });
}

function proxyData(vm, key) {
  Object.defineProperty(this, key, {
    get: function(){
      return vm.$data[key]
    },
    set: function (newVal){
      vm.$data[key] = newVal;
    }
  })
}