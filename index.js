// require your server and launch it here
const server = require('./api/server')

//const routes = require('./lksdmfls')



//server.use('./nfdsnfsld, routes)

server.use('/', (req, res) => res.send('API up and running!'));

server.listen(9000, () => console.log('API running on port 9000'));