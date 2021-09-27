Ext.define('Admin.view.jurnalumum.JurnalUmum', {
    extend: 'Ext.container.Container',
    xtype: 'jurnalumum',
    controller: 'jurnalumum',
    
    layout: {
        type: 'hbox',
        align: 'stretch'
    },

    margin: '20 0 0 20',

    items: [
        {
            xtype: 'container',
            itemId: 'contentPanel',
            margin: '0 20 20 0',
            flex: 1,
            layout: {
                type : 'anchor',
                anchor : '100%'
            }
        }
    ]
});
