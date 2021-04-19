//响应式部分
const ARRAY_METHOD = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
];

//继承原生Array方法
let array_methods = Object.create(Array.prototype);

//重写方法
ARRAY_METHOD.forEach(method => {
  array_methods[method] = function () {
    //调用原来方法
    console.log(`调用的是拦截${method}方法`)

    //将数据响应化
    for (let i = 0; i < arguments.length; i++) {
      observe(arguments[i]);
    }

    let res = Array.prototype[method].apply(this, arguments);

    return res;
  }
})

//设置响应式 简化版
function defineReactive(target, key, value, enumerable) {

  if (typeof value === 'object' && value != null) {
    observe(value); //递归
  }

  let dep = new Dep();

  dep.__propName__ = key;
 
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: !!enumerable,
    get() {
      console.log(`读取${key}属性`);
      dep.depend()
      return value;
    },
    set(newVal) {
      console.log(`设置${key}属性为：${newVal}`);

      if (value == newVal) return;

      //将重新赋值的数据变成响应式，如果传入的是对象类型，就需要使用observe转换为响应式
      if (typeof newVal === 'object' && newVal != null) {
        observe(newVal);
      }

      value = newVal;

      //派发更新, 找到全局watcher, 调用update()
      dep.notify();
    }
  })
}

// 将 某一个对象的属性 访问 映射到 对象的某一个属性成员上
function proxy(target, prop, key) {
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get() {
      return target[prop][key];
    },
    set(newVal) {
      target[prop][key] = newVal;
    }
  });
}

// 将对象 o 变成响应式, vm 就是 vue 实例, 为了在调用时处理上下文
function observe(obj) {
  if (Array.isArray(obj)) {
    // 对其每一个元素处理
    obj.__proto__ = array_methods;
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i]); // 递归处理每一个数组元素
      // 如果想要这么处理, 就在这里继续调用 defineRective
      //defineReactive.call( vm, obj, i, obj[ i ], true ); 
    }
  } else {
    // 对其成员进行处理
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      let prop = keys[i]; // 属性名
      defineReactive(obj, prop, obj[prop], true);
    }
  }
}