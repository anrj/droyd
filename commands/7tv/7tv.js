const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
const { getEmoteURL } = require('../../utils/7tv.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('7tv')
		.setDescription('Search and send 7tv.app emotes')
		.addStringOption(option =>
			option.setName('emote')
				.setDescription('Name of the emote')
				.setRequired(true),
		)
		.addStringOption(option =>
			option.setName('size')
				.setDescription('Size of the emote')
				.addChoices(
					{ name: '1x', value: '1x' },
					{ name: '2x', value: '2x' },
					{ name: '3x', value: '3x' },
					{ name: '4x', value: '4x' },
				),
		)
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		const name = interaction.options.getString('emote');
		const size = interaction.options.getString('size') ?? '4x';
		await interaction.editReply({
			content: await getEmoteURL(name, size),
		});
	},
};
