from pathlib import Path
import os

x = { 
	'main': {
		'about': None,
		'contact': None,
		'join': None,
		'message': None,
		'warning': None,
		'splash': None,
		'staticlayout': None,
		'boardslayout': None,
		'search': None,
		'loading': None,
		'loadingNonBoard': None,
		'notFound': None,
		'popup': None,
		'editor': None,
		'viewer': None,
		'signin': None,
		'blog': {
			'create': None,
			'list': None,
			'blog': None,
		},
		'markdown': None,
		'footer': None,
		'nav': None,
		'terms': None,
		'privacy': None,
		'utils': None,
	},
	'management': {
		'activities': {
			'activities': None,
			'cardActivities': None,
		},
		'cards': {
			'cards': None,
			'cardModal': None,
			'cardMemberPopup': None,
			'cardMembersPopup': None,
			'cardMorePopup': None,
			'cardLabelsPopup': None,
			'cardAttachmentsPopup': None,
			'dueDatePopup': None,
			'formLabel': None,
			'createLabelPopup': None,
			'editLabelPopup': None,
			'deleteLabelPopup': None,
			'cardDeletePopup': None,
			'attachmentDeletePopup': None,
			'addCardForm': None,
			'cardDetailWindow': None,
			'membersThumbnail': None,
			'WindowActivityModule': None,
			'WindowAttachmentsModule': None,
			'WindowDueDateModule': None,
			'WindowSidebarModule': None,
		},
		'boards': {
			'board': None,
			'boardChangePermissionPopup': None,
		},
		'widgets': {
			'homeWidget': None,
			'menuWidget': None,
			'membersWidget': None,
			'activityWidget': None,
			'applicantsPopup': None,
			'boardWidgets': None,
			'memberPopup': None,
			'filterWidget': None,
			'backgroundWidget': None,
			'removeMemberPopup': None,
			'addMemberPopup': None,
			'changePermissionsPopup': None,
			'calendarViewPopup': None,
		}
	},
	'communications': {
		'textOnly': None,
		'textAvatar': None,
		'commentBox': None,
		'messageBox': None,
		'comment': None,
	},
	'negotiations': {
		'applicants': None,
		'rejection': None,
		'receipts': None,
	},
	'projects': {
		'projectActionView': None,
		'projectThumbnailCenter': None,
		'editProject': None,
		'projectMessage': None,
		'projectVideo': None,
		'projectView': None,
		'newProject': None,
		'projectSortBar': None,
		'projectsSimilar': None,
		'project': None,
		'projectTabs': None,
	},
	'user': {
		'dashboard': None,
		'templates': None,
		'userTabs': None,
		'memberHeader': None,
		'statsPopup': None,
		'calPopup': None,
		'tasksPopup': None,
		'asssPopup': None,
		'minePopup': None,
		'memberMenuPopup': None,
		'setLanguagePopup': None,
		'userPopup': None,
		'memberName': None,
		'userAvatar': None,
		'memberAvatar': None,
		'applicantAvatar': None,
	},
	'misc': {
		'modal': None,
		'pager': None,
		'events': {
			'create': None,
			'list': None,
		}
	}
}

files = ['template.html', 'events.js', 'helpers.js']

def touch_files(p):
	for f in files:
		_p = os.path.join(p, f)
		Path(_p).touch()
		print('touch', _p)


for key in x:
	v = x[key]
	if v is not None:
		p = os.path.join(os.getcwd(), key)
		print('mkdir', key, p)
		os.mkdir(p)
		for _key in v:
			_v = v[_key]
			if _v is not None:
				p = os.path.join(os.getcwd(), key, _key)
				print('mkdir', _key, p)
				os.mkdir(p)
				for __key in _v:
					p = os.path.join(os.getcwd(), key, _key, __key)
					print('mkdir', __key, p)
					os.mkdir(p)
					touch_files(p)
			else:
				print('mkdir', _key, p)
				p = os.path.join(os.getcwd(), key, _key)
				os.mkdir(p)
				touch_files(p)
	else:
		print('mkdir', key, p)
		p = os.path.join(os.getcwd(), key)
		os.mkdir(p)
		touch_files(p)
