/**
 * xuan
 * 2019-6-20 20:51:26
 * 事件类型
 */

export enum EventType {
   TEST_1 = "TEST_1",

   //#region 网络相关
   /** 发送socket消息 */
   SOCKET_SEND = "SOCKET_SEND",

   /** http请求 */
   HTTP_REQUEST = "HTTP_REQUEST",

   //#endregion

   /** 打开界面 */
   SHOW_VIEW = "SHOW_VIEW",
   /** 关闭界面 */
   CLOSE_VIEW = "CLOSE_VIEW",
}