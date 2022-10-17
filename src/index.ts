import Cookies from '../node_modules/js-cookie/index.js'
import {Message} from '../index.js'
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
