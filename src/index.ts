import Cookies from './lib/js-cookie.js'




console.log('documentReady')

let name  = <HTMLInputElement>document.getElementById('name')
let recip =<HTMLInputElement> document.getElementById('recip')
let tInput = <HTMLInputElement>document.getElementById('tInput')
let textarea =  document.getElementById('tArea')
let uuid = document.getElementById('uuid')
let logout = document.getElementById('logout')


uuid.innerHTML ="Hello " +Cookies.get('username')



//@ts-ignore
var sock = new SockJS('/echo',"",{sessionId:8});
sock.onopen = function() {
    console.log('open');
    
    sock.send(JSON.stringify(new Message("me","you","yo")));
};

sock.onmessage = function(e) {
    console.log('message', e.data);
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