/*global Ext:false */
/*global $:false */
/*global App:false */
/*global document:false */
/*global writeFiles:false */
/*global store:false */
/*global addShape:false */
Ext.namespace('addShape');
addShape.init = function () {
    "use strict";
    Ext.QuickTips.init();
    var me = this;
    me.form = new Ext.Panel({
        region: 'center',
        id: "addform",
        frame: false,
        bodyStyle: 'padding: 0',
        border: false,
        autoHeight: true,
        html: "<div id='shape_uploader'>You need Flash or a modern browser, which supports HTML5</div>",
        afterRender: function () {
            var arr = [], ext = ["shp", "tab", "geojson", "gml", "kml", "mif"], geoType, encoding, srs, flag = false;
            $("#shape_uploader").pluploadQueue({
                runtimes: 'html5, flash',
                url: '/controllers/upload/vector',
                max_file_size: '1000mb',
                chunk_size: '1mb',
                unique_names: true,
                urlstream_upload: true,
                init: {
                    UploadComplete: function (up, files) {
                        Ext.each(arr, function (e) {
                            flag = true;
                            geoType = (e.split(".").reverse()[0].toLowerCase() === "shp") ? "PROMOTE_TO_MULTI" : geoType;
                            $.ajax({
                                url: '/controllers/upload/processvector',
                                data: "srid=" + srs + "&file=" + e + "&name=" + e.split(".")[0] + "&type=" + geoType + "&encoding=" + encoding,
                                dataType: 'json',
                                type: 'GET',
                                success: function (response, textStatus, http) {
                                    if (response.success) {
                                        App.setAlert(App.STATUS_NOTICE, response.message);
                                        writeFiles();
                                        document.getElementById("wfseditor").contentWindow.window.reLoadTree();
                                        store.load();
                                    } else {
                                        Ext.MessageBox.alert('Failure', response.message);
                                    }
                                }
                            });
                        });
                        if (!flag) {
                            Ext.MessageBox.alert('Failure', "No files you uploaded seems to be recognized as a valid vector format.");
                        }
                    },
                    FilesAdded: function (up, files) {
                        Ext.each(files, function (item) {
                            //console.log(item.name);
                            Ext.each(ext, function (e) {
                                if (item.name.split(".").reverse()[0].toLowerCase() === e) {
                                    arr.push(item.name);
                                }
                            });
                        });
                    },
                    BeforeUpload: function (up, file) {
                        geoType = Ext.getCmp('geotype').getValue();
                        encoding = Ext.getCmp('encoding').getValue();
                        srs = Ext.getCmp('srs').getValue();
                        up.settings.multipart_params = {
                            name: file.name
                        };
                    }
                },
                // Flash settings
                flash_swf_url: '/js/plupload/js/Moxie.swf'
            });
            window.setTimeout(function () {
                var e = $(".plupload_droptext");
                window.setTimeout(function () {
                    e.fadeOut(500).fadeIn(500);
                }, 1000);
                window.setTimeout(function () {
                    e.html("Vector formats: .shp, .geojson, .gml, .kml, .tab and .mif");
                }, 1500);
            }, 200);
        },
        tbar: [
            {
                text: 'Epsg:'
            },
            {
                width: 60,
                xtype: 'textfield',
                id: 'srs',
                value: '4326'

            },
            {
                text: 'Type:'
            },
            {
                width: 80,
                xtype: 'combo',
                mode: 'local',
                triggerAction: 'all',
                forceSelection: true,
                editable: false,
                id: 'geotype',
                displayField: 'name',
                valueField: 'value',
                value: 'Auto',
                allowBlank: false,
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [
                        {
                            name: 'Auto',
                            value: 'Auto'
                        },
                        {
                            name: 'Point',
                            value: 'Point'
                        },
                        {
                            name: 'Line',
                            value: 'Line'
                        },
                        {
                            name: 'Polygon',
                            value: 'Polygon'
                        }
                    ]
                })
            },
            {
                text: 'Encoding:'
            },
            {
                width: 150,
                xtype: 'combo',
                mode: 'local',
                triggerAction: 'all',
                forceSelection: true,
                editable: false,
                id: 'encoding',
                displayField: 'name',
                valueField: 'value',
                value: 'LATIN1',
                allowBlank: false,
                store: new Ext.data.JsonStore({
                    fields: ['name', 'value'],
                    data: [
                        {name: "BIG5", value: "BIG5"},
                        {name: "EUC_CN", value: "EUC_CN"},
                        {name: "EUC_JP", value: "EUC_JP"},
                        {name: "EUC_JIS_2004", value: "EUC_JIS_2004"},
                        {name: "EUC_KR", value: "EUC_KR"},
                        {name: "EUC_TW", value: "EUC_TW"},
                        {name: "GB18030", value: "GB18030"},
                        {name: "GBK", value: "GBK"},
                        {name: "ISO_8859_5", value: "ISO_8859_5"},
                        {name: "ISO_8859_6", value: "ISO_8859_6"},
                        {name: "ISO_8859_7", value: "ISO_8859_7"},
                        {name: "ISO_8859_8", value: "ISO_8859_8"},
                        {name: "JOHAB", value: "JOHAB"},
                        {name: "KOI8R", value: "KOI8R"},
                        {name: "KOI8U", value: "KOI8U"},
                        {name: "LATIN1", value: "LATIN1"},
                        {name: "LATIN2", value: "LATIN2"},
                        {name: "LATIN3", value: "LATIN3"},
                        {name: "LATIN4", value: "LATIN4"},
                        {name: "LATIN5", value: "LATIN5"},
                        {name: "LATIN6", value: "LATIN6"},
                        {name: "LATIN7", value: "LATIN7"},
                        {name: "LATIN8", value: "LATIN8"},
                        {name: "LATIN9", value: "LATIN9"},
                        {name: "LATIN10", value: "LATIN10"},
                        {name: "MULE_INTERNAL", value: "MULE_INTERNAL"},
                        {name: "SJIS", value: "SJIS"},
                        {name: "SHIFT_JIS_2004", value: "SHIFT_JIS_2004"},
                        {name: "SQL_ASCII", value: "SQL_ASCII"},
                        {name: "UHC", value: "UHC"},
                        {name: "UTF8", value: "UTF8"},
                        {name: "WIN866", value: "WIN866"},
                        {name: "WIN874", value: "WIN874"},
                        {name: "WIN1250", value: "WIN1250"},
                        {name: "WIN1251", value: "WIN1251"},
                        {name: "WIN1252", value: "WIN1252"},
                        {name: "WIN1253", value: "WIN1253"},
                        {name: "WIN1254", value: "WIN1254"},
                        {name: "WIN1255", value: "WIN1255"},
                        {name: "WIN1256", value: "WIN1256"},
                        {name: "WIN1257", value: "WIN1257"},
                        {name: "WIN1258", value: "WIN1258"}
                    ]
                })
            }
        ]
    });
    me.onSubmit = function (form, action) {
        var result = action.result;
        if (result.success) {
            store.load();
            App.setAlert(App.STATUS_NOTICE, result.message);
        } else {
            Ext.MessageBox.alert('Failure', result.message);
        }
    };
};