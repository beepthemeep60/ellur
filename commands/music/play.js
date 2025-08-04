const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");
const stringSimilarity = require("string-similarity");

const songs = JSON.parse(fs.readFileSync("./songs.json"));

const songChoices = Object.entries(songs).map(([title, url]) => ({
    name: title.slice(0, 100), // max 100 chars for name
    value: title
}));

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Add a song to the queue!")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Type the song name you would like")
        .setRequired(true)
        .addChoices(...songChoices)
    ),
  async execute(interaction) {
    // Check if member is in a VC
    if (!interaction.member.voice.channelId) {
      return interaction.reply({
        content: "You must be in a voice channel to play a song!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

        const title = interaction.options.getString('song');
        const url = songs[title];

    try {
      await interaction.client.DisTube.play(
        interaction.member.voice.channel,
        url,
        {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        }
      );
      await interaction.editReply({
        content: `Queued **${title}**`,
        ephemeral: false,
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error trying to play the song.",
        ephemeral: true,
      });
    }
  },
};
