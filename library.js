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
const icodeRegex = /\[icode\]([^[]*(?:\[(?!icode\]|\/icode\])[^[]*)*)\[\/icode\]/gi;
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

plugin.getUser = async function (uid) {
	return await user.getUserFields(uid, ['username', 'userslug', 'status', 'postcount', 'reputation', 'joindate', 'groupTitle']);
};
plugin.parseContent = async function(data) {
	console.log(data);
	//bolt [b][/b]
	//post.content = post.content.replace(boltRegex, "<strong>$1</strong>");
	//hide links for guest
	function parseLinkHref(text) {
	    return text.replace(linkHrefRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-link]]</div></div>');
	}
	function parseHide(text, user) {
	    if(text.search(hideRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			return text.replace(hideRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-inactive]]</div><div class="bbCodeBlock-content">$1</div></div>');
		    }else{
			return text.replace(hideRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseClub(text, user) {
	    if(text.search(clubRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			if(user.groupTitleArray.includes('administrators') || user.groupTitleArray.includes('Global Moderators')){
				return text.replace(clubRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для администрации.</div><div class="bbCodeBlock-content">$1</div></div>');
			}else{
				return text.replace(clubRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для администрации.</div></div>');
		    	}
		    }else{
			return text.replace(clubRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
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
				return text.replace(daysRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо провести не менее $1 дней на форуме.</div><div class="bbCodeBlock-content">$2</div></div>');
			}else{
				return text.replace(daysRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо провести не менее $1 дней на форуме.</div></div>');
		    	}
		    }else{
			return text.replace(daysRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
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
				return text.replace(likesRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо иметь не менее $1 репутации на форуме.</div><div class="bbCodeBlock-content">$2</div></div>');
			}else{
				return text.replace(likesRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо иметь не менее $1 репутации на форуме.</div></div>');
		    	}
		    }else{
			return text.replace(likesRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
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
				return text.replace(postsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо иметь не менее $1 сообщений на форуме.</div><div class="bbCodeBlock-content">$2</div></div>');
			}else{
				return text.replace(postsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для просмотра Вам необходимо иметь не менее $1 сообщений на форуме.</div></div>');
		    	}
		    }else{
			return text.replace(postsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseUserids(text, user) {
	    if(text.search(useridsRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(useridsRegex)[0].match(/=(.+?)\]/gi)[0].replace(/=/,'').replace(/\]/,'').split(',');
			console.log(hideData,' userids', user.uid.toString(), hideData.includes(user.uid.toString()));
			if(hideData.includes(user.uid.toString())){
				return text.replace(useridsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для определенных пользователей.</div><div class="bbCodeBlock-content">$2</div></div>');
			}else{
				return text.replace(useridsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для определенных пользователей.</div></div>');
		    	}
		    }else{
			return text.replace(useridsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
		    }
	    }else{
	    	return text;
	    }
	}
	function parseExceptids(text, user) {
	    if(text.search(exceptidsRegex) !== -1) {
		    if (typeof user !== 'undefined'){
			let hideData = text.match(exceptidsRegex)[0].match(/=(.+?)\]/gi)[0].replace(/=/,'').replace(/\]/,'').split(',');
			console.log(hideData,' exceptids', user.uid.toString(), hideData.includes(user.uid.toString()));
			if(hideData.includes(user.uid.toString())){
				return text.replace(exceptidsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для всех, кроме определенных пользователей.</div></div>');
			}else{
				return text.replace(exceptidsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">Скрытое содержимое. Для всех, кроме определенных пользователей.</div><div class="bbCodeBlock-content">$2</div></div>');
		    	}
		    }else{
			return text.replace(exceptidsRegex, '<div class="bbCodeBlock bbCodeBlock--hide"><div class="bbCodeBlock-title">[[hidetoguest:hide-content-active]]</div></div>');
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
	/////
	/*
	function parseLinks(text) {
	    while(text.search(linkRegex) !== -1) {
	        text = text.replace(linkRegex, '<a href="$1" target="_blank" class="externalLink" rel="nofollow">$1</a>');
	    }
	    return text;
	}
 	*/
	function parseP(text){
	    //return text.replace(/\n(.+)\n/gi,'<p dir="auto">$1</p>\n');
	    return text.replace(/\n(.+)\n/gi,'<p style="margin: 0 !important;">$1</p>\n');
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
	function parseIcode(text) {
	    while(text.search(icodeRegex) !== -1) {
	        text = text.replace(icodeRegex, '<code class="bbCodeInline">$1</code>');
	    }
	    return text;
	}
	function renderText(data, user){
		data = parseHide(data,user);
		data = parseClub(data,user);
		data = parseDays(data,user);
		data = parseLikes(data,user);
		data = parsePosts(data,user);
		data = parseUserids(data,user);
		data = parseExceptids(data,user);
		data = parseVisitor(data,user);	
		
		//data = parseP(data);
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
		data = parseIcode(data);

		return data;
	}
	function renderPosts(data, user){
		data = parseHide(data,user);
		data = parseClub(data,user);
		data = parseDays(data,user);
		data = parseLikes(data,user);
		data = parsePosts(data,user);
		data = parseUserids(data,user);
		data = parseExceptids(data,user);
		data = parseVisitor(data,user);	
		
		//data = parseP(data);
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
		data = parseIcode(data);

		return data;
	}
	if('string' === typeof data){
		data = renderPosts(data)
	} else if (!data.caller.uid) {
		if (data.postData && data.postData.content != null && data.postData.content != undefined) {
			data.postData.content = renderPosts(data.postData.content);
		} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
			data.userData.signature = renderPosts(data.userData.signature);
		}
	}else{
		let callerData = await plugin.getUser(data.caller.uid);
		console.log(data,'-3-',callerData);
		if (data.postData && data.postData.content != null && data.postData.content != undefined) {
			data.postData.content = renderPosts(data.postData.content,callerData);
		} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
			data.userData.signature = renderPosts(data.userData.signature,callerData);
		}
	}
	return data
	//callback(null, data);
};
module.exports = plugin;
