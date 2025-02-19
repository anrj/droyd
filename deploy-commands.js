const { REST, Routes } = require('discord.js');
const { clientId, dev_clientId, guildId, prod_token, dev_token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		console.log(file);
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		}
		else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
			);
		}
	}
}

const rest = new REST().setToken(dev_token);

(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`,
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands(dev_clientId),
			{ body: commands },
		);

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`,
		);
	}
	catch (error) {
		console.error(error);
	}
})();

// Unregister guild-based commands
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, '1322686879107121294'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);

// for global commands
// rest.delete(Routes.applicationCommand(dev_clientId, '1341817095675187271'))
// 	.then(() => console.log('Successfully deleted application command'))
// 	.catch(console.error);