/**
 * @Author: xuan
 * @Date: 2019-6-13 11:40:34
 * @Description: http封装
 */

import EventManager from "./EventManager";
import { EventType } from "../data/EventType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HttpHelper {
    private static _instance: HttpHelper = null;

    public static getInstance(): HttpHelper {
        if (null == this._instance) {
            this._instance = new HttpHelper();
            this._instance.init();
        }
        return this._instance;
    }

    private init(): void {
        this.addEventListener();
    }

    private addEventListener(): void {
        EventManager.getInstance().addListener(EventType.HTTP_REQUEST, this._onHttpRequest, this);
    }

    /**
     * 
     * @param data {url, requestType:请求类型（POST,GET）, successCB, failCB,}
     */
    private _onHttpRequest(data: any): void {
        // 默认为POST
        let isPost: boolean = ((data['requestType'] || 'POST') == 'POST');
        this.doRequest(data['url'], isPost, data['successCB'], data['failCB']);
    }

    public doRequest(url: string, bPost?: boolean, successCB?: any, failedCB?: any): void {
        let httpMethod: string = "";
        if (bPost || null == bPost || "undefined" == typeof (bPost)) {
            httpMethod = "POST"; // 默认为POST
        } else {
            httpMethod = "GET";
        }

        let xhr: XMLHttpRequest = new XMLHttpRequest();
        xhr.onreadystatechange = (ev: Event) => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    console.log("接收到数据： ", response)
                    if (response) {
                        var responseJson = JSON.parse(response);
                        if (successCB) successCB(responseJson);
                    } else {
                        console.log("返回数据不存在")
                        if (successCB) successCB(false);
                    }
                }
                else {
                    console.log("请求失败")
                    if (failedCB) failedCB("请求失败");
                }
            }
        }
        xhr.ontimeout = (ev: ProgressEvent) => {
            cc.error("http request time out: ", ev);
            if (failedCB) failedCB("time out");
        }
        xhr.onerror = (ev: ProgressEvent) => {
            cc.error("http request error: ", ev);
            if (failedCB) failedCB("error");
        }

        xhr.open(httpMethod, url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send();
    }
}