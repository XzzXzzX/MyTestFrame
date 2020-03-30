import AppLog, { printzx, print1 } from "./core/util/AppLog";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Helloworld extends cc.Component {

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemModel: cc.Node = null;

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    nodeList: Array<cc.Node> = [];

    start() {
        // init logic
        // this.label.string = this.text;
        // this.label.node.scale = 0.5;
        // cc.log("zx_ ", this.label.node.scale, this.node.scaleX,this.node.scaleY);
        // cc.log(this.node);

        print1("111");
        printzx("222");
        printzx(["222", 1, 3]);
        printzx(1, 2, 3, 34);
        printzx(this.node);
        printzx(printzx.prototype);


        // this.initContent();
    }

    private initContent(): void {
        for (let index = 0; index < 5; index++) {
            let node: cc.Node = cc.instantiate(this.itemModel);
            let lab: cc.Label = node.getChildByName("lab").getComponent(cc.Label);
            lab.string = index + '';
            node['lab'] = lab;
            node.parent = this.content;
            node.position = cc.Vec2.ZERO;
            this.nodeList.push(node);
            // node.zIndex = 10- index;
        }

        for (let index = 0; index < this.nodeList.length; index++) {
            const element = this.nodeList[index];
            element.zIndex = 10 - index;
            element.lab.string = element.lab.string + "Z" + element.zIndex;
        }
    }
}
