Ext.define('Admin.model.laporan.NeracaSaldo', {
    extend: 'Admin.model.Base',

    fields: [
        {
            type: 'auto',
            name: 'id'
        },
        {
            type: 'int',
            name: 'level'
        },
        {
            type: 'int',
            name: 'NO'
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
            name: 'tipe'
        },
        {
            type: 'string',
            name: 'saldonormal'
        },
        
        {
            type: 'int',
            name: 'SALDOAWAL'
        },
        {
            type: 'int',
            name: 'DEBET'
        },
        {
            type: 'int',
            name: 'KREDIT'
        },
        {
            type: 'int',
            name: 'SALDOAKHIR'
        }
    ]
});