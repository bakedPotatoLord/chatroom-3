

import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser"
import  Express  from 'express';
import fs from 'node:fs/promises'
import {v4 as uuidv4} from "uuid"

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = new Express();
app.use(bodyParser.urlencoded({ extended: true }));


const port = 3000;

const restrictedUrls = ['/users.json']

//initialize the json file that contains the messages

async function reset(){
	await fs.writeFile(path.join(__dirname,'/data.json'), JSON.stringify( {"arr":[]} ))
}


async function logPost(message){
	let data = await fs.readFile(path.join(__dirname,'/data.json'), 'utf8' )


		var tempData = JSON.parse(data);
		tempData.arr.push(JSON.parse(message) )

		await fs.writeFile(path.join(__dirname,'/data.json'), JSON.stringify(tempData ))

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

app.post('/login', async (req,res) =>{
	console.log(req.body)
	let data = await fs.readFile(__dirname+'/users.json', 'utf8' )
		
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

var matchFound
var content
app.post('/createAccount',async (req,res)=>{
	console.log(req.body)
	let data = fs.readFile(__dirname+'/users.json', 'utf8' )


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
			await fs.writeFile(__dirname+'/users.json', JSON.stringify(content))
			.then(()=>{
				res.redirect('index.html?name='+req.body.username)
			})
				
		}
	}else{
		res.set('Content-Type', 'text/html')
		res.send('<p>Check the dang box you little crap</p>')
	}


})



app.listen(port, ()=>{
  console.log("server is running on port 3000");
})
