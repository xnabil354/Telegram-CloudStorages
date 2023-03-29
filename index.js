const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)
const OWNER_ID = process.env.OWNER_ID
const client = bot.telegram;
const fs = require('fs')
let users = JSON.parse(fs.readFileSync('./db/users.json', 'utf8'))
let jwt = JSON.parse(fs.readFileSync('./db/jwt.json', 'utf8'))

function randomString(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function reply(chatid, message, msgid, opts) {
    return client.sendMessage(chatid, message, { reply_to_message_id: msgid, ...opts });
}


bot.on('callback_query', async (ctx) => {
    let userId = ctx.callbackQuery.from.id
    let username = ctx.callbackQuery.from.username
    let firstName = ctx.callbackQuery.from.first_name
    let chatId = ctx.callbackQuery.message.chat.id
    let text = ctx.callbackQuery.data
    let args = text.split(' ').slice(1)
    let command = text.split(' ')[0].toLowerCase()
    let q = args.join(' ');

    try {
        if (text == 'deleteall_yes') {
            users[userId].files = []
            Object.entries(jwt).forEach(([key, value]) => {
                if (value.id == userId) {
                    delete jwt[key]
                }
            })
            fs.writeFileSync('./db/jwt.json', JSON.stringify(jwt, null, 2))
            fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2))
            client.answerCbQuery(ctx.callbackQuery.id, 'All files deleted successfully!', { show_alert: true });
            client.editMessageText(chatId, ctx.callbackQuery.message.message_id, null, `Your files have been deleted all successfully!`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Close', callback_data: 'close' }]] } })
        } else if (text == 'deleteall_no') {
            client.answerCbQuery(ctx.callbackQuery.id, 'Canceled!', { show_alert: true });
        } else if (text == 'close') {
            client.deleteMessage(chatId, ctx.callbackQuery.message.message_id)
        }

        if (command == 'delete_file') {
            let file = args[0]
            let index = users[userId].files.find(x => x.tokens == file)
            if (!index) return client.answerCbQuery(ctx.callbackQuery.id, 'File not found!', { show_alert: true });
            client.editMessageText(chatId, ctx.callbackQuery.message.message_id, null, `Are you sure you want to delete this file?`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Yes', callback_data: `delete_yes ${file}` }, { text: 'No', callback_data: `delete_no ${file}` }]] } })
        }

        if (command == 'delete_yes') {
            let file = args[0]
            let index = users[userId].files.findIndex(x => x.tokens == file)
            if (!users[userId].files.find(x => x.tokens == file)) return client.answerCbQuery(ctx.callbackQuery.id, 'File not found!', { show_alert: true });
            users[userId].files.splice(index, 1)
            delete jwt[file]
            fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2))
            client.answerCbQuery(ctx.callbackQuery.id, 'File deleted successfully!', { show_alert: true });
            client.editMessageText(chatId, ctx.callbackQuery.message.message_id, null, `Your file has been deleted successfully!`, { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: 'Close', callback_data: 'close' }]] } })
        } else if (command == 'delete_no') {
            client.answerCbQuery(ctx.callbackQuery.id, 'Canceled!', { show_alert: true });
            client.editMessageText(chatId, ctx.callbackQuery.message.message_id, null, `Your file has not been deleted!\n[View this file](https://t.me/${bot.botInfo.username}?start=${args[0]})`, { parse_mode: 'Markdown', reply_markup: { inline_keyboard: [[{ text: 'Close', callback_data: 'close' }]] } })
        }




    } catch (err) {
        console.log(err)
    }
})
bot.on('message', async (ctx) => {
    let userId = ctx.message.from.id
    let username = ctx.message.from.username
    let text = ctx.message.text || ctx.message.caption || '';
    let chatId = ctx.message.chat.id;
    let firstName = ctx.message.from.first_name;
    let messageId = ctx.message.from.message_id
    let args = text.split(' ').slice(1)
    let command = text.split(' ')[0].toLowerCase()
    let q = args.join(' ');
    let msgType = ctx.message.document ? 'document' : ctx.message.photo ? 'photo' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video ? 'video' : ctx.message.audio ? 'audio' : ctx.message.voice ? 'voice' : ctx.message.video_note ? 'video_note' : ctx.message.animation ? 'animation' : ctx.message.sticker ? 'sticker' : ctx.message.document ? 'document' : ctx.message.video
    let fileId = ctx.message.document ? ctx.message.document.file_id : ctx.message.photo ? ctx.message.photo[ctx.message.photo.length - 1].file_id : ctx.message.video ? ctx.message.video.file_id : ctx.message.audio ? ctx.message.audio.file_id : ctx.message.voice ? ctx.message.voice.file_id : ctx.message.video_note ? ctx.message.video_note.file_id : ctx.message.animation ? ctx.message.animation.file_id : ctx.message.sticker ? ctx.message.sticker.file_id : ctx.message.document ? ctx.message.document.file_id : ctx.message.video ? ctx.message.video.file_id : ctx.message.audio ? ctx.message.audio.file_id : ctx.message.voice ? ctx.message.voice.file_id : ctx.message.video_note ? ctx.message.video_note.file_id : ctx.message.animation ? ctx.message.animation.file_id : ctx.message.sticker ? ctx.message.sticker.file_id : ctx.message.document ? ctx.message.document.file_id : ctx.message.video ? ctx.message.video.file_id : ctx.message.audio ? ctx.message.audio.file_id : ctx.message.voice ? ctx.message.voice.file_id : ctx.message.video_note ? ctx.message.video_note.file_id : ctx.message.animation ? ctx.message.animation.file_id : ctx.message.sticker ? ctx.message.sticker.file_id : ctx.message.document ? ctx.message.document.file_id : ctx.message.video ? ctx.message.video.file_id : ctx.message.audio ? ctx.message.audio.file_id : ctx.message.voice ? ctx.message.voice.file_id : ctx.message.video_note ? ctx.message.video_note.file_id : ctx.message.animation ? ctx.message.animation.file_id : ctx.message.sticker ? ctx.message.sticker.file_id : ctx.message.document ? ctx.message.document.file_id : ctx.message.video
    let fileName = ctx.message.document ? ctx.message.document.file_name : ctx.message.photo ? ctx.message.photo[ctx.message.photo.length - 1].file_name : ctx.message.video ? ctx.message.video.file_name : ctx.message.audio ? ctx.message.audio.file_name : ctx.message.voice ? ctx.message.voice.file_name : ctx.message.video_note ? ctx.message.video_note.file_name : ctx.message.animation ? ctx.message.animation.file_name : ctx.message.sticker ? ctx.message.sticker.file_name : ctx.message.document ? ctx.message.document.file_name : ctx.message.video ? ctx.message.video.file_name : ctx.message.audio ? ctx.message.audio.file_name : ctx.message.voice ? ctx.message.voice.file_name : ctx.message.video_note ? ctx.message.video_note.file_name : ctx.message.animation ? ctx.message.animation.file_name : ctx.message.sticker ? ctx.message.sticker.file_name : ctx.message.document ? ctx.message.document.file_name : ctx.message.video ? ctx.message.video.file_name : ctx.message.audio ? ctx.message.audio.file_name : ctx.message.voice ? ctx.message.voice.file_name : ctx.message.video_note ? ctx.message.video_note.file_name : ctx.message.animation ? ctx.message.animation.file_name : ctx.message.sticker ? ctx.message.sticker.file_name : ctx.message.document ? ctx.message.document.file_name : ctx.message.video ? ctx.message.video.file_name : ctx.message.audio ? ctx.message.audio.file_name : ctx.message.voice ? ctx.message.voice.file_name : ctx.message.video_note ? ctx.message.video_note.file_name : ctx.message.animation ? ctx.message.animation.file_name : ctx.message.sticker ? ctx.message.sticker.file_name : ctx.message.document ? ctx.message.document.file_name : ctx.message.video
    if (!users[userId]) {
        users[userId] = {
            id: userId,
            username: username || firstName,
        }
        fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2))
    }
    // On bot add to group
    if (ctx.message.new_chat_members) {
        if (ctx.message.new_chat_members[0].username == bot.botInfo.username) {
            await ctx.reply(`Sorry, this bot only works in private chat.`);
            return ctx.leaveChat()
        }
    }
    // On bot kicked from group
    if (ctx.message.left_chat_member) {
        if (ctx.message.left_chat_member.username == bot.botInfo.username) {
            return
        }
    }

    switch (command) {
        case '/start':
            console.log(q)
            if (q && jwt[q]) {
                let userIdS = jwt[q].id;
                let fileIds = jwt[q].fileId;
                if (!userIdS || !fileIds) return ctx.reply(`Hello ${username || firstName}, i'm a bot that can save your files in my database and you can share it with your friends.\n\n*Commands:*\n/start - Start the bot\n/help - Show help message\n\n*How to use:*\n1. Send me a file\n2. Copy the link and share it with your friends\n\n*Note:*\nThis bot is still in beta, so if you find any bugs, please report it to @xzhndvs`, { parse_mode: 'Markdown' });
                if (!users[userIdS]) return ctx.reply('Sorry, user not found');
                if (!users[userIdS].files.find(x => x.id == fileIds)) return ctx.reply('Sorry, file not found');
                let file = users[userIdS].files.find(x => x.id == fileIds);
                switch (file.type) {
                    case 'photo':
                        ctx.replyWithPhoto(fileIds, { caption: `*${file.caption}*\nFile uploaded by [${users[userIdS].username}](tg://user?id=${userIdS})`, parse_mode: 'Markdown' });
                        break;
                    case 'video':
                        ctx.replyWithVideo(fileIds, { caption: `*${file.caption}*\nFile uploaded by [${users[userIdS].username}](tg://user?id=${userIdS})`, parse_mode: 'Markdown' });
                        break;
                    case 'audio':
                        ctx.replyWithAudio(fileIds, { caption: `*${file.caption}*\nFile uploaded by [${users[userIdS].username}](tg://user?id=${userIdS})`, parse_mode: 'Markdown' });
                        break;
                    case 'document':
                        ctx.replyWithDocument(fileIds, { caption: `*${file.caption}*\nFile uploaded by [${users[userIdS].username}](tg://user?id=${userIdS})`, parse_mode: 'Markdown' });
                        break;
                    case 'animation':
                        ctx.replyWithAnimation(fileIds, { caption: `*${file.caption}*\nFile uploaded by [${users[userIdS].username}](tg://user?id=${userIdS})`, parse_mode: 'Markdown' });
                        break;
                }
            } else {
                ctx.reply(`Hello ${username || firstName}, i'm a bot that can save your files in my database and you can share it with your friends.\n\n*Commands:*\n/start - Start the bot\n/help - Show help message\n\n*How to use:*\n1. Send me a file\n2. Copy the link and share it with your friends\n\n*Note:*\nThis bot is still in beta, so if you find any bugs, please report it to @xzhndvs`, { parse_mode: 'Markdown' });
            }

            break;
        case '/myfiles':
            if (!users[userId].files.length) return ctx.reply('You don\'t have any files');
            files = users[userId].files.map((x, i) => `${i + 1}. [${x.fileName}](${x.link})`).join('\n');
            buttons = [];
            for (let i = 0; i < users[userId].files.length; i++) {
                buttons.push([{ text: `${i + 1}. ${users[userId].files[i].fileName}`, callback_data: `file_${users[userId].files[i].tokens}` }]);
            }
            ctx.replyWithMarkdown(`*Your files:*\n${files}`, { reply_markup: { inline_keyboard: buttons } });
            break;
        case '/delete':
            if (!users[userId].files.length) return ctx.reply('You don\'t have any files');
            files = users[userId].files.map((x, i) => `${i + 1}. [${x.caption} - ${x.fileName}](${x.link})`).join('\n');
            buttons = [];
            for (let i = 0; i < users[userId].files.length; i++) {
                buttons.push([{ text: `${i + 1}`, callback_data: `delete_file ${users[userId].files[i].tokens}` }]);
            }
            ctx.replyWithMarkdown(`*Your files:*\n${files}`, { reply_markup: { inline_keyboard: buttons } });
            break;
        case '/deleteall':
            if (!users[userId].files.length) return ctx.reply('You don\'t have any files');
            ctx.replyWithMarkdown(`*Are you sure you want to delete all your files?*\n\n*Note:*\nThis action cannot be undone!`, { reply_markup: { inline_keyboard: [[{ text: 'Yes', callback_data: 'deleteall_yes' }, { text: 'No', callback_data: 'deleteall_no' }]] } });
            break;
        case "/help":
            let shareText = `Cobain Nih!!
CloudFiles Storage yang akan menyimpan File Data mu dengan Mudah secara Online,
Drag & Drop File mu disini, Nanti BOT otomatis akan menyimpan filemu secara Online dan bahkan bisa dibagikan secara langsung.

https://t.me/${ctx.botInfo.username.toLowerCase()}`;
            let capt = `Hai Kak, Selamat Datang👋\n\nSaya Adalah TEKAJEH CloudFiles BOT, Tempat untuk menyimpan Data File Kamu dengan mudah secara online, dilengkapi Feature Share Files, so... Temenmu juga bisa melihat file mua dengan mudah....*Commands:*\n/start - Start the bot\n/help - Show help message\n/myfiles - Show your files\n/delete - Delete your files\n/deleteall - Delete all your files\n/info - Information of Tekajeh CloudFiles BOT\n\n*How to use:*\n1. Send me a file\n2. Copy the link and share it with your friends\n\n*Note:*\nThis bot is still in beta, so if you find any bugs, please report it to @xzhndvs`
            reply(chatId, capt.trim(), messageId, {
                parse_mode: "Markdown", reply_markup: {
                    inline_keyboard: [
                        [{ text: '🚀 Instagram', url: "https://instagram.com/nblhnzm354" }],
                        [{ text: '🔗 Whatsapp', url: "https://wa.me/6281281524356" }],
                        [{ text: '🌐 Official Website', url: "https://xzhndvs.tech" }],
                        [{ text: '🛠 Find Bugs ?', url: "https://t.me/xzhndvs" }],
                        [{ text: '📢 Share Bot', url: "https://t.me/share/url?" + new URLSearchParams({ text: shareText }) }]
                    ]
                }
            });
            break;
        case '/broadcast':
            if (userId != OWNER_ID) return;
            success = 0;
            for (let i of Object.keys(users)) {
                try {
                    await ctx.telegram.sendMessage(i, `*Broadcast:*\n${q}`, { parse_mode: 'Markdown' });
                    success++;
                } catch (e) {
                    console.log(e);
                }
            }
            ctx.reply(`*Broadcast sent!*\nSuccess: \`${success}\`\nFailed: \`${Object.keys(users).length - success}\``, { parse_mode: 'Markdown' });
            break;
        case "/info":
            det = new Date
            x = await reply(chatId, "Wait!", messageId)
            dex = new Date - det
            client.editMessageText(chatId, x.message_id, null, `Pong!!!\nSpeed : ${dex < 1000 ? dex : dex / 1000} ${dex < 1000 ? "ms" : "Seconds"}

▾ SERVER INFORMATION ▾
° Plɑtform : ${process.platform}
° Nodejs : ${process.version}`);
            break;

        default:
            if (msgType == 'photo' || msgType == 'video' || msgType == 'audio' || msgType == 'document' || msgType == 'animation') {
                tokens = randomString(10);
                let links = `https://t.me/${ctx.botInfo.username}?start=${tokens}`;
                jwt[tokens] = {
                    id: userId,
                    fileId: fileId
                };
                ctx.replyWithMarkdown(`*Your file has been uploaded successfully!*\nID: \`${tokens}\`\n\n*Link:*\n\`${links}\``, { disable_web_page_preview: true, reply_markup: { inline_keyboard: [[{ text: 'Share', url: `https://t.me/share/url?url=${links}` }], [{ text: 'Close', callback_data: 'close' }]] } });
                users[userId].files.push({
                    id: fileId,
                    type: msgType,
                    caption: text || 'No caption',
                    link: links,
                    tokens,
                    fileName: fileName || randomString(10)
                });
                fs.writeFileSync('./db/users.json', JSON.stringify(users, null, 2));
                fs.writeFileSync('./db/jwt.json', JSON.stringify(jwt, null, 2));
            } else {
                ctx.reply('Send me a file\n\nFile supported:\n- Photo\n- Video\n- Audio\n- Document\n- Animation');
            }
            break;
    }
});

bot.launch()
client.getMe().then((botInfo) => {
    console.log(`Bot ${botInfo.username} is running`)
}).catch((err) => {
    console.log(err)
})