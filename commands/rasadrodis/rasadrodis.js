const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const { scrapeMoazrovne } = require('../../utils/rasadrodis.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rasadrodis')
		.setDescription('Prompts a random "რა? სად? როდის?" question')
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		const { questionNumber, question, questionImage, answer, explanation } = await scrapeMoazrovne();

		const revealButton = new ButtonBuilder()
			.setCustomId('reveal')
			.setLabel('პასუხის ნახვა')
			.setStyle(ButtonStyle.Danger);

		const buttonRow = new ActionRowBuilder()
			.addComponents(revealButton);

		const questionEmbed = new EmbedBuilder()
			.setTitle(`შეკითხვა #${questionNumber}`)
			.addFields({ name: '', value: question, inline: true })
			.setImage(questionImage)
			.setColor('#93090a');

		const answerEmbed = new EmbedBuilder()
			.addFields({ name: 'პასუხი:', value: `||${answer}||`, inline: false })
			.addFields({ name: 'კომენტარი:', value: `||${explanation ?? 'არ გააჩნია'}||`, inline: false })
			.setColor('#93090a');

		const questionResponse = await interaction.editReply({
			embeds: [questionEmbed],
			components: [buttonRow],
			withResponse: true,
		});

		const filter = i => i.customId === 'reveal' && i.user.id === interaction.user.id;
		const collector = questionResponse.createMessageComponentCollector({ filter, time: 60000, max: 1 });

		collector.on('collect', async i => {
			buttonRow.components[0].setDisabled(true);

			await i.reply({
				embeds: [answerEmbed],
			});

			await interaction.editReply({
				embeds: [questionEmbed],
				components: [buttonRow],
			});
		});
	},
};
