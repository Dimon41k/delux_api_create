var request = require("request");
var server = require("http");
var urlParser = require("url");
var qs = require('querystring');

var params1 = [
    {
        url: "https://v2.api.tickets.ua/avia/search.json?key=77f59529-cbb9-4a06-814b-b3850ad1ba76&destinations[0][departure]=IEV&destinations[0][arrival]=IST&destinations[0][date]=03-10-2017&destinations[1][departure]=IST&destinations[1][arrival]=IEV&destinations[1][date]=06-10-2017&adt=1&chd=0&inf=0&service_class=A",
        name: "tickets",
        type: "get",
        header: "",
        body: ""
    },
    {
        url: "https://export.otpusk.com/api/tours/search?access_token=29ae1-e3746-4a233-2bbc1-17578&from=1544&to=961&checkIn=2017-10-03&checkTo=2017-10-22&length=7&people=1",
        name: "otpusk",
        type: "get",
        header: "",
        body: ""
    },
    {
        url: "http://roomsxmldemo.com/RXLStagingServices/ASMX/XmlService.asmx",
        name: "vitiana",
        type: "post",
        header: ["Content-Type", "application/json; charset=utf-8"],
        body: `<AvailabilitySearch xmlns='http://www.reservwire.com/namespace/WebServices/Xml'>
                                        <Authority xmlns='http://www.reservwire.com/namespace/WebServices/Xml'>
                                            <Org>TESTDESKV</Org>
                                            <User>xmltest</User>
                                            <Password>xmltest</Password>
                                            <Currency>EUR</Currency>
                                            <Language>en</Language>
                                            <TestDebug>false</TestDebug>
                                            <Version>1.26</Version>
                                        </Authority>
                                        <RegionId>18846</RegionId>
                                        <HotelStayDetails>
                                            <ArrivalDate>2017-10-08</ArrivalDate>
                                            <Nights>7</Nights>
                                            <Nationality>GB</Nationality>
                                                    <Room>
<Guests>
<Adult />
</Guests>
</Room>
                                        </HotelStayDetails>
                                        <HotelSearchCriteria>
                                            <AvailabilityStatus>allocation</AvailabilityStatus>
                                            <DetailLevel>basic</DetailLevel>
                                        </HotelSearchCriteria>
                                    </AvailabilitySearch>`
    },

];
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
                        
                    });
                    if (conteiner.length == array.length) {
                        resolve(conteiner);
                    }
                });
            } else if (url.type === "post") {
                request({
                url: url.url,
                method: url.type,
                json: true,
                headers: {
                    "content-type": "text/xml; charset=utf-8",
                },
                body: url.body
                }, function (error, response, body) {
                    conteiner.push({url: url.url, data: response});
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
            getData(parseGetString(x)).then(function(data){
            res.write(JSON.stringify(data));
            res.end();
            });
        });
}).listen(process.env.PORT, process.env.IP, function() {
    console.log("server run" + process.env.PORT + process.env.IP);
});