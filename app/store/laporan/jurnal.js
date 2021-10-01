Ext.define('Admin.store.laporan.Jurnal', {
    extend: 'Ext.data.Store',

    alias: 'store.laporan-jurnal',

    model: 'Admin.model.laporan.Jurnal',

    proxy: {
        type: 'ajax',
        url: './server/public/laporan/jurnal',
        reader: {
            type: 'json',
            rootProperty: 'data'
        }
    },

    autoLoad: true

});
