import Cookies from './lib/js-cookie.js'

console.log('documentReady')

let name  = <HTMLInputElement>document.getElementById('name')
let recip =<HTMLInputElement> document.getElementById('recip')
let tInput = <HTMLInputElement>document.getElementById('tInput')
let textarea =  document.getElementById('tArea')
let uuid = document.getElementById('uuid')
let logout = document.getElementById('logout')


uuid.innerHTML ="Hello " +Cookies.get('username')




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