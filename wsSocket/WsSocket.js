var ws = require("ws");
var Protobuf = require("./proto/protobuf");
var Path = require("path");

var protoBuildMap = {};
let server = null;

/**
 * 加载proto文件
 * @param {*} filepath proto文件路径
 * @param {*} msgname 协议体名称
 */
function loadProto(filepath, msgname) {
    //"proto/TestPB.proto"
    let fp = Path.join(__dirname, filepath);

    var builder = Protobuf.loadProtoFile(fp);
    protoBuildMap[filepath] = builder;
}

function init() {
    loadProto("proto/TestPB.proto");
}

/**
 * 获取消息体
 * @param {*} path 
 * @param {*} msgname 
 */
function getMsg(path, msgname) {
    var builder = protoBuildMap[path];
    if (null == builder) {
        return null;
    }

    return builder.build(msgname);
}

function buildMsg(path, msgname) {
    let msgbody = getMsg(path, msgname);

    return new msgbody();
}

function wSocket() {
    let serverOpt = {
        host: "127.0.0.1",
        port: 8888,
    };


    /**
     * 连接成功
     */
    onConnection = function (webs) {
        console.log("onConnection");
        server = webs;
        server.on("message", onMsg);
        sendMsg();
    }

    /**
     * 接受到消息
     */
    onMsg = function (msg) {
        console.log("onMsg: ", msg);
        try {
            let msgBody = getMsg("proto/TestPB.proto", "MsgPB");
            let msginfo = msgBody.decode(msg);
            console.log("msg info: ", msginfo);
            if (msginfo.code == 1) {
                let wsbody = getMsg("proto/TestPB.proto", "WSMessage");
                let wsinfo = wsbody.decode(msginfo.body);
                console.log("msg wsInfo: ", wsinfo);
            }
            sendMsg();
        }
        catch (error) {
            console.error("msg analysis error: ", error);
        }
    }

    onError = function (msg) {
        console.error("onError: ", msg);
    }

    // 创建服务器
    wss = new ws.Server(serverOpt);
    // 设置监听
    wss.on("connection", onConnection);
    wss.on("error", onError);

    console.log("start server");
}

function sendMsg() {
    if (null == server) {
        return;
    }
    let msginfo = buildMsg("proto/TestPB.proto", "MsgPB");
    // let msginfo = new msg();
    msginfo.code = 1;

    let bodyInfo = buildMsg("proto/TestPB.proto", "WSMessage");
    // let bodyInfo = new body();
    bodyInfo.id = 100;
    bodyInfo.content = 'bb';
    bodyInfo.sender = 'server';
    bodyInfo.time = '11111';
    let son = {
        num: 123
    }
    bodyInfo.son = son;

    msginfo.body = bodyInfo.encode().toBuffer();

    server.send(msginfo.encode().toBuffer());
}

init();
wSocket();
