//视频窗口
window.ShowVideo = function(config){
	if(!config) return false;
	this.video = [];
	this.videoInnerHTML = '<video></video>';
	this.btnInnerHTML = '<span style="padding:0 12px; cursor:pointer;"></span>';
	var title,url,width,height,autoPlay,control,poster,videoInner,btnInner;
	if(!config.video){
		title = config.title || '';
		if(typeof config.url == 'string'){
			url = [config.url];
		}else{
			url = config.url;
		}
		width = config.width || 1280;
		height = config.height || 720;
		autoPlay = config.autoPlay !== undefined ? config.autoPlay : true;
		control = config.control !== undefined ? config.control : true;
		poster = config.poster || false;
		videoInner = $(this.videoInnerHTML);
		btnInner = $(this.btnInnerHTML);
		this.video.push({
			title:title,
			url:url,
			width:width,
			height:height,
			autoPlay:autoPlay,
			control:control,
			poster:poster,
			videoInner:videoInner,
			btnInner:btnInner
		});
	}else{
		for(var i in config.video){
			title = config.video[i].title || '';
			if(typeof config.video[i].url == 'string'){
				url = [config.video[i].url];
			}else{
				url = config.video[i].url;
			}
			width = config.video[i].width || 1280;
			height = config.video[i].height || 720;
			autoPlay = config.video[i].autoPlay !== undefined ? config.video[i].autoPlay : true;
			control = config.video[i].control !== undefined ? config.video[i].control : true;
			poster = config.video[i].poster || false;
			videoInner = $(this.videoInnerHTML);
			btnInner = $(this.btnInnerHTML);
			this.video.push({
				title:title,
				url:url,
				width:width,
				height:height,
				autoPlay:autoPlay,
				control:control,
				poster:poster,
				videoInner:videoInner,
				btnInner:btnInner
			});
		}
	}
	this.type = {
		mp4:'video/mp4',
		ogv:'video/ogg',
		m3u8:'application/vnd.apple.mpegurl',
		ts:'video/MP2T'
	};
	
	this.bgColor = config.video[i].bgColor || config.video[i].backgroundColor || config.video[i].background || '#000'
	this.defaultType = 'mp4';
	this.cb = config.callback || function(){};
	this.closePic = 'img/btn_close_01.gif';
	this.windowSize = config.windowSize || {
		width:document.documentElement.clientWidth,
		height:document.documentElement.clientHeight
	}
	this.padding = 0;
	this.videoContent = $('<section id="showVideo" style="position:fixed; left:0; right:0; top:0; bottom:0; background:'+this.bgColor+'; overflow:hidden; z-index:20; display:none;"></section>');
	this.closeBtn = $('<div style="width:4em; height:4em; display:block; cursor:pointer; position:absolute; z-index:2; left:1.6em; top:1.6em; background:url('+this.closePic+') 0 0 no-repeat; background-size:100% 100%;"></div>');
	this.btnField = $('<div style=" height:2em; line-height:2em; font-size:1.6em; font-weight:bold; color:#aaa; position:absolute; z-index:2; right:1em; top:0.8em;"></div>');
	this.videoBg = $('<div style="position:absolute; left:0; right:0; top:0; bottom:0; background:'+this.bgColor+'; cursor:pointer; z-index:0;"></div>');
	this.setup();
}

