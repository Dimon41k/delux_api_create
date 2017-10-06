const request = require('request');

request({
 method: "get",url:'https://export.otpusk.com/api/tours/search?access_token=29ae1-e3746-4a233-2bbc1-17578&from=1544&to=961&checkIn=2017-10-03&checkTo=2017-10-22&length=5&people=1',
 json:true
 }, (err, res, body) => {
  console.log(body);

});