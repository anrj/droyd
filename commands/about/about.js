const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Information about the bot')
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		const videoPath = path.resolve(__dirname, '../../utils/media/assets/about_me/ABOUT ME.mp4');
		await interaction.editReply({
			content: '',
			files: [videoPath],
		});
	},
};
