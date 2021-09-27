Ext.define('Admin.view.webdesktop.jurnalumum.list', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-jurnalumum-list',
    controller: 'jurnalumum',
    
    layout: 'fit',
    border: false,

    width: 950,
    height: 500,

    items: [{
        xtype: 'jurnalumum-list'
    }]
});
