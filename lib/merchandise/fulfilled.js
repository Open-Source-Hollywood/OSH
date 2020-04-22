module.exports = function(options) {
	check(options, Object)
	Receipts.update(
		{
			_id: options._id
		}, {
			$set: {
			fulfilled: true
		}
	})
}