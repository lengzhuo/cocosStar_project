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

# 场景的加载与切换
	在cocos中默认只会运行一个场景，其他的场景当不再运行时，所有的节点与资源都将会被自动销毁
	1. 	进入场景与切换场景用loadScene()方法执行, 例如： 
			// home为我们创建场景的文件名(不带后缀), 函数会自动索引相应的场景文件并加载所需的资源文件
			cc.director.loadScene('home');
	2. 	有时，我们会用到预加载场景，让我们的游戏进入下一个场景更为流畅，更为迅速。 可以使用proloadScene()方法, 例如
			cc.director.proloadScene('game', function(){
				console.log('gameScene is proloaded');
			});
		然后我们只需再运行 cc.director.loadScene('game')方法, 即可快速打开下一个场景。
	3. 	当我们切换场景时, 所有的节点和资源都会销毁，那么我们如何进行场景之间的数据交互呢，我们可以利用常驻节点来完成。
		常驻节点：表示此节点不会在随着场景的销毁而销毁，会一直保留下去，直到手动回收或销毁
		创建一个常驻节点： 
			cc.director.addPersistRootNode(cc.Node);
		这样, cc.Node就变成了一个常驻节点, 挂载在此节点下的数据就不会随着场景的销毁而销毁, 我们可以用来存储一些常用到的信息如RoleInfor等。
		我们还可以注销一个常驻节点:
			cc.director.removePersistRootNode(cc.Node);
		**注意** 此API不会直接销毁此节点，而是将节点从常驻节点变为普通节点，会随着场景的销毁而销毁。
	4.	我们还可以在loadScene方法中添加回调函数，用于加载完场景后处理数据，如:
			cc.director.loadScene('home', this.getUserInfor);
			// this.getUserInfor方法用来获取玩家信息
		由于回调方法只能写在本脚本之中，会随着场景销毁而注销，所以我们一般将回调方法写在常驻节点的脚本中，用来进一步的初始化场景或者传递数据。

