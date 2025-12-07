const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { swapFace } = require('../../utils/gogichafy.js');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gogichafy')
		.setDescription('Face-swap an image with Gogicha\'s face')
	// add string link option too (subcommand)
		.addAttachmentOption(option =>
			option.setName('target-image')
				.setDescription('Image to faceswap')
				.setRequired(true),
		)
		.addAttachmentOption(option =>
			option.setName('source-image')
				.setDescription('Source face image')
				.setRequired(false),
		)
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		let sourceImage = interaction.options.getAttachment('source-image');
		const targetImage = interaction.options.getAttachment('target-image');
		
    if (!sourceImage) {
      sourceImage = path.join(__dirname, '..', '..', 'utils', 'media', 'assets', 'gogichafy', 'gogichaaa.jpg');
    }
		
    const resultURL = await swapFace(sourceImage, targetImage)
		await interaction.editReply({
			content: resultURL,
		});
	},
};
