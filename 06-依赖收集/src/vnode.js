//虚拟DOM构造函数
class VNode {
    constructor(tag, data, value, type) {
        this.tag = tag && tag.toLowerCase(); //标签
        this.data = data; //属性
        this.value = value; //值
        this.type = type; //类型
        this.children = []; //子元素
    }

    appendChild(vnode) {
        this.children.push(vnode);
    }
}