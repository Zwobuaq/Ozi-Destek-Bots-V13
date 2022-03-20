const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');  
const fs = require('fs');
const { Client, Collection, MessageActionRow, MessageButton } = require('discord.js');
const Discord = require('discord.js');
const client = (global.bot = new Client({
  fetchAllMembers: true,
  intents: [ 32767 ],
  partials: ['CHANNEL', 'MESSAGE', 'REACTION'],
})); 
const discordModals = require('discord-modals');
discordModals(client);

const ayar = require('./jaylen.json');
const { çizgi, green, red, star } = require('./jaylen.json');


client.on('ready', async () => {
  setInterval(() => {
  const sex = Math.floor(Math.random() * (ayar.Activity.length));
  client.user.setActivity(`${ayar.Activity[sex]}`, {
    type: "STREAMING",
    url: "https://www.twitch.tv/jaylenozi"});
}, 10000);
  client.user.setStatus("idle");
})


client.commands = new Collection();
var commands = [];

fs.readdirSync("./commands/").forEach((file) => {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
  commands.push(command.data.toJSON());
});


const rest = new REST({ version: '9' }).setToken(ayar.BotToken);

(async () => {
	try {
		console.log('[OZİ] Komutlar yükleniyor.');

    await rest.put(
      Routes.applicationCommands(ayar.BotClientID),
      { body: commands },
    );

		console.log('[OZİ] Komutlar yüklendi.');
	} catch (error) {
		console.error(error);
	}
})();

client.on('interactionCreate', (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
     command.execute(interaction, client);
  } catch (err) {
    if (err) console.error("Error: ", err);
  }
});

client.on('modalSubmit', async (modal) => {

  var LogChannel = client.guilds.cache.get(ayar.GuildID).channels.cache.find((channel) => channel.id === ayar.BaşvuruLogChannelID);
    if(modal.customId === 'ybasvuru') {
      const isimyas = modal.getTextInputValue('isimyas');  
      const aktiflik = modal.getTextInputValue('aktiflik');  
      const yarar = modal.getTextInputValue('yarar');  
      const hakkında = modal.getTextInputValue('hakkında'); 
  
      if (hakkında) {
  let ozi = new Discord.MessageEmbed()
  .setDescription(`
  **${modal.user.tag}** - (\`${modal.user.id}\`) **Kullanıcısının Başvuru Formu**
  
  ${star}  **İsminiz ve yaşınız**
  \`${isimyas}\`
  
  ${star}  **Sunucumuzda günlük aktifliğiniz**
  \`${aktiflik}\`
  
  ${star}  **Sunucumuz için neler yapabilirsiniz**
  \`${yarar}\`
  
  ${star}  **Kendiniz hakkında biraz bilgi**
  \`${hakkında}\`
  
  ${modal.user} Kullanıcısı'nın Başvurusu;
  ${star} **Cevaplamak için :** \`/cevapla <user>.\`
  `)
  .setTimestamp()

        await modal.reply({ content: `Başvurunuz başarıyla alındı, yetkili arkadaşlar sizinle ilgilenecekler, başvuru formumuzu cevapladığın için teşekkür ederiz..`, ephemeral: true });
        await LogChannel.send({ content: `<@&${ayar.YetkiliAlımRoleID}> ${modal.user}`,  embeds: [ozi] })      
      }
    }  
  });

  client
  .login((ayar.BotToken))
  .then(() => console.log("Bot Başarıyla Bağlandı!"))
  .catch(() => console.log("[HATA] Bot Bağlanamadı!"));

  process.on("uncaughtException", err => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, "g"), "./");
    console.error("Beklenmedik yakalanamayan hata: ", errorMsg);
    process.exit(1);
  });
  
  process.on("unhandledRejection", err => {
    console.error("Promise Hatası: ", err);
  });
