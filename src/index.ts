import Cookies from './lib/js-cookie.js'




console.log('documentReady')

let name  = <HTMLInputElement>document.getElementById('name')
let recip =<HTMLInputElement> document.getElementById('recip')
let tInput = <HTMLInputElement>document.getElementById('tInput')
let textarea =  <HTMLTextAreaElement>document.getElementById('tArea')
let uuid = document.getElementById('uuid')
let logout = document.getElementById('logout')
let form = document.forms[0]





function displayMessages(messageArr: Message[]){
    console.log(messageArr)
    let displayText:string = ''
    for(let i of messageArr){
        displayText+= `${ new Date(i.timestamp).getHours()}:${ new Date(i.timestamp).getMinutes()} ${i.sender} -> ${i.recip} : ${i.text}\n`
    }
    textarea.value = displayText
}

form.onsubmit = (e)=>{
    e.preventDefault()
    let data = new FormData(form)
    tInput.value = ''

    sock.send(JSON.stringify(new Message(data.get('name'),data.get('recip'),data.get('tInput'))))
}


//@ts-ignore
var sock = new SockJS('/echo',"",{sessionId:8});
sock.onopen = function() {
    console.log('open');
};

sock.onmessage = function(e) {
    displayMessages(JSON.parse(e.data))
};

sock.onclose = function() {
    console.log('sock closed');
};


window.onload=function(){
    if(Cookies.get('uuid') == undefined){
        Cookies.set('uuid','guest')
        Cookies.set('username','guest')
    }

    name.value = Cookies.get('username')
    uuid.innerHTML ="Hello " +Cookies.get('username')
}

tInput.onkeyup = (e)=>{
    if(e.key == 'enter'){
        form.submit()
    }
}


logout.onclick = function(e){
    if(confirm("Want to log out?")){
        Cookies.set('uuid','guest')
        Cookies.set('username','guest')
    }
}

export class Message{
	sender: string;
	recip: string;
	text: string;
	timestamp: number;
	constructor(sender, recip, text){
		this.sender = sender;
		this.recip = recip;
		this.text = text;
		this.timestamp = Date.now();
	}
}