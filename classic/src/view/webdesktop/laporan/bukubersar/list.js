Ext.define('Admin.view.webdesktop.laporan.bukubesar.list', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-laporan-bukubesar-list',
    controller: 'laporan-bukubesar',
    
    layout: 'fit',
    border: false,

    width: 900,
    height: 500,

    items: [{
        xtype: 'laporan-bukubesar-list'
    }]

});
