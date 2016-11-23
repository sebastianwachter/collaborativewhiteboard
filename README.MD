# Collaborative Whiteboard
This is a collaborative whiteboard inspired by <a href="http://socket.io/get-started/whiteboard/">the socket.io get started page</a>.<br/>
This demo is missing now for around 1.5 years and I finally found some time to dive into it.<br/><br/>
So what is this project? - It is a whiteboard with which connected clients can draw together on one board.
## Missing features
This being a proof of concept there are a lot of missing features to make this even cooler:
* On a new connection only a empty whiteboard is shown. Only the newly (after this connection) drawn lines are getting shown
* A color picker
* A way to export pictures from the whiteboard
* Touch support
## Getting started
1. Clone the repo
2. Open a terminal inside the folder
3. Type ```npm install``` NPM will now install the modules
4. After the installation is done type ```node app.js```. You should get a message that the server is running.
5. Navigate a browser to ```localhost:3000``` and start drawing. Open another browser (or another tab) and watch yourself drawing. You might draw on the second screen as well.
## License
MIT