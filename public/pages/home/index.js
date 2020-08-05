socket = io.connect(window.location.href);
socket.on('id', (data) => {
	id = data;
	console.log(id);
});

window.addEventListener('beforeunload', unload);

function unload(event) {
	socket.emit('delete');
}

amount = null;
socket.on('amount', (data) => {
	if (!!!amount) document.getElementsByClassName('amount')[0].style.opacity = '1';
	amount = data;
	if (amount > 1) document.getElementById('amount').innerHTML = `<b>${amount}</b> people are`;
	else document.getElementById('amount').innerHTML = `<b>${amount}</b> person is`;
});
