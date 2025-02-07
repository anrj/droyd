const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('about')
		.setDescription('Information about the bot')
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		const videoPath = 'C:\\coding\\discord\\gd\\droyd2\\utils\\media\\assets\\ABOUT ME.mp4';

		await interaction.reply('🤖🤖🤖 BOOTING UP THE FENTRACTOR');
		await interaction.editReply({
			content: '',
			files: [videoPath],
		});
	},
};
