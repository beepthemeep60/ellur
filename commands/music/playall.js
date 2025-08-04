const { SlashCommandBuilder } = require("discord.js");
const fs = require("node:fs");

const songs = JSON.parse(fs.readFileSync("./songs.json"));

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("playall")
    .setDescription("Add all songs to the queue!")
    .addBooleanOption((option) =>
      option
        .setName("shuffle")
        .setDescription("Whether the songs should be shuffled or not")
    ),
  async execute(interaction) {
    //check if member is in a vc
    if (!interaction.member.voice.channelId) {
      return interaction.reply({
        content: "You must be in a voice channel to play songs!",
        ephemeral: true,
      });
    }

    await interaction.deferReply();

    const shuffleOption = interaction.options.getBoolean("shuffle") || false;
    const voiceChannel = interaction.member.voice.channel;
    try {
      const songList = shuffleOption
        ? shuffle(Object.keys(songs))
        : Object.keys(songs);

      for (const songName of songList) {
        const url = songs[songName];
        await interaction.client.DisTube.play(voiceChannel, url, {
          member: interaction.member,
          textChannel: interaction.channel,
          interaction,
        });
      }
      await interaction.editReply({
        content: `Added all songs to queue${
          shuffleOption ? " (shuffled)" : ""
        }!`,
        ephemeral: false,
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error adding all songs to the queue.",
        ephemeral: true,
      });
    }
  },
};
