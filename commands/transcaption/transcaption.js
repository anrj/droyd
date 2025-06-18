const {
	SlashCommandBuilder,
	InteractionContextType,
	ApplicationIntegrationType,
} = require('discord.js');
const { transcaption2 } = require('../../utils/fetch-content.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('transcaption')
		.setDescription('Translates the caption of a gif or an image')
		.addStringOption((option) =>
			option.setName('link').setDescription('GIF/Image link').setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('from')
				.setDescription(
					'Language to translate from (ISO 639-2): eng, spa, fra, deu, rus, etc.',
				),
		)
		.addStringOption((option) =>
			option
				.setName('to')
				.setDescription(
					'Language to translate to (ISO 639-1): en, es, fr, de, ru, ka, etc.',
				),
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
		const originalGIF = interaction.options.getString('link');
		const from = interaction.options.getString('from') ?? 'eng';
		const to = interaction.options.getString('to') ?? 'ka';

		try {
			const result = await transcaption2(originalGIF, from, to);
			await interaction.editReply({
				content: '',
				files: [result],
			});
		}
		catch (error) {
			console.error('Transcaption error:', error);
			await interaction.editReply({
				content: `❌ **Error:** ${error.message}\n\n**Valid language codes:**\n- **From (ISO 639-2):** eng, spa, fra, deu, rus, etc.\n- **To (ISO 639-1):** en, es, fr, de, ru, ka, etc.`,
			});
		}
	},
};
