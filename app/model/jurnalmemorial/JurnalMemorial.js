Ext.define('Admin.model.jurnalmemorial.JurnalMemorial', {
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
            type: 'string',
            name: 'keterangan'
        },
        {
            type: 'int',
            name: 'total'
        }
    ]
});