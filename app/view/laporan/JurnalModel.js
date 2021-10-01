Ext.define('Admin.view.laporan.JurnalModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.laporan',
    
    stores: {
        results: {
            type: 'laporan-jurnal'
        }
    }

});
