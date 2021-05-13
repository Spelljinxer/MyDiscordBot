module.exports = {
	name: 'botCommands',
	description: 'help func',
	execute(message, args) {
        message.channel.send('Hello Master!');
	},
};
