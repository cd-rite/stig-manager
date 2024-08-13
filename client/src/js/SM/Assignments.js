Ext.ns('SM.Acl')

SM.Acl.ResourceTreePanel = Ext.extend(Ext.tree.TreePanel, {
    initComponent: function() {
      let me = this
      let collectionId = this.collectionId
      let config = {
          autoScroll: true,
          bodyStyle: 'padding:5px;',
          minSize: 220,
          root: {
            nodeType: 'async',
            id: `${collectionId}-resource-root`,
            expanded: true
          },
          rootVisible: false,
          loader: new Ext.tree.TreeLoader({
            directFn: me.loadTree
          }),
          loadMask: {msg: ''},
          listeners: {
            beforeexpandnode: function (n) {
              n.loaded = false; // always reload from the server
            }
          }
      }
  
      Ext.apply(this, Ext.apply(this.initialConfig, config))
      this.superclass().initComponent.call(this)
    },
    loadTree: async function (node, cb) {
        try {
          let match
          // Root node
          match = node.match(/^(\d+)-resource-root$/)
          if (match) {
            let collectionId = match[1]
            let content = []
            content.push(
              {
                id: `${collectionId}-resource-collection-node`,
                node: 'collection',
                text: 'Collection',
                iconCls: 'sm-collection-icon',
                expanded: true,
                children: [
                  {
                    id: `${collectionId}-resource-stigs-node`,
                    node: 'stigs',
                    text: 'STIGs',
                    iconCls: 'sm-stig-icon'
                  },
                  {
                      id: `${collectionId}-resource-assets-node`,
                      node: 'assets',
                      text: 'Assets',
                      iconCls: 'sm-asset-icon'
                  },
                  {
                    id: `${collectionId}-resource-labels-node`,
                    node: 'labels',
                    text: 'Labels',
                    iconCls: 'sm-label-icon'
                  }
                ]
              }
            )
            cb(content, { status: true })
            return
          }
          // Collection-Assets node
          match = node.match(/^(\d+)-resource-assets-node$/)
          if (match) {
            let collectionId = match[1]
            let apiAssets = await Ext.Ajax.requestPromise({
              responseType: 'json',
              url: `${STIGMAN.Env.apiBase}/assets`,
              method: 'GET',
              params: {
                collectionId: collectionId
              }
            })
            let content = apiAssets.map(asset => ({
              id: `${collectionId}-${asset.assetId}-resource-assets-asset-node`,
              text: SM.he(asset.name),
              assetName: asset.name,
              node: 'asset',
              collectionId: collectionId,
              assetId: asset.assetId,
              iconCls: 'sm-asset-icon',
              qtip: SM.he(asset.name)
            }))
            cb(content, { status: true })
            return
          }
          // Collection-Assets-STIG node
          match = node.match(/^(\d+)-(\d+)-resource-assets-asset-node$/)
          if (match) {
            let collectionId = match[1]
            let assetId = match[2]
            let apiAsset = await Ext.Ajax.requestPromise({
              responseType: 'json',
              url: `${STIGMAN.Env.apiBase}/assets/${assetId}`,
              method: 'GET',
              params: {
                projection: 'stigs'
              }
            })
            let content = apiAsset.stigs.map(stig => ({
              id: `${collectionId}-${assetId}-${stig.benchmarkId}-resource-leaf`,
              text: SM.he(stig.benchmarkId),
              leaf: true,
              node: 'asset-stig',
              iconCls: 'sm-stig-icon',
              stigName: stig.benchmarkId,
              assetName: apiAsset.name,
              assetId: apiAsset.assetId,
              collectionId: collectionId,
              benchmarkId: stig.benchmarkId,
              qtip: `Rules: ${SM.he(stig.ruleCount)}`
            }))
            cb(content, { status: true })
            return
          }
      
          // Collection-STIGs node
          match = node.match(/^(\d+)-resource-stigs-node$/)
          if (match) {
            let collectionId = match[1]
            let apiStigs = await Ext.Ajax.requestPromise({
              responseType: 'json',
              url: `${STIGMAN.Env.apiBase}/collections/${collectionId}/stigs`,
              method: 'GET',
              // params: {
              //   projection: 'stigs'
              // }
            })
            let content = apiStigs.map( stig => ({
              collectionId: collectionId,
              text: SM.he(stig.benchmarkId),
              node: 'stig',
              iconCls: 'sm-stig-icon',
              id: `${collectionId}-${stig.benchmarkId}-resource-stigs-stig-node`,
              benchmarkId: stig.benchmarkId,
              qtip: `Assets: ${SM.he(stig.assetCount)}`
            }) )
            cb( content, { status: true } )
            return
          }
          // Collection-STIGs-Asset node
          match = node.match(/^(\d+)-(.*)-resource-stigs-stig-node$/)
          if (match) {
            let collectionId = match[1]
            let benchmarkId = match[2]
              let apiAssets = await Ext.Ajax.requestPromise({
                responseType: 'json',
                url: `${STIGMAN.Env.apiBase}/collections/${collectionId}/stigs/${benchmarkId}/assets`,
              method: 'GET'
            })
            let content = apiAssets.map(asset => ({
              id: `${collectionId}-${benchmarkId}-${asset.assetId}-resource-leaf`,
              text: SM.he(asset.name),
              leaf: true,
              node: 'stig-asset',
              iconCls: 'sm-asset-icon',
              stigName: benchmarkId,
              assetName: asset.name,
              assetId: asset.assetId,
              collectionId: collectionId,
              benchmarkId: benchmarkId,
              qtip: SM.he(asset.name)
            }))
            cb(content, { status: true })
            return
          }

          // Collection-Labels node
          match = node.match(/^(\d+)-resource-labels-node$/)
          if (match) {
            const collectionId = match[1]
            const apiLabels = await Ext.Ajax.requestPromise({
              responseType: 'json',
              url: `${STIGMAN.Env.apiBase}/collections/${collectionId}/labels`,
              method: 'GET'
            })
            const content = apiLabels.map( label => ({
              collectionId: collectionId,
              label,
              text: SM.Collection.LabelTpl.apply(label),
              node: 'label',
              iconCls: 'sm-label-icon',
              id: `${collectionId}-${label.name}-resource-labels-label-node`,
              qtip: `Assets: ${SM.he(label.uses)}`
            }) )
            cb( content, { status: true } )
            return
          }
          // Collection-Labels-STIG node
          match = node.match(/^(\d+)-(.*)-resource-labels-label-node$/)
          if (match) {
            const collectionId = match[1]
            const label = this.attributes.label
            const apiStig = await Ext.Ajax.requestPromise({
              responseType: 'json',
              url: `${STIGMAN.Env.apiBase}/collections/${collectionId}/stigs`,
              method: 'GET',
              params: {
                labelId: label.labelId
              }
            })
            const content = apiStig.map(stig => ({
              id: `${collectionId}-${label.labelName}-${stig.benchmarkId}-resource-leaf`,
              text: SM.he(stig.benchmarkId),
              leaf: true,
              node: 'label-stig',
              iconCls: 'sm-stig-icon',
              stigName: stig.benchmarkId,
              label,
              collectionId,
              benchmarkId: stig.benchmarkId,
              qtip: `Assets: ${SM.he(stig.assetCount)}`
            }))
            cb(content, { status: true })
            return
          }
          
          
        }
        catch (e) {
          SM.Error.handleError(e)
        }
    }
})
  
