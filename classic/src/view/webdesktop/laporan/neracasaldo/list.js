Ext.define('Admin.view.webdesktop.laporan.neracasaldo.list', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-laporan-neracasaldo-list',
    controller: 'laporan-neracasaldo',
    
    layout: 'fit',
    border: false,

    width: 900,
    height: 500,

    items: [{
        xtype: 'laporan-neracasaldo-list'
    }]

});
