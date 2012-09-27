// The ajax part is a spanish script. Could use anything
// Source: http://www.yvoschaap.com/index.php/weblog/css_star_rater_ajax_version/
// Esta es para llamado de datos remotos via xmlHttpRequest

function datosServidor() {
};
datosServidor.prototype.iniciar = function() {
	try {
		// Mozilla / Safari
		this._xh = new XMLHttpRequest();
	} catch (e) {
		// Explorer
		var _ieModelos = new Array(
		'MSXML2.XMLHTTP.5.0',
		'MSXML2.XMLHTTP.4.0',
		'MSXML2.XMLHTTP.3.0',
		'MSXML2.XMLHTTP',
		'Microsoft.XMLHTTP'
		);
		var success = false;
		for (var i=0;i < _ieModelos.length && !success; i++) {
			try {
				this._xh = new ActiveXObject(_ieModelos[i]);
				success = true;
			} catch (e) {
				// Implementar manejo de excepciones
			}
		}
		if ( !success ) {
			// Implementar manejo de excepciones, mientras alerta.
			return false;
		}
		return true;
	}
}

datosServidor.prototype.ocupado = function() {
	estadoActual = this._xh.readyState;
	return (estadoActual && (estadoActual < 4));
}

datosServidor.prototype.procesa = function() {
	if (this._xh.readyState == 4 && this._xh.status == 200) {
		this.procesado = true;
	}
}

datosServidor.prototype.enviar = function(urlget,datos) {
	if (!this._xh) {
		this.iniciar();
	}
	if (!this.ocupado()) {
		this._xh.open("GET",urlget,false);
		this._xh.send(datos);
		if (this._xh.readyState == 4 && this._xh.status == 200) {
			return this._xh.responseText;
		}
		
	}
	return false;
}


// Este es un acceso rapido, le paso la url y el div a cambiar
function _gr(reqseccion,divcont) {
	remotos = new datosServidor;
	nt = remotos.enviar(reqseccion,"");
	document.getElementById(divcont).innerHTML = nt;
}



//Estas dos son para guardar

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

//****End of ajax part ****

function rateImg(rating,songid)  {
		remotos = new datosServidor;
		nt = remotos.enviar('ajaxupdaterating.php?rating='+rating+'&songid='+songid);
		width = 25 * nt;

		document.getElementById('resultstars'+songid).style.display = "block";
		document.getElementById('resultlink'+songid).style.width =  width+'px';
		document.getElementById('resultstars'+songid).title =  "You: "+rating+" / Avg: "+nt;
		document.getElementById('clickstars'+songid).style.display = "none";
}

function ratesonglayout(rating,baseurl)  {
		if (rating < 3) {
			document.getElementById('popup').style.display="block";
			
			document.getElementById('singlesong').style.background="#cccccc";
			document.getElementById('singlesong').style.color="#999999";
			
			
			//The titles do not have id, so leave this for now..
			//document.getElementById('finalartist').style.color="gray";
			//document.getElementById('finaltitle').style.color="blue";
		}
		
		remotos = new datosServidor;
		nt = remotos.enviar('/ratesong.php?layoutrating='+rating+'&baseurl='+baseurl);
		width = 20 * nt;

		document.getElementById('resultstarslayout').style.display = "block";
		document.getElementById('resultlinklayout').style.width =  width+'px';
		document.getElementById('clickstarslayout').style.display = "none";
		

}

function ratesongaccuracy(rating,baseurl)  {
		remotos = new datosServidor;
		nt = remotos.enviar('/ratesong.php?accuracyrating='+rating+'&baseurl='+baseurl);
		width = 20 * nt;

		document.getElementById('resultstarsaccuracy').style.display = "block";
		document.getElementById('resultlinkaccuracy').style.width =  width+'px';
		document.getElementById('clickstarsaccuracy').style.display = "none";
}