SM.Acl.ResourceAddBtn = Ext.extend(Ext.Button, {
  initComponent: function () {
    let config = {
      disabled: true,
      height: 30,
      width: 150,
      margins: "10 10 10 10",
      icon: 'img/right-arrow-16.png',
      iconAlign: 'right',
      cls: 'x-btn-text-icon'
    }
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    SM.Acl.ResourceAddBtn.superclass.initComponent.call(this)
  }
})
  
SM.Acl.ResourceRemoveBtn = Ext.extend(Ext.Button, {
  initComponent: function () {
    let grid = this.grid
    let config = {
      disabled: true,
      height: 30,
      width: 150,
      margins: "10 10 10 10",
      icon: 'img/left-arrow-16.png',
      iconAlign: 'left',
      cls: 'x-btn-text-icon',
      listeners:{
      click: function(){
          const assigmentsToPurge = grid.getSelectionModel().getSelections()
          grid.getStore().remove(assigmentsToPurge)
        }
      }
}
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    SM.Acl.ResourceRemoveBtn.superclass.initComponent.call(this)
  }
})

SM.Acl.AssignedRulesGrid = Ext.extend(Ext.grid.EditorGridPanel, {
  // config: { panel}
  initComponent: function() {
    let me = this
    let assignmentStore = new Ext.data.JsonStore({
      fields: [
        'benchmarkId',
        'assetId',
        'assetName',
        'labelId',
        'labelName',
        'label',
        'access'  
      ],
      root: this.root || '',
      sortInfo: {
          field: 'assetName',
          direction: 'ASC' // or 'DESC' (case sensitive for local sorting)
      },
      idProperty: v => `${v.benchmarkId}-${v.assetName}-${v.labelName}`,
      listeners: {
        add: function(){
          // me.setTitle('Asset-STIG Assignments (' + assignmentStore.getCount() + ')');
        }, 
        remove: function(){
          // me.setTitle('Asset-STIG Assignments (' + assignmentStore.getCount() + ')');
          //==========================================================
          //DISABLE THE REMOVAL BUTTON AFTER EACH REMOVAL OF ASSIGMENTS
          //==========================================================
          me.panel.removeButton.disable();
        } 
      }  
    })
    let selectionModel = new Ext.grid.RowSelectionModel({
      singleSelect: false,
      listeners: {
        rowselect: function(theSelModel, theRowIndex, therecord){
          me.panel.removeButton.enable();
        },
        rowdeselect: function(theSelModel, theRowIndex, therecord){
          if (theSelModel.getCount()<1){
            //==============================================
            //WHEN THERE ARE NO MORE SELECTIONS, DISABLE THE 
            //"REMOVE ASSIGNMENTS" BUTTON
            //==============================================
            me.panel.removeButton.disable();
          }
        }
      }
      
    })

    function renderResource (value, metadata, record) {
      let html = ''
      if (!record.data.assetName && !record.data.labelName && !record.data.benchmarkId) {
        html += `<div class="sm-collection-icon sm-cell-with-icon">Collection</div>`
      }
      if (record.data.assetName) {
        html += `<div class="sm-asset-icon sm-cell-with-icon">${record.data.assetName}</div>`
      }
      if (record.data.labelName) {
        html += `<div class="sm-label-icon sm-cell-with-icon">${SM.Collection.LabelTpl.apply(record.data.label)}</div>`
      }
      if (record.data.benchmarkId) {
        html += `<div class="sm-stig-icon sm-cell-with-icon">${record.data.benchmarkId}</div>`
      }
      return html
    }

    const columns = [
      {
        header: `Resource`, 
        sortable: true,
        width: 350,
        renderer: renderResource
      },
      {
        header: `Access`, 
        dataIndex: 'access',
        sortable: true,
        width: 100,
        editor: new Ext.form.ComboBox({
          mode: 'local',
          forceSelection: true,
          autoSelect: true,
          editable: false,
          store: new Ext.data.SimpleStore({
            fields: ['access'],
            data: [
              ['rw'],
              ['r'],
              ['none']
            ]
          }),
          valueField:'access',
          displayField:'access',
          monitorValid: false,
          listeners: {
            select: function (combo,record,index) {
              if (combo.startValue !== combo.value ) {
                combo.fireEvent("blur");
              } 
              else {
                console.log('No Change')
              }
            }
          },
          triggerAction: 'all'
        }),

      }
    ]
    const config = {
      name: 'access',
      isFormField: true,
      setValue: function(acl) {
        assignmentStore.loadData(acl.map(rule=>({
          benchmarkId: rule.benchmarkId,
          assetId: rule.asset?.assetId,
          assetName: rule.asset?.name,
          labelId: rule.label?.labelId,
          labelName: rule.label?.name,
          label: rule.label,
          access: rule.access
        })))
      },
      getValue: function() {
        let rules = [];
        assignmentStore.each(function(record){
          rules.push({
            benchmarkId: record.data.benchmarkId || undefined,
            assetId: record.data.assetId || undefined,
            labelId: record.data.labelId || undefined,
            access: record.data.access
          })
        })
        return rules
      },
      markInvalid: Ext.emptyFn,
      clearInvalid: Ext.emptyFn,
      isValid: function() { return true},
      disabled: false,
      getName: function() {return this.name},
      validate: function() { return true},
      // width: me.width || 400,
      store: assignmentStore,
      view: new SM.ColumnFilters.GridView({
        emptyText: this.emptyText || 'No records to display',
        deferEmptyText: false,
        forceFit: true,
        markDirty: false
      }),
      stripeRows: true,
      sm: selectionModel,
      columns,
      listeners: {
        keydown: SM.CtrlAGridHandler
      }
    }
    
    Ext.apply(this, Ext.apply(this.initialConfig, config))
    SM.Acl.AssignedRulesGrid.superclass.initComponent.call(this)
  }
})

