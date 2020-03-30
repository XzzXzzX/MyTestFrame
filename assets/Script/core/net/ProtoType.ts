/**
 * xuan
 * 2019-7-2 20:49:35
 * 协议类型
 */


export var ProtoCodeType = {
    ROOT_PB: 'proto/TestPB',
};

export var ProtoBodyType = {
    RootMsg: 'MsgPB',
    WSMessage: 'WSMessage',
};

/**
 * c2s
 */
export enum c2s {
    /**
     * 测试协议
     */
    ROOT_PB = 1,        // 协议根数据包
}

export enum s2c {
    /**
     * 测试协议
     */
    Test_PB = 1,        // 协议根数据包
}