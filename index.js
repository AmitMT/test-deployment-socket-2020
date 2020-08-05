const express = require('express');
const chalk = require('chalk');
const cors = require('cors');

class Client {
	constructor(id) {
		this.id = id;
	}

	static clients = [];

	static findId(id) {
		let index = this.clients.findIndex((n) => n.id === id);
		return index;
	}

	static deleteById(id) {
		let index = this.clients.findIndex((n) => n.id === id);
		this.clients.splice(index, 1);
		return index;
	}
}

const app = express();
const bodyParser = require('body-parser');
const server = app.listen(process.env.PORT || 5000);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const socket = require('socket.io');
const io = socket(server);

console.log(
	chalk.bold(chalk.underline('\nrunning')) +
		' - ' +
		chalk.cyan(chalk.underline(`http://localhost:${server.address().port}`))
);

io.sockets.on('connection', (socket) => {
	io.to(socket.id).emit('id', socket.id);

	Client.clients.push(new Client(socket.id));

	console.log(
		chalk.yellow(chalk.bold('connecting: ') + Client.findId(socket.id)) +
			' - ' +
			chalk.blue(`length: ${Client.clients.length}`) +
			chalk.magenta(chalk.bold('   at: ')) +
			socket.handshake.headers.referer
	);
	io.local.emit('amount', Client.clients.length);

	socket.on('delete', () => {
		let index = Client.findId(socket.id);

		Client.deleteById(socket.id);

		console.log(
			chalk.red(chalk.bold('removing: ') + index) +
				' - ' +
				chalk.blue(`length: ${Client.clients.length}`) +
				chalk.magenta(chalk.bold('   at: ')) +
				socket.handshake.headers.referer
		);

		io.local.emit('amount', Client.clients.length);
	});
});

app.get('/', (req, res) => {
	res.render('home.ejs', { url: `http://localhost:${server.address().port}${req.url}` });
});
