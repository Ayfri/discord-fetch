/**
 * Fetch all the messages from a Discord TextChannel.
 * @param {module:"discord.js".Client} client - Your Discord.js Client.
 * @param {module:"discord.js".TextChannel | module:"discord.js".NewsChannel} channel - The ID of the Discord TextChannel.
 * @returns {Promise<module:"discord.js".Message[]>} - All the messages fetched.
 */
async function fetchChannelMessages(client, channel) {
	const total = [];
	let lastMessageID;
	let messages;

	if (!channel.isText()) return total;

	while (true) {
		if (lastMessageID) {
			messages = await channel.messages.fetch({
				limit: 100,
				before: lastMessageID,
			});
		} else {
			messages = await channel.messages.fetch({
				limit: 100,
			});
		}

		if (messages.size === 0) break;

		lastMessageID = messages.last().id;
		console.log(`#${channel.name} : ${total.length}`);
		total.push(...messages.array());
	}

	return total;
}

/**
 * Fetch all the messages from a Discord Guild.
 * @param {module:"discord.js".Client} client - Your Discord.js Client.
 * @param {string} guildID - The ID of the Guild to be fetch.
 * @returns {Promise<module:"discord.js".Message[]>} - All the messages fetched.
 */
async function fetchGuildMessages(client, guildID) {
	const m = [];
	const channels = client.guilds.cache.get(guildID).channels.cache.filter(c => c.isText());
	console.log(`Getting the messages from these channels : ${channels.map(c => `#${c.name}`).sort().join('\n')}`);
	
	for (const channel of channels.array()) {
		console.log(`Getting messages from : #${channel.name}.`)
		const messages = await fetchChannelMessages(client, channel);

		if (!m.find(c => c.id === channel.id))
			m.push({
				id: channel.id,
				messages: [],
			});
		m.find(c => c.id === channel.id).messages.push(...messages.map(m => m.cleanContent));
	}

	console.log(`Finished fetching messages, messages count: ${m.length}`);
	return m;
}

module.exports = {
	fetchGuildMessages,
	fetchChannelMessages,
};
