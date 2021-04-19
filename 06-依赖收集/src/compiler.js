//由HTML DOM --> VNode,将函数作为一个compiler函数
function getVNode(node) {
    let type = node.nodeType;
    let _vnode = null;

    if (type === 1) {//1位元素节点
        let nodeName = node.nodeName;
        let attrs = node.attributes;
        let _attrObj = {};

        for (let i = 0; i < attrs.length; i++) { //attrs[i] 中 nodeType = 2 属性节点
            _attrObj[attrs[i].nodeName] = attrs[i].nodeValue;
        }

        _vnode = new VNode(nodeName, _attrObj, undefined, type);

        //存在子元素 递归处理
        let childNodes = node.childNodes
        for (let i = 0; i < childNodes.length; i++) {
            _vnode.appendChild(getVNode(childNodes[i]));
        }

    } else if (type === 3) { //3为文本节点
        _vnode = new VNode(undefined, undefined, node.nodeValue, node.nodeType);
    }

    return _vnode;

}

//将VNode --> 真实 DOM
function parseVNode(vnode) {
    let type = vnode.type
    let _node = null
    if (type === 3) {
        return document.createTextNode(vnode.value); // 创建文本节点
    } else if (type === 1) {
        _node = document.createElement(vnode.tag);

        // 属性
        let data = vnode.data; // 现在这个 data 是键值对
        Object.keys(data).forEach((key) => {
            let attrName = key;
            let attrValue = data[key];
            _node.setAttribute(attrName, attrValue);
        });

        // 子元素
        let children = vnode.children;
        children.forEach(subVnode => {
            _node.appendChild(parseVNode(subVnode)); // 递归转换子元素 ( 虚拟 DOM )
        });

        return _node;
    }

}

let r = /\{\{(.+?)\}\}/g;
//根据路径 访问对象成员
function getValueByPath(obj, path) {
    let paths = path.split('.'); // [ xxx, yyy, zzz ]
    let res = obj;
    let prop;
    while (prop = paths.shift()) {
        res = res[prop];
    }
    return res;
}

//将带有坑的VNode 和 data结合，转为填充数据的VNode，这一步模拟 AST --> VNode
function combine(vnode, data) {
    let _tag = vnode.tag;
    let _data = vnode.data;
    let _value = vnode.value;
    let _type = vnode.type;
    let _children = vnode.children;

    let _vnode = null;

    if (_type === 3) {//文本节点
        _value = _value.replace(r, (_, g) => {
            return getValueByPath(data, g.trim());
        })
        _vnode = new VNode(_tag, _data, _value, _type);
    } else if (_type === 1) { //元素节点
        _vnode = new VNode(_tag, _data, _value, _type);
        _children = _children.forEach(subVnode => _vnode.appendChild(combine(subVnode, data)));
    }

    return _vnode;

}