ShowVideo.prototype = {
	setup:function(){
		this.isShow = -1;
		for(var k in this.video){
			this.video[k].source = '';
			for(var i in this.video[k].url){
				var fileLastName = '';
				if(this.video[k].url[i].indexOf('?')!=-1){
					fileLastName = this.video[k].url[i].split('?')[0];
				}else{
					fileLastName = this.video[k].url[i];
				}
				if(fileLastName.indexOf('/')!=-1){
					fileLastName = fileLastName.split('/')[fileLastName.split('/').length-1];
				}
				if(fileLastName.indexOf('.')!=-1){
					fileLastName = fileLastName.split('.')[fileLastName.split('.').length-1];
				}else{
					fileLastName = this.defaultType;
				}
				var tempType = this.type[fileLastName] || this.type[this.defaultType];
				var tempRandomCode = (this.video[k].url[i].indexOf('?')!=-1)?'':'?random='+Math.floor(Math.random()*10000);
				this.video[k].source += '<source src="'+this.video[k].url[i]+tempRandomCode+'" type="'+tempType+'">';
			}
			if(this.video[k].autoPlay){
				this.video[k].videoInner.attr('autoplay','autoplay');
			}
			if(this.video[k].control){
				this.video[k].videoInner.attr('controls','controls');
			}
			this.video[k].videoInner.attr('preload','none');
			
			var tempMaxWidth = this.windowSize.width - this.padding*2;
			var tempMaxHeight = this.windowSize.height - this.padding*2;
			if(this.video[k].width > tempMaxWidth){
				this.video[k].height = this.video[k].height*tempMaxWidth/this.video[k].width;
				this.video[k].width = tempMaxWidth;
			}
			if(this.video[k].height > tempMaxHeight){
				this.video[k].width = this.video[k].width*tempMaxHeight/this.video[k].height;
				this.video[k].height = tempMaxHeight;
			}
			
			this.video[k].videoInner.attr('style','position:absolute; z-index:1; display:block; left:50%; top:50%; width:'+this.video[k].width+'px; height:'+this.video[k].height+'px; margin:-'+parseInt(this.video[k].height/2)+'px 0 0 -'+parseInt(this.video[k].width/2)+'px;');
			if(this.video[k].poster){
				this.video[k].videoInner.attr('poster',this.poster);
			}
			this.video[k].btnInner.html(this.video[k].title).attr('num',k).appendTo(this.btnField);
		}
	},
	bindEvents: function(){
		var _this = this;
		for(var k in this.video){
			this.video[k].videoInner.get(0).addEventListener('ended',this.hide);
			this.video[k].btnInner.click(function(){
				_this.changeVideo($(this).attr('num'));
			});
		}
		this.closeBtn.bind('click',function(){
			_this.hide();
			controlMusic();
		});
		this.videoBg.bind('click',function(){
			_this.hide();
			controlMusic();
		});
	},
	unBindEvents: function(){
		var _this = this;
		for(var k in this.video){
			this.video[k].videoInner.get(0).removeEventListener('ended',this.hide);
			this.video[k].btnInner.unbind();
		}
		this.closeBtn.unbind();
		this.videoBg.unbind();
	},
	changeVideo:function(num){
		if(num == this.isShow) return false;
		this.isShow = num;
		for(var k in this.video){
			if(k!=num){
				this.video[k].videoInner.remove().get(0).pause();
				this.video[k].btnInner.css('color','');
			}else{
				this.video[k].videoInner.html(this.video[k].source).appendTo(this.videoContent);
				this.video[k].btnInner.css('color','#ddd');
				if(this.video[k].autoPlay){
					this.video[k].videoInner.get(0).play();
				}
			}
		}
	},
	show:function(){
		if(this.isShow>-1) return false;
		var _this = this;
		$('html').css('overflow','hidden');
		this.videoContent.append(this.closeBtn).append(this.videoBg).append(this.btnField).appendTo('body').show();
		this.changeVideo(0);
		this.bindEvents();
	},
	hide:function(){
		if(this.isShow==-1) return false;
		var _this = this;
		this.unBindEvents();
		for(var k in this.video){
			this.video[k].videoInner.get(0).pause();
		}
		this.videoContent.hide();
		this.changeVideo(-1);
		this.videoContent.remove();
		$('html').css('overflow','');
		this.cb();
	}
}


var videos = [];
var links = $('.showVideo');

for(var i=0; i<links.length; i++){
	var videoItem = new ShowVideo({
		video:[{
			title:'',
			url:[links.eq(i).attr('href')],
			width:parseFloat(links.eq(i).attr('width')),
			height:parseFloat(links.eq(i).attr('height'))
		}],
		callback:function(){
			$('html').css('overflow','auto');
		}
	});
	videos.push(videoItem);
}


links.click(function(e){
	controlMusic();
	videos[links.index(this)].show();
	e.stopPropagation();
	e.preventDefault();
});
