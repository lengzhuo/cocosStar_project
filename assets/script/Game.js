// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 加载预设资源
        starPrefab: {
            default: null,
            type: cc.Prefab
        },
        // 星星产生后消失时间的随机范围
        maxStarDuration: 0,
        minStarDuration: 0,

        ground: {
            default: null,
            type: cc.Node
        },

        // 主角
        player: {
            default: null,
            type: cc.Node
        },

        // 分数
        scoreDisplay: {
            default: null,
            type: cc.Label
        },

        // 得分音效
        scoreAudio: {
            default: null,
            type: cc.AudioClip
        },
    },


    onLoad() {
        // 获取地平面的y轴坐标
        this.groundY = this.ground.y + this.ground.height / 2;
        // 初始化计时器
        this.timer = 0;
        this.starDuration = 0;
        // 生成一个新的星星
        this.spawnNewStar();
        // 初始化得分
        this.score = 0;
    },

    spawnNewStar: function () {
        // 使用给定的模板在场景中生成一个新的节点
        var newStar = cc.instantiate(this.starPrefab);
        // 将新增的节点添加到Canvas节点下
        this.node.addChild(newStar);
        // 在星星实例上挂载game对象的引用
        newStar.getComponent('Star').game = this;

        // 为星星设置一个随机位置
        newStar.setPosition(this.getNewStarPosition());

        // 重置计时器
        this.starDuration = this.minStarDuration + Math.random() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    },

    getNewStarPosition: function () {
        var randX = 0;
        // 根据地平面高度和主角跳跃高度，随机得到一个星星的位置
        var randY = this.groundY + Math.random() * this.player.getComponent('Player').jumpHeight + 50;
        // 根据屏幕宽度，随机得到一个星星x坐标
        var maxX = this.node.width / 2;
        randX = (Math.random() - 0.5) * 2 * maxX;
        // 返回星星的坐标
        return cc.v2(randX, randY);
    },

    update(dt) {
        // 每帧更新计时器, 超出限度还没有生成新的星星, 就会调用游戏失败逻辑
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    },

    gainScore: function () {
        this.score += 1;
        // 更新 scoreDisplay 文字
        this.scoreDisplay.string = 'Score:' + this.score;

        // 播放得分音效
        cc.audioEngine.playEffect(this.scoreAudio, false);
    },

    gameOver: function () {
        // 停止 player 节点跳动
        this.player.stopAllActions();
        cc.director.loadScene('game');
    },
});
