Template.editProject.onRendered(function() {
	resetEnv()
	console.log('init edit proj')
	// TODO: FIXME
	summernoteRenderFromProj(this&&this.data.project||null)
})