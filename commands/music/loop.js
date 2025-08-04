const { SlashCommandBuilder } = require("discord.js");
const { RepeatMode } = require("distube");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("loop")
    .setDescription("Toggle loop mode"),
  async execute(interaction) {
    if (!interaction.member.voice.channelId) {
      return interaction.reply({
        content: "You must be in a voice channel to loop the queue!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const queue = interaction.client.DisTube.getQueue(interaction.guildId);
    if (!queue || !queue.songs.length) {
      return interaction.editReply({
        content: "There are no songs in the queue to loop.",
        ephemeral: true,
      });
    }

    try {
      // Toggle repeat mode
      const currentMode = queue.repeatMode;
      const newMode =
        currentMode === RepeatMode.DISABLED
          ? RepeatMode.SONG
          : RepeatMode.DISABLED;
      queue.setRepeatMode(newMode);

      await interaction.editReply({
        content: `Loop mode was ${
          newMode === RepeatMode.SONG ? "enabled" : "disabled"
        } by ${interaction.user.displayName}`,
        ephemeral: false,
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error toggling loop mode.",
        ephemeral: true,
      });
    }
  },
};
