const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env' });

mongoose.connect(process.env.DATABASE);
mongoose.Promise = global.Promise;
mongoose.connection.on('error', error => {
	console.error(`Error: ${error.message}`);
});

require('./models/Cafe');
require('./models/User');
require('./models/Review');

const app = require('./app');

app.set('port', process.env.PORT || 8000);

const server = app.listen(app.get('port'), () => {
	console.log(`Server running on: http://localhost:${server.address().port}`);
});

module.exports = server;