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
    // 继承父类 
    extends: cc.Component,

    // 构造函数
    ctor: function () {

    },

    properties: {
        // 星星与主角之间的距离
        pickRadius: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() { },

    getPlayerDistance: function () {
        // 根据player节点位置判断距离
        var playerPos = this.game.player.getPosition();
        // 根据两点之间位置计算两点距离
        var dist = this.node.position.sub(playerPos).mag();
        return dist;
    },

    onPicked: function () {
        // 当星星收集时，调用Game脚本中的接口，生成一个新的星星
        this.game.spawnNewStar();
        // 得分
        this.game.gainScore();
        // 然后销毁当前节点
        this.node.destroy();
    },

    update(dt) {
        // 每帧判断主角之间距离是否小于最小收集距离
        if (this.getPlayerDistance() < this.pickRadius) {
            // 调用收集行为
            this.onPicked();
            return;
        }

        // 根据game脚本中的计时器更新星星的透明度
        var opacityRatio = 1 - this.game.timer / this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    },
});
