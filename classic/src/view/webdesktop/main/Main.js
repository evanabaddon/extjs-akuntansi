Ext.define('Admin.view.webdesktop.main.Main', {
    extend: 'Ext.container.Viewport',
    xtype: 'webdesktopmain',

    windows: new Ext.util.MixedCollection(),
    cls: 'webdesktop-main',
    autoShow: true,

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    items: [{
        xtype: 'xdataview',
        listeners: {
            select: 'openModul'
        },
        flex: 1
    },
    {
        xtype: 'xtaskbar'
    }]

});
