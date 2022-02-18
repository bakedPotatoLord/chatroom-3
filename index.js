
const path = require('path')
const bodyParser = require('body-parser');
const express = require("express");
const fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const app = new express();
app.use(bodyParser.urlencoded({ extended: true }));


const port = 3000;

const restrictedUrls = ['/users.json']

//initialize the json file that contains the messages

function reset(){
	fs.writeFile(path.join(__dirname,'/data.json'), JSON.stringify( {"arr":[]} ), err => {
			if (err) {console.error(err) }
	})
}


function logPost(message){
	fs.readFile(path.join(__dirname,'/data.json'), 'utf8' , (err, data) => {
		if (err) {console.error(err) }
		

		var tempData = JSON.parse(data);
		tempData.arr.push(JSON.parse(message) )

		
		fs.writeFile(path.join(__dirname,'/data.json'), JSON.stringify(tempData ), err => {
				if (err) {console.error(err)  }

				})
	})

}

app.get("/home/:uuid/:username",(req,res) => {

	res.cookie('uuid',req.params.uuid,{ maxAge: 900000, httpOnly: false})
	res.cookie('username',req.params.username,{ maxAge: 900000, httpOnly: false})
	
	res.sendFile(__dirname+'/index.html')

})


app.get("*",(req,res) => {
	if(!restrictedUrls.includes(req.originalUrl) ){

		res.sendFile(__dirname + req.originalUrl)
	}else{
		res.send('restricted file')
	}

})


app.post("/", function(req, res) {
	console.log('post request recived')

	var tempMs = JSON.parse( req.body.message)
	console.log(' message sent : ',tempMs.text)

		if(tempMs.text == 'reset'){
			reset();
			return;
		};
		
		logPost(req.body.message)

	
});

app.post('/login',function(req,res){
	console.log(req.body)
	fs.readFile(__dirname+'/users.json', 'utf8' , (err, data) => {
		if (err) {
			console.error(err)
			return
		}
		
		for(i of JSON.parse(data)){
			if(i.username === req.body.username){
				if(i.password === req.body.password){
					res.redirect('/home/'+i.uuid+'/'+i.username)
					//send webpage
				}else{
					res.set('Content-Type', 'text/html')
					res.send('<p>incorrect password</p>')
				}
			}else{
				res.set('Content-Type', 'text/html')
				res.send('<p>username not found</p>')
			}
		}
	})
})

var matchFound
var content
app.post('/createAccount',function(req,res){
	console.log(req.body)
	fs.readFile(__dirname+'/users.json', 'utf8' , (err, data) => {
		if (err) {
			console.error(err)
			return
		}
		matchFound=false
		if('checkbox' in req.body){

			for( i of JSON.parse(data)){
				if(i.username == req.body.username){
					res.set('Content-Type', 'text/html')
					res.send('<p>username taken</p>')
					matchFound=true
				}
			}
			if(!matchFound){
				content = JSON.parse(data)
				content.push({"username":req.body.username,
				"password":req.body.password,
				"email":req.body.email,
				"uuid":uuidv4()})
				fs.writeFile(__dirname+'/users.json', JSON.stringify(content), err => {
					if (err) {
						console.error(err)
						return
					}
					res.redirect('index.html?name='+req.body.username)
				})
			}
		}else{
			res.set('Content-Type', 'text/html')
			res.send('<p>Check the dang box you little crap</p>')
		}

		
	})
})



app.listen(port, function(){
  console.log("server is running on port 3000");
})
