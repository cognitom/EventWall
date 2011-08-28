/**
 * 拡張と共通関数
 */
 
/* jQuery Extention */
jQuery.extend({
	getUrlVars: function(){
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++){
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	},
	getUrlVar: function(name){
		return ($.getUrlVars()[name]) ? decodeURI($.getUrlVars()[name]) : '';
	}
});

/* URL文字列を検出して、リンクにする */
String.prototype.autoLink = function(){
	return this.replace(/(https?:\/\/[^\s]+)/g, function(){
	    return '<a href="' + arguments[1] + '">' + decodeURI(arguments[1]) + '</a>';
	});
};

/* 改行にBRを追加 */
String.prototype.nl2br = function(){
	return this.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br />' + '$2');
};

/* 文字列の前後の空白を除去 */
String.prototype.trim = function(){
	return this.replace(/^\s+|\s+$/g, '');
};


/**
 * 拡張と共通関数
 */
var eid = $.getUrlVar('eid') || '126901887401754';
var hashtag = $.getUrlVar('hashtag') || 'fbcmeetup';
var setting = {
	event_id:eid,
	column_width:180,
	interval:20*1000,
	twitter:{
		version: 2,
		type: 'search',
		search: '#'+hashtag,
		interval: 30000,
		title: 'Tweet with this hashtag!',
		subject: '#'+hashtag,
		width: 210,
		height: 800,
		theme: {
			shell: {
				background: '#8ec1da',
				color: '#ffffff'
			},
			tweets: {
				background: '#ffffff',
				color: '#444444',
				links: '#1985b5'
			}
		},
		features: {
			scrollbar: false,
			loop: true,
			live: true,
			hashtags: true,
			timestamp: true,
			avatars: true,
			toptweets: true,
			behavior: 'default'
		}
	}
};

/**
 * 処理
 */

/* フィードを読込む */
$(function(){
	$.getJSON('event.php?event_id='+setting.event_id, function(json){
		var evt = json.event, atnds = json.attendees, order = [], detail_loading = [];
		
		for (var id in atnds){
			order.push(id);
			detail_loading.push(id);
		}
		
		evt.name || (evt.name = 'Untitled Event');
		evt.description || (evt.description = '(no data)');
		
		document.title = evt.name;
		$('body>header h1').html(evt.name);
		$('body>header p').html(evt.description.autoLink().nl2br());
		
		var repeater = function (){
			var html = []
			for (var i=0; i<order.length; i++){
				var atnd = atnds[order[i]], url = '#', feed = [], likes = [];
				if (atnd.detail_loaded){
					url = atnd.link ? atnd.link : 'http://www.facebook.com/'+atnd.username;
					for (var j=0; j<atnd.feed.length; j++)
						if (atnd.feed[j].message)
							feed.push(atnd.feed[j].message);
					//for (var j=0; j<atnd.likes.length; j++)
					//	likes.push('<img src="http://graph.facebook.com/',atnd.likes[j].id,'/picture" />');
				}
				html.push(
					'<article>',
						'<header>',
							'<h2>',atnd.name,'</h2>',
							'<a target="',atnd.id,'" href="',url,'"><img src="http://graph.facebook.com/',atnd.id,'/picture?type=large" /></a>',
						'</header>',
						'<p>',likes.join(''),feed.join(' / '),'</p>',
					'</article>'
				);
			}
			
			$('body>div.attendees').html(html.join(''));
			
			setTimeout(function(){
				order.push(order.shift());
				$('body>div.attendees article:first').slideUp(200, repeater);
			}, setting.interval);
		};
		var detail_load = function(){
			var user_id = detail_loading.shift();
			if (user_id){
				$.getJSON('profile.php?user_id='+user_id, function(json){
					atnds[json.id] = json;
					detail_load();
				});
			}
		};
		repeater();
		detail_load();
	});
});