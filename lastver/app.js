var express = require('express'),
	http = require('http');
var path = require('path');
var app = express();
//moi them 1

var Db = require('mongodb').Db,
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    ReplSetServers = require('mongodb').ReplSetServers,
    ObjectID = require('mongodb').ObjectID,
    Binary = require('mongodb').Binary,
    GridStore = require('mongodb').GridStore,
    Grid = require('mongodb').Grid,
    Code = require('mongodb').Code,
    //BSON = require('mongodb').pure().BSON,
    assert = require('assert');
var db = new Db('qlbh', new Server('localhost', 27017));

//moi 2
var session = require('express-session');
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'Hoang Van Thong'
}));
//var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/qlbh');
//app.use(express.bodyParser());

app.use(express.static(path.join(__dirname, 'public')));
app.set('port',process.env.PORT||3000);
app.set('view engine','jade');
app.use('views',express.static(__dirname +'/views'));
app.get('/index',function(req,res,next){
	var Fiber = require('fibers');
	Fiber(function(){
		var Server = require("mongo-sync").Server;
		var server = new Server('127.0.0.1');
		var result = server.db("qlbh").getCollection("sanpham").find().toArray();
		server.close();
		res.render('index',{ yt: result });
		//res.render('index');
	}).run();
});
app.get('/login',function(req,res){
	res.render('login');
});
app.post('/login',function(req,res){
	var udd = req.body.UID;
	var pwd = req.body.PWD;
	db.open(function(err, db) {
		var collection = db.collection('user');
		collection.findOne({usename: udd , pass: pwd}, function(err, doc) {
  			//dieu kien
			if(doc){
				if(doc.phanquyen == 1){
					req.session.curlUser.user_group = 1;
					res.redirect('/admin/sanpham');
				}
				else{
					req.session.curlUser = 1;
					res.redirect('/index');
				}
			}
			else{
				res.redirect('/login');
			}
		});
	});
});
app.get('/admin/sanpham/add',function(req,res){
	res.render('addpro');
});
app.get('/admin/sanpham/edit/:id',function(req,res){
	var id = req.params.id;
	db.open(function(err, db) {
		var sp;
		var collection = db.collection('sanpham');
		collection.findOne({_id: new ObjectID(id) }, function(err, doc) {
  			sp = doc;
  			res.render('editpro',{ edit: sp });
		});
	});
});
app.post('/admin/sanpham/edit',function(req,res){
	var id = req.body.idma;
	var ten = req.body.tensp;
	var gia1 = req.body.gia;
	var gt = req.body.FullName;
	db.open(function(err, db) {
		var collection = db.collection('sanpham');
		collection.update({_id: new ObjectID(id)}, {$set:{ tensp: ten, mieuta: gt, gia: gia1 }});
	});
	res.redirect('/admin/sanpham');
});
app.get('/admin/user/add',function(req,res){
	res.render('adduser');
});
app.get('/admin/user/edit/:id',function(req,res){
	var id = req.params.id;
	db.open(function(err, db) {
		var sp;
		var collection = db.collection('user');
		collection.findOne({_id: new ObjectID(id) }, function(err, doc) {
  			sp = doc;
  			res.render('edituser',{ edit: sp });
		});
	});
});
app.post('/admin/user/edit',function(req,res){
	var id = req.body.idma;
	var ten = req.body.usname;
	var pass1 = req.body.pass;
	var pq = req.body.pq
	db.open(function(err, db) {
		var collection = db.collection('user');
		collection.update({_id: new ObjectID(id)}, {$set:{ usename: ten, pass: pass1, phanquyen: pq }});
	});
	res.redirect('/admin/user');	
});
app.post('/admin/sanpham/add',function(req,res){
	var id = 11;
	var ten =req.body.tensp;
	var gia1 = req.body.gia;
	var gioithieu = req.body.FullName;

	db.open(function(err, db) {
		var collection = db.collection('sanpham');
	// Insert a single document
		collection.insert({masp: id ,tensp: ten, mieuta: gioithieu, gia: gia1 });

	// Wait for a second before finishing up, to ensure we have written the item to disk
	});
	res.redirect('/admin/sanpham');
});
app.post('/admin/user/add',function(req,res){
	var id = 11;
	var ten =req.body.usename;
	var pass1 = req.body.pass;
	var pass2 = req.body.pass1;
	if(pass1!= pass2)
	{
		res.redirect('/admin/user/add');
	}
	else
	{
		db.open(function(err, db) {
		var collection = db.collection('user');
	// Insert a single document
		collection.insert({mauser: id ,usename: ten, pass: pass1, phanquyen: 0 });

	// Wait for a second before finishing up, to ensure we have written the item to disk
	});
	res.redirect('/admin/user');
	}
});
app.post('/admin/user/:id',function(req,res){
	var id = req.params.id;
	db.open(function(err, db) {
		var collection = db.collection('user');
      	collection.remove({_id: new ObjectID(id) });
	});
	res.redirect('/admin/user');
});
app.post('/admin/sanpham/:id',function(req,res){
	var id = req.params.id;
	db.open(function(err, db) {
		var collection = db.collection('sanpham');
      	collection.remove({_id: new ObjectID(id) });
	});
	res.redirect('/admin/sanpham');
});
app.get('/admin/sanpham',function(req,res){
	var Fiber = require('fibers');
	Fiber(function(){
		var Server = require("mongo-sync").Server;
		var server = new Server('127.0.0.1');
		var result = server.db("qlbh").getCollection("sanpham").find().toArray();
		server.close();
		res.render('qlsanpham',{ yt: result });
	}).run();
});
app.get('/admin/user',function(req,res){
	var Fiber = require('fibers');
	Fiber(function(){
		var Server = require("mongo-sync").Server;
		var server = new Server('127.0.0.1');
		var result = server.db("qlbh").getCollection("user").find().toArray();
		server.close();
		res.render('qluser',{ us: result });
	}).run();
});
http.createServer(app).listen(app.get('port'),function(){
	console.log('Start successfully');
});