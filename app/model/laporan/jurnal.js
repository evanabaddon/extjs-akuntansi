Ext.define('Admin.model.laporan.Jurnal', {
    extend: 'Admin.model.Base',

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'nobukti'
        },
        {
            type: 'string',
            name: 'tanggal'
        },
        {
            type: 'string',
            name: 'kode_akun'
        },
        {
            type: 'string',
            name: 'nama_akun'
        },
        {
            type: 'string',
            name: 'keterangan'
        },
        {
            type: 'int',
            name: 'debet'
        },
        {
            type: 'int',
            name: 'kredit'
        }
    ]
});