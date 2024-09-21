import server from './server.js'

const PORT = process.env.PORT || 3000;
// Start the server
server.listen(PORT, () => {
	console.log("Server is running on port ", PORT);
});

