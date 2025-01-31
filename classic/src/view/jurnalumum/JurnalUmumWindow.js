Ext.define('Admin.view.jurnalumum.JurnalUmumWindow', {
    extend: 'Ext.window.Window',
    alias: 'widget.jurnalumum-window',

    autoShow: true,
    modal: true,

    layout: 'fit',

    width: 200,
    height: 200,

    afterRender: function () {
        var me = this;

        me.callParent(arguments);

        me.syncSize();

        // Since we want to always be a %age of the viewport, we have to watch for
        // resize events.
        Ext.on(me.resizeListeners = {
            resize: me.onViewportResize,
            scope: me,
            buffer: 50
        });
    },

    doDestroy: function () {
        Ext.un(this.resizeListeners);

        this.callParent();
    },

    onViewportResize: function () {
        this.syncSize();
    },

    syncSize: function () {
        var me     = this,
            width  = me.width==undefined?Ext.Element.getViewportWidth():me.width,
            height =  me.height==undefined?Ext.Element.getViewportHeight():me.height;

        // We use percentage sizes so we'll never overflow the screen (potentially
        // clipping buttons and locking the user in to the dialog).

        this.setSize(Math.floor(width * 0.9), Math.floor(height * 0.9));
        this.setXY([ Math.floor(width * 0.05), Math.floor(height * 0.05) ]);
    }
});
