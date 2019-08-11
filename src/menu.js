const electron = require('electron');
const {Menu, BrowserWindow} = electron;

class MenuBuilder {
    mainWindow = BrowserWindow;

    constructor(mainWindow = BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    //在main里面执行
    buildMenu() {
        if (
            process.env.NODE_ENV === 'development' ||
            process.env.DEBUG_PROD === 'true'
        ) {
            this.setupDevelopmentEnvironment();
        }
        console.log(process.platform);

        const template =
            process.platform === 'darwin'
                ? this.buildDarwinTemplate()
                : this.buildDefaultTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    setupDevelopmentEnvironment() {
        this.mainWindow.openDevTools();
        this.mainWindow.webContents.on('context-menu', (e, props) => {
            const {x, y} = props;

            Menu.buildFromTemplate([
                {
                    label: 'Inspect element',
                    click: () => {
                        this.mainWindow.inspectElement(x, y);
                    }
                }
            ]).popup(this.mainWindow);
        });
    }

    buildDarwinTemplate() {
        const subMenuAbout = {
            label: '网易云音乐',
            submenu: [
                {
                    label: '关于网易云音乐',
                    selector: 'orderFrontStandardAboutPanel:'
                },
                {type: 'separator'},
                {label: '偏好设置', submenu: []},
                {type: 'separator'},
                {
                    label: '隐藏窗口',
                    accelerator: 'Command+H',
                    selector: 'hide:'
                },
                {
                    label: '隐藏其他',
                    accelerator: 'Command+Shift+H',
                    selector: 'hideOtherApplications:'
                },
                {label: '隐藏所有', selector: 'unhideAllApplications:'},
                {type: 'separator'},
                {
                    label: '退出',
                    accelerator: 'Command+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        };
        const subMenuEdit = {
            label: '编辑',
            submenu: [
                {
                    label: '打开',
                    accelerator: 'Ctrl+O'
                },
                {
                    label: '退出',
                    accelerator: 'Ctrl+W',
                    click: () => {
                        this.mainWindow.close();
                    }
                },
                {label: 'Undo', accelerator: 'Command+Z', selector: 'undo:'},
                {label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:'},
                {type: 'separator'},
                {label: 'Cut', accelerator: 'Command+X', selector: 'cut:'},
                {label: 'Copy', accelerator: 'Command+C', selector: 'copy:'},
                {label: 'Paste', accelerator: 'Command+V', selector: 'paste:'},
                {
                    label: 'Select All',
                    accelerator: 'Command+A',
                    selector: 'selectAll:'
                }
            ]
        };
        const subMenuViewDev = {
            label: '视图',
            submenu: [
                {
                    label: '刷新',
                    accelerator: 'Command+R',
                    click: () => {
                        this.mainWindow.webContents.reload();

                    }
                },
                {
                    label: '切换全屏',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                },
                {
                    label: '切换开发者人员工具',
                    accelerator: 'Alt+Command+I',
                    click: () => {
                        this.mainWindow.toggleDevTools();
                    }
                }
            ]
        };
        const subMenuViewProd = {
            label: '视图',
            submenu: [
                {
                    label: 'Toggle Full Screen',
                    accelerator: 'Ctrl+Command+F',
                    click: () => {
                        this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
                    }
                }
            ]
        };
        const subMenuWindow = {
            label: '窗口',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'Command+M',
                    selector: 'performMiniaturize:'
                },
                {label: 'Close', accelerator: 'Command+W', selector: 'performClose:'},
                {type: 'separator'},
                {label: 'Bring All to Front', selector: 'arrangeInFront:'}
            ]
        };
        const subMenuHelp = {
            label: '帮助',
            submenu: [
                {
                    label: 'Learn More',
                    click() {
                        shell.openExternal('http://electron.atom.io');
                    }
                },
                {
                    label: 'Documentation',
                    click() {
                        shell.openExternal(
                            'https://github.com/atom/electron/tree/master/docs#readme'
                        );
                    }
                },
                {
                    label: 'Community Discussions',
                    click() {
                        shell.openExternal('https://discuss.atom.io/c/electron');
                    }
                },
                {
                    label: 'Search Issues',
                    click() {
                        shell.openExternal('https://github.com/atom/electron/issues');
                    }
                }
            ]
        };

        //设置开发或者是生产
        const subMenuView =
            process.env.NODE_ENV === 'development' ? subMenuViewDev : subMenuViewProd;

        return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
    }

    buildDefaultTemplate() {
        const templateDefault = [
            {
                label: '文件',
                submenu: [
                    {
                        label: '打开',
                        accelerator: 'Ctrl+O'
                    },
                    {
                        label: '退出',
                        accelerator: 'Ctrl+W',
                        click: () => {
                            this.mainWindow.close();
                        }
                    }
                ]
            },
            {
                label: '视图',
                submenu:
                    process.env.NODE_ENV === 'development'
                        ? [
                            {
                                label: '刷新',
                                accelerator: 'Ctrl+R',
                                click: () => {
                                    this.mainWindow.webContents.reload();
                                }
                            },
                            {
                                label: '切换全屏',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                }
                            },
                            {
                                label: '切换开发者人员工具',
                                accelerator: 'Alt+Ctrl+I',
                                click: () => {
                                    this.mainWindow.toggleDevTools();
                                }
                            }
                        ]
                        : [
                            {
                                label: '切换全屏',
                                accelerator: 'F11',
                                click: () => {
                                    this.mainWindow.setFullScreen(
                                        !this.mainWindow.isFullScreen()
                                    );
                                }
                            }
                        ]
            },
            {
                label: '帮助',
                submenu: [
                    {
                        label: '更多帮助',
                        click() {
                            shell.openExternal('http://electron.atom.io');
                        }
                    },
                    {
                        label: '文档',
                        click() {
                            shell.openExternal(
                                'https://github.com/atom/electron/tree/master/docs#readme'
                            );
                        }
                    },
                    {
                        label: '搜索更多',
                        click() {
                            shell.openExternal('https://github.com/atom/electron/issues');
                        }
                    }
                ]
            }
        ];
        return templateDefault;
    }
}

module.exports = MenuBuilder;
