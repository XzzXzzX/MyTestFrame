# MyTestFrame
cocos creator游戏简单框架

## 环境和工具
使用cocos creator进行的客户端开发，使用TypeScript语言。
使用JavaScript作为服务器开发，使用websocket通讯。
使用protobuf协议。
使用vs code编辑器。

框架结构包括：

### 网络模块 
```
SocketManager.ts
```
使用websocket通讯，protobuf协议。
protobuf协议文件的加载，协议体对象的构建。

### 资源管理
```
AssetManager.ts
```
按模块进行资源的缓存加载

### 界面管理
```
UIManager.ts
```

### 测试模块
```
TestModule.ts
```
**服务器**
首先要运行起简单服务器，在wsSocket目录中，直接运行WsSocket.js

**客户端**
**模块结构** xxxModule负责数据的接收和发送 

点击“连接服务器”，连接上简单服务器，
点击“发送”，发送测试消息，
点击“TestView”，测试界面开关