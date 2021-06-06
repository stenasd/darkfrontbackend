// INTRO FILE THAT LISTEN TO PORT AND USE SERVER.APP
//send product as seller bug
//TODO Purge data when order finished
const server = require('./src/server');

const { app } = server;
const port = 8081;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});