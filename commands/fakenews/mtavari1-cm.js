const { ContextMenuCommandBuilder, ApplicationCommandType, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { mtavari1 } = require('../../utils/fakenews.js');

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Quote message')
		.setType(ApplicationCommandType.Message)
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),

	async execute(interaction) {
		await interaction.deferReply();

		const message = interaction.targetMessage;
		const by = message.author.globalName;
		const quote = message.content;
		const attachment = {
			url: message.author.displayAvatarURL({ format: 'png', size: 1024 }),
			contentType: 'image/png',
		};

		const result = await mtavari1(attachment, quote, by);

		await interaction.editReply({
			content: '',
			files: [result],
		});
	},
};