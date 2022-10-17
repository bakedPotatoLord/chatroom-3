import * as dotenv from 'dotenv'
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from "body-parser"
import  Express  from 'express';
import {Client} from '@replit/database';
import http from 'http'
import sockjs from "sockjs"
import { Message } from './src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = Express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = new Client(process.env.DBURL)
const port = 3000

app.get("/home/:uuid/:username",(req,res) => {
	res.cookie('uuid',req.params.uuid,{ maxAge: 900000, httpOnly: false})
	res.cookie('username',req.params.username,{ maxAge: 900000, httpOnly: false})
	res.sendFile(__dirname+'/index.html')
})

app.get("*",(req,res) => {
	res.sendFile(__dirname +'/src'+ req.originalUrl)
})

app.post('/login', async (req,res) =>{
	console.log(req.body)
	let data:any = await db.get("users")
	for(let i of data){
		if(i.username === req.body.username){
			if(i.password === req.body.password){
				res.cookie("username",req.body.username)
				res.redirect('/')
				break
			}else{
				res.set('Content-Type', 'text/html')
				res.send('<p>incorrect password</p>')
				break
			}
		}else{
			res.set('Content-Type', 'text/html')
			res.send('<p>username not found</p>')
			break
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
			content.push(new User(req.body.username,req.body.password,req.body.email))
			db.set("users",content)
			res.cookie("username",req.body.username)
			res.redirect('/')
		}
	}else{
		res.set('Content-Type', 'text/html')
		res.send('<p>Check the box please</p>')
	}
})
	
let socketArr:sockjs.Connection[] = []
const wss = sockjs.createServer({ prefix:'/echo'});
wss.on('connection', async function(ws) {
	socketArr.push(ws)
	ws.write( JSON.stringify( await db.get("messages")))

	ws.on('data', async function(message) {
		let data:Message[] = <Message[]>await db.get("messages")
		data.push(JSON.parse(message))
		db.set("messages",data)
		if(JSON.parse(message).text == 'reset'){
			db.set("messages",[])
			data = []
		}
		for(let i of socketArr){
			i.write(JSON.stringify(data));
		}
	});

  	ws.on('close', function() {
		socketArr.splice(socketArr.findIndex( (v,i)=>(v.id == ws.id) ),1)
	});
});

const server = http.createServer(app)
wss.installHandlers(server, {prefix:'/echo'});
server.listen(port, ()=>{
  console.log(`server is running on port ${port}`);
})


class User{
	username: string;
	password: string;
	email: string;
	uuid: string;
    constructor(username,password,email){
		this.username = username
		this.password= password
		this.email = email
		this.uuid = this.uuidv4()
	}

	uuidv4() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}
}
