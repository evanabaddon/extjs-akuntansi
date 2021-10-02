Ext.define('Admin.view.laporan.bukubesar.BukuBesarList',{
    extend: 'Ext.container.Container',
    xtype: 'laporan-bukubesar-list',

    requires: [
        'Ext.data.summary.Sum',
        'Ext.grid.feature.Summary'
    ],

    cls: 'shadow',
    layout: 'fit',

    constructor: function(c) {
        
        var func  = new Admin.view.currency();
        var d     = new Date();
        var year  = d.getFullYear();
        var month = d.getMonth()+1;
        var day   = d.getDate();

        var from_date = year + '-' + (month<10 ? '0' : '') + month + '-01';
        var to_date   = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        var kode_akun = '';
        
        var dataStore = Ext.create('Ext.data.Store', {
            model: 'Admin.model.laporan.BukuBesar',
            proxy: {
                type: 'ajax',
                url: './server/public/laporan/bukubesar',
                reader: {
                    type: 'json',
                    rootProperty: 'data'
                },
                extraParams: {
                    'from': from_date,
                    'to': to_date,
                    'kode_akun': kode_akun
                }
            },
            
            groupField: 'kode_nama_akun',

            autoLoad: true
        });

        var renderAkun = function(value, p, record) {            
            return value+ ' - '+ record.data['nama_akun'];
        };

        Ext.apply(c, {
            items: [{
                xtype: 'gridpanel',
                cls: 'laporan-bukubesar-grid',
                store: dataStore,
                dockedItems: [{
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [{
                        xtype: 'datefield',
                        fieldLabel: 'Periode',
                        labelWidth: 60,
                        width: 185,
                        value: from_date,
                        format: 'd-m-Y',            
                        submitFormat: 'Y-m-d',
                        listeners: {
                            change: function(field) {
                                from_date = this.getSubmitValue();
                                dataStore.load({
                                    params: {
                                        'from': from_date,
                                        'to': to_date,
                                        'kode_akun': kode_akun
                                    }
                                });
                            }
                        }
                    }, 
                    {
                        xtype: 'datefield',
                        fieldLabel: 's/d',
                        labelStyle: 'text-align: center;',
                        labelSeparator: '&nbsp;',
                        labelWidth: 25,
                        width: 150,
                        value: to_date,
                        format: 'd-m-Y',
                        submitFormat: 'Y-m-d',
                        listeners: {
                            change: function(field) {
                                to_date = this.getSubmitValue();
                                dataStore.load({
                                    params: {
                                        'from': from_date,
                                        'to': to_date,
                                        'kode_akun': kode_akun
                                    }
                                });
                            }
                        }
                    }, '-', 
                    {
                        xtype: 'combobox',
                        itemId: 'kode_akun',
                        labelWidth: 75,
                        fieldLabel: 'Kode Akun',
                        flex: 1,
                        store: {
                            type: 'akun-level-4'
                        },
                        typeAhead: true,
                        queryMode: 'local',
                        valueField: 'kode_akun',
                        displayField: 'display',
                        listeners: {
                            select: function(combobox) {
                                kode_akun = this.getSubmitValue();
                                dataStore.load({
                                    params: {
                                        'from': from_date,
                                        'to': to_date,
                                        'kode_akun': kode_akun
                                    }
                                });
                            }                        
                        }                    
                    },
                    {
                        xtype: 'button',
                        text:'All',
                        iconCls:'x-fa fa-trash-alt',
                        handler: function(button) {
                            combobox = button.up('laporan-bukubesar-list').down('#kode_akun');
                            combobox.reset();
                            combobox.fireEvent('select', combobox);
                        }
                    }
                    , '-', {
                        ui: 'default-toolbar',
                        xtype: 'button',
                        cls: 'dock-tab-btn',
                        text: 'Export To ...',
                        menu: {
                            defaults: {
                                handler: 'exportTo'
                            },
                            items: [{
                                text: 'Excel xlsx',
                                cfg: {
                                    type: 'excel07',
                                    ext: 'xlsx'
                                }
                            }, {
                                text: 'Excel xlsx (include groups)',
                                cfg: {
                                    type: 'excel07',
                                    ext: 'xlsx',
                                    includeGroups: true,
                                    includeSummary: true
                                }
                            }, {
                                text: 'Excel xml',
                                cfg: {
                                    type: 'excel03',
                                    ext: 'xml'
                                }
                            }, {
                                text: 'Excel xml (include groups)',
                                cfg: {
                                    includeGroups: true,
                                    includeSummary: true
                                }
                            }, {
                                text: 'CSV',
                                cfg: {
                                    type: 'csv'
                                }
                            }, {
                                text: 'TSV',
                                cfg: {
                                    type: 'tsv',
                                    ext: 'csv'
                                }
                            }, {
                                text: 'HTML',
                                cfg: {
                                    type: 'html'
                                }
                            }, {
                                text: 'HTML (include groups)',
                                cfg: {
                                    type: 'html',
                                    includeGroups: true,
                                    includeSummary: true
                                }
                            }]
                        }
                    }]
                }],
                
                columns: [{
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'center',
                    dataIndex: 'NO',
                    text: 'No.',
                    flex: 0.2
                }, 
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'left',
                    dataIndex: 'TGL',
                    text: 'Tanggal',
                    flex: 0.4
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'left',
                    dataIndex: 'nobukti',
                    text: 'No. Bukti',
                    flex: 0.5
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'left',
                    dataIndex: 'keterangan',
                    text: 'Keterangan',
                    flex: 1,
                    cellWrap: true
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'right',
                    dataIndex: 'debet',
                    text: 'Debet',
                    flex: 0.5,
                    renderer: function(value, p, record) {
                        return func.currency(value);
                    },
                    summaryRenderer: function(value, p, record) {
                        return '<b>'+func.currency(value)+'</b>';
                    },
                    summaryType: 'sum'
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'right',
                    dataIndex: 'kredit',
                    text: 'Kredit',
                    flex: 0.5,
                    renderer: function(value, p, record) {
                        return func.currency(value);
                    },
                    summaryRenderer: function(value, p, record) {
                        return '<b>'+func.currency(value)+'</b>';
                    },
                    summaryType: 'sum'
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'right',
                    dataIndex: 'saldo_akhir',
                    text: 'Saldo',
                    flex: 0.5,
                    renderer: function(value, p, record) {
                        return func.currency(value);
                    },
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return '<b>'+func.currency(value)+'</b>';
                    },
                    summaryType: function(records, values) {
                        var length = records.length,
                            record = records[length-1],
                            total  = record.get('saldo_akhir');
                                
                        return total;                        
                    }
                }],

                features: [{
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}',
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                }]
            }]
        });

        this.callParent(arguments);
    }
});