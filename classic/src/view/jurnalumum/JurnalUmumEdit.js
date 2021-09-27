Ext.define('Admin.view.jurnalumum.JurnalUmumEdit', {
    extend: 'Ext.form.Panel',
    xtype: 'jurnalumum-edit',

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
                                var me = this.up('jurnalumum-edit');
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
                                var me = this.up('jurnalumum-edit');
                                me.down('#jenis').focus(true, 10);
                            }
                        }
                    }
                }]
            }, 
            {
                xtype: 'combobox',
                name: 'jenis',
                itemId: 'jenis',
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
                        {id: 1, kode: 'D', nama: 'Debet'},
                        {id: 2, kode: 'K', nama: 'Kredit'}
                    ]
                }),
                valueField: 'nama',
                displayField: 'nama',
                typeAhead: true,
                queryMode: 'local',
                value: 'Debet',
                listeners: {
                    select: function(field, record) {
                        var me = this.up('jurnalumum-edit');
                        var rekeningheader = me.down('#rekeningheader');                                        
                        rekeningheader.setFieldLabel('Akun '+record.data['nama']);

                        var grid = me.down('jurnalumum-edit-detail');
                        grid.columnManager.columns[1].setText(record.data['nama']=='Debet'?'Akun Kredit':'Akun Debet');
                    },
                    specialkey: function(field, e){
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('jurnalumum-edit');
                            me.down('#rekeningheader').focus(true, 10);
                        }
                    }
                }
            },
            {
                xtype: 'combobox',
                name: 'rekeningheader',
                itemId: 'rekeningheader',
                fieldLabel: 'Akun Debet',
                store: {
                    type: 'akun-level-4'
                },
                valueField: 'kode_akun',
                displayField: 'display',
                typeAhead: true,
                queryMode: 'local',
                listeners: {  
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('jurnalumum-edit');
                            me.down('#jumlah').focus(true, 10);
                        }
                    }
                }       
            },
            {
                xtype: 'currencyfield',
                name: 'jumlah',
                itemId: 'jumlah',
                fieldStyle: 'text-align: right; background: none #F8F9F9;',
                fieldLabel: 'Jumlah',
                readOnly: true,
                value: 0,
                listeners: {
                    
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('jurnalumum-edit');
                            me.down('#uraian').focus(true, 10);
                        }
                    }
                }
            }],
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
                name: 'uraian',
                itemId: 'uraian',
                fieldLabel: 'Keterangan',
                allowBlank: true,
                flex: 1 /*,
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            var me = this.up('jurnalumum-edit');
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
        flex: 1,
        margin: '0 0 10 0',
        bodyStyle: 'background-color: #c5c5c5',
        bodyPadding: 1,
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        items: [{
            xtype: 'jurnalumum-edit-detail',
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
            url: './server/public/jurnalumum/getnobukti',
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);
                me.down('[name=nobukti]').setValue(json.nobukti);
                me.down('[name=nobukti]').focus(true, 10);
            }
        });
    }
});
