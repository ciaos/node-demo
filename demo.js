var http = require("http"),
    url  = require("url"),
    path = require("path"),
    fs   = require("fs");

var handle = {}
handle["/utoken"]         = utokenHandler;

/**
 * server
 */
http.createServer(function (req, res) {
    var pathname=url.parse(req.url).pathname;
    if(typeof handle[pathname] === "function"){
    	handle[pathname](res, req)
    }
    else {
        pathname=__dirname+url.parse(req.url).pathname;
        if (path.extname(pathname)=="") {
            pathname+="/";
        }
        if (pathname.charAt(pathname.length-1)=="/"){
            pathname+="index.html";
        }
        fs.exists(pathname,function(exists){
            if(exists){
                fs.readFile(pathname,function (err,data){
                    res.end(data);
                })
            } else {
                res.writeHead(404, '404 Not Found', {'Content-Type': 'text/html'})
                res.end('<h1>404 Not Found</h1>')
            }
        })
    }
}).listen(8080, "0.0.0.0");

console.log("Server running at http://0.0.0.0:8080/");

/**
 * define a handler
 */
function utokenHandler(res, req){//get token from server
	//1, get client ip
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
	//2, get upload host and token for the client
    	var utoken = require("./utoken");//require this module
	utoken.getHostTokenTs(ip, function(ret){
		//3, show result
		res.writeHead(200)
		res.write(ret)
		res.end()
	})
}
