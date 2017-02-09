let http = require('http');

//Lets define a port we want to listen to
const PORT=8443;

//We need a function which handles requests and send response
function handleRequest(request, response){
    let body = {};
    let method = request.method;
    let url = request.url;
    if (method === "GET") {
        response.statusCode = 200;
        response.end(url);
    } else {
        response.writeHead(404, {});
        response.end(JSON.stringify(body));
    }
}

//Create a server
let server = http.createServer(handleRequest);

//Lets start our server
server.listen(PORT, function(){
    //Callback triggered when server is successfully listening. Hurray!
    console.log("Server listening on: http://localhost:%s", PORT);
});
