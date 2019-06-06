# 记一次 MongoDB 生产报错

<img src="mongodb.jpeg">

*2019/05/30*

5 月 29 日早上，在公司忙着处理好几年没用的旧设备，接到个电话：“XX 系统挂了，报 500……”

回到位置上，打开“某聊天软件”，除了业务方的群，还有就是新拉的运维排查群，运维童鞋真给力，帮我们排查来自底层硬件或网络方面的问题。

### 一、现象

1. XX 系统及其管理后台能正常打开（首页正常）
2. 但我一点 OAuth 登录，第三方似乎登录正常，URL 跳转回到自己域下时，页面直接打印 JSON（接口报错）

```json
{
  "status": 500,
  "error": "Topology was destroyed"
}
```

### 二、自我排查（1）

一开始还以为是第三方登录报的，后来一搜才知道，是 MongoDB。

说是和连接池参数有关，但 XX 系统运行 2 年，从未定制过这类参数，也从未出现这个报错。如今首次遇到这种情况，我相信属于偶发状况，属于实例运行中的临时负面状态。

因此我决定，先尝试一次重启进程，观察是否解决。重启进程，对于我们来说，就是重新发版、构建一次。

进程重启后，果然问题解决了，看来我的决策是非常正确的。

此时，群里运维同学也有了结论……

### 三、运维排查

”AWS 报 system status check fail 和 instance status check fail，那个时候肯定是整体 ec2 的主机 hang 住了。“

”XX 市 XX 可用区的服务器大规模受到影响。“

”这个是故障表现报错现象，根本原因是昨晚 AWS 底层服务器故障了，我们在开 case 给厂家，他们也会给我们事故报告，其他很多项目也收到影响。“

看来，不仅仅是我们的 XX 系统，其他系统也收到了影响。

并且他们反映，这次 MongoDB 异常没有纳入监控，因此未提前收到告警，可能由于早期自建而非独立服务。

我悬着的一颗心算是落定了，为了安抚替接手该系统的同事，我本来还说”写事故报告找我吧“；如今，有勇敢的 DevOps 同事在前方冲锋陷阵，我感到既欣喜又振奋。

### 四、自我排查（2）

事故解决后以及运维排查后，回过头来，我们继续探讨问题本身……

”查了下，应该就是数据库 hang 断开连接啦，而应该是底层故障导致数据库主机 hang。“ —— 私下求教了另一位运维同学

我也查了一波资料，发现一个不错的回答，道出了真相：

<small>StackOverflow 链接：<br>
[node.js - mongoError: Topology was destroyed - Stack Overflow](https://stackoverflow.com/questions/30909492/mongoerror-topology-was-destroyed/39831825)</small>

我们不管连接数（poolSize=5），当连接出现问题，MongoDB 默认会重试 30 次（reconnectTries=30），每秒一次（reconnectInterval=1000）。

```js
/* mongodb (Node SDK) 默认值
 * @param {number} [options.poolSize=5] poolSize The maximum size of the individual server pool.
 * @param {number} [options.reconnectTries=30] Server attempt to reconnect #times
 * @param {number} [options.reconnectInterval=1000] Server will wait # milliseconds between retries
 */
 ```

这次问题在于，机器 hang 住，MongoDB 故障，Node 进程连接出现异常，曾经尝试 30 次无果，就晾在一边了囧（直至重启）。这就解释了为什么我们重启后就解决。

该回答建议我们提高重试次数到 max（接近无穷）：

```js
// sets how many times to try reconnecting
reconnectTries: Number.MAX_VALUE,
```

具体利弊我们没有再深究，但我会把这个改动列入计划……（假设我还是 Owner）

### 四、对业务方的影响

根据以上诊断，还原当时系统所遭受的境遇，故障对业务方造成的影响如下：

1. 当天早上，用户无法正常登录或使用系统（影响终端用户）
2. 供应商未在早上 10 点收到系统推送的订单邮件（影响供应商服务）
3. 管理员无法登录管理后台，手动导出订单给供应商（管理员无法临时补救）

### 五、总结、提升

通过此次事件，可以做的优化项有很多，包括：

1. 持续的故障（这类 DB 错误影响发邮件），应发告警邮件+即时通讯
2. MongoDB 为早期自建，应接入独立服务并监控
3. 系统需要补上消息队列机制，在途请求不受影响
4. 定时任务应有管理界面，可随时手动触发开关
