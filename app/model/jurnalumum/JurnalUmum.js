Ext.define('Admin.model.jurnalumum.JurnalUmum', {
    extend: 'Admin.model.Base',

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'tanggal'
        },
        {
            type: 'string',
            name: 'nobukti'
        },
        {
            type: 'int',
            name: 'kd'
        },
        {
            type: 'int',
            name: 'kk'
        },
        {
            type: 'string',
            name: 'keterangan'
        },
        {
            type: 'int',
            name: 'jumlah'
        },
        {
            type: 'string',
            name: 'jenis'
        },
        {
            type: 'string',
            name: 'tipe_jurnal'
        }
    ]
});