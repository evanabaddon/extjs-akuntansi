Ext.define('Admin.view.webdesktop.jurnalmemorial.edit', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-jurnalmemorial-edit',
    controller: 'jurnalmemorial',
    
    layout: 'fit',
    border: false,
    
    width: 900,
    height: 600,

    items: [{
        xtype: 'jurnalmemorial-edit'
    }]
});