// Dep：用来管理Watcher
function Dep() {
  this.subs = [];      // 这里存放若干依赖（watcher）
}
Dep.prototype = {
  addSub: function (sub) {
    this.subs.push(sub);
  },
  notify: function () {
    this.subs.forEach(function (sub) {
      sub.update();
    })
  }
}