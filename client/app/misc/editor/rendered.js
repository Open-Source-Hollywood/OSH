Template.descriptionEditor.onRendered(function() {
	console.log('render descriptionEditor')
	downloadQuill(function() {
		var editor = new Quill('#editor', {
			modules: { toolbar: '#toolbar' },
			theme: 'snow'
		});
	});
});

