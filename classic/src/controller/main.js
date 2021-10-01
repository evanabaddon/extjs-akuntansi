Ext.define('Admin.controller.main', {
    extend: 'Ext.app.Controller',
    
    refs: [{
        ref: 'webdesktopmain',
        selector: 'webdesktopmain'
    }],
    
    init: function() {
        
        this.control({
            'webdesktopmain': {
                afterrender: this.afterrender
            },

            'xtaskbar menu': {
                click: this.menuClick
            },

            'button[action=logout]': {
                click: this.logout
            },

            'button[action=change_password]': {
                click: this.gantiPassword
            },

            'xdataview': {
                itemclick: this.openModul
            }
        });
    },

    menuClick: function(menu, data) {
        var tab = this.getWebdesktopmain();
        this.openModulSubMenu(tab, data['modul'], data['text'], data['akses'], data['idItem']);
    },

    openModul: function(view, record) {
        var tab = this.getWebdesktopmain();
        var data = record.data;
        this.openModulSubMenu(tab, data['modul'], data['text'], data['akses'], data['idItem']);
    },

    openModulSubMenu: function(tab, modul, judul, akses, mod_id) {
        var me = this,
            win = Ext.create(modul, {
                viewType: 'webdesktop',
                constrain: true,
                title: judul,
                cUtama: me,
                tab: tab,
                akses: akses,
                modulId: mod_id
            });

        this.showWindow(tab, win);
    },

    afterrender: function(view) {
        var me = this;

        Ext.Ajax.request({
            url: './server/public/akses',
            success: function(response) {
                var json = Ext.JSON.decode(response.responseText);

                var login = json['login'];
                var user = json['user'];
                var shortcut = json['shortcut'];
                var menu = json['menu'];

                view.down('xtaskbar').setVisible(login);
                view.down('xdataview').getStore().loadRawData(shortcut);
                if(!login) {
                    me.showLoginWindow();    
                } else {
                    view.down('xtaskbar').startMenu.setTitle(user['nama']);
                    view.down('xtaskbar').startMenu.add(menu);
                }
            },

            failure: function() {
                me.showLoginWindow();   
            }
        });
    },

    showLoginWindow: function() {
        Ext.create({
            xtype: 'webdesktop-login',
            mainView: this.getWebdesktopmain()
        }).show();
    },

    logout: function() {

        var me = this,
            mainView = me.getWebdesktopmain();

        Ext.MessageBox.show({
            title: 'Konfirmasi',
            msg: 'Yakin ingin keluar?',
            buttons: Ext.MessageBox.YESNO,
            fn: function(btn, text) {
                if(btn=='yes') {
                    var myMask = new Ext.LoadMask({target: mainView, msg: 'Logout...'});
                    myMask.show();

                    Ext.Ajax.request({
                        method: 'GET',
                        url: './server/public/logout',
                        success: function() {                            
                            
                            mainView.down('xtaskbar').setVisible(false);
                            mainView.down('xdataview').getStore().removeAll();

                            me.closeAllWindow();
                            me.showLoginWindow();
                            myMask.hide();
                        }
                    });
                }
            }
        });
    },

    gantiPassword: function(b) {
        Ext.create('Admin.view.webdesktop.gantipassword.edit').show();
    },

    showWindow: function(tab, w) {
        var me = this,
            mainView = me.getWebdesktopmain(),
            open = true;

        var xtaskbar_menu = Ext.getCmp('xtaskbar_' + w.modulId);
        if(xtaskbar_menu) {
            w.destroy();
            open = false;
            var win = xtaskbar_menu.win;
            if (win.minimized || win.hidden) {
                win.show();
            }else {
                win.toFront();
            }

        } else {

            mainView.down('xtaskbar').windowBar.items.each(function (item) {
                if (item.modulId === w.modulId) {
                    w.destroy();
                    open = false;

                    var win = item.win;
                    if (win.minimized || win.hidden) {
                        win.show();
                    }else {
                        win.toFront();
                    }
                    return;
                }
            });
        }

        if(open) {
            var f = function() {
                return function() {
                    w.viewType = 'webdesktop';
                    w.tab = tab;
                    w.stateful = false;
                    w.isWindow = true;
                    w.constrainHeader = true;
                    w.minimizable = !w.modal;
                    w.maximizable = !w.modal;

                    var win = tab.add(w),
                    xtaskbar = mainView.down('xtaskbar');
                    tab.windows.add(win);

                    win.mainTitle = Ext.util.Format.ellipsis(win.title, 20);
                    win.taskButton = xtaskbar.addTaskButton(win);
                    if(win.animateTarget==undefined) win.animateTarget = win.taskButton.el;

                    win.on({
                        activate: me.updateActiveWindow,
                        beforeshow: me.updateActiveWindow,
                        deactivate: me.updateActiveWindow,
                        minimize: me.minimizeWindow,
                        destroy: me.onWindowClose,
                        scope: me
                    });
                    w.show();
                };
            };

            setTimeout(f(), 0);
        }
    },

    closeAllWindow: function() {
        var me = this,
            mainView = me.getWebdesktopmain(),
            windows = mainView.windows;
        for(var i=windows.length-1; i>=0; i--) windows.getAt(i).close();
    },

    onWindowClose: function(win) {
        var me = win.tab,
            mainView = this.getWebdesktopmain();

        me.windows.remove(win);
        mainView.down('xtaskbar').removeTaskButton(win.taskButton, win);

        this.updateActiveWindow(win);

    },

    getActiveWindow: function (tab) {
        var win = null,
            zmgr = this.getDesktopZIndexManager(tab);

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function (tab) {
        var windows = tab.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    updateActiveWindow: function (win) {
        var mainView = this.getWebdesktopmain();
        var me = win.tab,
        activeWindow = this.getActiveWindow(me),
        last = me.lastActiveWindow;
        if (activeWindow === last) {
            mainView.down('xtaskbar').setActiveButton(activeWindow && activeWindow.taskButton, activeWindow?activeWindow:win);
            return;
        }

        if (last) {
            if (last.el && last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }
        mainView.down('xtaskbar').setActiveButton(activeWindow && activeWindow.taskButton, activeWindow?activeWindow:win);
    }
});