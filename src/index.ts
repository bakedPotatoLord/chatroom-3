import Cookies from './lib/js-cookie.js'




console.log('documentReady')

let name  = <HTMLInputElement>document.getElementById('name')
let recip =<HTMLInputElement> document.getElementById('recip')
let tInput = <HTMLInputElement>document.getElementById('tInput')
let textarea =  <HTMLTextAreaElement>document.getElementById('tArea')
let uuid = document.getElementById('uuid')
let logout = document.getElementById('logout')


uuid.innerHTML ="Hello " +Cookies.get('username')


function displayMessages(messageArr: Message[]){
    console.log(messageArr)
    let displayText:string = ''
    for(let i of messageArr){
        displayText+= `${ new Date(i.timestamp).getHours()}:${ new Date(i.timestamp).getMinutes()} ${i.sender} -> ${i.recip} : ${i.text}\n`
    }
    textarea.value = displayText
}


//@ts-ignore
var sock = new SockJS('/echo',"",{sessionId:8});
sock.onopen = function() {
    console.log('open');
};

//setTimeout(()=>{sock.send(JSON.stringify(new Message("me","you","yo"))); },1000)

sock.onmessage = function(e) {
    displayMessages(JSON.parse(e.data))
    //sock.close();
};

sock.onclose = function() {
    console.log('close');
};


window.onload=function(){
    name.value = Cookies.get('name')
    uuid.innerHTML = Cookies.get('username')

    if(Cookies.get('uuid') == undefined){
        Cookies.set('uuid','guest')
        Cookies.set('username','guest')
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