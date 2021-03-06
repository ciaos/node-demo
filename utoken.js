var http   = require("http"),
    qs     = require('qs'),
    crypto = require("crypto");

/**
 * Configure
 */
var Appid     = "xxxxx"
var Appsecret = "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
var Appname   = "xxx"

/**
 * Module
 */
exports.getHostTokenTs = function(clientIp, callback_func){

	var host, tsecret, ts

	this.uri = {
		host      : "api.dbank.com",
		port      : 80,
		path      : "/rest.php",
		method    : "POST",
		headers   : {
			'Content-Type': 'application/x-www-form-urlencoded',
		}
	}

	var dt = {   
		client_ip : clientIp,
		nsp_app   : Appid,   
		nsp_fmt   : "JSON", 
		nsp_svc   : "nsp.ping.getupsrvip",
		nsp_ts    : Date.parse(new Date()),
		nsp_ver   : "1.0"
	}

	this.processRequest = function(res) {
		var body = ''
		res.on("data",function(chunk){
			body += chunk
		});
		res.on("end",function(){
			try{
				var ret = JSON.parse(body)
			}catch(e){
				body = e.message	
			}
			if(ret && ret.ip){
				var ts = Date.parse(new Date())
				var tmpsecret = crypto.createHmac('sha1', Appsecret).update(ts+"").digest('hex')
				callback_func(ret.ip + " " + tmpsecret + " " + ts)
			}
			callback_func("error")
		});
		res.on("error",function(e){
			callback_func(e.message)
		});
	}

	this.result = function(){
		var md5str = Appsecret
		for (var key in dt) {md5str+=key+dt[key]}
		dt.nsp_key = crypto.createHash("md5").update(md5str+"").digest('hex').toUpperCase()

		var postdata = qs.stringify(dt)
		this.uri.headers["Content-Length"] = Buffer.byteLength(postdata)

		var req = null
		var request_timer = setTimeout(function() {
			req.emit("timeout");
		}, 3000);

		try{
			req = http.request(this.uri, this.processRequest)
			req.on("timeout", function(){
				callback_func("connection timeout")
				return
			})
			req.write(postdata)
			req.end()
		}catch(e){
		}
	}

	this.result();
}


