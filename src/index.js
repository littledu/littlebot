const {Wechaty, Message} = require('wechaty');

Wechaty.instance()
  .on('scan', (url, code) => console.log(`Scan QR Code to login: ${code}\n${url}`))
  .on('login', user => console.log(`User ${user} logined`))
  .on('logout', user => {
    console.log(`user ${user} logout`)
  })
  .on('message', message => {
    console.log(`Message: ${message}`);

    if(message.content().indexOf('小杜测试') != -1){
      message.to('filehelper');
      message.say('hahahah');
    }
  })
  .init();

