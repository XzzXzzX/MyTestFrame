import Protobuf = require("./protobuf");

const {ccclass, property} = cc._decorator;

@ccclass
export class PBBuild {

    private static pbMsgMap = {};

    public static init(): void
    {
        this.createPB("proto/TestPB", "MsgPB");
        this.createPB("proto/TestPB", "WSMessage");
    }

    private static createPB(pbFilePath: string, pbMsgName: string): void
    {
        // 加载pb文件
        cc.loader.loadRes(pbFilePath, (err: Error, res: any)=>{
            if (err)
            {
                cc.error("PBBuild.createPB() load file fail: ", err);
                return;
            }

            let pbFile: any = Protobuf.loadProto(res);
            let decode: any = pbFile.build(pbMsgName);
            let pb: any = {};
            pb.decodeResult = decode;
            pb.encodeResult = decode;

            this.pbMsgMap[pbFilePath + pbMsgName] = pb;
        });
    }

    /**
     * 解码协议
     * @param pbFilePath 
     * @param pbMsgName 
     */
    public static decodePB(pbFilePath: string, pbMsgName: string): any
    {
        let pb:any = this.pbMsgMap[pbFilePath + pbMsgName];
        if (null != pb)
        {
            return pb.decodeResult;
        }
        return null;
    }

    /**
     * 加密协议
     * @param pbFilePath 
     * @param pbMsgName 
     */
    public static encodePB(pbFilePath: string, pbMsgName: string): any
    {
        let pb:any = this.pbMsgMap[pbFilePath + pbMsgName];
        if (null != pb)
        {
            return new pb.encodeResult();
        }
        return null;
    }
}