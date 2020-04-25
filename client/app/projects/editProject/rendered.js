Template.editProject.onRendered(function() {
	resetProjectVars()
	console.log('init edit proj')
	// TODO: FIXME
	summernoteRenderFromProj(this&&this.data.project||null)
})