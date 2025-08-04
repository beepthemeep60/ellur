const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stop")
    .setDescription("Stop all tracks and clear the queue"),
  async execute(interaction) {
    if (!interaction.member.voice.channelId) {
      return interaction.reply({
        content: "You must be in a voice channel to stop a song!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    try {
      await interaction.client.DisTube.stop(interaction.guildId);
      const botMember = interaction.guild.members.cache.get(interaction.client.user.id);
      if (botMember && botMember.voice.channel) {
        await botMember.voice.disconnect();
      }
      await interaction.editReply({
        content: `Stopped music and cleared the queue.`,
        ephemeral: false,
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error trying to stop the music.",
        ephemeral: true,
      });
    }
  },
};
