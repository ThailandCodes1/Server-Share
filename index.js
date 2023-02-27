const { Client, Events, Partials, EmbedBuilder } = require('discord.js');
const cooldown = new Set();

const client = new Client({
    intents: 131071,
    partials: [Partials.Channel]
});
const { BlackList } = require('./DataBase/Models/data');

require('./DataBase/connect');
require('./uptime');
client.on(Events.ClientReady, async () => {
    await console.log(client.user.tag);
    await client.user.setActivity(`Idk`, { type: 'WATCHING' });
    await client.user.setStatus('idle');
}).login(process.env.token);

const prefix = '$'


client.on(Events.MessageCreate, async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(message.channel.id !== 'channel') return;
    if (command === 'link') {

        let link = args[0];

        if (!link) {
            return message.reply({ content: "link" });
        }
        if (!link.startsWith('https://discord.gg/')) {
            return message.reply({ content: '**Please specify a server link.**', allowedMentions: { repliedUser: false } });
        }
        if (cooldown.has(message.author.id)) {
            return message.reply({ content: `**Please wait for a few hours before posting again.**` });
        }

        await client.fetchInvite(link).then(async (data) => {
            let anti = await BlackList.findOne({
                GuildId: data.guild.id
            })


            if (!anti) {
                await client.fetchInvite(link).then(async (serverlink) => {
                    await cooldown.add(message.author.id);
                    let time = new Date();
                    let avatar = await client.channels.fetch('channelid');//شات الفتارات
                    let server = await client.channels.fetch('channelid');//شات السيرفر
                    let logs = await client.channels.fetch('channelid');

                    let embed = new EmbedBuilder()

                    embed.setDescription(`
                    > **Select your server type**
                    **1.** Server
                    **2.** Avatar
                    **0.** Cancel`)

                    let embed1 = new EmbedBuilder()
                    embed1.setDescription(`
                    > **Share By**: ${message.author} ID: (${message.author.id})
                    > **Server Link**: ${serverlink} ID: (${serverlink.guild.id})
                    > **Server name**: ${serverlink.guild.name} 
                    `)
                    embed1.setColor('Aqua')
                    embed1.setTimestamp()


                    let messages = await message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } })
                    let filter = m => m.author.id == message.author.id
                    await message.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] }).then(async (collected) => {

                        if (collected.first().content == '1') {
                            await cooldown.add(message.author.id)
                            await message.delete();
                            await messages.delete();
                            await collected.first().delete();
                            await logs.send({ embeds: [embed1] });
                            await message.channel.send({content : 'Done'})
                            return await server.send({ content: `**${serverlink.guild.name}**\n${data}` });
                        }
                        if (collected.first().content == '2') {
                            await cooldown.add(message.author.id)
                            await message.delete();
                            await messages.delete();
                            await logs.send({ embeds: [embed1] });
                            await collected.first().delete();
                            await message.channel.send({content : 'Done'})
                            return await avatar.send({ content: `**${serverlink.guild.name}**\n${data}` });
                        }
                        if (collected.first().content == '0') {
                            await cooldown.delete(message.author.id)
                            await message.delete();
                            await messages.delete();
                            return await collected.first().delete();
                        }
                    })
                }).catch(async (err) => {
                    await message.channel.send({ content: 'Please specify a valid link.' });
                    await cooldown.delete(message.author.id);
                    console.error(err);
                });
            } else {
                await message.channel.send({ content: 'رابط بالع بلاك لست' });
                await cooldown.delete(message.author.id);
            }
        }).catch(async (err) => {
            await message.channel.send({ content: 'Please specify a valid link.' });
            await cooldown.delete(message.author.id);
            console.error(err);
        });

        setTimeout(async () => {
            await cooldown.delete(message.author.id);
        }, 86400000);
    }
})
// GuildId 
// OwnerID 
// ServerName

client.on(Events.MessageCreate, async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (message.author.id !== 'id owner') return
    if (command === 'black-add') {

        let server = args[0];

        if (!server) {
            return message.reply({ content: 'id server', allowedMentions: { repliedUser: false } });
        }



            let test = await BlackList.findOne({
                GuildId: server
            });

            if (!test) {
                await BlackList.create({
                    GuildId: server,

                });
                let embed1 = new EmbedBuilder()
                embed1.setDescription('تم اعطاء سيرفر بلاك لست')
                await message.reply({ embeds: [embed1], allowedMentions: { repliedUser: false } });

            } else {
                let embed2 = new EmbedBuilder()
                embed2.setDescription('سيرفر بالع بلاك من قبل')
                await message.reply({ embeds: [embed2], allowedMentions: { repliedUser: false } });
            }
    }

    if (command === 'black-remove') {

        let server = args[0];

        if (!server) {
            return message.reply({ content: 'link server', allowedMentions: { repliedUser: false } })
        }

            let fetch = await BlackList.findOne({
                GuildId: server
            });

            if (!fetch) {
                let embed2 = new EmbedBuilder()

                embed2.setDescription("سيرفر معندو بلاك لست")

                await message.reply({ embeds: [embed2], allowedMentions: { repliedUser: false } });
            } else {
                await BlackList.deleteMany({
                    GuildId: server
                }).then(async () => {

                    let embed1 = new EmbedBuilder()

                    embed1.setDescription("تم حذف البلاك لست")
                    embed1.setColor("NotQuiteBlack")

                    await message.reply({ embeds: [embed1], allowedMentions: { repliedUser: false } });
                });
            }
    }
})

// client.on(Events.MessageCreate, async message => {
//     if (!message.content.startsWith(prefix) || message.author.bot) return;
//     const args = message.content.slice(prefix.length).trim().split(/ +/);
//     const command = args.shift().toLowerCase();

//     if (command === 'cooldawn') {


//         await message.channel.send({content : `${cooldown}`})
//     }
// })

// async function DeleteChat() {

//     let guild = await client.guilds.cache.get('1050075599441514547')
//     let channel = await guild.channels.fetch('1061237610149842964')

//     await channel.bulkDelete('100').catch(er => { return })
//     await channel.send({
//         content: `_**/color**: Change your color._
//     _**.bl**: Black & white image._
//     _**.cl**: Colored image._
//     _**.link**: Share your server link._
//     `, files: ['https://cdn.discordapp.com/attachments/726891667403178074/931355057709002782/20220107_055457.png']
//     }).catch(er => { return });
// }

// setInterval(async () => {
//     await DeleteChat();
// }, 60_00);
