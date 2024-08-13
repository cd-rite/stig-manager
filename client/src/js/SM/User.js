Ext.ns('SM.User')

SM.User.GroupSpriteHtml = `<span class="sm-label-sprite {extraCls}" style="color:black;background-color:#888;">{[SM.he(values)]}</span>`

SM.User.GroupTpl = new Ext.XTemplate(
  SM.User.GroupSpriteHtml
)
SM.User.GroupArrayTpl = new Ext.XTemplate(
  '<tpl for=".">',
  `${SM.User.GroupSpriteHtml} `,
  '</tpl>'
)

SM.User.CollectionSelectionField = Ext.extend(Ext.form.ComboBox, {
  initComponent: function () {
    let me = this
    this.proxy = new Ext.data.HttpProxy({
      restful: true,
      url: this.url || `${STIGMAN.Env.apiBase}/collections`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    })
    const collectionStore = new Ext.data.JsonStore({
      fields: [
        {
          name: 'collectionId',
          type: 'string'
        }, {
          name: 'name',
          type: 'string'
        }
      ],
      proxy: this.proxy,
      autoLoad: this.autoLoad,
      baseParams: {
        elevate: curUser.privileges.canAdmin
      },
      root: this.root || '',
      sortInfo: {
        field: 'name',
        direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
      },
      idProperty: 'collectionId'
    })
    const config = {
      store: collectionStore,
      filteringStore: this.filteringStore || null,
      displayField: 'name',
      valueField: 'collectionId',
      mode: 'local',
      forceSelection: true,
      allowBlank: true,
      typeAhead: true,
      minChars: 0,
      hideTrigger: false,
      triggerAction: this.triggerAction || 'query',
      lastQuery: '',
      validator: (v) => {
        // Don't keep the form from validating when I'm not active
        if (me.grid.editor.editing == false) {
          return true
        }
        if (v === "") { return "Blank values no allowed" }
      },
      doQuery: function (q, forceAll) {
        // Custom re-implementation of the original ExtJS method
        // Initial lines were retained
        q = Ext.isEmpty(q) ? '' : q;
        var qe = {
          query: q,
          forceAll: forceAll,
          combo: this,
          cancel: false
        };
        if (this.fireEvent('beforequery', qe) === false || qe.cancel) {
          return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if (forceAll === true || (q.length >= this.minChars)) {
          // Removed test against this.lastQuery
          if (this.mode == 'local') {
            this.selectedIndex = -1
            if (forceAll) {
              this.store.clearFilter()
            }
            else {
              // Build array of filter functions
              let filters = []
              if (this.filteringStore) {
                // Include records from the combo store that are NOT in filteringStore
                filters.push(
                  {
                    fn: (record) => this.filteringStore.indexOfId(record.id) === -1,
                    scope: this
                  }
                )
              }
              if (q) {
                // Include records that partially match the combo value
                filters.push(
                  {
                    property: this.displayField,
                    value: q
                  }
                )
              }
              this.store.filter(filters)
            }
            this.onLoad()
          }
          else {
            this.store.baseParams[this.queryParam] = q
            this.store.load({
              params: this.getParams(q)
            })
            this.expand()
          }
        }
      },
      listeners: {
        afterrender: (combo) => {
          combo.getEl().dom.setAttribute('spellcheck', 'false')
        },
        expand: (combo) => {
          if (combo.filteringStore) {
            combo.store.filterBy(
              function (record, id) {
                return combo.filteringStore.indexOfId(id) === -1
              }
            )
          }
        }
      }
    }
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})

SM.User.DirectGrantsGrid = Ext.extend(Ext.grid.GridPanel, {
  initComponent: function () {
    const newFields = [
      {
        name: 'collectionId'
      },
      {
        name: 'name'
      },
      {
        name: 'accessLevel'
      }
    ]
    this.newRecordConstructor = Ext.data.Record.create(newFields)
    const totalTextCmp = new Ext.Toolbar.TextItem({
      text: '0 records',
      width: 80
    })
    this.proxy = new Ext.data.HttpProxy({
      restful: true,
      url: this.url,
      headers: { 'Content-Type': 'application/json;charset=utf-8' }
    })
    const grantStore = new Ext.data.JsonStore({
      grid: this,
      proxy: this.proxy,
      baseParams: this.baseParams,
      root: '',
      fields: newFields,
      idProperty: 'collectionId',
      sortInfo: {
        field: 'name',
        direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
      },
      listeners: {
        load: function (store, records) {
          totalTextCmp.setText(records.length + ' records');
        },
        remove: function (store, record, index) {
          totalTextCmp.setText(store.getCount() + ' records');
          store.grid.fireEvent('grantschanged', store.grid)
        }
      }
    })
    const collectionSelectionField = new SM.User.CollectionSelectionField({
      submitValue: false,
      grid: this,
      maxHeight: 150,
      filteringStore: grantStore,
      getListParent: function () {
        return this.grid.editor.el;
      },
      autoLoad: true
    })
    const accessLevelField = new SM.AccessLevelField({
      submitValue: false,
      canModifyOwners: true,
      includeOwnerGrant: true,
      grid: this,
      getListParent: function () {
        return this.grid.editor.el;
      }
    })
    const columns = [
      {
        header: "Collection",
        width: 150,
        dataIndex: 'name',
        sortable: true,
        editor: collectionSelectionField
      },
      {
        header: "Grant Level",
        width: 100,
        dataIndex: 'accessLevel',
        sortable: true,
        renderer: (v) => SM.AccessLevelStrings[v],
        editor: accessLevelField
      }
    ]
    this.editor = new Ext.ux.grid.RowEditor({
      saveText: 'Save',
      grid: this,
      collectionSelectionField: collectionSelectionField,
      accessLevelField: accessLevelField,
      clicksToEdit: 2,
      errorSummary: false, // don't display errors during validation monitoring
      listeners: {
        validateedit: function (editor, changes, record, index) {
          // RowEditor unhelpfully sets changes.name to the collectionId value. 
          if (changes.hasOwnProperty('name')) {
            let collEditor = editor.collectionSelectionField
            let collRecord = collEditor.store.getAt(collEditor.selectedIndex)
            changes.name = collRecord.data.name
            changes.collectionId = collRecord.data.collectionId
          }
        },
        canceledit: function (editor, forced) {
          // The 'editing' property is set by RowEditorToolbar.js
          if (editor.record.editing === true) { // was the edit on a new record?
            this.grid.store.suspendEvents(false);
            this.grid.store.remove(editor.record);
            this.grid.store.resumeEvents();
            this.grid.getView().refresh();
          }
        },
        afteredit: function (editor, changes, record, index) {
          // "Save" the record by reconfiguring the store's data collection
          // Corrects the bug where new records don't deselect when clicking away
          let mc = record.store.data
          let generatedId = record.id
          record.id = record.data.userId
          record.phantom = false
          record.dirty = false
          delete mc.map[generatedId]
          mc.map[record.id] = record
          for (let x = 0, l = mc.keys.length; x < l; x++) {
            if (mc.keys[x] === generatedId) {
              mc.keys[x] = record.id
            }
          }
          editor.grid.fireEvent('grantschanged', editor.grid)
        }

      }
    })

    const tbar = new SM.RowEditorToolbar({
      itemString: 'Grant',
      editor: this.editor,
      gridId: this.id,
      deleteProperty: 'collectionId',
      newRecord: this.newRecordConstructor
    })
    tbar.delButton.disable()

    const config = {
      isFormField: true,
      submitValue: true,
      forceSelection: true,
      allowBlank: true,
      layout: 'fit',
      height: 150,
      plugins: [this.editor],
      store: grantStore,
      cm: new Ext.grid.ColumnModel({
        columns: columns
      }),
      sm: new Ext.grid.RowSelectionModel({
        singleSelect: true,
        listeners: {
          selectionchange: function (sm) {
            tbar.delButton.setDisabled(!sm.hasSelection())
          }
        }
      }),
      view: new SM.ColumnFilters.GridView({
        emptyText: this.emptyText || 'No records to display',
        deferEmptyText: false,
        forceFit: true,
        markDirty: false
      }),
      listeners: {
      },
      tbar,
      getValue: function () {
        let grants = []
        grantStore.data.items.forEach((i) => {
          grants.push({
            collectionId: i.data.collectionId,
            accessLevel: i.data.accessLevel
          })
        })
        return grants
      },
      setValue: function (collectionGrants) {
        const data = collectionGrants.filter(g => g.grantees[0]?.userId).map(g => ({
          collectionId: g.collection.collectionId,
          name: g.collection.name,
          accessLevel: g.accessLevel
        }))
        grantStore.loadData(data)
      },
      markInvalid: function () { },
      clearInvalid: function () { },
      isValid: () => true,
      getName: () => this.name,
      validate: () => true
    }

    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})

SM.User.EffectiveGrantsGrid = Ext.extend(Ext.grid.GridPanel, {
  initComponent: function () {
    const fields = [
      {
        name: 'collectionId',
        mapping: 'collection.collectionId'
      },
      {
        name: 'name',
        mapping: 'collection.name'
      },
      'accessLevel',
      'grantees'
    ]
    const totalTextCmp = new Ext.Toolbar.TextItem({
      text: '0 records',
      width: 80
    })
    const store = new Ext.data.JsonStore({
      grid: this,
      root: '',
      fields,
      idProperty: 'collectionId',
      sortInfo: {
        field: 'name',
        direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
      },
      listeners: {
        load: function (store, records) {
          totalTextCmp.setText(records.length + ' records');
        }
      }
    })
    const columns = [
      {
        header: "Collection",
        width: 150,
        dataIndex: 'name',
        sortable: true,
      },
      {
        header: '<span exportvalue="Grantee">Grantee<i class= "fa fa-question-circle sm-question-circle"></i></span>',
        width: 150,
        dataIndex: 'grantees',
        sortable: false,
        renderer: function (grantees) {
          const divs = []
          for (const source of grantees) {
            const icon = source.userId ? 'sm-user-icon' : 'sm-users-icon'
            const title = source.userId ? 'Direct' : source.name
            divs.push(`<div class="x-combo-list-item ${icon} sm-combo-list-icon" exportValue="${title}">
                    <span style="font-weight:600;">${title}</span></div>`)
          }
          return divs.join('')
        }
      },
      {
        header: "Grant Level",
        width: 100,
        dataIndex: 'accessLevel',
        sortable: true,
        renderer: (v) => SM.AccessLevelStrings[v],
      }
    ]
    const bbar = new Ext.Toolbar({
      items: [
        {
          xtype: 'exportbutton',
          hasMenu: false,
          gridBasename: 'EffectiveGrants',
          exportType: 'grid',
          iconCls: 'sm-export-icon',
          text: 'CSV'
        }, {
          xtype: 'tbfill'
        }, {
          xtype: 'tbseparator'
        },
        totalTextCmp
      ]
    })

    const config = {
      isFormField: true,
      forceSelection: true,
      stripeRows: true,
      layout: 'fit',
      height: 150,
      store,
      columns,
      sm: new Ext.grid.RowSelectionModel({
        singleSelect: true
      }),
      view: new SM.ColumnFilters.GridView({
        emptyText: this.emptyText || 'No records to display',
        deferEmptyText: false,
        forceFit: true,
        markDirty: false
      }),
      bbar,
      setValue: function (v) {
        store.loadData(v)
      },
      getValue: function () { },
      markInvalid: function () { },
      clearInvalid: function () { },
      isValid: () => true,
      getName: () => this.name,
      validate: () => true
    }

    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})

SM.User.GroupSelectingGrid = Ext.extend(Ext.grid.GridPanel, {
  initComponent: function () {
    const _this = this
    const fields = Ext.data.Record.create([
      { name: 'userGroupId', type: 'string' },
      { name: 'name', type: 'string' },
      { name: 'usernames', convert: (v, r) => r.users.map(user => user.username) },
    ])
    const sm = new Ext.grid.CheckboxSelectionModel({
      singleSelect: false,
      checkOnly: false,
      listeners: {
        selectionchange: function (sm) {
          SM.SetCheckboxSelModelHeaderState(sm)
        }
      }
    })
    const columns = [
      sm,
      {
        header: "Group name",
        width: 150,
        dataIndex: 'name',
        sortable: true,
        filter: { type: 'string' }
      },
      {
        header: "Members",
        width: 50,
        align: 'center',
        dataIndex: 'usernames',
        sortable: true,
        hidden: false,
        filter: { type: 'values' },
        renderer: function (value, metadata, record) {
          let qtipWidth = 230
          if (value.length > 0) {
            let longest = Math.max(...(value.map(el => el.length)))
            qtipWidth = longest * 8
          }
          metadata.attr = ` ext:qwidth=${qtipWidth} ext:qtip="<b>${record.data.name} Members</b><br>${value.join('<br>')}"`
          return `<i>${value.length}</i>`
        }
      }
    ]
    const store = new Ext.data.JsonStore({
      fields,
      idProperty: 'userGroupId',
      sortInfo: {
        field: 'name',
        direction: 'ASC'
      },
    })
    const totalTextCmp = new SM.RowCountTextItem({
      store,
      noun: 'group',
      iconCls: 'sm-users-icon'
    })
    const config = {
      store,
      columns,
      sm,
      enableDragDrop: true,
      ddText: '{0} selected Group{1}',
      bodyCssClass: 'sm-grid3-draggable',
      ddGroup: `SM.User.GroupSelectingGrid-${this.role}`,
      border: true,
      loadMask: false,
      stripeRows: true,
      view: new SM.ColumnFilters.GridView({
        forceFit: true,
        emptyText: 'No Groups to display',
        listeners: {
          filterschanged: function (view, item, value) {
            store.filter(view.getFilterFns())
          }
        }
      }),
      bbar: new Ext.Toolbar({
        items: [
          {
            xtype: 'exportbutton',
            grid: this,
            hasMenu: false,
            gridBasename: 'Groups (grid)',
            storeBasename: 'Groups (store)',
            iconCls: 'sm-export-icon',
            text: 'CSV'
          },
          {
            xtype: 'tbfill'
          },
          {
            xtype: 'tbseparator'
          },
          totalTextCmp
        ]
      })
    }
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this);
  }
})

SM.User.GroupSelectingPanel = Ext.extend(Ext.Panel, {
  initComponent: function () {
    const _this = this
    function setupDragZone(grid) {
      const gridDragZone = grid.getView().dragZone
      const originalGetDragData = gridDragZone.getDragData
      gridDragZone.getDragData = function (e) {
        const t = Ext.lib.Event.getTarget(e)
        if (t.className === 'x-grid3-row-checker') {
          return false
        }
        return originalGetDragData.call(gridDragZone, e)
      }

      const originalStartDrag = gridDragZone.startDrag
      gridDragZone.startDrag = function (x, y) {
        Ext.getBody().addClass('sm-grabbing')
        return originalStartDrag.call(gridDragZone, x, y)
      }

      const originalOnDragDrop = gridDragZone.onDragDrop
      gridDragZone.onDragDrop = function (e, id) {
        Ext.getBody().removeClass('sm-grabbing')
        return originalOnDragDrop.call(gridDragZone, e, id)
      }

      const originalOnInvalidDrop = gridDragZone.onInvalidDrop
      gridDragZone.onInvalidDrop = function (e, id) {
        Ext.getBody().removeClass('sm-grabbing')
        return originalOnInvalidDrop.call(gridDragZone, e)
      }

    }
    const availableGrid = new SM.User.GroupSelectingGrid({
      title: 'Available',
      headerCssClass: 'sm-available-panel-header',
      role: 'available',
      flex: 1,
      listeners: {
        render: function (grid) {
          setupDragZone(grid)
          const gridDropTargetEl = grid.getView().scroller.dom;
          const gridDropTarget = new Ext.dd.DropTarget(gridDropTargetEl, {
            ddGroup: selectionsGrid.ddGroup,
            notifyDrop: function (ddSource, e, data) {
              const selectedRecords = ddSource.dragData.selections;
              changeSelected(selectionsGrid, selectedRecords, availableGrid)
              return true
            }
          })
        },

      }
    })
    const selectionsGrid = new SM.User.GroupSelectingGrid({
      title: this.selectionsGridTitle || 'Assigned',
      headerCssClass: 'sm-selections-panel-header',
      role: 'selections',
      flex: 1,
      listeners: {
        render: function (grid) {
          setupDragZone(grid)
          const gridDropTargetEl = grid.getView().scroller.dom;
          const gridDropTarget = new Ext.dd.DropTarget(gridDropTargetEl, {
            ddGroup: availableGrid.ddGroup,
            notifyDrop: function (ddSource, e, data) {
              const selectedRecords = ddSource.dragData.selections;
              changeSelected(availableGrid, selectedRecords, selectionsGrid)
              return true
            }
          })
        }
      }
    })
    availableGrid.getSelectionModel().on('selectionchange', handleSelections, selectionsGrid)
    selectionsGrid.getSelectionModel().on('selectionchange', handleSelections, availableGrid)

    const addBtn = new Ext.Button({
      iconCls: 'sm-add-assignment-icon',
      margins: "0 10 10 10",
      disabled: true,
      handler: function (btn) {
        const selectedRecords = availableGrid.getSelectionModel().getSelections()
        changeSelected(availableGrid, selectedRecords, selectionsGrid)
        btn.disable()
      }
    })
    const removeBtn = new Ext.Button({
      iconCls: 'sm-remove-assignment-icon',
      margins: "0 10 10 10",
      disabled: true,
      handler: function (btn) {
        const selectedRecords = selectionsGrid.getSelectionModel().getSelections()
        changeSelected(selectionsGrid, selectedRecords, availableGrid)
        btn.disable()
      }
    })
    const buttonPanel = new Ext.Panel({
      bodyStyle: 'background-color:transparent;border:none',
      width: 60,
      layout: {
        type: 'vbox',
        pack: 'center',
        align: 'center',
        padding: "10 10 10 10"
      },
      items: [
        addBtn,
        removeBtn,
        { xtype: 'panel', border: false, html: '<i>or drag</i>' }
      ]
    })

    function handleSelections() {
      const sm = this.getSelectionModel()
      if (sm.getSelected()) {
        sm.suspendEvents()
        sm.clearSelections()
        sm.resumeEvents()
        SM.SetCheckboxSelModelHeaderState(sm)
      }
      addBtn.setDisabled(this.role === 'available')
      removeBtn.setDisabled(this.role === 'selections')
    }

    async function initPanel({ userId }) {
      const promises = [
        Ext.Ajax.requestPromise({
          responseType: 'json',
          url: `${STIGMAN.Env.apiBase}/user-groups`,
          params: {
            projection: ['users']
          },
          method: 'GET'
        }),
        Ext.Ajax.requestPromise({
          responseType: 'json',
          url: `${STIGMAN.Env.apiBase}/users/${userId}`,
          params: {
            elevate: curUser.privileges.canAdmin,
            projection: ['userGroups']
          },
          method: 'GET'
        })
      ]
      const [apiAvailableUserGroups, apiUser] = await Promise.all(promises)
      const assignedUserGroupIds = apiUser?.userGroups?.map(userGroup => userGroup.userGroupId) ?? []
      _this.originalUserGroupIds = assignedUserGroupIds
      const availableUserGroups = []
      const assignedUserGroups = []
      apiAvailableUserGroups.reduce((accumulator, userGroup) => {
        const property = assignedUserGroupIds.includes(userGroup.userGroupId) ? 'assignedUserGroups' : 'availableUserGroups'
        accumulator[property].push(userGroup)
        return accumulator
      }, { availableUserGroups, assignedUserGroups })

      availableGrid.store.loadData(availableUserGroups)
      selectionsGrid.store.loadData(assignedUserGroups)
      _this.trackedProperty = { dataProperty: 'usernames', value: apiUser.username }

    }

    function changeSelected(srcGrid, records, dstGrid) {
      srcGrid.store.suspendEvents()
      dstGrid.store.suspendEvents()
      srcGrid.store.remove(records)
      dstGrid.store.add(records)
      // for (const record of records) {
      //   if (srcGrid.role === 'available') {
      //     record.data[_this.trackedProperty.dataProperty].push(_this.trackedProperty.value)
      //     record.commit()
      //   }
      //   else {
      //     record.data[_this.trackedProperty.dataProperty] = record.data[_this.trackedProperty.dataProperty].filter(i => i !== _this.trackedProperty.value)
      //     record.commit()
      //   }
      // }
      const { field, direction } = dstGrid.store.getSortState()
      dstGrid.store.sort(field, direction)
      srcGrid.store.resumeEvents()
      dstGrid.store.resumeEvents()
      srcGrid.store.fireEvent('datachanged', srcGrid.store)
      dstGrid.store.fireEvent('datachanged', dstGrid.store)
      srcGrid.store.fireEvent('update', srcGrid.store)
      dstGrid.store.fireEvent('update', dstGrid.store)
      dstGrid.store.filter(dstGrid.getView().getFilterFns())

      dstGrid.getSelectionModel().selectRecords(records)
      dstGrid.getView().focusRow(dstGrid.store.indexOfId(records[0].data.assetId))
      _this.fireEvent('groupselectionschanged')
    }

    function getValue() {
      const records = selectionsGrid.store.snapshot?.items ?? selectionsGrid.store.getRange()
      return records.map(record => record.data.userGroupId)
    }

    const config = {
      layout: 'hbox',
      layoutConfig: {
        align: 'stretch'
      },
      name: 'userGroups',
      border: false,
      items: [
        availableGrid,
        buttonPanel,
        selectionsGrid
      ],
      availableGrid,
      selectionsGrid,
      initPanel,
      getValue,
      // need fns below so Ext handles us like a form field
      setValue: () => { },
      markInvalid: function () { },
      clearInvalid: function () { },
      isValid: () => true,
      getName: () => this.name,
      validate: () => true
    }
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})

SM.User.UserGrid = Ext.extend(Ext.grid.GridPanel, {
  initComponent: function () {
    const _this = this
    const fields = Ext.data.Record.create([
      {
        name: 'userId',
        type: 'string'
      },
      {
        name: 'username',
        type: 'string'
      },
      {
        name: 'displayName',
        type: 'string'
      },
      {
        name: 'groupNames',
        convert: (v, r) => r.userGroups.map(userGroup => userGroup.name)
      },
      {
        name: 'created',
        type: 'date',
        mapping: 'statistics.created'
      },
      {
        name: 'lastAccess',
        type: 'integer',
        mapping: 'statistics.lastAccess'
      },
      {
        name: 'collectionGrantCount',
        type: 'integer',
        mapping: 'statistics.collectionGrantCount'
      },
      {
        name: 'statistics'
      }
    ])
    const store = new Ext.data.JsonStore({
      proxy: new Ext.data.HttpProxy({
        url: `${STIGMAN.Env.apiBase}/users`,
        method: 'GET'
      }),
      baseParams: {
        elevate: curUser.privileges.canAdmin,
        projection: ['userGroups', 'statistics']
      },
      root: '',
      fields,
      idProperty: 'userId',
      sortInfo: {
        field: 'username',
        direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
      }
    })
    const privilegeGetter = new Function("obj", "return obj?." + STIGMAN.Env.oauth.claims.privileges + " || [];");
    const totalTextCmp = new SM.RowCountTextItem({ store })
    const config = {
      store,
      sm: new Ext.grid.RowSelectionModel({ singleSelect: true }),
      columns: [
        {
          header: "Username",
          width: 150,
          dataIndex: 'username',
          sortable: true,
          filter: { type: 'string' }
        },
        {
          header: "Name",
          width: 150,
          dataIndex: 'displayName',
          sortable: true,
          filter: { type: 'string' }
        },
        {
          header: "Groups",
          width: 220,
          dataIndex: 'groupNames',
          sortable: false,
          filter: {
            type: 'values',
            renderer: SM.ColumnFilters.Renderers.groups
          },
          renderer: function (value, metadata) {
            value.sort((a, b) => a.localeCompare(b))
            metadata.attr = 'style="line-height: 17px;white-space:normal;"'
            return SM.User.GroupArrayTpl.apply(value)
          }
        },
        {
          header: "Grants",
          width: 50,
          align: 'center',
          dataIndex: 'collectionGrantCount',
          sortable: true,
        },
        {
          header: "Added",
          xtype: 'datecolumn',
          format: 'Y-m-d H:i T',
          width: 150,
          dataIndex: 'created',
          sortable: true
        },
        {
          header: "Last Access",
          width: 150,
          dataIndex: 'lastAccess',
          sortable: true,
          renderer: v => v ? Ext.util.Format.date(new Date(v * 1000), 'Y-m-d H:i T') : SM.styledEmptyRenderer()
        },
        {
          header: "Create Collection",
          width: 100,
          align: 'center',
          renderer: function (value, metaData, record) {
            return privilegeGetter(record.data.statistics.lastClaims).includes('create_collection') ? '&#x2714;' : ''
          }
        },
        {
          header: "Administrator",
          width: 100,
          align: 'center',
          renderer: function (value, metaData, record) {
            return privilegeGetter(record.data.statistics.lastClaims).includes('admin') ? '&#x2714;' : ''
          }
        },
        {
          header: "userId",
          width: 100,
          dataIndex: 'userId',
          sortable: true
        }
      ],
      view: new SM.ColumnFilters.GridView({
        forceFit: true,
        listeners: {
          filterschanged: function (view) {
            store.filter(view.getFilterFns())
          },
          // These listeners keep the grid in the same scroll position after the store is reloaded
          beforerefresh: function (v) {
            v.scrollTop = v.scroller.dom.scrollTop;
            v.scrollHeight = v.scroller.dom.scrollHeight;
          },
          refresh: function (v) {
            setTimeout(function () {
              v.scroller.dom.scrollTop = v.scrollTop + (v.scrollTop == 0 ? 0 : v.scroller.dom.scrollHeight - v.scrollHeight);
            }, 100);
          }
        },
        deferEmptyText: false
      }),
      listeners: {
        rowdblclick: function (grid, rowIndex, e) {
          let r = grid.getStore().getAt(rowIndex);
          SM.User.showUserProps(r.get('userId'));
        }
      },
      tbar: [
        {
          iconCls: 'icon-add',
          text: 'Pre-register User',
          disabled: !(curUser.privileges.canAdmin),
          handler: function () {
            Ext.getBody().mask('');
            SM.User.showUserProps(0);
          }
        },
        '-',
        {
          ref: '../removeBtn',
          iconCls: 'icon-del',
          text: 'Unregister User',
          disabled: !(curUser.privileges.canAdmin),
          handler: function () {
            let user = _this.getSelectionModel().getSelected();
            let buttons = { yes: 'Unregister', no: 'Cancel' }
            let confirmStr = `Unregister user ${user.data.username}?<br><br>This action will remove all Collection Grants for the user. A record will be retained in the system for auditing and attribution purposes.`;
            if (user.data.lastAccess === 0) {
              confirmStr = `Delete user ${user.data.username}?<br><br>This user has never accessed the system, and will be deleted from the system entirely.`;
              buttons.yes = 'Delete'
            }

            Ext.Msg.show({
              title: 'Confirm unregister action',
              icon: Ext.Msg.WARNING,
              msg: confirmStr,
              buttons: buttons,
              fn: async function (btn, text) {
                try {
                  if (btn == 'yes') {
                    if (user.data.lastAccess === 0) {
                      const apiUser = await Ext.Ajax.requestPromise({
                        responseType: 'json',
                        url: `${STIGMAN.Env.apiBase}/users/${user.data.userId}?elevate=${curUser.privileges.canAdmin}`,
                        method: 'DELETE'
                      })
                      store.remove(user)
                      SM.Dispatcher.fireEvent('userdeleted', apiUser)
                    }
                    else {
                      const apiUser = await Ext.Ajax.requestPromise({
                        responseType: 'json',
                        url: `${STIGMAN.Env.apiBase}/users/${user.data.userId}?elevate=${curUser.privileges.canAdmin}&projection=collectionGrants&projection=statistics`,
                        method: 'PATCH',
                        jsonData: { collectionGrants: [] }
                      })
                      // userStore.remove(user)
                      SM.Dispatcher.fireEvent('userchanged', apiUser)
                    }
                  }
                }
                catch (e) {
                  SM.Error.handleError(e)
                }
              }
            })
          }
        },
        '-',
        {
          iconCls: 'icon-edit',
          text: 'Modify User',
          handler: function () {
            var r = _this.getSelectionModel().getSelected();
            Ext.getBody().mask('Getting properties...');
            SM.User.showUserProps(r.get('userId'));
          }
        }
      ],
      bbar: new Ext.Toolbar({
        items: [
          {
            xtype: 'tbbutton',
            iconCls: 'icon-refresh',
            tooltip: 'Reload this grid',
            width: 20,
            handler: function (btn) {
              store.reload()
            }
          },
          {
            xtype: 'tbseparator'
          },
          {
            xtype: 'exportbutton',
            hasMenu: false,
            gridBasename: 'User-Info',
            exportType: 'grid',
            iconCls: 'sm-export-icon',
            text: 'CSV'
          },
          {
            xtype: 'tbfill'
          }, {
            xtype: 'tbseparator'
          },
          totalTextCmp
        ]
      })
    }


    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)
  }
})
SM.User.UserProperties = Ext.extend(Ext.form.FormPanel, {
  initComponent: function () {
    const directGrantsGrid = new SM.User.DirectGrantsGrid({
      name: 'collectionGrants',
      title: 'Direct Grants',
      iconCls: 'sm-lock-icon',
      layout: 'fit',
      border: true
    })
    const userGroupsPanel = new SM.User.GroupSelectingPanel({
      title: 'User Groups',
      iconCls: 'sm-users-icon',
      layout: 'fit',
      border: true,
      isFormField: true,
      submitValue: true
    })
    const effectiveGrantsGrid = new SM.User.EffectiveGrantsGrid({
      name: 'effectiveGrants',
      title: 'View Effective Grants',
      iconCls: 'sm-lock-icon',
      layout: 'fit',
      isFormField: true,
      border: true
    })
    const registeredUserItems = [
      {
        layout: 'column',
        baseCls: 'x-plain',
        border: false,
        items: [
          {
            columnWidth: .5,
            layout: 'form',
            border: false,
            items: [
              {
                xtype: 'textfield',
                fieldLabel: 'Username',
                readOnly: true,
                anchor: '-20',
                name: 'username'
              }
            ]
          },
          {
            columnWidth: .5,
            layout: 'form',
            border: false,
            items: [
              {
                xtype: 'textfield',
                fieldLabel: 'Name',
                readOnly: true,
                anchor: '100%',
                name: 'displayName'
              }
            ]
          }
        ]
      },
      {
        xtype: 'textfield',
        fieldLabel: 'Email',
        anchor: '100%',
        readOnly: true,
        name: 'email'
      },
      {
        xtype: 'textfield',
        fieldLabel: 'Privileges',
        anchor: '100%',
        readOnly: true,
        name: 'privileges'
      },
      {
        xtype: 'displayfield',
        allowBlank: true,
        // style: 'border: 1px solid #888',
        fieldLabel: 'Last Claims',
        autoScroll: true,
        border: true,
        name: 'lastClaims',
        height: 150,
        anchor: '100%',
        setValue: function (v) {
          if (Object.keys(v).length === 0 && v.constructor === Object) {
            return
          }
          const tree = JsonView.createTree(v)
          const el = this.getEl().dom
          JsonView.render(tree, el)
          JsonView.expandChildren(tree)
        }
      }
    ]
    const preregisteredUserItems = [
      {
        xtype: 'textfield',
        fieldLabel: 'Username',
        allowBlank: false,
        anchor: '100%',
        name: 'username'
      }
    ]
    const registeredTabPanelItems = [
      effectiveGrantsGrid,
      directGrantsGrid,
      userGroupsPanel,
    ]
    const preregisteredTabPanelItems = [
      directGrantsGrid,
      userGroupsPanel
    ]

    let config = {
      baseCls: 'x-plain',
      region: 'south',
      labelWidth: 70,
      monitorValid: true,
      trackResetOnLoad: true,
      items: [
        {
          xtype: 'fieldset',
          title: '<b>User information</b>',
          items: this.registeredUser ? registeredUserItems : preregisteredUserItems
        },
        {
          xtype: 'tabpanel',
          border: false,
          activeTab: 0,
          height: 270,
          items: this.registeredUser ? registeredTabPanelItems : preregisteredTabPanelItems
        }

      ],
      buttons: [{
        text: this.btnText || 'Save',
        formBind: true,
        handler: this.btnHandler || function () { }
      }],
      userGroupsPanel
    }

    Ext.apply(this, Ext.apply(this.initialConfig, config))
    this.superclass().initComponent.call(this)

    this.getForm().getFieldValues = function (dirtyOnly, getDisabled) {
      // Override to support submitValue boolean
      var o = {},
        n,
        key,
        val;
      this.items.each(function (f) {
        // Added condition for f.submitValue
        if (f.submitValue && (!f.disabled || getDisabled) && (dirtyOnly !== true || f.isDirty())) {
          n = f.getName();
          key = o[n];
          val = f.getValue();

          if (Ext.isDefined(key)) {
            if (Ext.isArray(key)) {
              o[n].push(val);
            } else {
              o[n] = [key, val];
            }
          } else {
            o[n] = val;
          }
        }
      });
      return o;
    }
  }
})

SM.User.showUserProps = async function showUserProps(userId) {
  try {
    const userPropsFormPanel = new SM.User.UserProperties({
      registeredUser: userId,
      padding: '10px 15px 10px 15px',
      btnHandler: async function () {
        try {
          if (userPropsFormPanel.getForm().isValid()) {
            const values = userPropsFormPanel.getForm().getFieldValues(false, true) // dirtyOnly=false, getDisabled=true
            const jsonData = { collectionGrants: values.collectionGrants, userGroups: values.userGroups }

            const method = userId ? 'PATCH' : 'POST'
            const url = userId ? `${STIGMAN.Env.apiBase}/users/${userId}` : `${STIGMAN.Env.apiBase}/users`
            if (!userId) {
              jsonData.username = values.username
            }
            const result = await Ext.Ajax.requestPromise({
              url,
              method,
              params: {
                elevate: curUser.privileges.canAdmin,
                projection: ['userGroups', 'collectionGrants', 'statistics']
              },
              headers: { 'Content-Type': 'application/json;charset=utf-8' },
              jsonData
            })
            const apiUser = JSON.parse(result.response.responseText)
            const event = userId ? 'userchanged' : 'usercreated'
            SM.Dispatcher.fireEvent(event, apiUser)
            appwindow.close()
          }
        }
        catch (e) {
          SM.Error.handleError(e)
        }
      }
    })

    /******************************************************/
    // Form window
    /******************************************************/
    const appwindow = new Ext.Window({
      title: userId ? 'User ID ' + userId : 'Pre-register User',
      cls: 'sm-dialog-window sm-round-panel',
      modal: true,
      hidden: true,
      width: 660,
      height: userId ? 650 : 440,
      layout: 'fit',
      plain: true,
      bodyStyle: 'padding:5px;',
      buttonAlign: 'right',
      items: userPropsFormPanel
    });


    appwindow.show(Ext.getBody());

    const privilegeGetter = new Function("obj", "return obj?." + STIGMAN.Env.oauth.claims.privileges + " || [];");

    if (userId) {
      const result = await Ext.Ajax.requestPromise({
        url: `${STIGMAN.Env.apiBase}/users/${userId}`,
        params: {
          elevate: curUser.privileges.canAdmin,
          projection: ['statistics', 'collectionGrants']
        },
        method: 'GET'
      })
      const apiUser = JSON.parse(result.response.responseText)
        ;['iat', 'exp', 'auth_time'].forEach(claim => {
          if (apiUser.statistics.lastClaims[claim]) {
            apiUser.statistics.lastClaims[claim] = new Date(apiUser.statistics.lastClaims[claim] * 1000)
          }
        })
      if (apiUser.statistics.lastClaims.scope) {
        apiUser.statistics.lastClaims.scope = apiUser.statistics.lastClaims.scope.split(' ')
      }
      const formValues = {
        username: apiUser.username,
        displayName: apiUser.displayName,
        email: apiUser.email,
        privileges: privilegeGetter(apiUser.statistics.lastClaims).join(', '),
        canCreateCollection: privilegeGetter(apiUser.statistics.lastClaims).includes('create_collection'),
        canAdmin: privilegeGetter(apiUser.statistics.lastClaims).includes('admin'),
        lastClaims: apiUser.statistics.lastClaims,
        collectionGrants: apiUser.collectionGrants || [],
        effectiveGrants: apiUser.collectionGrants || []
      }
      userPropsFormPanel.getForm().setValues(formValues)
    }
    await userPropsFormPanel.userGroupsPanel.initPanel({ userId })

    Ext.getBody().unmask();
  }
  catch (e) {
    Ext.getBody().unmask()
    SM.Error.handleError(e)
  }
}

SM.User.CollectionAclGrid = Ext.extend(Ext.grid.GridPanel, {
  initComponent: function () {
      const fields = [
        {
          name: 'assetName',
          mapping: 'asset.name'
        },
        'benchmarkId',
        'access',
        'aclSources'
      ]
      const store = new Ext.data.JsonStore({
        autoLoad: true,
        proxy: new Ext.data.HttpProxy({
          url: `${STIGMAN.Env.apiBase}/collections/${this.collectionId}/grants/user/${this.userId}/access/effective`,
          method: 'GET'
        }),
        root: '',
        fields,
        idProperty: 'assetName',
        sortInfo: {
          field: 'assetName',
          direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
        }
      })
      const columns = [
        {
          header: `<span class="sm-asset-icon sm-column-with-icon">Asset</span>`, 
          dataIndex: 'assetName',
          sortable: true,
          width: 250
        },
        {
          header: `<span class="sm-stig-icon sm-column-with-icon">STIG</span>`, 
          dataIndex: 'benchmarkId',
          sortable: true,
          width: 350
        },
        {
          header: `Access`, 
          dataIndex: 'access',
          sortable: true,
          width: 150
        },
        {
          header: 'ACL Source',
          width: 150,
          dataIndex: 'aclSources',
          sortable: false,
          renderer: function (aclSources) {
            const divs = []
            for (const source of aclSources) {
              const icon = source.grantee.userId ? 'sm-user-icon' : 'sm-users-icon'
              const title = source.grantee.userId ? 'Direct' : source.grantee.name
              divs.push(`<div class="x-combo-list-item ${icon} sm-combo-list-icon" exportValue="${title}">
                      <span style="font-weight:600;">${title}</span></div>`)
            }
            return divs.join('')
          }
        }
      ]
      const sm = new Ext.grid.RowSelectionModel({
        singleSelect: true
      })
      const view = new SM.ColumnFilters.GridView({
        emptyText: this.emptyText || 'No records to display',
        deferEmptyText: false,
        forceFit: true,
        markDirty: false
      })

      const config = {
        fields,
        store,
        columns,
        sm,
        view,
        stripeRows: true,
        layout: 'fit',
      }
      Ext.apply(this, Ext.apply(this.initialConfig, config))
      this.superclass().initComponent.call(this)
  }
})

SM.User.showCollectionAcl = async function ({userId, collectionId, defaultAccess}) {
  const aclGrid = new SM.User.CollectionAclGrid({
    userId,
    collectionId,
    border: false,
    title: `Effective Access, default = ${defaultAccess}`
  })
  const appwindow = new Ext.Window({
    title: 'User ID ' + userId,
    cls: 'sm-dialog-window sm-round-panel',
    modal: true,
    hidden: true,
    width: 660,
    height: 650,
    layout: 'fit',
    plain: true,
    bodyStyle: 'padding:15px;',
    buttonAlign: 'right',
    items: aclGrid
  })
  appwindow.show(Ext.getBody());
}
