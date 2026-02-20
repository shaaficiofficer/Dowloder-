const TelegramBot = require('node-telegram-bot-api');
const { exec } = require('child_process');
const fs = require('fs');

// Waxaan Token-ka ka akhrinaynaa Kinesis Cloud (Ammaanka dartiis)
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Asc! Bot-kan waxaa lagu dhisay Node.js. Soo dir link-ga!");
});

bot.on('message', (msg) => {
    const url = msg.text;
    if (url.startsWith('http')) {
        bot.sendMessage(msg.chat.id, "Waan soo dejinayaa, fadlan sug...");

        // Waxaan isticmaalaynaa yt-dlp si uu u soo dejiyo
        exec(`yt-dlp -o video.mp4 ${url}`, (error) => {
            if (error) {
                bot.sendMessage(msg.chat.id, `Cilad: ${error.message}`);
                return;
            }

            // U dirista video-ga
            bot.sendVideo(msg.chat.id, 'video.mp4').then(() => {
                fs.unlinkSync('video.mp4'); // Tirtir file-ka markuu diro
            });
        });
    }
});

