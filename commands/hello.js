module.exports = {
	name: 'hello',
	description: 'hello',
	execute(message, args) {
        message.channel.send('Hello Master!');
	},
};
