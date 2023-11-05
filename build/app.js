// Import the express
import express from 'express';
// Initialize the express engine
const app = express();
//Declaration of App Port Number.
const port = 3000;
app.use(express.static('public'));
app.use(express.static('build/typescript'));
// Handling '/' Request
app.get('/', (_req, _res) => {
    _res.sendFile(__dirname + "/public/index.html");
});
// Server setup - Port Listening
app.listen(port, () => {
    console.log(`Express Server Running - Port: ${port}`);
});
