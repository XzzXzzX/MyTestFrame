// Learn TypeScript:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

/**
 * xuan
 * 2019-6-11 19:39:42
 * 日志封装
 * 
 * 可设置自定义的颜色，开启关闭不同tag的日志
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class AppLog {

    /**
     * 日志颜色
     */
    static logColor = {
        White: "color:white;",
        Black: "color:black;",
        Red: "color:red;",
        Green: "color:green;",
        Yellow: "color:yellow;",
        Gray: "color:gray;",
        Custom1: "color:#123212;"
    }

    /**
     * 日志cfg
     */
    static logConfig = {
        printzx:{ bOpen: true, color: AppLog.logColor.Green },
        print1:{ bOpen: false, color: AppLog.logColor.Gray },
    }

    /**
     * 是否开启日志
     */
    public static bOpenLog = true;

    /**
     * 获取系统的时间
     * 如 [00:00:00.000]  时:分:秒.毫秒
     */
    public static getSysTime(): string
    {
        let str = '';
        let date = new Date();
        let timeStr = '';
        // 时
        str = date.getHours() + '';
        timeStr += ((str.length == 1) ? ('0' + str) : str) + ':';

        // 分
        str = date.getMinutes() + '';
        timeStr += ((str.length == 1) ? ('0' + str) : str) + ':';
        
        // 秒
        str = date.getSeconds() + '';
        timeStr += ((str.length == 1) ? ('0' + str) : str) + '.';
        
        // 毫秒
        str = date.getMilliseconds() + '';
        if (str.length == 1) str = "00" + str;
        if (str.length == 2) str = "0" + str;
        timeStr += str;

        timeStr = '[' + timeStr + ']';

        return timeStr;
    };

    /**
     * 获取调用堆栈信息
     * @param index 选择堆栈信息中的第几条信息获取对应的类和方法名
     */
    public static getStack(index: number): string
    {
        let stackStr = '';

        let e = new Error();
        let eInfo = e.stack;
        // console.log(eInfo);
    
        /**
         * 
            0: "Error"
            1: "    at getStack (<anonymous>:5:13)"
            2: "    at <anonymous>:17:1"
         */
        let infoList = eInfo.split('\n');
    
        // 去掉第一行
        infoList.shift();
    
        let result = [];
        infoList.forEach(function (line) {
            // 去掉每行的开头 '    at '
            line = line.substring(7);
    
            let strs = line.split(' ');
            if (strs.length < 2)
            {
                result.push(strs[0]);
            } 
            else 
            {
                result.push({[strs[0]] : strs[1]});
            }
        });
        // console.log(infoList);

        let list = [];
        if(index <= result.length-1)
        {
            for(var a in result[index])
            {
                list.push(a);
            }
        }
        if( list.length > 0 ) 
        {
            var splitList = list[0].split(".");
            if( splitList.length >=2 ) 
            {
                return ("【"+splitList[0] + "." + splitList[1] + "】");
            }
            return "【" + splitList[0] + "】";
        }
        return stackStr;
    }

    /**
     * 打印输出
     * @param msg 输出信息
     * @param printname 调用的打印配置名
     */
    static print(msg: any, printname?: string)
    {
        let cfg: any = this.logConfig[printname];
        // 默认的日志配置
        if (null == cfg)
        {
            cfg.bOpen = true;
            cfg.color = this.logColor.Black;
        }
        if (!this.bOpenLog || (!cfg.bOpen))
        {
            return;
        }

        let color = cfg.color;

        if (null != msg && !Array.isArray(msg) && typeof msg === 'object')
        {
            // msg = JSON.stringify(msg);
            // var cache = [];
            // 处理报错  Converting circular structure to JSON 循环对象引用结构无法转为json str
            // msg = JSON.stringify(msg, function(key, value) {
            //     if (typeof value === 'object' && value !== null) {
            //         if (cache.indexOf(value) !== -1) {
            //             // Circular reference found, discard key
            //             return;
            //         }
            //         // Store value in our collection
            //         cache.push(value);
            //     }
            //     return value;
            // });
            // cache = null; // Enable garbage collection
        }
        let log = cc.log || console.log || window['log'];
        let arr = Array.prototype.slice.call(arguments);

        if (typeof arr[0] !== 'object')
        {
            log.call(this, "%c%s%s" + arr[0], color, this.getSysTime(), this.getStack(3));
        }
        else
        {
            log.call(this, "%c%s%s" , color, this.getSysTime(), this.getStack(3), arr[0]);
        }
    }
}

export function printzx(msg: any) {
    AppLog.print(msg, "printzx");
}

export function print1(msg: any) {
    AppLog.print(msg, "print1");
}