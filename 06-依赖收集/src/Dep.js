let depId = 0;

class Dep {
    constructor() {
        this.id = depId++;
        // 存储的是与当前 Dep 关联的 watcher
        this.subs = [];
    }

    //添加一个 watcher
    addSub(sub) {
       this.subs.push(sub)
    }

    //移除
    removeSub(sub) {
        for(let i = this.subs.length - 1; i >= 0; i--) {
            if(sub === this.subs[i]) {
                this.subs.splice(i, 1);
            }
        }
    }

    //将当前 Dep 与当前的 watcher ( 暂时渲染 watcher ) 关联
    depend() {
      //将当前的dep与当前的watcher互相关联
      if(Dep.target) {
          //将当前的watcher关联到当前dep上
          this.addSub(Dep.target);
          //将当前的dep与当前渲染watcher关联起来
          Dep.target.addDep(this);
      }
    }

    //触发与之关联的 watcher 的 update 方法, 起到更新的作用
    notify() {
       //实际Vue中依次触发this.subs中的watcher的update方法
       //此时，deps中已经关联到我们需要使用的那个watcher
       let deps = this.subs.slice();

       deps.forEach(watcher => {
           watcher.update();
       })
        
    }

}

// 全局的容器存储渲染 Watcher
// let globalWatcher
Dep.target = null; //全局的 Watcher

let targetStack = [];

//将当前操作的watcher存储到全局watcher中，参数target就是当前watcher
function pushTarget(target) { 
    //实际Vue中使用push
    targetStack.unshift(Dep.target);
    Dep.target = target;
 }

 //移除当前watcher
 function popTarget() { 
     //移除最后就是undefined
     Dep.target = targetStack.shift();
  }

  /**
   * 在watcher调用get方法的时候，调用pushTarget(this)
   * 在watcher的get方法结束时候，调用popTarget()
   */