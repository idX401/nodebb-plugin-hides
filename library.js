"use strict";
const plugin = {};

const user = require.main.require('./src/user');
//bolt [b][/b]
const boltRegex = /\[b\](.+?)\[\/b\]/gi
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
