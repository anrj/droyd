const { ContextMenuCommandBuilder, ApplicationCommandType, InteractionContextType, ApplicationIntegrationType } = require("discord.js");
const { swapFace } = require("../../utils/gogichafy.js");
const path = require('path');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Gogichafy")
    .setType(ApplicationCommandType.Message)
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
    const targetMessage = interaction.targetMessage;
    const imageAttachment = targetMessage.attachments.find(
      (att) => att.contentType && att.contentType.startsWith("image/"),
    );

    if (!imageAttachment) {
      return await interaction.editReply({
        content: "This message does not contain any images",
      });
    }

    const gogichaPath = path.join(__dirname, "..", "..", "utils", "media", "assets", "gogichafy", "gogichaaa.jpg");

    try {
      const resultURL = await swapFace(gogichaPath, imageAttachment);

      await interaction.editReply({
        content: resultURL,
      });
    } catch (error) {
      console.error("Gogichafy error:", error);
      await interaction.editReply({
        content: "Failed to gogichafy the image",
      });
    }
  },
};
