const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { inforustavi } = require("../../utils/fakenews.js");
const { cleanupAll } = require("../../utils/cleanup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("inforustavi")
    .setDescription("InfoRustavi news post")
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("GIF/Image attachment")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("caption")
        .setDescription("News caption")
        .setRequired(true),
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
    const caption = interaction.options.getString("caption");

    await interaction.editReply({
      content: "",
      files: [await inforustavi(attachment, caption)],
    });
  },
};
