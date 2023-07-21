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
//color
//font
const sizeRegex = /\[size=(\d+)\]([^[]*(?:\[(?!size=\d+\]|\/size\])[^[]*)*)\[\/size\]/gi;
const urlRegex = /\[url\]([^[]*(?:\[(?!url\]|\/url\])[^[]*)*)\[\/url\]/gi;
const emailRegex = /\[email\]([^[]*(?:\[(?!email\]|\/email\])[^[]*)*)\[\/email\]/gi;
//urlCustom
//emailCustom
const imgRegex = /\[img\]([^[]*(?:\[(?!img\]|\/img\])[^[]*)*)\[\/img\]/gi;
const mediaRegex = /\[media\]([^[]*(?:\[(?!media\]|\/media\])[^[]*)*)\[\/media\]/gi;
//list
const leftRegex = /\[left\]([^[]*(?:\[(?!left\]|\/left\])[^[]*)*)\[\/left\]/gi;
const centerRegex = /\[center\]([^[]*(?:\[(?!center\]|\/center\])[^[]*)*)\[\/center\]/gi;
const rightRegex =/\[right\]([^[]*(?:\[(?!right\]|\/right\])[^[]*)*)\[\/right\]/gi;
//quote
const spoilerRegex = /\[spoiler\]([^[]*(?:\[(?!spoiler\]|\/spoiler\])[^[]*)*)\[\/spoiler\]/gi;
//spoilerCustom
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
	//urlCustom
	//emailCustom
	if ('string' === typeof data) {
		data = parseBolt(data);
		data = parseItalic(data);
		data = parseUnderline(data);
		data = parseCrossedOut(data);
		data = parseSize(data);
		data = parseUrl(data);
		data = parseEmail(data);
	} else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
		data.postData.content = parseBolt(data.postData.content);
		data.postData.content = parseItalic(data.postData.content);
		data.postData.content = parseUnderline(data.postData.content);
		data.postData.content = parseCrossedOut(data.postData.content);
		data.postData.content = parseSize(data.postData.content);
		data.postData.content = parseUrl(data.postData.content);
		data.postData.content = parseEmail(data.postData.content);
	} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
		data.userData.signature = parseBolt(data.userData.signature);
		data.userData.signature = parseItalic(data.userData.signature);
		data.userData.signature = parseUnderline(data.userData.signature);
		data.userData.signature = parseCrossedOut(data.userData.signature);
		data.userData.signature = parseSize(data.userData.signature);
		data.userData.signature = parseUrl(data.userData.signature);
		data.userData.signature = parseEmail(data.userData.signature);
	}
	callback(null, data);
};
/*
plugin.parseContent = function(data, callback) {
    var Transform = async function (content) {
      return content.replace(boltRegex, "<strong>$1</strong>");
    };

    if ('string' === typeof data) {
      Transform(data).then((parsedContent) => {
	data = parsedContent;
	callback(null, data);
      });
    } else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
      Transform(data.postData.content).then((parsedContent) => {
	data.postData.content = parsedContent;
	callback(null, data);
      });
    } else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
      Transform(data.userData.signature).then((parsedContent) => {
	data.userData.signature = parsedContent;
	callback(null, data);
      });
    }
}
*/
/*
plugin.parseContent = function(data, callback) {
    var Transform = async function (content) {
      return content.replace(/\[SPOILER\]/g, '<div><div href="#" class="show-spoiler btn btn-md btn-default waves-effect" title="Сlick to show or hide"><i class="fa fa-eye-slash fa-fw"></i><span class="btn-text" data-show_text="spoiler" data-hide_text="spoiler">spoiler</span></div><div class="spoiler hidden">')
	    .replace(/\[SPOILER=([^<]*)\]/g, '<div><div href="#" class="show-spoiler btn btn-md btn-default waves-effect" title="Сlick to show or hide"><i class="fa fa-eye-slash fa-fw"></i><span class="btn-text" data-show_text="$1" data-hide_text="$1">$1</span></div><div class="spoiler hidden">')
	    .replace(/\[\/SPOILER\]/g, '</div></div>');
    };

    if ('string' === typeof data) {
      Transform(data).then((parsedContent) => {
	data = parsedContent;
	callback(null, data);
      });
    } else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
      Transform(data.postData.content).then((parsedContent) => {
	data.postData.content = parsedContent;
	callback(null, data);
      });
    } else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
      Transform(data.userData.signature).then((parsedContent) => {
	data.userData.signature = parsedContent;
	callback(null, data);
      });
    }
}
*/

module.exports = plugin;
