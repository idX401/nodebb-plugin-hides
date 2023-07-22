"use strict";
const plugin = {};

const user = require.main.require('./src/user');
/*
//regex
const boltRegex = /\[b\]([\s\S]*?)\[\/b\]/gi;
const italicRegex = /\[i\]([\s\S]*?)\[\/i\]/gi;
const underlineRegex = /\[u\]([\s\S]*?)\[\/u\]/gi;
const crossedOutRegex = /\[s\]([\s\S]*?)\[\/s\]/gi;
const colorRegex = /\[color=(.+?)\]([\s\S]*?)\[\/color\]/gi;
const fontRegex = /\[font=(.+?)\]([\s\S]*?)\[\/font\]/gi;
const sizeRegex = /\[size=(.+?)\]([\s\S]*?)\[\/size\]/gi;
const urlRegex = /\[url\](.+?)\[\/url\]/gi;
const emailRegex = /\[email\](.+?)\[\/email\]/gi;
const urlCustomRegex = /\[url=(.+?)\]([\s\S]*?)\[\/url\]/gi;
const emailCustomRegex = /\[email=(.+?)\]([\s\S]*?)\[\/email\]/gi;
const imgRegex = /\[img\](.+?)\[\/img\]/gi;
const mediaRegex = /\[media=(.+?)\](.+?)\[\/media\]/gi;
//LIST
const leftRegex = /\[left\]([\s\S]*?)\[\/left\]/gi;
const centerRegex = /\[center\]([\s\S]*?)\[\/center\]/gi;
const rightRegex = /\[right\]([\s\S]*?)\[\/right\]/gi;
//QUOTE
const spoilerRegex = /\[spoiler\]([\s\S]*?)\[\/spoiler\]/gi;
const spoilerCustomRegex = /\[spoiler=(.+?)\]([\s\S]*?)\[\/spoiler\]/gi;
//CODE
//INDENT
const visitorRegex = /\[visitor\]([\s\S]*?)\[\/visitor\]/gi;

const clubRegex =  /\[club\]([\s\S]*?)\[\/club\]/gi;
const daysRegex = /\[days=(.+?)\]([\s\S]*?)\[\/days\]/gi;
const likesRegex = /\[likes=(.+?)\]([\s\S]*?)\[\/likes\]/gi;
const useridsRegex = /\[userids=(.+?)\]([\s\S]*?)\[\/userids\]/gi;
const exceptidsRegex = /\[exceptids=(.+?)\]([\s\S]*?)\[\/exceptids\]/gi;

*/
const boltRegex = /\[b\]([^[]*(?:\[(?!b\]|\/b\])[^[]*)*)\[\/b\]/gi;
const italicRegex = /\[i\]([^[]*(?:\[(?!i\]|\/i\])[^[]*)*)\[\/i\]/gi;
const underlineRegex = /\[u\]([^[]*(?:\[(?!u\]|\/u\])[^[]*)*)\[\/u\]/gi;
const crossedOutRegex = /\[s\]([^[]*(?:\[(?!s\]|\/s\])[^[]*)*)\[\/s\]/gi;
const colorRegex = /\[color=(.+)\]([^[]*(?:\[(?!color=.+\]|\/color\])[^[]*)*)\[\/color\]/gi;
//font
const sizeRegex = /\[size=(\d+)\]([^[]*(?:\[(?!size=\d+\]|\/size\])[^[]*)*)\[\/size\]/gi;
const urlRegex = /\[url\]([^[]*(?:\[(?!url\]|\/url\])[^[]*)*)\[\/url\]/gi;
const emailRegex = /\[email\]([^[]*(?:\[(?!email\]|\/email\])[^[]*)*)\[\/email\]/gi;
const urlCustomRegex = /\[url=(.+)\]([^[]*(?:\[(?!url=.+\]|\/url\])[^[]*)*)\[\/url\]/gi;
const emailCustomRegex = /\[email=(.+)\]([^[]*(?:\[(?!email=.+\]|\/email\])[^[]*)*)\[\/email\]/gi;
const imgRegex = /\[img\]([^[]*(?:\[(?!img\]|\/img\])[^[]*)*)\[\/img\]/gi;
const mediaRegex = /\[media\]([^[]*(?:\[(?!media\]|\/media\])[^[]*)*)\[\/media\]/gi;
//list
const leftRegex = /\[left\]([^[]*(?:\[(?!left\]|\/left\])[^[]*)*)\[\/left\]/gi;
const centerRegex = /\[center\]([^[]*(?:\[(?!center\]|\/center\])[^[]*)*)\[\/center\]/gi;
const rightRegex =/\[right\]([^[]*(?:\[(?!right\]|\/right\])[^[]*)*)\[\/right\]/gi;
//quote
const spoilerFixRegex = /\[spoiler=\"(.+)\"\]/gi;
const spoilerRegex = /\[spoiler\]([^[]*(?:\[(?!spoiler\]|\/spoiler\])[^[]*)*)\[\/spoiler\]/gi;
const spoilerCustomRegex = /\[spoiler=(.+)\]([^[]*(?:\[(?!spoiler=.+\]|\/spoiler\])[^[]*)*)\[\/spoiler\]/gi;
//code
//indent
const visitorRegex = /\[visitor\]([^[]*(?:\[(?!visitor\]|\/visitor\])[^[]*)*)\[\/visitor\]/gi;

//<a href
const linkHrefRegex = /<a[^>]*>[^<]*<\/a>/g;

plugin.alterContent = async function (params) {
	//console.log(params);
	//bolt [b][/b]
	//post.content = post.content.replace(boltRegex, "<strong>$1</strong>");
	//hide links for guest
	if (!params.caller.uid) {
		for (const post of params.posts) {
			post.content = post.content.replace(
				linkHrefRegex,
				'<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>'
			);
		}
	}else{
		let userData = await plugin.getUser(params.caller.uid);
		console.log(params,'-3-',userData);
	}
	return params;
};

plugin.getUser = async function (uid) {
	return await user.getUserFields(uid, ['username', 'userslug', 'status', 'postcount', 'reputation', 'joindate', 'groupTitle']);
};
plugin.parseContent = function(data, callback) {
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
	//font
	function parseSize(text) {
	    while(text.search(sizeRegex) !== -1) {
	        text = text.replace(sizeRegex, '<span style="font-size: $1pt">$2</span>');
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
	//quote
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
		//data = '<p dir="auto">'+data+'<p>';
		data = parseBR(data);
		data = parseBolt(data);
		data = parseItalic(data);
		data = parseUnderline(data);
		data = parseCrossedOut(data);
		data = parseColor(data);
		//font
		data = parseSize(data);
		data = parseUrl(data);
		data = parseEmail(data);
		data = parseUrlCustom(data);
		data = parseEmailCustom(data);
		data = parseImg(data);
		data = parseMedia(data);
		//list
		data = parseLeft(data);
		data = parseCenter(data);
		data = parseRight(data);
		//quote
		data = parseSpoilerFix(data);
		data = parseSpoiler(data);
		data = parseSpoilerCustom(data);
	} else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
		//data.postData.content = '<p dir="auto">'+data.postData.content+'<p>';
		data.postData.content = parseBR(data.postData.content);
		data.postData.content = parseBolt(data.postData.content);
		data.postData.content = parseItalic(data.postData.content);
		data.postData.content = parseUnderline(data.postData.content);
		data.postData.content = parseCrossedOut(data.postData.content);
		data.postData.content = parseColor(data.postData.content);
		//font
		data.postData.content = parseSize(data.postData.content);
		data.postData.content = parseUrl(data.postData.content);
		data.postData.content = parseEmail(data.postData.content);
		data.postData.content = parseUrlCustom(data.postData.content);
		data.postData.content = parseEmailCustom(data.postData.content);
		data.postData.content = parseImg(data.postData.content);
		data.postData.content = parseMedia(data.postData.content);
		//list
		data.postData.content = parseLeft(data.postData.content);
		data.postData.content = parseCenter(data.postData.content);
		data.postData.content = parseRight(data.postData.content);
		//quote
		data.postData.content = parseSpoilerFix(data.postData.content);
		data.postData.content = parseSpoiler(data.postData.content);
		data.postData.content = parseSpoilerCustom(data.postData.content);
	} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
		//data.userData.signature = '<p dir="auto">'+data.userData.signature+'<p>';
		//data.userData.signature = parseBR(data.userData.signature);
		data.userData.signature = parseBolt(data.userData.signature);
		data.userData.signature = parseItalic(data.userData.signature);
		data.userData.signature = parseUnderline(data.userData.signature);
		data.userData.signature = parseCrossedOut(data.userData.signature);
		data.userData.signature = parseColor(data.userData.signature);
		//font
		data.userData.signature = parseSize(data.userData.signature);
		data.userData.signature = parseUrl(data.userData.signature);
		data.userData.signature = parseEmail(data.userData.signature);
		data.userData.signature = parseUrlCustom(data.userData.signature);
		data.userData.signature = parseEmailCustom(data.userData.signature);
		data.userData.signature = parseImg(data.userData.signature);
		data.userData.signature = parseMedia(data.userData.signature);
		//list
		data.userData.signature = parseLeft(data.userData.signature);
		data.userData.signature = parseCenter(data.userData.signature);
		data.userData.signature = parseRight(data.userData.signature);
		//quote
		data.userData.signature = parseSpoilerFix(data.userData.signature);
		data.userData.signature = parseSpoiler(data.userData.signature);
		data.userData.signature = parseSpoilerCustom(data.userData.signature);
	}
	callback(null, data);
};
module.exports = plugin;
