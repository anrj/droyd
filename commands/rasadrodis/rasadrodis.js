const { SlashCommandBuilder, InteractionContextType, ApplicationIntegrationType, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, AttachmentBuilder } = require('discord.js');
const { scrapeMoazrovne } = require('../../utils/rasadrodis.js');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rasadrodis')
		.setDescription('Prompts a random "რა? სად? როდის?" question')
		.setContexts([InteractionContextType.Guild, InteractionContextType.BotDM, InteractionContextType.PrivateChannel])
		.setIntegrationTypes([ApplicationIntegrationType.GuildInstall, ApplicationIntegrationType.UserInstall]),
	async execute(interaction) {
		await interaction.deferReply();
		const { questionNumber, question, questionImageUrl, answer, explanation } = await scrapeMoazrovne();

		const revealButton = new ButtonBuilder()
			.setCustomId('reveal')
			.setLabel('პასუხის ნახვა')
			.setStyle(ButtonStyle.Danger);

		const buttonRow = new ActionRowBuilder()
			.addComponents(revealButton);

		const questionEmbed = new EmbedBuilder()
			.setTitle(`შეკითხვა #${questionNumber}`)
			.addFields({ name: '', value: question, inline: true })
			.setColor('#93090a');

		const files = [];
		if (questionImageUrl) {
			const filename = path.basename(questionImageUrl);
			const imagePath = path.join(__dirname, '..', '..', 'utils', 'media', 'outputs', 'rasadrodis', filename);
			const image = new AttachmentBuilder(imagePath);
			files.push(image);
			questionEmbed.setImage(`attachment://${filename}`);
		}

		const answerEmbed = new EmbedBuilder()
			.addFields({ name: 'პასუხი:', value: `||${answer}||`, inline: false })
			.setColor('#93090a');

		if (explanation) {
			answerEmbed.addFields({ name: 'კომენტარი:', value: `||${explanation}||`, inline: false });
		}

		const questionResponse = await interaction.editReply({
			embeds: [questionEmbed],
			components: [buttonRow],
			files: files,
			withResponse: true,
		});

		const filter = i => i.customId === 'reveal';
		const collector = questionResponse.createMessageComponentCollector({ filter, time: 3_600_000, max: 1 });

		collector.on('collect', async i => {
			buttonRow.components[0].setDisabled(true);

			await i.reply({
				embeds: [answerEmbed],
			});

			await interaction.editReply({
				embeds: [questionEmbed],
				components: [buttonRow],
				files: files,
			});
		});
	},
};