SM.Acl.Panel = Ext.extend(Ext.Panel, {
  // config: {collectionId, userId}
  initComponent: function() {
    const navTree = new SM.Acl.ResourceTreePanel({
      panel: this,
      title: 'Collection Resources',
      width: 300,
      collectionId: this.collectionId,
      listeners: {
        click: handleTreeClick
      }
    })

    function handleTreeClick (node) {
      switch (node.attributes.node){
        case 'collection':
        case 'stig':
        case 'stig-asset':
        case 'asset':
        case 'asset-stig':
        case 'label':
        case 'label-stig':
          addBtn.setDisabled(isTreeNodeInRulesGrid(node))
          break
        default:
          addBtn.disable()
          break
      }
    }

    function handleAddBtnItem(item) {
      const selectedNode = navTree.getSelectionModel().getSelectedNode()
      makeAssignment(selectedNode, item.access);
    }

    function makeAssignment(selectedNode, access) {
      const assignment = {
        benchmarkId:selectedNode.attributes.benchmarkId, 
        assetId:selectedNode.attributes.assetId, 
        assetName: selectedNode.attributes.assetName,
        labelId:selectedNode.attributes.label?.labelId, 
        labelName: selectedNode.attributes.label?.name,
        label: selectedNode.attributes.label,
        access
      }
      assignedRulesGrid.getStore().loadData(assignment, true);
    }

    const assignedRulesGrid = new SM.Acl.AssignedRulesGrid({
      panel: this,
      title: `Assigned ACL`,
      flex: 1
    })

    function isTreeNodeInRulesGrid(node) {
      const candidateId = `${node.attributes.benchmarkId ?? 'undefined'}-${node.attributes.assetName ?? 'undefined'}-${node.attributes.label?.name ?? 'undefined'}`
      const record = assignedRulesGrid.store.getById(candidateId)
      return !!record
    }

    this.assignmentGrid = assignedRulesGrid

    const addBtnMenuItems = [
      {text: 'with Read/Write access', access: 'rw', handler: handleAddBtnItem},
      {text: 'with Read Only access', access: 'r', handler: handleAddBtnItem},
    ]
    if (this.accessLevel === 1) addBtnMenuItems.push({text: 'with No access', access: 'none', handler: handleAddBtnItem})
    const addBtn = new SM.Acl.ResourceAddBtn({
      tree: navTree,
      text: 'Assign Resource',
      grid: assignedRulesGrid,
      menu: new Ext.menu.Menu({
        items: addBtnMenuItems
      })
    })
    this.addButton = addBtn

    const removeBtn = new SM.Acl.ResourceRemoveBtn({
      tree: navTree,
      text: 'Remove Assignment ',
      grid: assignedRulesGrid
    })
    this.removeButton = removeBtn

    const buttonPanel = new Ext.Panel({
      bodyStyle: 'background-color:transparent;border:none',
      layout: {
        type: 'vbox',
        pack: 'center'//,
        //padding: "10 10 10 10"
      },
      items: [
        addBtn,
        removeBtn
      ]
    })

    const config = {
      bodyStyle: 'background:transparent;border:none',
      assignmentGrid: assignedRulesGrid,
      layout: 'hbox',
      anchor: '100% -130',
      layoutConfig: {
        align: 'stretch'
      },
      items: [ 
        navTree,
        buttonPanel,
        assignedRulesGrid
      ]
    }

    Ext.apply(this, Ext.apply(this.initialConfig, config))
    SM.Acl.Panel.superclass.initComponent.call(this)
  }
})

