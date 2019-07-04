#cocos核心 - CCClass类的声明 
cc.class({
	// 继承父类 cc.组件基类
	extends: cc.Component,

	// 类的构造函数
	ctor: function() {
		// 这里是声明组件类的构造函数
	},

	// 组件在编辑器中显示的私有属性
	properties: {
		// 声明格式
		// 1. 直接声明，后面的值会进行类型判断
		minWdith: 0,
		// 2. 类型声明, type指定属性是什么类型，可以有默认值
		player: {
			default: null,
			type: cc.Node
		}
		// 3. 声明数组类型, 表示声明的属性是一个子元素为cc.Node的数组
		enemy： {
			default: [],
			type: [cc.Node]
		}
		// 可在下文中直接以 this.properyName 的形式访问
	},
    
	/* 以下为生命周期钩子 */
	onLoad() {
		// 在组件首次激活时自动执行的方法
	},
	onEnable() {
		// 会在组件的enable属性变为true，或者所在节点的active属性变为true时执行，假如节点第一次被创建且enabled属性为true时，会在onLoad之后，start之前执行。
	},
	start() {
		// 会在组件第一次激活前，也就是第一次执行update函数之前执行，通常用于初始化一些中间状态的数据
	},
	update() {
		// 这里每帧执行，相当于组件的帧循环方法
	},
	letaUpdate() {
		// 这里在每帧执行完update方法且组件完成所有动画之后执行
	},
	onDisable() {
		// 当组件enabled属性变为false时，或者所在节点active属性变为false时执行
	},
	onDestroy() {
		// 当组件销毁时自动执行
	}
});