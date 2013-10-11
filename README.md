node-demo
=========

华为存储平台上传SDK服务器端
* * *

应用场景
-----------
> 部署到node服务器上，客户端用户访问服务器获取上传IP和密钥，然后可以往目标服务器直接上传文件

使用方法
----------

* 配置utoken.js文件
<pre><code>
var Appid     = "xxxxx" /*应用ID*/
var Appsecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  /*应用密钥*/
var Appname   = "xxxxxx"  /*应用名称*/
</code></pre>

* 将utoken.js放到服务器合适目录下，添加引用如下：
<pre><code>
utoken = require("./utoken");
function utokenHandler(res, req){//get token from server
        //1, get client ip
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
        //2, get upload host and token for the client
        utoken.getHostTokenTs(ip, function(ret){
                //3, show result
                res.writeHead(200)
                res.write(ret)
                res.end()
        })
}
</code></pre>

* 客户端访问该handler会得到“上传IP 上传密钥 时间戳”的字符串。具体上传方法参照相关文档说明

Weibo Account
-------------

Have a question? [@littley](http://weibo.com/littley)