function getsongs(id,baseurl)  {
		remotos = new datosServidor;
		nt = remotos.enviar('/ajaxallsongsartists.php?id='+id+'&baseurl='+baseurl);
		if (document.getElementById(id).innerHTML != ""){
					document.getElementById(id).innerHTML = "";
					document.getElementById(id).style.display = "none";
					document.getElementById('arrow'+id).src = 'http://images.chordie.com/images/right.gif';
		} else {
					document.getElementById(id).style.display = "block";
					document.getElementById(id).innerHTML = nt;
					document.getElementById('arrow'+id).src = 'http://images.chordie.com/images/down.gif';
					createCookie('lastvisitedurl',document.location.href,7);
					createCookie('lastvisitedbaseurl',baseurl,7);
					createCookie('lastvisitedid',id,7);
		}
}

function getchords(chord,tuning,define,id,current)  {
		var cleandefinearray = new Array();
		var definearray = new Array();
		remotos = new datosServidor;
		nt = remotos.enviar('/ajaxvoicings.php?chord='+chord+'&tuning='+tuning+'&define='+define+'&id='+id+'&current='+current);
		if (document.getElementById('variations').style.display == "none" ){
				document.getElementById('chordimages').style.display = "none";
				document.getElementById('imageexplanation').style.display = "none";
				document.getElementById('variations').style.display = "block";
				document.getElementById('variations').innerHTML = nt;
		} else {
				//Clean the input field for all previous definitions of this chord
				definearray = document.getElementById('defineinput').value.split("+");
				shortdefine = define.replace('+','');
				for (i=0;i < definearray.length;i++){
					if (definearray[i] != "") {
							definechord = shortdefine.substr(0,shortdefine.length-8);
							definearraychord = definearray[i].substr(0,definearray[i].length-8);
							if (definechord != definearraychord) {
								cleandefinearray.push(definearray[i]);
							}
					}
				}				
				
				cleandefine = cleandefinearray.join("+");
				//alert(cleandefinearray);
		
				//Add previous value from hidden define field
				document.getElementById('defineinput').value = cleandefine + define;
				
				
				document.getElementById('chordimages').style.display = "block";
				document.getElementById('variations').style.display = "none";
				document.getElementById('imageexplanation').style.display = "block";
				//Change image
				if (current) {
						document.getElementById('chord'+id).src = current;
				}
				if(addlink = document.getElementById('addlink').href) {
					definepos = addlink.lastIndexOf('define=');
					firstpart = addlink.substr(0,definepos+7);
					newaddlink = firstpart+document.getElementById('defineinput').value;
					document.getElementById('addlink').href = newaddlink;
				}
		}
}

function ltrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}
 
