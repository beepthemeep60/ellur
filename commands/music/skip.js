const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip the current track"),
  async execute(interaction) {
    if (!interaction.member.voice.channelId) {
      return interaction.reply({
        content: "You must be in a voice channel to skip a song!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const queue = interaction.client.DisTube.getQueue(interaction.guildId);

    if (!queue || !queue.songs.length) {
      return interaction.editReply({
        content: "There are no songs in the queue to skip.",
        ephemeral: true,
      });
    }

    try {
      await interaction.client.DisTube.skip(interaction.member.voice.channel);
      await interaction.editReply({
        content: `Skipped current track.`,
        ephemeral: false,
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error trying to skip the song.",
        ephemeral: true,
      });
    }
  },
};
