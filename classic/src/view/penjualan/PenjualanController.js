Ext.define('Admin.view.penjualan.PenjualanController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.penjualan',

    init: function() {
        var me = this;
        var viewType = me.getView().viewType;
        if(viewType && viewType!='webdesktop') {
            console.log('penjualan-init');
            this.setCurrentView(viewType);
        }
    },

    setCurrentView: function(view, params) {
        var contentPanel = this.getView().down('#contentPanel');

        //We skip rendering for the following scenarios:
        // * There is no contentPanel
        // * view xtype is not specified
        // * current view is the same
        if(!contentPanel || view === '' || (contentPanel.down() && contentPanel.down().xtype === view)){
            return false;
        }

        if (params && params.openWindow) {
            var cfg = Ext.apply({
                xtype: 'penjualan-window',
                items: [
                    Ext.apply({
                        xtype: view
                    }, params.targetCfg)
                ]
            }, params.windowCfg);

            Ext.create(cfg);
        } else {
            Ext.suspendLayouts();

            contentPanel.removeAll(true);
            contentPanel.add(
                Ext.apply({
                    xtype: view
                }, params)
            );

            Ext.resumeLayouts(true);
        }
    },

    onSelectionChange: function(sm, selections) {
        var grid         = this.getView().down('gridpanel'),
            refs         = this.getReferences(),
            delBtn       = refs.deleteButton,
            edtBtn       = refs.editButton,
            idSelect     = '',
            recordSelect = null;

        for(var i=0; i<sm.getSelection().length; i++) {
            idSelect+=(idSelect!=''?',':'') + sm.getSelection()[i].data['id'];
        }

        if(sm.getSelection().length==1) {
            recordSelect = sm.getSelection()[0];
        }

        delBtn.setDisabled(selections.length == 0);
        edtBtn.setDisabled(selections.length != 1);
        grid.idSelect = idSelect;
    },

    onAddButtonClick: function(btn) {
        var win = this.getView();
        var viewType = win.viewType;
        var gridpanel = win.down('gridpanel'); 

        if(viewType=='webdesktop') {   
            var params = {
                xtype: 'webdesktop-penjualan-edit',
                title: 'Penjualan Baru',
                modulId: 'penjualan-add',
                modal: true,
                constrain: true,
                grid: gridpanel
            };

            win.cUtama.showWindow(win.tab, Ext.create(params));
        } else {
            this.setCurrentView('penjualan-edit', {
                openWindow: true, // Let the controller know that we want this component in the window,
                targetCfg: {
                    //put any extra configs for your view here
                    saveUrl: 'insert',
                    grid: gridpanel
                },
                windowCfg: {
                    // Any configs that you would like to apply for window popup goes here
                    title: 'Tambah Penjualan',
                    width: 450,
                    height: 550
                }
            });
        }
    },
    
    onEditButtonClick: function(btn) {
        var win = this.getView();
        var viewType = win.viewType;
        var gridpanel = win.down('gridpanel'); 

        if(viewType=='webdesktop') {   
            var params = {
                xtype: 'webdesktop-penjualan-edit',
                title: 'Edit Penjualan',
                modulId: 'penjualan-edit',
                modal: true,
                constrain: true,
                grid: gridpanel,
                idEdit: gridpanel.idSelect           
            };

            win.cUtama.showWindow(win.tab, Ext.create(params));
        } else {
            this.setCurrentView('penjualan-edit', {
                openWindow: true, // Let the controller know that we want this component in the window,
                targetCfg: {
                    //put any extra configs for your view here
                    grid: gridpanel,
                    idEdit: gridpanel.idSelect
                },
                windowCfg: {
                    // Any configs that you would like to apply for window popup goes here
                    title: 'Edit Penjualan',
                    width: 450,
                    height: 550
                }
            });
        }
    },
    
    onLoadData: function(form) {
        var win = this.getView();
        var viewType = win.viewType;
        var form = win.down('penjualan-edit');
        var idEdit = viewType=='webdesktop'?win.idEdit:form.idEdit;

        if(idEdit) {
            form.load({
                //waitMsg: 'Loading...',
                method: 'GET',
                url: './server/public/penjualan/'+idEdit+'/load',
                success: function (frm, action) {
                    var json = Ext.JSON.decode(action.response.responseText);
                    var gridBarang = form.down('penjualan-edit-detail-barang');
                    var storeBarang = gridBarang.getStore();
                    var gridJasa = form.down('penjualan-edit-detail-jasa');
                    var storeJasa = gridJasa.getStore();

                    storeBarang.loadData(json['detail']);
                    storeJasa.loadData(json['jasa']);

                    var uangmuka = form.down('#uangmuka');
                    uangmuka.setDisabled(json.data['jenistrx']=='Cash');
                    if(json.data['jenistrx']=='Cash') {
                        uangmuka.setValue(0);
                    }

                },
                failure: function (frm, action) {
                    var json = Ext.JSON.decode(action.response.responseText);
                    Ext.MessageBox.show({
                        title: 'Error',
                        msg: json['message'],
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        fn : function(buttonValue, inputText, showConfig) {
                            if (win) {
                                win.close();
                            }
                        }
                    });
                }
            });
        } else {
            form.setNoTrx();
        }
    },

    onDeleteButtonClick: function(btn) {
        
        var gridpanel = this.getView().down('gridpanel');
        Ext.MessageBox.confirm('Konfirmasi', 'Yakin untuk hapus data yang dipilih?', function(btn,text) {
            if(btn=='yes') {

                var myMask = new Ext.LoadMask({target: gridpanel, msg:'Hapus...'});
                myMask.show();

                Ext.Ajax.request({
                    method:'GET',
                    url: './server/public/penjualan/'+gridpanel.idSelect+'/delete',
                    success: function(response) {
                        myMask.hide();
                        var json = Ext.JSON.decode(response.responseText);

                        Ext.Msg.alert('Sukses', json['message'], function(btn, text) {
                            var store = gridpanel.getStore(),
                            page = store.currentPage;

                            if(page>1 && store.getCount()-gridpanel.selModel.getSelection().length==0) page--;
                            store.loadPage(page);
                        });
                    },

                    failure: function(response) {
                        myMask.hide();
                        var json = Ext.JSON.decode(response.responseText);

                        Ext.MessageBox.show({
                            title: 'Error',
                            msg: json['message'],
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                });
            }
        });
    },

    onSaveButtonClick: function(btn) {
        var win = this.getView();
        var viewType = win.viewType;
        var form = win.down('penjualan-edit');
        var grid = viewType=='webdesktop'?win.grid:form.grid;
        var idEdit = viewType=='webdesktop'?win.idEdit:form.idEdit;
        var saveUrl = idEdit?idEdit+'/update':'insert';
        var editDetailBarang = form.down('penjualan-edit-detail-barang');
        var editDetailJasa   = form.down('penjualan-edit-detail-jasa');

        if(form.getForm().isValid()) {
            Ext.MessageBox.confirm('Konfirmasi', 'Yakin untuk proses simpan data?', function(btn, text) {
                if(btn=='yes') {
                    form.getForm().waitMsgTarget = win.getEl();
                    form.getForm().submit({
                        method:'POST',
                        url: './server/public/penjualan/'+saveUrl,
                        params: {
                            detail: editDetailBarang.getDetail(),
                            jasa: editDetailJasa.getDetail()
                        },
                        waitMsg: 'Simpan...',
                        success:function(frm, action) {
                            var json = Ext.JSON.decode(action.response.responseText);
                            Ext.Msg.alert('Sukses', json['message'], function(btn, text) {
                                if (win) {
                                    win.close();
                                    grid.getStore().loadPage(1);
                                }
                            });
                        },
    
                        failure:function(frm, action) {
                            var json = Ext.JSON.decode(action.response.responseText);
                            Ext.MessageBox.show({
                                title: 'Gagal',
                                msg: json['message'],
                                buttons: Ext.MessageBox.OK,
                                icon: Ext.MessageBox.ERROR
                            })
                        }
                    });
                }
            });
        }
    },

    onCancelButtonClick: function(btn) {
        var win = btn.up('window');
        if (win) {
            win.close();
            
        }
    }

});