function rtrim(str, chars) {
	chars = chars || "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/**
 * DHTML email validation script. Courtesy of SmartWebby.com
/(http://www.smartwebby.com/dhtml/)
 */

function echeck(str) {
		var at="@"
		var dot="."
		var lat=str.indexOf(at)
		var lstr=str.length
		var ldot=str.indexOf(dot)
		if (str.indexOf(at)==-1){
		   //alert("Invalid E-mail ID")
		   return false
		}

		if (str.indexOf(at)==-1 || str.indexOf(at)==0 || str.indexOf(at)==lstr){
		   //alert("Invalid E-mail ID")
		   return false
		}

		if (str.indexOf(dot)==-1 || str.indexOf(dot)==0 || str.indexOf(dot)==lstr){
		    //alert("Invalid E-mail ID")
		    return false
		}

		 if (str.indexOf(at,(lat+1))!=-1){
		    //alert("Invalid E-mail ID")
		    return false
		 }

		 if (str.substring(lat-1,lat)==dot || str.substring(lat+1,lat+2)==dot){
		    //alert("Invalid E-mail ID")
		    return false
		 }

		 if (str.indexOf(dot,(lat+2))==-1){
		    //alert("Invalid E-mail ID")
		    return false
		 }
		
		 if (str.indexOf(" ")!=-1){
		    //alert("Invalid E-mail ID")
		    return false
		 }

 		 return true					
	}


function enableUsernameCheck(){
		document.getElementById('usernamestatus').innerHTML = '';
}

function firststepRegister(){
	var date = new Date();
	document.getElementById('register1').value='checking...';
	document.getElementById('register1').label='checking...';

	error = false;
	if (checkName() != true) error = true;	
	if (checkPassword() != true) error = true;
	if (checkEMail() != true) error = true;
	document.getElementById('register1').value='Sign Up';
	document.getElementById('register1').label='Sign Up';
	
	if(!error){
		color = 'gray';
		
		document.getElementById('usernamelabel').style.color = color;
		document.getElementById('passwordlabel').style.color = color;
		document.getElementById('emaillabel').style.color = color;
		document.getElementById('usernamestatus').style.color = color;
		document.getElementById('passwordstatus').style.color = color;
		document.getElementById('emailstatus').style.color = color;
		document.getElementById('username').disabled = 'true';
		document.getElementById('password').disabled = 'true';
		document.getElementById('email').disabled = 'true';
		document.getElementById('register1').style.display = 'none';
		document.getElementById('laststep').style.display = 'block';
		
		email = document.getElementById('email').value;
		username = document.getElementById('username').value;
		
		//Send the email with the verification code
    remotos = new datosServidor;
    nt = remotos.enviar('sendverificationcode.php?uande='+username+'xxxzzz'+email+'&iestuff='+date.getTime());

    if (nt == "mail sent"){
      document.getElementById('register1').style.display = 'none';
      document.getElementById('laststep').style.display = 'block';
      return true;
    } else {
      document.getElementById('emailstatus').innerHTML = 'There was a	problem sending a mail to this address!';
      return false;
		}
	}	
}

function checkVerificationCode(){
	var date = new Date();
	
	enteredcode = document.getElementById('code').value;
	enteredcode = enteredcode.toUpperCase();
	email = document.getElementById('email').value;
	alert(enteredcode);
	//Get generated code
	remotos = new datosServidor;
  nt = remotos.enviar('getverificationcode.php?email='+email+'&iestuff='+date.getTime());
	if (nt == enteredcode) {
		return true;
	} else {
		return false;
	}
}

function laststepRegister(){
	var date = new Date();
	document.getElementById('register2').value='checking...';
	document.getElementById('register2').label='checking...';
	
	error = false;
	if (checkName() != true) error = true;	
	if (checkPassword() != true) error = true;
	if (checkEMail() != true) error = true;
	if (error){
		document.getElementById('register2').value='Finalize Registration';
		document.getElementById('register2').label='Finalize Registration';
		return false;
	}
	if (checkVerificationCode() != true){
	 document.getElementById('codestatus').innerHTML = 'Codes do not match!';
	 document.getElementById('register2').value='Finalize Registration';
	 //alert('codes do not match!');
	 return false;
	}	else {
	 //Start the real registration process
	 remotos = new datosServidor;
   nt = remotos.enviar('registernewuser.php?email='+document.getElementById('email').value+'&username='+document.getElementById('username').value+'&code='+document.getElementById('code').value+'&p='+document.getElementById('password').value+'&iestuff='+date.getTime());
	 if (nt == "user created"){
	 	document.getElementById('firststep').style.display = 'none';
	 	document.getElementById('laststep').style.display = 'none';
	 	document.getElementById('success').style.display = 'block';
	 } else {
	 	document.getElementById('register2').value='Finalize Registration';
	 	alert('There was an error creating this user! Please send an email to support@chordie.com and describe your problem. Error code: '+nt);
	 }
	}

}


function checkEMail(){
	var date = new Date();
	email = document.getElementById('email').value;
	if (echeck(email) != true) {
		document.getElementById('emailstatus').innerHTML = 'This is not a valid	email address!';
		return false;
	} else {
		//Check if email-address already is registered
		remotos = new datosServidor;
		nt = remotos.enviar('checkemail.php?email='+email+'&iestuff='+date.getTime());
	
		if (nt == "available"){
			document.getElementById('emailstatus').innerHTML = '<span	style="color: green">OK!</span>';
			return true;
		} else {
			document.getElementById('emailstatus').innerHTML = 'Email address already registered. Did you <a href="http://www.chordie.com/forum/login.php?action=forget&email='+email+'">forget your password</a>?';
			return false;
		}
	}
}

function checkPassword() {


	password = document.getElementById('password').value;

	if (password.length == 0){
		document.getElementById('passwordstatus').innerHTML = 'You must type a password!';
		return false;
		exit;
	}
	if (password.length <= 3){
		document.getElementById('passwordstatus').innerHTML = 'Password is too short! Minimum 4 characters.';
		return false;
		exit;
	}
	document.getElementById('passwordstatus').innerHTML = '<span	style="color: green">OK!</span>';
	return true;
}

function checkName(){
	var date=new Date();
	var username = ltrim(rtrim(document.getElementById('username').value));
	var usernamelength = username.length;
	
	if (usernamelength <= 3){
			document.getElementById('usernamestatus').innerHTML = 'Username is too short! Minimum 4 characters.';
			return false;
	} else {
		remotos = new datosServidor;
		nt = remotos.enviar('checkusername.php?username='+username+'&iestuff='+date.getTime());

		if (nt == "available"){
			document.getElementById('usernamestatus').innerHTML = '<span	style="color: green">OK!</span>';
			return true;
		} else {
			document.getElementById('usernamestatus').innerHTML = 'The username is not available!';
			return false;
		}
	}
}	

var ie = (document.all) ? true : false;

function showgrids() {
	spans = document.getElementsByTagName('span');
	img = document.getElementsByTagName('img');
	
	//Start by going through the chord images
	for (j=0;j<img.length;j++){
	//check if it is a chord image
		if(img[j].className == "chord"){
			chord = img[j].alt;
			spanclass1 = "absc "+chord;
			spanclass2 = "alow "+chord;
			imgsrc = img[j].src;
			for (i=0;i<spans.length;i++){
				if ((spans[i].className.toUpperCase() == spanclass1.toUpperCase()) || (spans[i].className.toUpperCase() == spanclass2.toUpperCase())){
					spans[i].innerHTML = "<span class=\"hiddenchords\" style=\"display: none;\">"+chord+"</span><img class=\"gridimages\" style=\"position: relative;top:-45px;left: -25px;\" src=\""+imgsrc+"\" />";
				}
			}
		}	
	}
	//Change the attributes for the inlc-tag
	for (i=0;i<spans.length;i++){
		if(spans[i].className == "inlc"){
			spans[i].style.position = "absolute";
			spans[i].style.right = "64px;";
		}
	}
	
	divs = document.getElementsByTagName('div');
	for (i=0;i<divs.length;i++){
		if (divs[i].className == "chordline" || divs[i].className == "textline" || divs[i].className == "chordonly"){
			divs[i].style.height = "70px";
		}
		
		if (divs[i].className == "song"){
			divs[i].style.paddingTop = "20px";
			divs[i].style.paddingLeft = "10px";
		}
	}

	document.getElementById('showgrids').style.display = "none";
	document.getElementById('hidegrids').style.display = "inline";
}

function hidegrids() {

	//remove the images
	imgs = document.getElementsByTagName('img');
	for (i=0;i<imgs.length;i++){
		if(imgs[i].className == "gridimages"){
			imgs[i].style.display = "none";
		}
	}
	
	//Make the hidden chords visible
	spans = document.getElementsByTagName('span');
	for (i=0;i<spans.length;i++){
		if(spans[i].className == "hiddenchords"){
			spans[i].style.display = "inline";
		}
	}
	
	//Reset the line height and margins
	divs = document.getElementsByTagName('div');
	for (i=0;i<divs.length;i++){
		if (divs[i].className == "chordline" || divs[i].className == "textline" || divs[i].className == "chordonly"){
			divs[i].style.height = "1.3em";
		}
		
		if (divs[i].className == "song"){
			divs[i].style.paddingTop = "0px";
			divs[i].style.paddingLeft = "0px";
		}
	}

	document.getElementById('showgrids').style.display = "inline";
	document.getElementById('hidegrids').style.display = "none";

	document.getElementById('showgrids').style.display = "inline";
	document.getElementById('hidegrids').style.display = "none";
}
function openlastitem() {
	lasturl = readCookie('lastvisitedurl');
	id = readCookie('lastvisitedid');
	baseurl = readCookie('lastvisitedbaseurl');
	if(document.location.href == lasturl) {
		getsongs(id,baseurl);
	}
}
function compact() {
	document.getElementById('grids').style.display = "none";
	document.getElementById('firstcol').style.width = "55%";
	document.getElementById('secondcol').style.width = "43%";
	document.getElementById('firstcol').style.cssFloat = "left";
	document.getElementById('secondcol').style.cssFloat = "left";
	document.getElementById('controlc').style.display = "block";
}

function expand() {
	document.getElementById('grids').style.display = "block";
	document.getElementById('firstcol').style.width = "100%";
	document.getElementById('secondcol').style.width = "100%";
	document.getElementById('firstcol').style.cssFloat = "none";
	document.getElementById('secondcol').style.cssFloat = "none";
	document.getElementById('controlc').style.display = "none";
	view(0);
	document.getElementById('layoutSelect').options[0].selected = "true";
}

function increaseFont() {
	rows = document.getElementsByTagName('tr');
	for (i=0;i<rows.length;i++){
		if (rows[i].className == "cl"){
			size = rows[i].style.fontSize;
			if (!size) size="100%";
			size = size.substr(0,size.length-1)-0;
			size = size+15;
			size = size + "%";
			rows[i].style.fontSize = size;
		}
		if (rows[i].className == "tl"){
			size = rows[i].style.fontSize;
			if (!size) size="100%";
			size = size.substr(0,size.length-1)-0;
			size = size+25;
			size = size + "%";
			rows[i].style.fontSize = size;
		}
	}
}
function decreaseFont() {
	rows = document.getElementsByTagName('tr');
	for (i=0;i<rows.length;i++){
		if (rows[i].className == "cl"){
			size = rows[i].style.fontSize;
			if (!size) size="100%";
			size = size.substr(0,size.length-1)-0;
			size = size-10;
			if (size<30) size=30;
			size = size + "%";
			rows[i].style.fontSize = size;
		}
		if (rows[i].className == "tl"){
			size = rows[i].style.fontSize;
			if (!size) size="100%";
			size = size.substr(0,size.length-1)-0;
			size = size-10;
			if (size<40) size=40;
			size = size + "%";
			rows[i].style.fontSize = size;
		}
	}
}		
function normalFont() {
	rows = document.getElementsByTagName('tr');
	for (i=0;i<rows.length;i++){
		if (rows[i].className == "cl"){
			rows[i].style.fontSize = "100%";
		}
		if (rows[i].className == "tl"){
			rows[i].style.fontSize = "100%";
		}
	}
}

function view(view) {

	if (view==0){

		rows = document.getElementsByTagName('tr');
		for (i=0;i<rows.length;i++){
			if (rows[i].className == "cl" || rows[i].className == "tl"){
				rows[i].style.visibility = "visible";
				rows[i].style.fontSize = "100%";
				rows[i].style.lineHeight = "100%";
			}
		}
	}

	if (view==1){
		rows = document.getElementsByTagName('tr');
		for (i=0;i<rows.length;i++){
			if (rows[i].className == "cl"){
				rows[i].style.visibility = "hidden";
				rows[i].style.fontSize = "0%";
				rows[i].style.lineHeight = "0%";
			}
			if (rows[i].className == "tl"){
				rows[i].style.visibility = "visible";
				rows[i].style.fontSize = "100%";
				rows[i].style.lineHeight = "100%";
			}
		}
	}
	
	if (view==2){
		rows = document.getElementsByTagName('tr');
		for (i=0;i<rows.length;i++){
			if (rows[i].className == "tl"){
				rows[i].style.visibility = "hidden";
				rows[i].style.fontSize = "0%";
				rows[i].style.lineHeight = "0%";
			}
			if (rows[i].className == "cl"){
				rows[i].style.visibility = "visible";
				rows[i].style.fontSize = "100%";
				rows[i].style.lineHeight = "100%";
			}
		}
	}

	if (view == 3) compact();

}


function ipodScroll(){
	var agent=navigator.userAgent.toLowerCase();
	var is_iphone = ((agent.indexOf('mobile'))!=-1);
	if (is_iphone){
		var	speed = 3;	
		counter=1;
	 
	 if (window.orientation == -90 || window.orientation == 90){
	 		slength = 135;
	} else {
	 		slength = 300;
	}	
		
		//Stop any processes before starting a new one...	
		if (typeof bTmp != "undefined"){
	 			clearInterval(bTmp);
		}
		bTmp=setInterval('ipodScrollFW()',speed);
	}
}

function ipodScrollFW(){
	counter++;
	
	if(counter>=slength) {
		clearInterval(bTmp);
	} else {
		//This one is critical. For some reason 0,1 does not work
		self.scrollBy(0,2);
	}
}

function scroll(nr){
	fullicon = "http://www.chordimages.com/images/fullicon.gif";
	scrollicon = "http://www.chordimages.com/images/scroll.gif";
	curicon = document.getElementById('autoscroll').src;
	
	for (i=1;i<=9;i++){
		document.getElementById(i).style.backgroundColor = "#f0f0f0";
		document.getElementById(i).style.fontWeight = "normal";
		document.getElementById(i).style.color = "#693";
	}
	document.getElementById(nr).style.backgroundColor = "#3366CC";
	document.getElementById(nr).style.fontWeight = "bold";
	document.getElementById(nr).style.color = "white";
	document.getElementById('scrollcontrol').style.zIndex = "5";
	document.getElementById('autoscroll').src = fullicon;
	document.getElementById('autoscroll').alt = "stop scroll";
	
	switch(nr) {
		case 1:
		speed="600";
		break;
		
		case 2:
		speed="400";
		break;
		
		case 3:
		speed="300";
		break;
	
		case 4:
		speed="200";
		break;
	
		case 5:
		speed="150";
		break;
	
		case 6:
		speed="110";
		break;
	
		case 7:
		speed="70";
		break;
	
		case 8:
		speed="40";
		break;
	
		case 9:
		speed="20";
		break;
		
		default:
		speed="125";
		break;
	}
	
	//Stop any processes before starting a new one...	
	if (typeof bTmp != "undefined"){
	 		clearInterval(bTmp);
	}
	bTmp=setInterval('ScrollFW()',speed);
}

function ScrollFW(){
	if (isAtBottom() == false){
		self.scrollBy(0,1);
	} else {
		document.getElementById('autoscroll').src = "http://www.chordimages.com/images/scroll.gif";
 		clearInterval(bTmp);
	}
}

function stopScroll() {
		document.getElementById('autoscroll').src = "http://www.chordimages.com/images/scroll.gif";
		clearInterval(bTmp);
		document.getElementById('scrollcontrol').style.zIndex = "-1";
}

function isAtBottom(){
		var a,b,c;
		a=document.documentElement.scrollHeight;
  	b=document.documentElement.scrollTop;
	 	c=document.documentElement.clientHeight
    return ((a-b)<=c);
}
