Ext.define('Admin.view.webdesktop.jurnalmemorial.list', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-jurnalmemorial-list',
    controller: 'jurnalmemorial',
    
    layout: 'fit',
    border: false,

    width: 950,
    height: 500,

    items: [{
        xtype: 'jurnalmemorial-list'
    }]
});
