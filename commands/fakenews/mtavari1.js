const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { mtavari1 } = require("../../utils/fakenews.js");
const { cleanup } = require("../../utils/cleanup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mtavari1")
    .setDescription("Mtavari news quote")
    // add string link option too (subcommand)
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("GIF/Image attachment")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("by")
        .setDescription("Who said the quote")
        .setRequired(true)
        .setMaxLength(50),
    )
    .addStringOption((option) =>
      option.setName("quote").setDescription("What was said").setRequired(true),
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel,
    ])
    .setIntegrationTypes([
      ApplicationIntegrationType.GuildInstall,
      ApplicationIntegrationType.UserInstall,
    ]),
  async execute(interaction) {
    await interaction.deferReply();
    cleanup();
    const attachment = interaction.options.getAttachment("image");
    const by = interaction.options.getString("by");
    const quote = interaction.options.getString("quote");

    await interaction.editReply({
      content: "",
      files: [await mtavari1(attachment, quote, by)],
    });
  },
};
