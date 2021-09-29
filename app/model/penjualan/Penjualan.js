Ext.define('Admin.model.penjualan.Penjualan', {
    extend: 'Admin.model.Base',

    fields: [
        {
            type: 'int',
            name: 'id'
        },
        {
            type: 'string',
            name: 'notrx'
        },
        {
            type: 'string',
            name: 'tanggal'
        },
        {
            type: 'int',
            name: 'id_customer'
        },
        {
            type: 'string',
            name: 'customer'
        },
        {
            type: 'string',
            name: 'keterangan'
        },  
        {
            type: 'string',
            name: 'no_so'
        },
        {
            type: 'string',
            name: 'jenis_trx' //barang jasa or voucher
        },
        {
            type: 'string',
            name: 'jenistrx'   //cash or kredit
        },
        {
            type: 'int',
            name: 'subtotal'
        },
        {
            type: 'int',
            name: 'totalpajak'
        },
        {
            type: 'int',
            name: 'uangmuka'
        },
        {
            type: 'int',
            name: 'totaldiskon'
        },
        {
            type: 'int',
            name: 'total'
        },
        {
            type: 'bool',
            name: 'draft'
        }
    ]
});