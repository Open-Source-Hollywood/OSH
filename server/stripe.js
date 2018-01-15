Meteor.startup(function() {
	SeoCollection.update(
	    {
	        route_name: 'about'
	    },
	    {
	        $set: {
	            route_name: 'about',
	            title: 'About - Open Source Hollywood',
	            meta: {
	                'description': 'Build teams, fund campaigns, and manage productions with collaborations. Includes a full project management backend all at no cost .. ever!'
	            },
	            og: {
	                'title': 'About - Open Source Hollywood',
	                'image': 'https://secure.meetupstatic.com/photos/event/3/b/9/1/600_465675249.jpeg'
	            }
	        }
	    },
	    {
	        upsert: true
	    }
	);	

	SeoCollection.update(
	    {
	        route_name: 'terms'
	    },
	    {
	        $set: {
	            route_name: 'terms',
	            title: 'Terms - Open Source Hollywood',
	            meta: {
	                'description': 'Terms and conditions, user agreement, and privacy policy.'
	            },
	            og: {
	                'title': 'Terms - Open Source Hollywood',
	                'image': 'https://secure.meetupstatic.com/photos/event/3/b/9/1/600_465675249.jpeg'
	            }
	        }
	    },
	    {
	        upsert: true
	    }
	);	

	SeoCollection.update(
	    {
	        route_name: 'Home'
	    },
	    {
	        $set: {
	            route_name: 'Home',
	            title: 'Open Source Hollywood',
	            meta: {
	                'description': 'Live campaigns in Open Source Hollywood. Crowdfund and crowdsource by building teams, raising funds, and managing campaigns. Join or create a campaign today!'
	            },
	            og: {
	                'title': 'Open Source Hollywood',
	                'image': 'https://secure.meetupstatic.com/photos/event/3/b/9/1/600_465675249.jpeg'
	            }
	        }
	    },
	    {
	        upsert: true
	    }
	);	

	SeoCollection.update(
	    {
	        route_name: 'Projects'
	    },
	    {
	        $set: {
	            route_name: 'Projects',
	            title: 'Open Source Hollywood',
	            meta: {
	                'description': 'Live campaigns in Open Source Hollywood. Crowdfund and crowdsource by building teams, raising funds, and managing campaigns. Join or create a campaign today!'
	            },
	            og: {
	                'title': 'Open Source Hollywood',
	                'image': 'https://secure.meetupstatic.com/photos/event/3/b/9/1/600_465675249.jpeg'
	            }
	        }
	    },
	    {
	        upsert: true
	    }
	);	

});