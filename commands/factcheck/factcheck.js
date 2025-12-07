const {
  SlashCommandBuilder,
  InteractionContextType,
  ApplicationIntegrationType,
} = require("discord.js");
const { getImage, factcheck } = require("../../utils/fact-check.js");
const { cleanup } = require("../../utils/cleanup.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("factcheck")
    .setDescription("Fact checker by real niggalink scientists")
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
        .setDescription("Fact checked by _")
        .setRequired(true)
        .setMaxLength(50),
    )
    .addBooleanOption((option) =>
      option.setName("as").setDescription("True or False").setRequired(true),
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
    const as = interaction.options.getBoolean("as");
    await interaction.editReply({
      content: "",
      files: [await factcheck(attachment, by, as)],
    });
  },
};
