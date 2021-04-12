class Dep {
    constructor() {
        // 存储的是与当前 Dep 关联的 watcher
        this.subs = [];
    }

    //添加一个 watcher
    addSub(sub) {

    }

    //移除
    removeSub(sub) {

    }

    //将当前 Dep 与当前的 watcher ( 暂时渲染 watcher ) 关联
    depend() {

    }

    //触发与之关联的 watcher 的 update 方法, 起到更新的作用
    notify() {
        // 在Vue中是依次触发 this.subs 中的 watcher 的 update 方法
        if (Dep.target) {
            Dep.target.update();
        }
    }

}

// 全局的容器存储渲染 Watcher
// let globalWatcher
Dep.target = null; //全局的 Watcher