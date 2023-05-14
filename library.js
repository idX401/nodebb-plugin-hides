"use strict";
const plugin = {};

const user = require.main.require('./src/user');

const linkHrefRegex = /<a[^>]*>[^<]*<\/a>/g;

plugin.alterContent = async function (params, callback) {
	//console.log(params);
	if (!params.caller.uid) {
		for (const post of params.posts) {
			post.content = post.content.replace(
				linkHrefRegex,
				'<a href="/login" class="hide-to-guest">[[hidetoguest:hide-message]]</a>'
			);
		}
	}else{
		let userData = await plugin.getUser(params.caller.uid);
		console.log(params,'-2-',userData);
	}
	return callback(null, params);
};

plugin.getUser = async function (uid) {
	return await user.getUserFields(uid, ['username', 'userslug', 'status', 'postcount', 'reputation', 'joindate', 'groupTitle']);
};

module.exports = plugin;
