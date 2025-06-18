// const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType } = require('discord.js');
// const { evil } = require('../../utils/fetch-content.js');

// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('evil')
// 		.setDescription('Turns the gif evil')
// 		.addStringOption(option =>
// 			option.setName('link')
// 				.setDescription('GIF link')
// 		    .setRequired(true))
// 		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
// 		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
// 	async execute(interaction) {
// 		await interaction.deferReply();
// 		const originalGIF = interaction.options.getString('link');
// 		await interaction.editReply({
// 			content: '',
// 			files: [await evil(originalGIF)],
// 		});
// 	},
// };
