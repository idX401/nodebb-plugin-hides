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
        			{ name: 'bold', className: 'fa fa-bold', text: '[[modules:composer.formatting.bold]]', onClick: fn },
        			{ name: 'italic', className: 'fa fa-italic', text: '[[modules:composer.formatting.italic]]', onClick: fn },
        		],
        	},
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
