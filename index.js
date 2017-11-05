var request = require("request");
var server = require("http");
var urlParser = require("url");
var qs = require('querystring');
/*
дописать хеддеры в скрипт для большей универсальности
*/
var mP = [];
function getPostData(req, res) {
    return new Promise(function(resolve, reject){
            if (req.method == 'POST') {
            var jsonString = '';
    
           req.on('data', function (data) {
                jsonString += data;
            });
    
           req.on('end', function () {
                resolve(jsonString);
            });
    
       }else {
            res.end("Сделай Post request, чувак. И будет тебе счастье.");
        }
    });
}
function getData(urls) {
var conteiner = [];
return new Promise(resolve => {
urls.forEach(function(url, idx, array) {
            if(url.type === "get") {
                request({
                url:url.url,
                method: url.type,
                json: true
                }, function(error, response, body) {
                    conteiner.push({
                        url: url.url,
                        data: response,
                        name: url.name,
                        
                   });
                    if (conteiner.length == array.length) {
                        resolve(conteiner);
                    }
                });
                function getOtpuskTimeout(){
                    request({
                        url:url.url,
                        method: url.type,
                        json: true
                        }, function(error, response, body) {
                            conteiner.push({
                                url: url.url,
                                data: response,
                                name: url.name,
                            });
                        })
                }
                if(url.name.indexOf("otpusk") != -1)
                    setTimeout(getOtpuskTimeout, 4000);
            } else if (url.type === "post") {
                request({
                url: url.url,
                method: url.type,
                json: false,
                headers: {
                    "content-type": "text/xml; charset=utf-8",
                },
                body: url.body
                }, function (error, response, body) {
                    conteiner.push({
                        url: url.url,
                        data: response,
                        name: url.name,
                        
                   });
                    if (conteiner.length == array.length) {
                        resolve(conteiner);
                    }
                });
            }
        });
    });
}
function parseGetString(req) {
    
   var q = urlParser.parse(decodeURIComponent("/?"+req), true).query;
    var counter = 0;
    var params = [];
        for(point in q) {
          counter++;
          param = {};
          if(q["name"+counter+"n"]){
                  param["name"] = q["name"+counter+"n"];
                  param["url"] = q["url"+counter+"n"];
                  param["type"] = q["type"+counter+"n"];
                  param["body"] = q["body"+counter+"n"];
                  params.push(param);
          }
        }
   return params;
}
server.createServer(function(req, res) {
        res.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
        getPostData(req,res).then(function(x){
            getData(parseGetString(x)).then(function(data) {
            res.write(JSON.stringify(data));
            res.end();
            });
        });
}).listen(8080, function() {
    console.log("server run on " + process.env.IP+ ":" + process.env.PORT);
});