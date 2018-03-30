window.Loading = function(){
	this.domTagName = 'div';
	this.domId = 'loading';
	this.domContent = [
		'<div class="box">',
			'<div class="clock"><i></i><i></i></div>',
			'<p>LOADING...</p>',
		'</div>'
	].join('');
	this.styleTagName = 'style';
	this.styleId = 'loadingStyle';
	this.styleContent = [
		'#loading{ font-size:1em; position:absolute; z-index:100; left:0; right:0; top:0; bottom:0; background:#000; display: -webkit-box;-webkit-box-orient: horizontal;-webkit-box-pack: center;-webkit-box-align: center;display: -moz-box;-moz-box-orient: horizontal;-moz-box-pack: left;-moz-box-align: center;display: -o-box;-o-box-orient: horizontal;-o-box-pack: left;-o-box-align: center;display: -ms-box;-ms-box-orient: horizontal;-ms-box-pack: left;-ms-box-align: center;display: box;box-orient: horizontal;box-pack: left;box-align:center;}',
		'#loading .box{ color:#00a696; text-align:center;}',
		'#loading .box p{ margin-top:1em;}',
		'#loading .clock{font-size:1.2em;border-radius: 6em;border: 0.4em solid #00a696;height: 7em;width: 7em;position: relative;}',
		'#loading .clock i:nth-child(1){position: absolute;background-color: #00a696;left: 50%;bottom:50%;margin-bottom:-0.2em;height: 3.2em;margin-left:-0.2em;width: 0.4em;border-radius: 0.3em;-webkit-transform-origin: 50% 93.75%;transform-origin: 50% 93.75%;-webkit-animation: grdAiguille 2s linear infinite;animation: grdAiguille 2s linear infinite;}',
		'@-webkit-keyframes grdAiguille{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}',
		'@keyframes grdAiguille{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}',
		'#loading .clock i:nth-child(2){position: absolute;background-color: #00a696;left: 50%;bottom:50%;margin-bottom:-0.2em;margin-left:-0.2em;height: 2.5em;width: 0.4em;border-radius: 0.3em;-webkit-transform-origin: 50% 92%;transform-origin: 50% 92%;-webkit-animation: ptAiguille 12s linear infinite;animation: ptAiguille 12s linear infinite;}',
		'@-webkit-keyframes ptAiguille{0%{-webkit-transform:rotate(0deg);}100%{-webkit-transform:rotate(360deg);}}',
		'@keyframes ptAiguille{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}'
	].join('');
	this.setup();
}

Loading.prototype = {
	setup: function(){
		this.style = document.createElement(this.styleTagName);
		this.style.id = this.styleId;
		this.style.innerHTML = this.styleContent;
		document.getElementsByTagName('body')[0].appendChild(this.style);
		
		this.dom = document.createElement(this.domTagName);
		this.dom.id = this.domId;
		this.dom.innerHTML = this.domContent;
		document.getElementsByTagName('body')[0].appendChild(this.dom);
		this.bindEvents();
	},
	bindEvents: function(){
		var _this = this;
		window.addEventListener('load',windowLoadHandler,false);
		function windowLoadHandler(){
			window.removeEventListener('load',windowLoadHandler,false);
			document.getElementsByTagName('body')[0].removeChild(_this.dom);
			document.getElementsByTagName('body')[0].removeChild(_this.style);
			try{
				start();
			}catch(e){}
		}
	}
}
var loading = new Loading();