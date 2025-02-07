const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Operates the bot to speak')
		.addStringOption(option =>
			option.setName('text')
				.setDescription('The message to relay')
		    .setRequired(true))
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		const message = await interaction.options.getString('text');
		await interaction.reply('‎');
		await interaction.followUp(message);
		await interaction.deleteReply();
	},
};
