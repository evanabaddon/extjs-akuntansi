Ext.define('Admin.view.webdesktop.laporan.jurnal.list', {
    extend: 'Ext.window.Window',
    xtype: 'webdesktop-laporan-jurnal-list',
    controller: 'laporan-jurnal',
    
    layout: 'fit',
    border: false,

    width: 900,
    height: 500,

    items: [{
        xtype: 'laporan-jurnal-list'
    }]

});
