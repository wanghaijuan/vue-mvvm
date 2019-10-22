// 用法 new Compile(node, vm)
function Compile(node, vm) {
  // if (node) {
  //   this.$frag = this.nodeToFragment(node, vm);    
  //   return this.$frag;
  // }
  this.$vm = vm;

  // 编译
  if (node) {
    // 转换内部内容为片段Fragment
    this.$fragment = this.nodeToFragment(node, vm);
    // 执行编译
    this.compileElement(node);
    // 将编译完的html结果追加至$el
    node.appendChild(this.$fragment);
  }

}
// 编译过程
Compile.prototype = {
  // 转换内部内容为片段Fragment
  nodeToFragment: function (node) {   // 将宿主元素中代码片段拿出来遍历，这样做比较高效
    var frag = document.createDocumentFragment();   // 将el中所有子元素搬家至frag中
    var child;

    while (child = node.firstChild) {
      this.compileElement(child);        
      frag.append(child);   // 将所有子节点添加到fragment中
    }
    return frag;
  },
  // 执行编译
  compileElement: function (node) {
    var reg = /\{\{(.*)\}\}/;
    // 类型判断：节点类型为元素  查找k-，@，:
    if (node.nodeType === 1) {  
      var attr = node.attributes;
      // console.log('ooobbb',attr[0])
      for (var i = 0; i < attr.length; i++) { // 解析属性
        var attrName = attr[i].name; // 属性名
        var exp = attr[i].value;     // 属性值 获取v-model绑定的属性名 attr[i].nodeValue
        if (attrName.indexOf("v-") === 0) {           // v-model
          var dir = attrName.substring(2);            // model
          // 执行指令
          this[dir] && this[dir](node, exp);
        } 
        if (attrName.indexOf("@") === 0) {
          var dir = attrName.substring(1);   // @click
          this.eventHandler(node, exp, dir);
        }
      };

      // 没有标签的属性
      if(attr.length <=0) {
        if (reg.test(node.textContent)) { 
          this.compileText(node);
        }
      }
    } 

    // 节点类型为text
    if (node.nodeType === 3) {
      if (reg.test(node.nodeValue)) {
        // node.nodeValue = vm[name];
        //new Watcher(this.$vm, node, name, 'textContent');     // 将data的值赋给该node
        this.compileText(node);
      }
    }

  },
  // 更新函数
  update(node, exp, dir, type) {
    const updaterFn = this[dir + "Updater"];
    // 初始化
    updaterFn && updaterFn(node, this.$vm[exp]);
    // 依赖收集
    new Watcher(this.$vm, node, exp, type);     // 将data的值赋给该node
  },
  compileText(node) {
    var exp = RegExp.$1; // 获取匹配到的字符串
    exp = exp.trim();
    new Watcher(this.$vm, node, exp, 'textContent');    
  },
  html(node, exp) {
    this.update(node, exp, "html", 'innerHTML');
  },
  text(node, exp) {
    this.update(node, exp, "text", 'textContent');
  },
  // 双向绑定
  model(node, exp) {
    // 指定input的value属性
    this.update(node, exp, 'model', 'value');
    // 视图对模型响应
    node.addEventListener("input", e => {
      this.$vm[exp] = e.target.value;
    });
  },
  //   事件处理器
  eventHandler(node, exp, dir) {
    let fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];     //   @click="onClick"

    if (dir && fn) {
      node.addEventListener(dir, fn.bind(this.$vm));
    }
  }
}

