Ext.define('Admin.view.jurnalmemorial.JurnalMemorialEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'jurnalmemorial-edit',

    requires: [
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.form.field.ComboBox',
        'Ext.form.field.TextArea'
    ],
    
    layout: {
        type: 'vbox',
        align: 'stretch'
    },
    bodyPadding: 20,

    scrollable: true,
    
    listeners: {
        afterrender: 'onLoadData'
    },

    items: [{
        xtype: 'panel',
        itemId: 'panel-header',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            itemId: 'panel-header-left',
            layout: 'anchor',
            defaults: {
                anchor: '100%',
                msgTarget: 'side',
                labelAlign: 'left',
                allowBlank: false,
                labelWidth: 100
            },
            items: [{
                xtype: 'fieldcontainer',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [{
                    xtype: 'textfield',
                    name: 'nobukti',
                    itemId:'nobukti',
                    fieldLabel: 'No. Transaksi',
                    msgTarget: 'side',
                    labelAlign: 'left',
                    allowBlank: false,
                    labelWidth: 100,
                    flex: 0.6,
                    margin: '0 10 0 0',
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                var me = this.up('jurnalmemorial-edit');
                                me.down('#tanggal').focus(true, 10);
                            }
                        }
                    }
                }, {
                    xtype: 'datefield',
                    name: 'tanggal',
                    itemId: 'tanggal',
                    fieldLabel: 'Tanggal',
                    format: 'd-m-Y',
                    submitFormat: 'Y-m-d',
                    msgTarget: 'side',
                    labelAlign: 'left',
                    allowBlank: false,
                    value: new Date(),
                    labelWidth: 60,
                    flex: 0.42,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                var me = this.up('jurnalmemorial-edit');
                                me.down('#uraian').focus(true, 10);
                            }
                        }
                    }
                }]
            },
            {
                xtype: 'textareafield',
                name: 'uraian',
                itemId: 'uraian',
                fieldLabel: 'Keterangan',
                labelAlign: 'top',
                allowBlank: true,
                flex: 1 /*,
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('jurnalmemorial-edit');
                            var btnTambah = me.down('#tambah');
                            btnTambah.fireEvent('click', btnTambah);
                        }
                    }
                }*/
            }],
            flex: 0.55,
            margin: '0 10 0 0'
        },
        {
            xtype: 'panel',
            itemId: 'panel-header-right',
            flex: 0.45,
            margin: '0 0 0 10'
        }]               
    },
    {
        xtype: 'panel',
        itemId: 'panel-detail',
        flex: 1,
        margin: '0 0 10 0',
        bodyStyle: 'background-color: #c5c5c5',
        bodyPadding: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'jurnalmemorial-edit-detail',
            flex: 1
        }]
    }],

    bbar: {
        overflowHandler: 'menu',
        items: [
            '->',
            {
                xtype: 'button',
                width: 80,
                ui: 'soft-red',
                text: 'Batal',
                handler: 'onCancelButtonClick'
            },
            {
                xtype: 'button',
                width: 80,
                ui: 'soft-green',
                text: 'Simpan',
                handler: 'onSaveButtonClick'
            }
        ]
    },

    setNobukti: function(kode) {
        var me = this;

        Ext.Ajax.request({
            method:'GET',
            url: './server/public/jurnalmemorial/getnobukti',
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                me.down('[name=nobukti]').setValue(json.nobukti);
                me.down('[name=nobukti]').focus(true, 10);
            }
        });
    }
});
