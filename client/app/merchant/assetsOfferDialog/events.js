Template.assetsOfferDialog.events({
	'click #offerorrejectoffer': function(e) {
		Meteor.call('rejectLeaseRequest', this.offer, function(err, res) {
			vex.dialog.alert(err||res)
		})
	},
	'click #offeroracceptoffer': function(e) {
		Meteor.call('approveLeaseRequest', this.offer, function(err, res) {
			vex.dialog.alert(err||res)
		})
	},
	'click #edit_eo': function(e) {
		var _was = this
	    vex.dialog.open({
	      message: 'Edit your express offer.',
	      input: [
	          '<style>',
	              '.vex-custom-field-wrapper {',
	                  'margin: 1em 0;',
	              '}',
	              '.vex-custom-field-wrapper > label {',
	                  'display: inline-block;',
	                  'margin-bottom: .2em;',
	              '}',
	          '</style>',
	          '<div class="vex-custom-field-wrapper">',
	              '<div class="vex-custom-input-wrapper t40">',
	              	'<label for="offer">enter new amount here</label>',
	              	'<input type="number" min="0" max="9999" placeholder="', this.offer.expressOffer.offer||'','" name="offer">',
	              '</div>',
	              '<div class="vex-custom-input-wrapper t20">',
	              '<label for="offer">enter new details here</label>',
	              	'<input type="text" placeholder="', this.offer.expressOffer.message||'','" name="message">',
	              '</div>',
	          '</div>'
	      ].join(''),
	      callback: function (data) { 
	      	console.log(data)
	      	if (data&&(data.offer||data.message)) {
	      		Meteor.call('editExpressOffer', _was.offer._id, data)
	      	};
	      }
	    });
	},
	'click #assetsexpressoffer': function(e) {
		console.log('express offer accept')
	},
	'click #assetsrevokeoffer': function(e) {
		var _was = this
		vex.dialog.confirm({
			input: 'Please verify: by revoking, you will be revoking every current offer related to this project. Continue?',
			callback: function(d) {
				console.log(d)
				if (d) {
					Meteor.call('revokeLeaseRequest', _was.offer, function(err, res) {
						vex.dialog.alert(err||res)
					})
				};
			}
		})
	},
	'click #submit-message': function(e) {
		e.preventDefault();
		var text = $('#message-box').val();
		$('#message-box').val('');
		// console.log(this)
		Meteor.call('addOfferMessage', {
			user: this.user._id,
			offer: this.offer._id,
			text: text
		});
	},
	'click #assetsagreeoffer': function(e) {
		Meteor.call('acceptAssetsOffer', this, function(e, r) {
			vex.dialog.alert(e||r)
		})
	},
	'click #assetsrejectoffer': function(e) {
		Meteor.call('rejectAssetsOffer', this)
	}
})