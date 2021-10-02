Ext.define('Admin.view.jurnalmemorial.EditDetail', {
    extend: 'Ext.grid.Panel',
    xtype: 'jurnalmemorial-edit-detail',

    cls: 'jurnalmemorial-grid',
    constructor: function(c) {
        var me = this;
        me.func = new Admin.view.currency();

        var decimalRender = function(value, p, record) {
            return me.func.currency(value);
        };
        
        var summaryRendererJumlah = function(value, p, record) {
            return '<B>'+me.func.currency(value)+'</B>';
        };
        
        var renderNo = function(value, p, record) {
            return me.store.indexOf(record)+1;
        };

        var tambahRecord = function(btn) {
            var store = me.getStore();
            var rowGridCount = store.getCount();
            
            me.addNew = true;
            store.insert(rowGridCount, {
                id: rowGridCount+1
            });
                
            me.rowEditor.startEdit(rowGridCount, 1);
            me.columns[1].getEditor(store.getAt(rowGridCount)).focus(true, 10);
        };
        
        var hapusRecord = function(btn) {
            var store = me.getStore();
            var selection = me.getView().getSelectionModel().getSelection()[0];
    
            if (selection) {
                var index = store.indexOf(selection);
                store.remove(selection);
                
                for(var i=index; i<store.getCount(); i++) {
                    store.getAt(i).set('id', i+1);
                    store.getAt(i).commit();
                }          
            }
        };
    
        var editRecord = function(btn) {
            var store = me.getStore();
            var selection = me.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                var row = store.indexOf(selection);
                me.rowEditor.startEdit(row, 1);
                me.columns[1].getEditor(selection).focus(true, 10);
            }
        };

        var akunSelect = function(f, record) {
            var store = me.getStore();
            var rec = me.recordSelected;
            var index = store.indexOf(rec);
            
            store.getAt(index).set('kode_akun', record.data['kode_akun']); //kode_akun
        };

        me.rowEditor = Ext.create('Ext.grid.plugin.RowEditing', {
            autoCancel: false,
            hideButtons: function() {
                var me = this;
                
                me.editor.floatingButtons.setStyle('visibility', 'hidden');
            },

            listeners: {
                scope: me,
                canceledit: function(f, e) {
                    if(me.addNew) {
                        me.store.remove(e.record);
                    }
                    
                    me.addNew = false;
                    me.recordSelected = undefined;

                    var tambah = me.down('#tambah');
                    setTimeout(function() {
                        tambah.setDisabled(false);
                    }, 100);
                },

                beforeedit: function(f, e) {
                    if(me.saved) return false;

                    f.hideButtons();
                    me.recordSelected = e.record;
                    me.validateEdit = false;
                    var tambah = me.down('#tambah');
                    var hapus = me.down('#hapus');
                    var edit = me.down('#edit');
                    
                    setTimeout(function() {
                        tambah.setDisabled(true);
                        hapus.setDisabled(true);
                        edit.setDisabled(true);                  
                    }, 100);
                },

                afteredit: function(f, e) {
                    e.record.commit();
                    
                    me.addNew = false;
                    me.recordSelected = undefined;
                    
                    var tambah = me.down('#tambah');
                    var store = me.getStore();
                    var row = store.indexOf(e.record);

                    setTimeout(function() {
                        tambah.setDisabled(false);
                        if(row==store.getCount()-1) {
                            tambahRecord();
                        } else {
                            me.rowEditor.startEdit(row+1, 1);
                            me.columns[1].getEditor(me.recordSelected).focus(true, 10);
                        }
                    }, 10);
                },

                validateedit: function(editor, e) {
                    return me.validateEdit;
                }                    
            }
        });       
        
        Ext.apply(c, {

            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'button',
                    itemId: 'tambah',
                    text : 'Tambah [<B>INS</B>]',
                    iconCls:'x-fa fa-plus',
                    listeners: {
                        click: tambahRecord
                    }
                }, {
                    xtype: 'button',
                    itemId: 'hapus',
                    text : 'Hapus [<B>DEL</B>]',
                    iconCls:'x-fa fa-trash-alt',
                    listeners: {
                        click: hapusRecord
                    },
                    disabled: true
                }, {
                    xtype: 'button',
                    itemId: 'edit',
                    text : 'Edit [<B>F2</B>]',
                    iconCls:'x-fa fa-pencil-alt',
                    listeners: {
                        click: editRecord
                    },
                    disabled: true
                }]
            }],

            plugins: me.rowEditor,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            store: Ext.create('Ext.data.Store', {
                
                fields: [{
                    type: 'int',
                    name: 'id'
                }, 
                {
                    type: 'string',
                    name: 'kode_akun'
                },
                {
                    type: 'string',
                    name: 'detail_akun'
                },
                {
                    type: 'string',
                    name: 'keterangan'
                },
                {
                    type: 'int',
                    name: 'debet'
                },
                {
                    type: 'int',
                    name: 'kredit'
                }],
                
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            }),

            columns: [
                //--- [0]
                {xtype: 'gridcolumn', cls: 'content-column', text: 'No.', width: 55, menuDisabled: true, sortable: false, align: 'center', renderer: renderNo, 
                editor: {
                    xtype: 'displayfield',
                    fieldStyle: 'text-align: center;'
                }},
                
                //--- [1]
                {xtype: 'gridcolumn', cls: 'content-column', text: 'Kode Akun', flex: 1, menuDisabled: true, sortable: false, align: 'left', dataIndex: 'detail_akun', 
                    editor: {
                        xtype: 'combobox',
                        store: {
                            type: 'akun-level-4'
                        },
                        typeAhead: true,
                        queryMode: 'local',
                        valueField: 'display',
                        displayField: 'display',
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    me.columns[2].getEditor(me.recordSelected).focus(true, 10);
                                }
                            },
                            select: akunSelect
                        }                    
                    }
                },

                //--- [2]
                {xtype: 'gridcolumn', cls: 'content-column', text: 'Keterangan', flex: 1, menuDisabled: true, sortable: false, align: 'left',  dataIndex: 'keterangan', 
                    editor: {
                        xtype: 'textfield',
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    me.columns[3].getEditor(me.recordSelected).focus(true, 10);
                                }
                            }
                        }
                    },
                    cellWrap: true
                },

                //--- [3]
                {xtype: 'gridcolumn', cls: 'content-column', text: 'Debet', flex: 0.5, menuDisabled: true, sortable: false, align: 'right', dataIndex: 'debet', renderer: decimalRender,
                    editor: {
                        xtype: 'currencyfield',
                        fieldStyle: 'text-align: right;',
                        listeners: {
                            specialkey: function(field, e){
                                if (e.getKey() == e.ENTER) {
                                    me.columns[4].getEditor(me.recordSelected).focus(true, 10);
                                }
                            },
                            change: function() {
                                me.columns[4].getEditor(me.recordSelected).setValue(0);
                            }
                        }
                    },
                    summaryType: 'sum',
                    summaryRenderer: summaryRendererJumlah
                },

                //--- [4]
                {xtype: 'gridcolumn', cls: 'content-column', text: 'Kredit', flex: 0.5, menuDisabled: true, sortable: false, align: 'right', dataIndex: 'kredit', renderer: decimalRender,
                    editor: {
                        xtype: 'currencyfield',
                        fieldStyle: 'text-align: right;',
                        listeners: {
                            specialkey: function(field, e){
                                me.validateEdit = (e.getKey() == e.ENTER);                                
                            },
                            change: function() {
                                me.columns[3].getEditor(me.recordSelected).setValue(0);
                            }
                        }
                    },
                    summaryType: 'sum',
                    summaryRenderer: summaryRendererJumlah
                }
            ],

            listeners: {
                selectionchange: function(view, records) {
                    var tambah = me.down('#tambah');
                    var hapus = me.down('#hapus');
                    var edit = me.down('#edit');
                    
                    var getValue = tambah.disabled || !records.length;
                    edit.setDisabled(getValue);
                    hapus.setDisabled(getValue);
                },
                keydown: {
                    element: 'el',
                    fn: function (eventObject, htmlElement, object, options) {
                        if (eventObject.keyCode == 45) {
                            tambahRecord();
                        } else
                        if (eventObject.keyCode == 46) {
                            hapusRecord();
                        } else 
                        if (eventObject.keyCode == 113) {
                            editRecord();
                        }
                    }
                }
            }
        });

        this.callParent(arguments);
    },
    
    getDetail: function() {
        var me = this;
        var str = '';
        me.total_debet = 0;
        me.total_kredit = 0;

        for(var row =0;row<me.getStore().getCount();row++) {
            var rec = me.getStore().getAt(row);

            me.total_debet+=rec.data['debet'];
            me.total_kredit+=rec.data['kredit'];

            str += (str!=''?';':'') +
                rec.data['kode_akun'] + ',' +
                rec.data['detail_akun'] + ',' + 
                rec.data['keterangan'] + ',' +
                rec.data['debet'] + ',' +
                rec.data['kredit'];
        }

        //console.log(str);
        return str;
    }
});