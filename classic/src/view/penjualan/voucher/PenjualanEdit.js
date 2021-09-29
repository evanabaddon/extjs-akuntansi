Ext.define('Admin.view.penjualan.voucher.PenjualanEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'penjualan-voucher-edit',

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
                    name: 'notrx',
                    itemId:'notrx',
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
                                var me = this.up('penjualan-voucher-edit');
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
                    flex: 0.4,
                    listeners: {
                        specialkey: function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                var me = this.up('penjualan-voucher-edit');
                                me.down('#customer').focus(true, 10);
                            }
                        }
                    }
                }]
            }, 
            {
                xtype: 'combobox',
                name: 'id_customer',
                itemId: 'customer',
                fieldLabel: 'Customer',
                store: {
                    type: 'customer',
                    autoLoad: true
                },
                valueField: 'id',
                displayField: 'nama',
                typeAhead: true,
                queryMode: 'local',
                listeners: {
                    
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('penjualan-voucher-edit');
                            me.down('#jenistrx').focus(true, 10);
                        }
                    }
                }       
            }, 
            {
                xtype: 'combobox',
                name: 'jenistrx',
                itemId: 'jenistrx',
                fieldLabel: 'Jenis Transaksi',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            type: 'int',
                            name: 'id'
                        },
                        {
                            type: 'string',
                            name: 'kode'
                        },
                        {
                            type: 'string',
                            name: 'nama'
                        }
                    ],
                    data: [
                        {id: 1, kode: 'C', nama: 'Cash'},
                        {id: 2, kode: 'K', nama: 'Kredit'}
                    ]
                }),
                valueField: 'nama',
                displayField: 'nama',
                typeAhead: true,
                queryMode: 'local',
                value: 'Kredit',
                listeners: {
                    select: function(field, record) {
                        var me = this.up('penjualan-voucher-edit');
                        var uangmuka = me.down('#uangmuka');                                        
                        
                        uangmuka.setDisabled(record.data['nama']=='Cash');
                        if(record.data['nama']=='Cash') {
                            uangmuka.setValue(0);
                        }

                    },
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('penjualan-voucher-edit');
                            me.down('#keterangan').focus(true, 10);
                        }
                    }
                }
            }/*,
            {
                xtype: 'textfield',
                name: 'no_so',
                itemId:'no_so',
                fieldLabel: 'No. SO',
                allowBlank: true,
                listeners: {
                    
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('penjualan-voucher-edit');
                            me.down('#keterangan').focus(true, 10);
                        }
                    }
                }
            }*/],
            flex: 0.55,
            margin: '0 10 0 0'
        },
        {
            xtype: 'panel',
            itemId: 'panel-header-right',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                msgTarget: 'side',
                labelAlign: 'top',
                allowBlank: false
            },
            items: [{
                xtype: 'textareafield',
                name: 'keterangan',
                itemId: 'keterangan',
                fieldLabel: 'Keterangan',
                allowBlank: true,
                flex: 1 /*,
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('penjualan-voucher-edit');
                            var btnTambah = me.down('#tambah');
                            btnTambah.fireEvent('click', btnTambah);
                        }
                    }
                }*/
            }],
            flex: 0.45,
            margin: '0 0 0 10'
        }]               
    },
    {
        xtype: 'panel',
        itemId: 'panel-detail',
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'penjualan-voucher-edit-detail',
            flex: 1
        }],
        flex: 1,
        bodyStyle: 'background-color: #c5c5c5',
        bodyPadding: 1,
        margin: '0 0 10 0'
    },
    {
        xtype: 'panel',
        itemId: 'panel-footer',
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'panel',
            itemId: 'panel-footer-left',
            flex: 0.7
        }, {
            xtype: 'panel',
            itemId: 'panel-footer-right',
            flex: 0.3,
            
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            defaults: {
                xtype: 'currencyfield',
                labelWidth: 90,
                margin: '5 0 0 0',
                readOnly: true,
                fieldStyle: 'font-weight: bold; text-align: right; background: none #F8F9F9;',
                labelStyle: 'font-weight: bold;',
                value: 0
            },
            items: [{
                name: 'subtotal',
                itemId:'subtotal',
                fieldLabel: 'Sub Total'
            }, 
            {
                name: 'totalpajak',
                itemId:'totalpajak',
                fieldLabel: 'Pajak'
            },
            {
                name: 'uangmuka',
                itemId:'uangmuka',
                fieldLabel: 'Uang Muka',
                readOnly: false,
                fieldStyle: 'font-weight: bold; text-align: right; background: none #fff;',
                listeners: {
                    change: function(field) {
                        var me = this.up('penjualan-voucher-edit');
                        var subtotal = eval(me.down('#subtotal').getSubmitValue());
                        var totalpajak = eval(me.down('#totalpajak').getSubmitValue());
                        var uangmuka = eval(this.getSubmitValue());

                        me.down('#total').setValue(subtotal+totalpajak-uangmuka);
                    }
                }
            },
            {
                name: 'total',
                itemId:'total',
                fieldLabel: 'Total'
            }]
        }],
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

    setNoTrx: function(kode) {
        var me = this;

        Ext.Ajax.request({
            method:'GET',
            url: './server/public/penjualan/getnotrx',
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                me.down('[name=notrx]').setValue(json.notrx);
                me.down('[name=notrx]').focus(true, 10);
            }
        });
    }
});
