//JCVue构造函数
class JCVue {
    constructor(options) {
        //获取实例data
        this._data = options.data;
        //获取实例dom
        this._template = options.el && document.querySelector(options.el);
        //获取实例dom的父节点
        this._parent = this._template.parentNode;

        //数据响应化
        this.initData()

        //渲染
        this.mount();
    }

    //初始化数据
    initData() {
        //遍历this._data成员，将属性转换为响应式，将直接属性代理到实例上
        let keys = Object.keys(this._data);

        //响应式化
        observe(this._data);

        //代理
        for (let i = 0; i < keys.length; i++) {
            // 将 this._data[ keys[ i ] ] 映射到 this[ keys[ i ] ] 上
            // 就是要 让 this 提供 keys[ i ] 这个属性
            // 在访问这个属性的时候 相当于在 访文this._data 的这个属性
            proxy(this, '_data', keys[i]);
        }
    }

    //提供一个方法，生成虚拟DOM
    mount() {
        this.render = this.createRender();
        this.mountComponent();
    }

    // 执行 mountComponent() 函数 
    mountComponent() {
        let mount = () => {
            this.update(this.render());
        }

        // 这个 Watcher 就是全局的 Watcher, 在任何一个位置都可以访问他
        new Watcher(this, mount); // 相当于这里调用了 mount
    }

    //生成render函数, 目的是缓存抽象语法树 
    createRender() {
        let ast = getVNode(this._template);
        //将 AST + data => VNode
        //带有坑的 VNode + data => 含有数据的 VNode
        return function render() {
            // 将 带有 坑的 VNode 转换为 待数据的 VNode
            let _tmp = combine(ast, this._data);
            return _tmp;
        }
    }

    //直接生成真实DOM替换页面中
    update(vnode) {
        let realDom = parseVNode(vnode);
        this._parent.replaceChild(realDom, document.querySelector('#root'));
    }

}