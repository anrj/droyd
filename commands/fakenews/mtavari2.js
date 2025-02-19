const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { mtavari2 } = require('../../utils/fakenews.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('mtavari2')
		.setDescription('Mtavari news post')
	// add string link option too (subcommand)
		.addAttachmentOption(option =>
			option.setName('image')
				.setDescription('GIF/Image attachment')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('caption')
				.setDescription('News caption')
				.setRequired(true),
		)
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		const attachment = interaction.options.getAttachment('image');
		const caption = interaction.options.getString('caption');

		await interaction.editReply({
			content: '',
			files: [await mtavari2(attachment, caption)],
		});
	},
};
