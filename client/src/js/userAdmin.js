function addUserAdmin(params ) {
	let { treePath } = params
	const tab = Ext.getCmp('main-tab-panel').getItem('user-admin-tab')
	if (tab) {
		tab.show()
		return
	}

	const userGrid = new SM.User.UserGrid({
		cls: 'sm-round-panel',
		margins: { top: SM.Margin.top, right: SM.Margin.edge, bottom: SM.Margin.bottom, left: SM.Margin.edge },
		region: 'center',
		stripeRows:true,
		loadMask: {msg: ''}
	})

	const onUserChanged = function (apiUser) {
		userGrid.store.loadData(apiUser, true)
		const sortState = userGrid.store.getSortState()
		userGrid.store.sort(sortState.field, sortState.direction)
		userGrid.getSelectionModel().selectRow(userGrid.store.findExact('userId',apiUser.userId))
	}
	SM.Dispatcher.addListener('userchanged', onUserChanged)
	SM.Dispatcher.addListener('usercreated', onUserChanged)


	const thisTab = Ext.getCmp('main-tab-panel').add({
		id: 'user-admin-tab',
		sm_treePath: treePath, 
		iconCls: 'sm-user-icon',
		title: 'Users',
		closable:true,
		layout: 'border',
		border: false,
		items: [userGrid],
		listeners: {
			beforedestroy: function(grid) {
				SM.Dispatcher.removeListener('userchanged', onUserChanged)
				SM.Dispatcher.removeListener('usercreated', onUserChanged)
			}
		}
	})
	thisTab.show()
	
	userGrid.getStore().load()
}

