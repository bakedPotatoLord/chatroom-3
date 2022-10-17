import * as dotenv from 'dotenv'
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser"
import  Express  from 'express';
import {v4 as uuidv4} from "uuid"
import {Client} from '@replit/database';
import https from 'https'


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Client(process.env.DBURL)
const port = 3000
const server = https.createServer(app)


function reset(){
	db.set("messages",[])
}


async function logPost(message){
	let data:any= await db.get("messages")
	data.push(JSON.parse(message) )
	db.set("messages", data)
}

app.get("/home/:uuid/:username",(req,res) => {
	res.cookie('uuid',req.params.uuid,{ maxAge: 900000, httpOnly: false})
	res.cookie('username',req.params.username,{ maxAge: 900000, httpOnly: false})
	res.sendFile(__dirname+'/index.html')
})

app.get('/data.json',async (req,res)=>{
	res.send(await db.get("messages"))
})


app.get("*",(req,res) => {
	res.sendFile(__dirname +'/src'+ req.originalUrl)
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
		res.end("recived")
});

app.post('/login', async (req,res) =>{
	console.log(req.body)
	let data:any = await db.get("users")
		
	for(let i of data){
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


app.post('/createAccount',async (req,res)=>{
	let matchFound:boolean
	let content
	console.log(req.body)
	let data:any = await db.get("users")


	matchFound=false
	if('checkbox' in req.body){

		for(let i of data){
			if(i.username == req.body.username){
				res.set('Content-Type', 'text/html')
				res.send('<p>username taken</p>')
				matchFound=true
			}
		}
		if(!matchFound){
			content = data
			content.push({"username":req.body.username,
			"password":req.body.password,
			"email":req.body.email,
			"uuid":uuidv4()})
			await db.set("users",content)
			res.cookie("username",req.body.username)
			res.redirect('/')
			
				
		}
	}else{
		res.set('Content-Type', 'text/html')
		res.send('<p>Check the dang box you little crap</p>')
	}


})


server.listen(port, ()=>{
  console.log("server is running on port 3000");
})


