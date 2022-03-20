const { Discord, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Modal, TextInputComponent, showModal } = require('discord-modals')
const { SlashCommandBuilder } = require("@discordjs/builders");
const ayar = require("../jaylen.json");
const { green , red } = require("../jaylen.json");

    module.exports = {
      data: new SlashCommandBuilder()
      .setName("destek")
      .setDescription("Öneri şikayet bildirmenizi veya canlı destek talebi açmanızı sağlar."),

      async execute(interaction, client) {

        const istek = new MessageButton()
        .setCustomId("istek")
        .setLabel("Öneri/İstek")
        .setStyle("SUCCESS")
    
        const sikayet = new MessageButton()
        .setCustomId("sikayet")
        .setLabel("Şikayet")
        .setStyle("DANGER")

        const canlıdestek = new MessageButton()
        .setCustomId("canlıdestek")
        .setLabel("Canlı Destek")
        .setStyle("PRIMARY")
  
        const basvuru = new MessageButton()
        .setCustomId("basvuru")
        .setLabel("Yetkili Başvuru")
        .setStyle("SECONDARY")

        const evet = new MessageButton()
        .setCustomId("evt")
        .setLabel("Evet")
        .setStyle("SUCCESS")
  
        const hayır = new MessageButton()
        .setCustomId("hyr")
        .setLabel("Hayır")
        .setStyle("DANGER")
  
        const row = new MessageActionRow()
        .addComponents([istek, sikayet, canlıdestek, basvuru])

        const row2 = new MessageActionRow()
        .addComponents([evet, hayır])

       interaction.reply({ content: `Lütfen **20 saniye** içerisinde hangi hizmeti kullanmak istediğinizi aşağıdaki butonlara tıklayarak belirtin.`, components: [row]})

        const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', max: 2, time: 20000 });

       collector.on("collect", async (interaction) => {

            const filter = m => m.author === interaction.user;
            var cevaplar = {};
            istek: cevaplar["Öneri"]
    
          if(interaction.customId === "istek") {

            await interaction.update({ content: `Lütfen 60 saniye içerisinde önerinizi belirtiniz.`, components: []});
    
            interaction.channel.awaitMessages({filter, max: 1 }).then(async function (collected) {
            collected.each(msj => cevaplar["Öneri"] = msj.content);

            await interaction.deleteReply();
            await interaction.followUp( { content: `Öneriniz başarıyla iletildi!`, components: []});
    
    const ozi = new MessageEmbed()
    .setAuthor({
        name: "Öneri / İstek",
       iconURL: interaction.user.displayAvatarURL({ dynamic: true })
       })
       .setDescription(`**Gönderen:** ${interaction.user} - \`${interaction.user.id}\``)
       .addFields({ name: "Mesaj İçeriği", value: cevaplar["Öneri"], inline: true })
       .setColor("RANDOM")
       .setFooter({ text: interaction.user.username })
       .setTimestamp()
       
       var LogChannel = client.guilds.cache.get(ayar.GuildID).channels.cache.find((channel) => channel.id === ayar.ÖneriİstekChannelID);
       LogChannel.send({ embeds: [ozi] })
    })
    
    } 
    
    if(interaction.customId === "sikayet") {

      await interaction.update({ content:`Lütfen 60 saniye içerisinde şikayetinizi belirtiniz.`, components: []}); 
    
            interaction.channel.awaitMessages({filter, max: 1 }).then(async function (collected) {
            collected.each(msj => cevaplar["Şikayet"] = msj.content);

            await interaction.deleteReply();
            await interaction.followUp({ content: `Şikayetiniz başarıyla iletildi!`, components: []});

    const ozi = new MessageEmbed()
    .setAuthor({
        name: "Şikayet",
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
    })
    .setDescription(`**Gönderen:** ${interaction.user} - \`${interaction.user.id}\``)
    .addFields({ name: "Mesaj İçeriği", value: cevaplar["Şikayet"], inline: true })
    .setColor("RANDOM")
    .setFooter({ text: interaction.user.username })
    .setTimestamp()

    var LogChannel = client.guilds.cache.get(ayar.GuildID).channels.cache.find((channel) => channel.id === ayar.SikayetChannelID);
    LogChannel.send({ embeds: [ozi] })
    })
    } 
    
        if(interaction.customId === "canlıdestek") {
          await interaction.update({ content: `Görüşmelerimiz kayıt altına alınmaktadır! Trolleyen/Gereksiz kullananlar cezalandırılacaktır. Canlı desteğe bağlanmak istediğinizden emin misiniz?` , components: [row2]});
    } 
        
        if(interaction.customId === "evt") {
          await interaction.update({ content: `Sizi canlı destek ekibimize bağlıyorum, lütfen beklemede kalın...`, components: []});
          collector.stop()
        } 
    
        if(interaction.customId === "hyr") {
          await interaction.update({ content: `Canlı desteğe bağlanılırken bir hata oluştu veya bağlantı onaylanmadı!`, components: []}); 
          collector.stop()
        }


    if(interaction.customId === "basvuru") {

      if(![ayar.TagRoleID].some(role => client.guilds.cache.get(ayar.GuildID).members.cache.get(interaction.user.id).roles.cache.get(role))) {
        return interaction.reply({ content: ":x: Tagın olmadığı için başvuramazsın.", ephemeral: true })
      } else if([ayar.EnAltYetkiliRoleID].some(role2 => client.guilds.cache.get(ayar.GuildID).members.cache.get(interaction.user.id).roles.cache.get(role2))) {
        return interaction.reply({ content: ":x: Zaten Yetkili Rolüne Sahip olduğun için başvuramazsın.", ephemeral: true })
      } else {
        const modal = new Modal()
        .setCustomId('ybasvuru')
        .setTitle('Yetkili Başvuru')
        .addComponents(
          new TextInputComponent()
          .setCustomId('isimyas')
          .setLabel('İsim ve Yaşınız ?')
          .setStyle('SHORT')
          .setMinLength(5)
          .setMaxLength(20)
          .setPlaceholder('Lütfen buraya yazın. / Örn: Ozi 18')
          .setRequired(true),
          new TextInputComponent()
          .setCustomId('aktiflik')
          .setLabel('Sunucumuzda günlük aktifliğiniz ?')
          .setStyle('SHORT')
          .setMinLength(1)
          .setMaxLength(10)
          .setPlaceholder('Lütfen buraya yazın. / Örn: 8 Saat')
          .setRequired(true),
          new TextInputComponent()
          .setCustomId('yarar')
          .setLabel('Sunucumuz için neler yapabilirsiniz ?')
          .setStyle('SHORT')
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder('Lütfen buraya yazın. / Örn: Günlük 5 invite ya da Diğer...')
          .setRequired(true),
          new TextInputComponent()
          .setCustomId('hakkında')
          .setLabel('Kendiniz hakkında biraz bilgi ?')
          .setStyle('SHORT')
          .setMinLength(5)
          .setMaxLength(100)
          .setPlaceholder('Lütfen buraya yazın. / Örn: Bot Kodlamayı severim.')
          .setRequired(true)
        );
        showModal(modal, { client, interaction });
      }
} 

});


  }
}
