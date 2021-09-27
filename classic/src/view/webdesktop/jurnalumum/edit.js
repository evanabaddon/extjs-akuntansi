Ext.define('Admin.view.webdesktop.jurnalumum.edit', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-jurnalumum-edit',
    controller: 'jurnalumum',
    
    layout: 'fit',
    border: false,
    
    width: 900,
    height: 600,

    items: [{
        xtype: 'jurnalumum-edit'
    }]
});