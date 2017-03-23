const {
    Contact
} = require('wechaty');

exports = module.exports = async function onFriend(contact, request) {
    if (request) {
        let name = contact.name();
        await request.accept();
        await contact.say('你好，我是小小杜，是一个机器人，你可以随意的跟我聊天哦');

        const contactFindByName = await Contact.find({
            name: '杜'
        });

        contactFindByName.say(`${name} 添加 小小杜 为好友了。`);

        console.log(`Contact: ${name} send request ${request.hello}`);
    }
}