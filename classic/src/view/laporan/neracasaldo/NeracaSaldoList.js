Ext.define('Admin.view.laporan.neracasaldo.NeracaSaldoList',{
    extend: 'Ext.container.Container',
    xtype: 'laporan-neracasaldo-list',

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
        var to_date = year + '-' + (month<10 ? '0' : '') + month + '-' + (day<10 ? '0' : '') + day;
        
        var dataTreeStore = Ext.create('Ext.data.TreeStore', {
            model: 'Admin.model.laporan.NeracaSaldo',
            proxy: {
                type: 'ajax',
                url: './server/public/laporan/neracasaldo',
                extraParams: {
                    'from': from_date,
                    'to': to_date
                }
            },
            
            autoLoad: true
        });

        var renderAkun = function(value, p, record) {            
            return record.data['kode_akun']+ ' - '+ record.data['nama_akun'];
        };

        Ext.apply(c, {
            items: [{
                xtype: 'treepanel',
                cls: 'laporan-neracasaldo-grid',
                store: dataTreeStore,
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
                                dataTreeStore.load({
                                    params: {
                                        'from': from_date,
                                        'to': to_date
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
                                dataTreeStore.load({
                                    params: {
                                        'from': from_date,
                                        'to': to_date
                                    }
                                });
                            }
                        }
                    }, '-', {
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
                
                
                columnLines: true,
                useArrows: true,
                rootVisible: false,
                animate : true,
                columns: [{
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'center',  
                    dataIndex: 'NO',
                    text: 'No.', 
                    width: 70 
                },
                {
                    xtype: 'treecolumn', 
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'left',  
                    renderer: renderAkun,
                    text: 'Nama Akun', 
                    flex: 1.5
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'right', 
                    dataIndex: 'SALDOAWAL',
                    text: 'Saldo Awal', 
                    flex: 0.5, 
                    renderer: function(value, p, record) {

                        if(record.data['level']==4) {
                            if(value<0) {
                                return '('+func.currency(value)+')';
                            } else {
                                return func.currency(value);
                            }
                        } else {
                            return '';
                        }
                    }
                },
                {
                    xtype: 'gridcolumn',
                    cls: 'content-column',
                    menuDisabled: true,
                    align: 'right', 
                    dataIndex: 'DEBET',
                    text: 'Total Debet', 
                    flex: 0.5, 
                    renderer: function(value, p, record) {

                        if(record.data['level']==4) {
                            if(value<0) {
                                return '('+func.currency(value)+')';
                            } else {
                                return func.currency(value);
                            }
                        } else {
                            return '';
                        }
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
                    dataIndex: 'KREDIT',
                    text: 'Total Kredit', 
                    flex: 0.5, 
                    renderer: function(value, p, record) {
                        if(record.data['level']==4) {
                            if(value<0) {
                                return '('+func.currency(value)+')';
                            } else {
                                return func.currency(value);
                            }
                        } else {
                            return '';
                        }
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
                    dataIndex: 'SALDOAKHIR',
                    text: 'Saldo Akhir', 
                    flex: 0.5, 
                    renderer: function(value, p, record) {

                        if(record.data['level']==4) {
                            if(value<0) {
                                return '<b>('+func.currency(value)+')</b>';
                            } else {
                                return '<b>'+func.currency(value)+'</b>';
                            }
                        } else {
                            return '';
                        }
                    }
                }],
                
                features: [{
                    ftype: 'summary',
                    dock: 'bottom'
                }]
            }]
        });

        this.callParent(arguments);
    }
});