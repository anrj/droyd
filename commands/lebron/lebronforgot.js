const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { lebronforgot } = require('../../utils/lebronforgot.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('lebronforgot')
		.setDescription('Lebron reportedly forgot to use this command')
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('GIF/Image attachment')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('forgot')
				.setDescription('LEBRON REPORTEDLY FORGOT _')
				.setRequired(true),
		)
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		const attachment = interaction.options.getAttachment('image');
		const forgot = interaction.options.getString('forgot');

		await interaction.reply('🤖🤖🤖 ROBOT EXISTANCE MATTERS');
		await interaction.editReply({
			content: '',
			files: [await lebronforgot(attachment, forgot)],
		});
	},
};
