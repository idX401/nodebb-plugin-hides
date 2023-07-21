"use strict";
const plugin = {};

const user = require.main.require('./src/user');

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
	function parseSizeBBCode(text) {
	    // Here is the same regular expression in javascript syntax:
	    var re = /\[size=(\d+)\]([^[]*(?:\[(?!size=\d+\]|\/size\])[^[]*)*)\[\/size\]/ig;
	    while(text.search(re) !== -1) {
	        text = text.replace(re, '<span style="font-size: $1pt">$2</span>');
	    }
	    return text;
	}
	if ('string' === typeof data) {
		data = parseSizeBBCode(data);
	} else if (data.postData && data.postData.content != null && data.postData.content != undefined) {
		data.postData.content = parseSizeBBCode(data.postData.content);
	} else if (data.userData && data.userData.signature != null && data.userData.signature != undefined) {
		data.userData.signature = parseSizeBBCode(data.userData.signature);
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
