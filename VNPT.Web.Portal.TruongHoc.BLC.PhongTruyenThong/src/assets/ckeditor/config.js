/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	
	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'clipboard', groups: [ 'undo', 'clipboard' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];
	config.extraPlugins = 'youtube';
	config.youtube_responsive = true;
	config.removeButtons = 'Form,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Checkbox,Flash,Smiley,Save,NewPage,Preview,Print,Templates,SelectAll,Scayt,Language,Anchor,About';


	// // Set the most common block elements.
	// config.format_tags = 'p;h1;h2;h3;pre';

	// // Simplify the dialog windows.
	// //config.removeDialogTabs = 'image:advanced;link:advanced';
	// config.syntaxhighlight_lang = 'csharp';
	 //config.syntaxhighlight_hideControls = true;
	// config.language = 'en';
	// config.filebrowserBrowseUrl = 'http://localhost:51273/Content/AdminTheme/tool/ckfinder/ckfinder.html?domain=' + window.document.domain;
	// config.filebrowserImageBrowseUrl = 'http://localhost:51772/CkEditor/Index?Type=Images';
	// config.filebrowserFlashBrowseUrl = 'http://localhost:51772/CkEditor/Index?Type=Flash';
	// config.filebrowserUploadUrl = 'http://localhost:51772/CkEditor/Index?command=QuickUpload&type=Files';
	// config.filebrowserImageUploadUrl = '/DATA/';
	// config.filebrowserFlashUploadUrl = 'http://localhost:51772/CkEditor/Index?command=QuickUpload&type=Flash';
	
	//CKFinder.setupCKEditor(null, '/Content/AdminTheme/tool/ckfinder/');
};
