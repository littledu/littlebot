const axios = require('axios');
const _ = require('lodash');
const path = require('path');
let cheerio = require('cheerio');

exports = module.exports = async function onMessage(message) {
  const room = message.room();
  const sender = message.from();

  let content = message.content();
  let topic = room ? '[' + room.topic() + ']' : '';
  let mTime = message.rawObj.MMDigestTime;

  console.log(`[${mTime}] ${topic} <${sender.name()}> : ${content}`);

  //如果是系统消息则不进行回复
  if(message.type() === 10000) return;

  /*******************************************************************/

  let features = {
    time: '时间',
    joke: '笑话'
  };
  let Fns = {
    time: function(message){
      let d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth();
      let day = d.getDate();
      let hour = d.getHours();
      let minute = d.getMinutes();
      let second = d.getSeconds();
      let week = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];

      message.say(`@${sender.name()} ${year}年${month+1}月${day}日 星期${week} ${hour}:${minute}:${second}`);
    },

    joke: function(message){
      let pageTotal = 35;
      let pageNum = _.random(35);
      let qiushibaikeUrl = `http://www.qiushibaike.com/8hr/page/${pageNum}`;
      axios.get(qiushibaikeUrl).then(function(response){
        let $ = cheerio.load(response.data);
        let htmlArr = $('.content-text span').text().split(/\n+/);
        let result = [];

        htmlArr.forEach(function(item){
          if(item.length >= 30){
            result.push(item);
          }
        });

        let output = `${result[_.random(result.length-1)]} [来自 糗事百科]`;

        message.say(output);
      })
    }
  };
  
  let feature;
  let keyword;

  content = content.trim();

  if(content[0] === '#'){
    feature = content.substring(1).split(/\s+/);

    if(feature.length >= 2){
      keyword = feature[1];
    }

    feature = feature[0];

    for(var i in features){
      if(feature.indexOf(features[i]) != -1){
        Fns[i](message, keyword);
      }
    }
  }else if((room && content.indexOf('@小小杜') != -1) || (!room && sender.name() !== '小小杜')){

    if(room){
      keyword = content.split('@小小杜');
      if(keyword && keyword.length > 1 && keyword[1]){
        keyword = keyword[1].trim();
      }
    }else{
      keyword = content;
    }

    axios.post('http://www.tuling123.com/openapi/api', {
        key: '358a41932e654a01973df1cf8cfca054',
        info: keyword,
        userid: sender.id.substring(1, 32)
      })
      .then(function (response) {
        let data = response.data;
        let reply;

        if(data.code === 100000){ //文本
          reply = data.text;
        }else if(data.code === 200000){ //链接
          reply = `${data.text}: \n\n${data.url}`;
        }else if(data.code === 302000) {//新闻
          reply = `${data.text}: \n\n`;
          if(data.list && data.list.length){
            let list = data.list;
            let length = list.length > 5 ? 5 : list.length;
            for(let i = 0; i < length; i++){
              reply += `${i+1}. ${list[i].article}\n详情点击：${list[i].detailurl}\n\n`;
            }
          }
        }else if(data.code === 308000){ //菜谱
          reply = `${data.text}: \n\n`;
          if(data.list && data.list.length){
            let list = data.list;
            let length = list.length > 5 ? 5 : list.length;
            for(let i = 0; i < length; i++){
              reply += `${i+1}. ${list[i].name}\n材料：${list[i].info}\n详细做法点击：${list[i].detailurl}\n\n`;
            }
          }
        }else if(data.code === 40004){
          reply = `小小杜今天累了，不想再说话了，客官明天再来吧，么么嗒～`;
        }

        reply && message.say(reply);

      })
      .catch(function (error) {
        console.log(error);
      });
  }
}