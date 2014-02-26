var express =require('express'),
dns = require('dns')
app = express();
path = require('path'),
server = require('http').createServer(app),
io = require("socket.io").listen(server), 
mysql = require("mysql"),
parser = require(__dirname+"/jsonparser"),
hash = require('password-hash');
//var env = JSON.parse(process.env.VCAP_SERVICES);
var cre = parser.parseJSON(__dirname+"/mysql.json");
var pool = mysql.createPool({
	host: process.env.OPENSHIFT_MYSQL_DB_HOST,
	user: process.env.OPENSHIFT_MYSQL_DB_USERNAME,
	port: process.env.OPENSHIFT_MYSQL_DB_PORT,
	password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
	database: cre.name,
});
app.configure(function(){	
	app.use(express.favicon(path.join(__dirname,'public/favicon.ico')));
	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'html');
	app.set("views",path.join(__dirname,'views'));
	app.use(express.static(path.join(__dirname,'public')));	
	app.use(express.logger());
	app.use(express.cookieParser("secretterces"));
	app.use(express.bodyParser());
});
io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration",30);
});


server.listen(process.env.VMC_APP_PORT || process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 1337, process.env.OPENSHIFT_NODEJS_IP || null);

app.get("/",function(req,res){
	dbquery('SELECT * From Utilisateur',function(err, rows){
		if(err)
			throw err;
		res.render('app',{ content:'home', pseudo: rows[0].Pseudo});
	});
});
app.get("/checkPseudo/:pseudo", function(req,res){
	dbquery('SELECT COUNT(*) As Pexists FROM Utilisateur WHERE Pseudo = '+mysql.escape(req.params.pseudo),function(err,rows){
		if(err) throw err;
		res.setHeader("Content-Type", "text/plain");
		res.end(rows[0].Pexists+'');
	});
});
app.get("/connect",function(req,res){
	dbquery('SELECT COUNT(*) As Pexists, Password FROM Utilisateur WHERE Pseudo = '+mysql.escape(req.query.log_pseudo),function(err,rows){
		if(err)throw err;
		//res.setHeader("Content-Type", "text/plain");
		if(rows[0].Pexists)
		{
			if(hash.verify(req.query.log_pswd,rows[0].Password))
			{
				if(req.query.remember)
				{
					var year = 1000 * 3600 * 24 * 365;
					res.cookie("pseudo",req.query.log_pseudo, { maxAge: year });
					res.cookie("password", req.query.log_pswd, { maxAge: year });
				}
				else
				{
					res.clearCookie("pseudo");
					res.clearCookie("password");
				}
				res.send("OK");
			}
			else
			{
				res.send("Fail:1");
			}
		}		
		else
		{
			res.send("Fail:0");
		}
	});
});
app.get("/:user/chat",function(req,res){
	res.render("app",{ user: req.params.user, content: "chat"});
});
app.get("/chat/message",function(req,res){
	res.render("message_row.html",{ user: req.query.from, message : req.query.content });
});
app.get("/test",function(req,res){
	res.render("test",{user : "raf924"});
});

app.get("/checkMail/:mail",function(req, res){
	dns.resolveMx(req.params.mail.split("@")[1], function(err, addresses){
		if(err)
		{
			res.send("Fail:0");
		}
		else
		{
			dbquery("SELECT MailExists("+mysql.escape(req.params.mail)+") As Mexists",function(err,rows){
				if(rows[0].Mexists)
				{
					res.send("Fail:1");
				}
				else
				{
					res.send("OK");
				}
			});
		}
	});
});

io.sockets.on('connection',function(socket){
	socket.on("send",function(user,message){
		socket.emit("receive",user,message);
		socket.broadcast.emit("receive", user, message);
	});
});

function dbquery(q,callback)
{
	pool.getConnection(function(err,connection){
		connection.query(q,callback);
		connection.end();	
	});
}