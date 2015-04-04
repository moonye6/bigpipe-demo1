var http = require('http');
var sys = require('sys');
var url = require("url");

http.createServer(function(request, response) {
    // Write the document
    response.writeHead(200, {"Content-Type" : "text/html"});
    response.write('<!DOCTYPE html>');
    response.write('<head><script type="text/javascript">function arrived(id,text) { var b=document.getElementById(id); b.innerHTML = text; }</script>');
    response.write("</head><body><div>Progressive Loading");
    for(var i = 0; i < 6; i++) {
        response.write("<div id='" + i + "'>" + i + "</div>");
    }
    response.write("</div>");

    var down = 6;
    for (i = 0; i < 6; i++) {
        http.get("http://localhost:2000/?id=" + i, function(res) {
            res.on('data', function(chunk) {
                response.write(chunk, 'binary');
            });

            res.on('end', function() {
                console.log("down"+down)
                if((--down )== 0) {
                    response.end();
                }
            })
        });
    }
    response.write("</body></html>");

}).listen(8080);

http.createServer(function(request, response) {
    // Some delay upto upto 2 seconds
    var delay = Math.round(Math.random() * 2000);

    setTimeout(function() {
        var params = url.parse(request.url, true);
        var id = params.query.id;
        response.writeHead(200, {"Content-Type" : "text/html"});
        var content = "<span>Content of Module " + id + "</span>";
        response.write("<script>" +
            "arrived('" + id + "', '" + content + "');" +
             "</script>");
        response.end();
	}, delay);
}).listen(2000);