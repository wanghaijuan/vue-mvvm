function Vue(options) {
  var $data = options.data;

  this.$options = options;

  // 数据响应化
  observe($data, this);

  // var dom = new Compile(document.getElementById($options.el), this);

  // 编译完成后，将dom返回到app中
  // document.getElementById($options.el).appendChild(dom);

  new Compile(document.getElementById(options.el), this);

  // created 执行
  if (options.created) {
    options.created.call(this);
  }
}


