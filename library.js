"use strict";
var plugin = {};

const user = require.main.require('./src/user');

plugin.alterContent = async function (params, callback) {
	//console.log(params);
	if (!params.caller.uid) {
		for (const post of params.posts) {
			const regexHrefTag = new RegExp("<a[^>]*>[^<]*</a>", "g");
			post.content = post.content.replace(
				regexHrefTag,
				'<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>'
			);
		}
	}else{
		let userData = await getUser(params.caller.uid);
		console.log(params,'-',userData);
	}
  callback(null, params);
};

plugin.getUser = async (uid) => {
	let userData = user.getUserFields(uid, ['username', 'userslug', 'status', 'postcount', 'reputation', 'joindate', 'groupTitle']);
	console.log('user',userData);
	return userData;
};

module.exports = plugin;
