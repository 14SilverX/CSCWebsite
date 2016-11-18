var http = require('http')
  , fs   = require('fs')
  , url  = require('url')
  , qs = require('querystring')
  , port = 8080

var server = http.createServer (function (req, res) {
	players = 
    fs.readFileSync('https://raw.githubusercontent.com/14SilverX/CSCWebsite/master/Images/PlayerOfTheWeek/POTW/POTW.jpg', 'utf8')
      .toString()
      .trim()
      .split("\n");
      
  var uri = url.parse(req.url)

  switch( uri.pathname ) {
    case '/':
      sendFile(res, 'index.html')
      break
    case '/index.html':
      sendFile(res, 'index.html')
      break
    case '/roster.txt':
      sendFile(res, 'roster.txt', 'text/txt')
      break
    case '/roster':
    	showRoster(res)
    	break
    case '/league':
    	runLeague(res)
    	break
    case '/editroster_pw_PO01l':
    	editRoster(res)
    	break
    case '/editroster':
    	var d = '';
  	req.on('data', function(c) {
    	d = d+c
  	})
  	req.on('end', function() {
    	if(d != '') {
      		var q = qs.parse(d)
      		if(q.newplayer) {
        		players.push( q.newplayer )
        		fs.writeFileSync('roster.txt', players.join('\n'))
        		editRoster(res)
      		}
      		else if(q.findplayer){
      			players = players.filter(function(p){
      				return p.substring(0, q.findplayer.length) == q.findplayer
      			})
      			editRoster(res)
      		}
      		else if(q.removeplayer){
      			fs.writeFileSync('roster.txt', players.filter(function(p){
      				return p != q.removeplayer
      			}).join('\n'))
      			players = 
    fs.readFileSync('roster.txt', 'utf8')
      .toString()
      .trim()
      .split("\n");
        		editRoster(res)
      		}
      		else{
      			players = 
    fs.readFileSync('roster.txt', 'utf8')
      .toString()
      .trim()
      .split("\n");
        		editRoster(res)
      		}
    	}
    	d = ''
  	})
    	break
    case '/style.css':
      sendFile(res, 'style.css', 'text/css')
      break
    default:
      res.end('404 not found')
  }
})

server.listen(process.env.PORT || port);
console.log('listening on 8080')

function runLeague(res){
	res.writeHead(200, {"Content-Type": "text/html"});

  res.write("<html>");
  res.write("<head>");
  res.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" title=\"style-sheet\"/>");
  res.write("</head>");
  res.write("<body>");

  res.write("<header><h1>League Sheet</h1></header>");
  

  res.write("<footer>");
  res.write("<div class=\"silverback largetext\">Back to the <a href=\"../\">Main Page</a></div>");
  res.write("</footer>");


  res.write("</body>");
  res.write("</html>");
  res.end();
}

function showRoster(res){
	res.writeHead(200, {"Content-Type": "text/html"});

  res.write("<html>");
  res.write("<head>");
  res.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" title=\"style-sheet\"/>");
  res.write("</head>");
  res.write("<body>");

  res.write("<header><h1>WPI CSC Roster</h1></header>");
  players.forEach(function(d) {
    res.write("<p>" + d + "</p>");
  });

  res.write("<footer>");
  res.write("<div class=\"silverback largetext\">Back to the <a href=\"../\">Main Page</a></div>");
  res.write("</footer>");


  res.write("</body>");
  res.write("</html>");
  res.end();
}

function editRoster(res){
	res.writeHead(200, {"Content-Type": "text/html"});

  res.write("<html>");
  res.write("<head>");
  res.write("<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\" title=\"style-sheet\"/>");
  res.write("</head>");
  res.write("<body>");

  res.write("<header><h1>WPI CSC Roster</h1></header>");
  players.forEach(function(d) {
    res.write("<p>" + d + "</p>");
  });

  res.write("<footer><form action=\"/editroster\" method=\"post\">");
  res.write("<div>");
  res.write("<label for=\"newplayer\" > Add New Player </label>");
  res.write("<input id=\"newplayer\" name=\"newplayer\" type=\"text\">");
  res.write("<button type=\"submit\">Submit</button>");
  res.write("</div>");
  
  res.write("<div>");
  res.write("<label for=\"findplayer\" > Find Player </label>");
  res.write("<input id=\"findplayer\" name=\"findplayer\" type=\"text\">");
  res.write("<button type=\"search\">Search</button>");
  res.write("</div>");
  
  res.write("<label for=\"removeplayer\" > Remove Player </label>");
  res.write("<input id=\"removeplayer\" name=\"removeplayer\" type=\"text\">");
  res.write("<button type=\"remove\">Remove</button>");
  res.write("<div class=\"silverback largetext\">Back to the <a href=\"../\">Main Page</a></div>");
  res.write("</form></footer>");


  res.write("</body>");
  res.write("</html>");
  res.end();
}

// subroutines

function sendFile(res, filename, contentType) {
  contentType = contentType || 'text/html';

  fs.readFile(filename, function(error, content) {
    res.writeHead(200, {'Content-type': contentType})
    res.end(content, 'utf-8')
  })

}
