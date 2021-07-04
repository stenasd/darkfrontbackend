// INTRO FILE THAT LISTEN TO PORT AND USE SERVER.APP
//send product as seller bug
//[ ] 2 Purge data when order finished
//[ ] 4 edit current order page
//[ ] 5 Better seller panel
//[ ] 2 Leave review form 
//[ x ] 1 USER TABLE ON LISTING
//[ ] 3 upload multiple images to order
//[ ] 3 user Profile update and input
//[ ] pgp 2fa
const server = require('./src/server');

const { app } = server;
const port = 8081;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});