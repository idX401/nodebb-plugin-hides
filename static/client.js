var BBcode = {};
$('document').ready(function() {
    require(['composer', 'composer/controls'], function(composer, controls) {
        composer.addButton('fa fa-flag', function(textarea, selectionStart, selectionEnd) {

            let example = '[SPOILER="Title"]\nTest\n[/SPOILER]'
            if(selectionStart === selectionEnd){
                controls.insertIntoTextarea(textarea, example);
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionStart + 11 + spoilersTitle.length);
            } else {
                controls.wrapSelectionInTextareaWith(textarea, '[SPOILER="Title"]','[/SPOILER]');
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionEnd + 11 + spoilersTitle.length);
            }
        });
        composer.addButton('fa fa-bold', function(textarea, selectionStart, selectionEnd) {
            let example = '[B]\nBold text\n[/B]'
            if(selectionStart === selectionEnd){
                controls.insertIntoTextarea(textarea, example);
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionStart + 11 + spoilersTitle.length);
            } else {
                controls.wrapSelectionInTextareaWith(textarea, '[B]','[/B]');
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionEnd + 11 + spoilersTitle.length);
            }
        }, 'strong text', 'Bold');
        function fn(textarea, selectionStart, selectionEnd) {
            let example = '[B]\nBold text\n[/B]'
            if(selectionStart === selectionEnd){
                controls.insertIntoTextarea(textarea, example);
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionStart + 11 + spoilersTitle.length);
            } else {
                controls.wrapSelectionInTextareaWith(textarea, '[B]','[/B]');
                controls.updateTextareaSelection(textarea, selectionStart + 11 + spoilersTitle.length, selectionEnd + 11 + spoilersTitle.length);
            }
        }

        composer.addDropdown({
        		iconClass: 'fa fa-gear',
        		title: 'formatting options',
        		dropdownItems: [
        			{ name: 'bold', className: 'fa fa-bold', text: 'Bold', onClick: fn },
        			{ name: 'italic', className: 'fa fa-italic', text: 'Italic', onClick: fn },
        		],
        	});
        
        $('body').on('click', 'div.show-spoiler', function(){
            $(this).find('.fa').toggleClass('fa-eye');
            $(this).find('.fa').toggleClass('fa-eye-slash');
            if($(this).find('.fa').hasClass('fa-eye')){
                $(this).find('.btn-text').first().text($(this).find('.btn-text').first().data('hide_text'));
            } else {
                $(this).find('.btn-text').first().text($(this).find('.btn-text').first().data('show_text'));
            }
            $(this).parent().find('> .spoiler').toggleClass('hidden');
        });
    });

	BBcode.render = function (ev, data) {
        
		if (!data.posts && !data.post) {
			return;
		} if (data.hasOwnProperty('post')) {
			data.posts = [data.post];
		}

		var disable;
		var checkboxEls;
		data.posts.forEach(function (post) {
			disable = !post.display_edit_tools;
			checkboxEls = $('.posts li[data-pid="' + post.pid + '"] .content div.plugin-markdown input[type="checkbox"]');

			checkboxEls.on('click', function (e) {
				if (disable) {
					// Find the post's checkboxes in DOM and make them readonly
					e.preventDefault();
				}

				// Otherwise, edit the post to reflect state change
				var _this = this;
				var pid = $(this).parents('li[data-pid]').attr('data-pid');
				var index = $(this).parents('.content').find('input[type="checkbox"]').toArray()
					.reduce(function (memo, cur, index) {
						if (cur === _this) {
							memo = index;
						}

						return memo;
					}, null);

				socket.emit('plugins.markdown.checkbox.edit', {
					pid: pid,
					index: index,
					state: $(_this).prop('checked'),
				});
			});
		});
	};
/*
$(window).on('action:topic.loaded', BBcode.render);
$(window).on('action:posts.loaded', BBcode.render);
$(window).on('action:posts.edited', BBcode.render);
*/
