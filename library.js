"use strict";
const plugin = {};

const user = require.main.require('./src/user');

const boltRegex = /\[b\]([^[]*(?:\[(?!b\]|\/b\])[^[]*)*)\[\/b\]/gi;
const italicRegex = /\[i\]([^[]*(?:\[(?!i\]|\/i\])[^[]*)*)\[\/i\]/gi;
const underlineRegex = /\[u\]([^[]*(?:\[(?!u\]|\/u\])[^[]*)*)\[\/u\]/gi;
const crossedOutRegex = /\[s\]([^[]*(?:\[(?!s\]|\/s\])[^[]*)*)\[\/s\]/gi;
const colorRegex = /\[color=(.+?)\]([^[]*(?:\[(?!color=.+\]|\/color\])[^[]*)*)\[\/color\]/gi;
const fontRegex = /\[font=(.+?)\]([^[]*(?:\[(?!font=.+\]|\/font\])[^[]*)*)\[\/font\]/gi;
const sizeRegex = /\[size=(\d+)\]([^[]*(?:\[(?!size=\d+\]|\/size\])[^[]*)*)\[\/size\]/gi;
const blurRegex = /\[blur\]([^[]*(?:\[(?!blur\]|\/blur\])[^[]*)*)\[\/blur\]/gi;
const urlRegex = /\[url\]([^[]*(?:\[(?!url\]|\/url\])[^[]*)*)\[\/url\]/gi;
const emailRegex = /\[email\]([^[]*(?:\[(?!email\]|\/email\])[^[]*)*)\[\/email\]/gi;
const urlCustomRegex = /\[url=(.+?)\]([^[]*(?:\[(?!url=.+\]|\/url\])[^[]*)*)\[\/url\]/gi;
const emailCustomRegex = /\[email=(.+?)\]([^[]*(?:\[(?!email=.+\]|\/email\])[^[]*)*)\[\/email\]/gi;
const imgRegex = /\[img\]([^[]*(?:\[(?!img\]|\/img\])[^[]*)*)\[\/img\]/gi;
const imgCustomRegex = /\[img=(.+?)\]([^[]*(?:\[(?!img=.+\]|\/img\])[^[]*)*)\[\/img\]/gi;
const mediaRegex = /\[media\]([^[]*(?:\[(?!media\]|\/media\])[^[]*)*)\[\/media\]/gi;
//list
const leftRegex = /\[left\]([^[]*(?:\[(?!left\]|\/left\])[^[]*)*)\[\/left\]/gi;
const centerRegex = /\[center\]([^[]*(?:\[(?!center\]|\/center\])[^[]*)*)\[\/center\]/gi;
const rightRegex = /\[right\]([^[]*(?:\[(?!right\]|\/right\])[^[]*)*)\[\/right\]/gi;
const quoteRegex = /\[quote\]([^[]*(?:\[(?!quote\]|\/quote\])[^[]*)*)\[\/quote\]/gi;
const quoteCustomRegex = /\[quote=(.+?)\]([^[]*(?:\[(?!quote=.+\]|\/quote\])[^[]*)*)\[\/quote\]/gi;
const spoilerFixRegex = /\[spoiler=\"(.+?)\"\]/gi;
const spoilerRegex = /\[spoiler\]([^[]*(?:\[(?!spoiler\]|\/spoiler\])[^[]*)*)\[\/spoiler\]/gi;
const spoilerCustomRegex = /\[spoiler=(.+?)\]([^[]*(?:\[(?!spoiler=.+\]|\/spoiler\])[^[]*)*)\[\/spoiler\]/gi;
//code
//table

const hideRegex = /\[hide\]([^[]*(?:\[(?!hide\]|\/hide\])[^[]*)*)\[\/hide\]/gi;
const clubRegex = /\[club\]([^[]*(?:\[(?!club\]|\/club\])[^[]*)*)\[\/club\]/gi;
const daysRegex = /\[days=(.+?)\]([^[]*(?:\[(?!days=.+\]|\/days\])[^[]*)*)\[\/days\]/gi;
const likesRegex = /\[likes=(.+?)\]([^[]*(?:\[(?!likes=.+\]|\/likes\])[^[]*)*)\[\/likes\]/gi;
const postsRegex = /\[posts=(.+?)\]([^[]*(?:\[(?!posts=.+\]|\/posts\])[^[]*)*)\[\/posts\]/gi;
const useridsRegex = /\[userids=(.+?)\]([^[]*(?:\[(?!userids=.+\]|\/userids\])[^[]*)*)\[\/userids\]/gi;
const exceptidsRegex = /\[exceptids=(.+?)\]([^[]*(?:\[(?!exceptids=.+\]|\/exceptids\])[^[]*)*)\[\/exceptids\]/gi;
const visitorRegex = /\[visitor\]([^[]*(?:\[(?!visitor\]|\/visitor\])[^[]*)*)\[\/visitor\]/gi;

//<a href
//const linkRegex = var expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
const linkHrefRegex = /<a[^>]*>[^<]*<\/a>/g;

plugin.alterContent = async function (params) {
	//console.log(params);
	//bolt [b][/b]
	//post.content = post.content.replace(boltRegex, "<strong>$1</strong>");
	//hide links for guest
	function parseLinkHref(text) {
	    return text.replace(linkHrefRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
	}
	function parseHide(text) {
	    return text.replace(hideRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
	}
	function parseClub(text, user) {
	    if(text.search(clubRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			if(user.groupTitleArray.includes('administrators') || user.groupTitleArray.includes('Global Moderators')){
				return text;
			}else{
				return text.replace(clubRegex, '<b>[Только администрация может просмотреть это сообщение]</b>');
		    	}
		    }else{
			return text.replace(clubRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseDays(text, user) {
	    if(text.search(daysRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(daysRegex)[0].match(/\d+/gi)[0];
			let userData = Math.ceil((new Date() - new Date(user.joindate)) / 86400_000)
			console.log(hideData,' days');
			if(userData >= parseInt(hideData)){
				return text;
			}else{
				return text.replace(daysRegex, '<b>[Для просмотра вам необходимо быть зарегистрированным не менее: '+hideData+' дней назад]</b>');
		    	}
		    }else{
			return text.replace(daysRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseLikes(text, user) {
	    if(text.search(likesRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(likesRegex)[0].match(/\d+/gi)[0];
			console.log(hideData,' likes');
			if(user.reputation >= parseInt(hideData)){
				return text;
			}else{
				return text.replace(likesRegex, '<b>[Для просмотра вам необходимо иметь больше: '+hideData+' репутации]</b>');
		    	}
		    }else{
			return text.replace(likesRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parsePosts(text, user) {
	    if(text.search(postsRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(postsRegex)[0].match(/\d+/gi)[0];
			console.log(hideData,' posts');
			if(user.postcount >= parseInt(hideData)){
				return text;
			}else{
				return text.replace(postsRegex, '<b>[Для просмотра вам необходимо иметь больше: '+hideData+' сообщений]</b>');
		    	}
		    }else{
			return text.replace(postsRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseUserids(text, user) {
	    if(text.search(exceptidsRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(exceptidsRegex)[0].match(/=(.+?)\]/gi)[0].replace(/=/,'').replace(/\]/,'').split(',');
			console.log(hideData,' users');
			if(hideData.includes(user.uid.toString())){
				return text.replace(exceptidsRegex, '<b>[Это сообщение всем кроме ограниченного числа лиц]</b>');
			}else{
				return text;
		    	}
		    }else{
			return text.replace(exceptidsRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseExceptids(text, user) {
	    if(text.search(useridsRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(useridsRegex)[0].match(/=(.+?)\]/gi)[0].replace(/=/,'').replace(/\]/,'').split(',');
			console.log(hideData,' users');
			if(hideData.includes(user.uid.toString())){
				return text;
			}else{
				return text.replace(useridsRegex, '<b>[Это сообщение доступно ограниченному числу лиц]</b>');
		    	}
		    }else{
			return text.replace(useridsRegex, '<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseVisitor(text, user) {
	    if(text.search(visitorRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			return text.replace(visitorRegex, user.username);
		    }else{
		    	return text.replace(visitorRegex, 'гость');
		    }
	    }else{
	    	return text;
	    }
	}
	if (!params.caller.uid) {
		for (const post of params.posts) {
			post.content = parseLinkHref(post.content);
			post.content = parseHide(post.content);
			post.content = parseClub(post.content);
			post.content = parseDays(post.content);
			post.content = parseLikes(post.content);
			post.content = parsePosts(post.content);
			post.content = parseUserids(post.content);
			post.content = parseExceptids(post.content);
			post.content = parseVisitor(post.content);
		}
	}else{
		let userData = await plugin.getUser(params.caller.uid);
		console.log(params,'-3-',userData);
		for (const post of params.posts) {
			post.content = parseClub(post.content,userData);
			post.content = parseDays(post.content,userData);
			post.content = parseLikes(post.content,userData);
			post.content = parsePosts(post.content,userData);
			post.content = parseUserids(post.content,userData);
			post.content = parseExceptids(post.content,userData));
			post.content = parseVisitor(post.content,userData);	
		}
	}
	return params;
};

plugin.getUser = async function (uid) {
	return await user.getUserFields(uid, ['username', 'userslug', 'status', 'postcount', 'reputation', 'joindate', 'groupTitle']);
};
plugin.parseContent = function(data, callback) {
	/*
	function parseLinks(text) {
	    while(text.search(linkRegex) !== -1) {
	        text = text.replace(linkRegex, '<a href="$1" target="_blank" class="externalLink" rel="nofollow">$1</a>');
	    }
	    return text;
	}
 	*/
	function parseBR(text){
	    return text.replace(/\n/,'<br>');
	}
	function parseBolt(text) {
	    while(text.search(boltRegex) !== -1) {
	        text = text.replace(boltRegex, '<b>$1</b>');
	    }
	    return text;
	}
	function parseBolt(text) {
	    while(text.search(boltRegex) !== -1) {
	        text = text.replace(boltRegex, '<b>$1</b>');
	    }
	    return text;
	}
	function parseItalic(text) {
	    while(text.search(italicRegex) !== -1) {
	        text = text.replace(italicRegex, '<i>$1</i>');
	    }
	    return text;
	}
	function parseUnderline(text) {
	    while(text.search(underlineRegex) !== -1) {
	        text = text.replace(underlineRegex, '<span style="text-decoration: underline">$1</span>');
	    }
	    return text;
	}
	function parseCrossedOut(text) {
	    while(text.search(crossedOutRegex) !== -1) {
	        text = text.replace(crossedOutRegex, '<span style="text-decoration: line-through">$1</span>');
	    }
	    return text;
	}
	function parseColor(text) {
	    while(text.search(colorRegex) !== -1) {
	        text = text.replace(colorRegex, '<span style="color: $1">$2</span>');
	    }
	    return text;
	}
	function parseFont(text) {
	    while(text.search(fontRegex) !== -1) {
	        text = text.replace(fontRegex, '<span style="font-family: $1">$2</span>');
	    }
	    return text;
	}
	function parseSize(text) {
	    while(text.search(sizeRegex) !== -1) {
	        text = text.replace(sizeRegex, '<span style="font-size: $1pt">$2</span>');
	    }
	    return text;
	}
	function parseBlur(text) {
	    while(text.search(blurRegex) !== -1) {
	        text = text.replace(blurRegex, '<span class="blur-text">$1</span>');
	    }
	    return text;
	}
	function parseUrl(text) {
	    while(text.search(urlRegex) !== -1) {
	        text = text.replace(urlRegex, '<a href="$1" target="_blank" class="externalLink" rel="nofollow">$1</a>');
	    }
	    return text;
	}
	function parseEmail(text) {
	    while(text.search(emailRegex) !== -1) {
	        text = text.replace(emailRegex, '<a href="mailto:$1">$1</a>');
	    }
	    return text;
	}
	function parseUrlCustom(text) {
	    while(text.search(urlCustomRegex) !== -1) {
	        text = text.replace(urlCustomRegex, '<a href="$1" target="_blank" class="externalLink" rel="nofollow">$2</a>');
	    }
	    return text;
	}
	function parseEmailCustom(text) {
	    while(text.search(emailCustomRegex) !== -1) {
	        text = text.replace(emailCustomRegex, '<a href="mailto:$1">$2</a>');
	    }
	    return text;
	}
	function parseImg(text) {
	    while(text.search(imgRegex) !== -1) {
	        text = text.replace(imgRegex, '<a href="$1" target="_blank" rel="noopener"><img src="$1" class="img-fluid img-markdown"></a>');
	    }
	    return text;
	}
	function parseImgCustom(text) {
	    while(text.search(imgCustomRegex) !== -1) {
	        text = text.replace(imgCustomRegex, '<a href="$2" target="_blank" rel="noopener"><img style="width:$1px" src="$2" class="img-fluid img-markdown"></a>');
	    }
	    return text;
	}
	function parseMedia(text) {
	    while(text.search(mediaRegex) !== -1) {
	        text = text.replace(mediaRegex, '<a media="$1" target="_blank" class="externalLink" rel="nofollow">$1</a>');
	    }
	    return text;
	}
	//list
	function parseLeft(text) {
	    while(text.search(leftRegex) !== -1) {
	        text = text.replace(leftRegex, '<div style="text-align: left">$1</div>');
	    }
	    return text;
	}
	function parseCenter(text) {
	    while(text.search(centerRegex) !== -1) {
	        text = text.replace(centerRegex, '<div style="text-align: center">$1​</div>');
	    }
	    return text;
	}
	function parseRight(text) {
	    while(text.search(rightRegex) !== -1) {
	        text = text.replace(rightRegex, '<div style="text-align: right">$1</div>');
	    }
	    return text;
	}
	function parseQuote(text) {
	    while(text.search(quoteRegex) !== -1) {
	        text = text.replace(quoteRegex, '<blockquote>$1</blockquote>');
	    }
	    return text;
	}
	function parseQuoteCustom(text) {
	    while(text.search(quoteCustomRegex) !== -1) {
	        text = text.replace(quoteCustomRegex, '<blockquote>@$1<br>$2</blockquote>');
	    }
	    return text;
	}
	function parseSpoilerFix(text) {
	    while(text.search(spoilerFixRegex) !== -1) {
	        text = text.replace(spoilerFixRegex, '[SPOILER=$1]');
	    }
	    return text;
	}
	function parseSpoiler(text) {
	    while(text.search(spoilerRegex) !== -1) {
	        text = text.replace(spoilerRegex, '<div><div href="#" class="show-spoiler btn btn-md btn-default waves-effect" title="Сlick to show or hide"><i class="fa fa-eye-slash fa-fw"></i><span class="btn-text" data-show_text="spoiler" data-hide_text="spoiler">spoiler</span></div><div class="spoiler hidden">$1</div></div>');
	    }
	    return text;
	}
	function parseSpoilerCustom(text) {
	    while(text.search(spoilerCustomRegex) !== -1) {
	        text = text.replace(spoilerCustomRegex, '<div><div href="#" class="show-spoiler btn btn-md btn-default waves-effect" title="Сlick to show or hide"><i class="fa fa-eye-slash fa-fw"></i><span class="btn-text" data-show_text="$1" data-hide_text="$1">$1</span></div><div class="spoiler hidden">$2</div></div>');
	    }
	    return text;
	}
	if ('string' === typeof data) {
		//data = parseLinks(data);
		//data = '<p dir="auto">'+data+'<p>';
		//data = parseBR(data);
		data = parseBolt(data);
		data = parseItalic(data);
		data = parseUnderline(data);
		data = parseCrossedOut(data);
		data = parseColor(data);
		data = parseFont(data);
		data = parseSize(data);
		data = parseBlur(data);
		data = parseUrl(data);
		data = parseEmail(data);
		data = parseUrlCustom(data);
		data = parseEmailCustom(data);
		data = parseImg(data);
		data = parseImgCustom(data);
		data = parseMedia(data);
		//list
		data = parseLeft(data);
		data = parseCenter(data);
		data = parseRight(data);
		data = parseQuote(data);
		data = parseQuoteCustom(data);
		data = parseSpoilerFix(data);
		data = parseSpoiler(data);
		data = parseSpoilerCustom(data);
	} else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
		//data.postData.content = parseLinks(data.postData.content);
		//data.postData.content = '<p dir="auto">'+data.postData.content+'<p>';
		//data.postData.content = parseBR(data.postData.content);
		data.postData.content = parseBolt(data.postData.content);
		data.postData.content = parseItalic(data.postData.content);
		data.postData.content = parseUnderline(data.postData.content);
		data.postData.content = parseCrossedOut(data.postData.content);
		data.postData.content = parseColor(data.postData.content);
		data.postData.content = parseFont(data.postData.content);
		data.postData.content = parseSize(data.postData.content);
		data.postData.content = parseBlur(data.postData.content);
		data.postData.content = parseUrl(data.postData.content);
		data.postData.content = parseEmail(data.postData.content);
		data.postData.content = parseUrlCustom(data.postData.content);
		data.postData.content = parseEmailCustom(data.postData.content);
		data.postData.content = parseImg(data.postData.content);
		data.postData.content = parseImgCustom(data.postData.content);
		data.postData.content = parseMedia(data.postData.content);
		//list
		data.postData.content = parseLeft(data.postData.content);
		data.postData.content = parseCenter(data.postData.content);
		data.postData.content = parseRight(data.postData.content);
		data.postData.content = parseQuote(data.postData.content);
		data.postData.content = parseQuoteCustom(data.postData.content);
		data.postData.content = parseSpoilerFix(data.postData.content);
		data.postData.content = parseSpoiler(data.postData.content);
		data.postData.content = parseSpoilerCustom(data.postData.content);
	} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
		//data.userData.signature = parseLinks(data.userData.signature);
		//data.userData.signature = '<p dir="auto">'+data.userData.signature+'<p>';
		//data.userData.signature = parseBR(data.userData.signature);
		data.userData.signature = parseBolt(data.userData.signature);
		data.userData.signature = parseItalic(data.userData.signature);
		data.userData.signature = parseUnderline(data.userData.signature);
		data.userData.signature = parseCrossedOut(data.userData.signature);
		data.userData.signature = parseColor(data.userData.signature);
		data.userData.signature = parseFont(data.userData.signature);
		data.userData.signature = parseSize(data.userData.signature);
		data.userData.signature = parseBlur(data.userData.signature);
		data.userData.signature = parseUrl(data.userData.signature);
		data.userData.signature = parseEmail(data.userData.signature);
		data.userData.signature = parseUrlCustom(data.userData.signature);
		data.userData.signature = parseEmailCustom(data.userData.signature);
		data.userData.signature = parseImg(data.userData.signature);
		data.userData.signature = parseImgCustom(data.userData.signature);
		data.userData.signature = parseMedia(data.userData.signature);
		//list
		data.userData.signature = parseLeft(data.userData.signature);
		data.userData.signature = parseCenter(data.userData.signature);
		data.userData.signature = parseRight(data.userData.signature);
		data.userData.signature = parseQuote(data.userData.signature);
		data.userData.signature = parseQuoteCustom(data.userData.signature);
		data.userData.signature = parseSpoilerFix(data.userData.signature);
		data.userData.signature = parseSpoiler(data.userData.signature);
		data.userData.signature = parseSpoilerCustom(data.userData.signature);
	}
	callback(null, data);
};
module.exports = plugin;