SM.Acl.showAccess = async function(collectionId, grantRecord) {
  try {
    let appwindow 
    let assignmentPanel = new SM.Acl.Panel({
        collectionId,
        accessLevel: grantRecord.accessLevel
    })

      /******************************************************/
      // Form window
      /******************************************************/
      appwindow = new Ext.Window({
        title: `Access Control List for ${grantRecord.title}`,
        cls: 'sm-dialog-window sm-round-panel',
        modal: true,
        hidden: true,
        width: 900,
        height:600,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:20px;',
        buttonAlign:'right',
        items: assignmentPanel,
        buttons: [
          {
            text: 'Cancel',
            handler: function(){
              appwindow.close();
            }
          },
          {
            text: 'Save',
            formBind: true,
            id: 'submit-button',
            handler: async function() {
              try {
                let values = assignmentPanel.assignmentGrid.getValue()
                let url, method
                url = `${STIGMAN.Env.apiBase}/collections/${collectionId}/grants/${grantRecord.grantTarget}/${grantRecord.grantTargetId}/access`
                method = 'PUT'
                await Ext.Ajax.requestPromise({
                  url: url,
                  method: method,
                  headers: { 'Content-Type': 'application/json;charset=utf-8' },
                  jsonData: values
                })      
              }
              catch (e) {
                SM.Error.handleError(e)
              }
              finally {
                appwindow.close()
              }
            }
          }
        ]
      })
      assignmentPanel.appwindow = appwindow
      appwindow.render(Ext.getBody())
      let apiAccess = await Ext.Ajax.requestPromise({
        responseType: 'json',
          url: `${STIGMAN.Env.apiBase}/collections/${collectionId}/grants/${grantRecord.grantTarget}/${grantRecord.grantTargetId}/access`,
          method: 'GET'
      })
      assignmentPanel.assignmentGrid.setValue(apiAccess.acl)
      assignmentPanel.assignmentGrid.setTitle(`Assigned access, default = ${apiAccess.defaultAccess}`)
              
      Ext.getBody().unmask();
      appwindow.show()
  }
  catch (e) {
      if(typeof e === 'object') {
          if (e instanceof Error) {
            e = JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
          }
          else {
            e = JSON.stringify(e);
          }
        }        
        SM.Error.handleError(e)
        Ext.getBody().unmask()
  }	
} //end showAssetProps