# 获取和加载资源
	在cocos中，所有继承自cc.Asset类的类型都是资源。 他们有一套统一且自动化的资源管理机制。
		* 挂载在场景脚本里预设加载
			对于资源文件，我们可以直接在组件脚本中设定资源属性，然后再属性编辑器中，将我们要用到的资源直接拖到对应的属性名下，这样在脚本中我们就可以直接引用我们所需要的资源了。
			好处是不用我们再去手动加载，引擎会在进场景之前提前帮我们加载好，拿来即用就好。 缺点就是：只能使用提前预设好的资源，不能灵活变通，无法动态切换。
		* 动态加载资源
			Creator为我们提供了动态加载资源的接口：cc.loader.loadRes();
				// 加载 Prefab
				cc.loader.loadRes('assets/prefab', function(err, prefab){
					var newNode = cc.instantiate(prefab);
					cc.director.getScene().addChild(newNode);
				});
				// 加载其他资源类似，回调函数第二个参数就是我们需要的资源。
				// 加载SpriteFrame时，需要声明第二个参数为资源类型，第三个参数才是回调函数。 例如：
				cc.loader.loadRes('assets/textureName', cc.SpriteFrame, function(err, spf){
					self.node.getComponent(cc.Sprite).spriteFrame = spf;
				});
			也可以传入路径为文件夹，进行资源批量加载
				// 加载assets目录下所有资源
				cc.loader,loadRes('assets', function(err, assets){});
		* 直接加载网上资源或设备资源
			当我们从服务器请求到玩家头像或者本地上传头像时，我们可以直接用 cc.loader.load() 加载服务器资源或设备资源
				cc.loader.load(textureURL, function(err, texture){// texture 就是所需的资源});
			**注意** Web应用加载受浏览器同源策略限制，即不可跨域请求。
		* 释放资源
			在加载完资源之后，所有的资源都会被缓存到cc.loader中，以避免重复加载资源。 当我们认为某份资源不再需要时，便可以释放掉：
				// 释放贴图资源
				cc.loader.release(texture); 
				// 释放一个prefab 以及它所有依赖的资源
				var deps = cc.loader.getDependsRecursively('prefabs/star');
				cc.loader.release(deps);
				// 如果在这个 prefab 中有一些和场景其他部分共享的资源，你不希望它们被释放，可以将这个资源从依赖列表中删除
				var deps = cc.loader.getDependsRecursively('prefabs/sample');
				var index = deps.indexOf(texture2d._uuid);
				if (index !== -1) deps.splice(index, 1);
				cc.loader.release(deps);
		* 防止内存泄漏
			最后，一个常犯的新手错误：内存泄漏。 通俗的讲：就是我们在写程序时，自己认为某个资源已经可以释放并且已经释放了之后，由于程序设计或者逻辑不自洽的情况下，这个资源再一次的被请求了。此时垃圾回收还没有开始，那么就意味着这份资源还是会被留在内存中，但是cc.loader已经访问不到了。这是，引擎会重新加载这份资源。那么这样就造成了内存中有两份相同的资源，而在一些递归或者循环中，又有可能在不停的重复着这种操作，最后就有可能导致游戏内存不足而崩溃掉。所以，当我们编程时，一定要仔细检查游戏逻辑，避免上述情况发生。

# 事件监听与派发
	事件处理是在节点中完成的, 对于脚本组件, 可以通过访问节点this.node来完成事件注册与监听
	* 事件监听
		API： this.node.on(EventName, callBack, this);
	* 关闭监听
		// cocos建议关闭监听时写全所有参数
		API: this.node.off(EventName, callBack, this);
	* 事件派发两种形式
		1. emit派发： this.node.emit('eventName', arge); 特别说明： 从第二个参数起，我们可以给监听器传参, 出于底层性能考虑, 最多只支持5个参数。
		2. dispatchEvent派发	: 会进行事件传递, 以冒泡形式派送, 直到遇到stopPropagation()结束冒泡, 本页面的监听依旧触发。
			API: this.node.dispatchEvent(new cc.Event.EventCustom(EventName, true));
			注意: 在发送用户自定义事件的时候, 请不要直接创建cc.Event对象, 它是一个抽象类, 要用cc.Event.EventCustom()对象进行派发。
	* 鼠标事件与触摸事件
		节点事件可用枚举类型来注册，也可用事件名来注册
		枚举类型：全名; 事件名：别名。
		1. 鼠标事件  - 针对PC端, 在移动端不会触发, 
			* cc.Node.EventType.MOUSE_DOWN: 		鼠标按下监听
			* cc.Node.EventType.MOUSE_UP:			鼠标弹起监听
			* cc.Node.EventType.MOUSE_lEAVE: 		鼠标离开节点时触发
			* cc.Node.EventType.MOUSE_ENTER			鼠标进入节点时触发
			* cc.Node.EventType.MOUSE_MOVE: 		鼠标移动时触发
			* cc.Node.EventType.MOUSE_WHEEL: 		鼠标滚轮滑动时触发
		2. 触摸事件  - 针对移动端, 但在pc端也会触发, 方便调试
			* cc.Node.EventType.TOUCH_START			手指摁下
			* cc.Node.EventType.TOUCH_END			手指在节点上抬起
			* cc.Node.EventType.TOUCH_MOVE			手指在节点上移动
			* cc.Node.EventType.TOUCH_CANCEL 		手指在节点外离开屏幕时
	* 触摸事件的事件冒泡与捕获
		触摸事件会自动进行冒泡。 点击子元素, 不管是否点击区域在不在父元素内, 都会触发父级监听的同类事件, 可用event.stopPorpagation()方法停止冒泡。
		我们也可以将事件注册在节点的捕获状态，这样就会提前触发在父元素的事件。
		捕获事件API: this.node.on('touchstart', this.onStart, this, ture); // 只需在注册事件时传入第四个参数为true即可。
	* 同级节点之间触摸事件归属问题
		同级节点之间, 不会进行事件传递, 谁层级在上面, 就触发谁的事件, 下面的事件不会触发。
	* 节点的其他事件
		当节点属性改变时, 我们也可以注册事件监听。 没有枚举类型, 只有事件名
			* position-changed		当位置属性改变时
			* rotation-changed		当旋转属性改变时
			* scale-changed			当缩放属性改变时
			* size-changed			当宽高属性改变时
			* anchor-changed		
	* 全局系统事件, 分为输入事件与设备重力传感事件, 与节点树无关, 由cc.sysemEvent统一派发
		共有三种事件类型:	* cc.SystemEvent.EventType.KEY_DOWN 		键盘按下
						* cc.SystemEvent.EventType.KEY_UP 			键盘弹起
						* cc.SystemEvent.EventType.DEVICEMOTION 	设备重力感应 
	* 输入事件，监听键盘
		API: cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
			 onKeyDown(event) {
			 	switch(event.keyCode) {
			 		case: cc.macro.KEY.a: 
			 			// todo 点击a键
			 			break;
			 	}
			 }
	* 重力传感事件 cc.systemEvent.EventType.DEVICEMOTION
		用法： 	// open Accelerometer
				cc.systemEvent.setAccelerometerEnabled(true);
				// 注册监听
				cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotion, this);
				onDeviceMotion(event) {
					console.log(event.acc.x + "  " + event,acc.y);
				}
# 动作系统的使用
	* 动作API
	* 时间间隔动作
	* 缓动动作
	* 即时动作
	* 容器动作
	* 动作回调

# 缓动系统的使用
	缓动系统在cocos-v2.0.9版本之上才有, 是对动作系统的一层封装, 提供链式创建的方法, 可以对任意节点的任意属性进行缓动。
	* 缓动属性API
	* 使用easing使缓动更生动
	* 自定义process
	* 并行执行缓动
	* 缓动队列
	* 复制缓动与重复执行
	* 回调与延时执行

# 计时器的应用
	* 相对于setTimeout/setInterval 的优势: 更灵活, 与组件结合的更好
	  API：Component.schedule  				-- 开始一个计时器
	  				.scheduleOnce			-- 开始一个只执行一次的计时器
	  				.unschedule				-- 取消计时器
	  				.unscheduleAllCallbacks	-- 取消组件上的所有计时器
	  	   创建计时器时可选四个参数： 回调函数, 定时时间(单位: s), 执行次数, 延迟多少时间开始计时器。
	  	   销毁计时器时参数： 回调函数。 可在计时器回调函数中销毁计时器。

# 网络连接 http/webSocket

# 模块化脚本

# 使用对象池
	对象池的使用，可以有效的减少系统使用cc.instantiate和node.destory进行节点创建和销毁时性能的损耗
		* 用法 
			// 声明一个对象池
			this.enemyPool = new cc.NodePool();
			// 规定对象池的数量为5
			let initCount = 5;
			for(let i = 0; i < initCount; i++) {
				// 通过预设资源创建节点
				let enemy = cc.inistantiate(this.enemyPrefab);
				// 加入到对象池中, 接口与对象池回收节点接口一样, 他会自动removeFromParent这个节点。
				this.enemyPool.put(enemy);
			}

			// 从对象池请求一个对象
			let enemy = null;
			// 通过.size方法判断当前对象池所剩对象个数
			if (this.enemyPool.size() > 0) {
				// 对象池.get方法返回池内对象本身
				enemy = this.enemyPool.get();
			} else {
				// 此时对象池内没有空闲对象，需要创建新的对象，避免报错
				enemy = cc.inistantiate(this.enemyPrefab);
			}
			// 将生成的敌方加入到节点中
			enemy.parent = parentNode;
			// 然后调用enemy节点上的脚本进行初始化
			enemy.getComponent('Enemy').init();

			// 用对象池回收对象
			this.enemyPool.put(enemy);

			// 清楚对象池
			this.enemyPool.clear();
		* 也可以使用对象池缓冲同一类型组件。 比如：一个menu菜单下的子项 menuItem
			// 创建组件对象池, 参数写组件名, 会自动创建多个组件
			let menuItemPool = cc.NodePool('menuItem');
		  当使用menuItemPool.get() 获取节点后，会自动触发menuItem里的reuse方法, 完成一些数据初始化和事件绑定。
		  当使用menuItemPool.put(menuItemNode) 回收节点后, 会调用menuItem里的unuse方法, 完成一些事件的反注册。
		  另外, cc.NodePool.get()方法还可以传入任意数量类型的参数, 这些参数会原样传递给组件的reuse方法。

# 分包加载策略  (微信小游戏/OPPO小游戏)

# CocosUI组件的使用
	* cocos没有弹窗的概念，只能自己创建一个节点通过禁用/激活或者添加/删除来完成弹窗的行为。
		- 背景层： 	背景层应该使用组件 cc.BlockInputEvents 作用：拦截所有输入事件(鼠标与触摸), 防止事件穿透到下层其他节点。
					背景可以用一个纯色sprite组件实现，node节点上设置颜色及透明度，然后利用Widget组件设置上下左右四周边距为0，即可实现背景阴影遮罩。
		- 弹窗容器: 	弹窗容器应与背景层同级，不能嵌套在背景层中，如果容器变成背景层子元素，那么容器将继承背景层透明度设置，这样弹窗出来后是半透明的。
		- 显示/隐藏:	显示隐藏可以通过控制容器节点的active属性完成，为Boolean值。 也可以通过控制容器的创建与销毁来完成，例如提示弹窗。
	* pageView组件: 	pageView组件可以设置一个左右滑动的切换页，必须绑定节点content(即可滑动节点容器)。 子元素view下mask组件可选择矩形/圆角/图片大小遮罩类型
					组件可在编辑器中添加事件监听，也可在代码中添加。 代码中监听页面滑动 this.pageView.on('page-turning', this.callBack, this);可在每次切换页面时触发。
					this.pageView.getCurrentPageIndex(); 可返回页面当前所在页面下标，下标从 0 开始。
					this.pageView.setCurrentPageIndex(index: number); 可设置当前页面。 会自动滑到设置的界面。
	* Layout组件：	布局组件，用于规范子元素排列顺序，type 属性可选横向/纵向/网格/none排列方式。 Padding属性规定左右及相邻子元素之间间距。
					当改变组件子元素大小的时候，可以使用updateLayout()方法重新调整布局。
	* Progress：		进度条组件，参考教程。