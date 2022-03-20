const { Modal, TextInputComponent, showModal } = require('discord-modals')
const { SlashCommandBuilder } = require("@discordjs/builders");
const ayar = require('../jaylen.json');

    module.exports = {
      data: new SlashCommandBuilder()
      .setName("başvuru")
      .setDescription("Yetkili başvurusunda bulunmanızı sağlar."),

      async execute(interaction, client) {

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
}