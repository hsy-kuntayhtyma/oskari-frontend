/**
 * @class Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the plugin
     */
    function (instance, config, locale, mapmodule, sandbox) {
        var me = this;
        me._locale = locale;
        me._config = config || {};
        me._mapmodule = mapmodule;
        me._sandbox = sandbox;
        me._instance = instance;
        me._clazz = 'Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin';
        me._defaultLocation = 'top right';
        me._index = 9;
        me._name = 'ClassificationToolPlugin';
        me._element = null;
        me._templates = {
            main: jQuery('<div class="statsgrid-legend-plugin"></div>')
        };

        me._mobileDefs = {
            buttons:  {
                'mobile-coordinatetool': {
                    iconCls: 'mobile-xy',
                    tooltip: locale.legend.title,
                    show: true,
                    callback: function () {
                        if(me._popup && me._popup.isVisible()) {
                            me._popup.close(true);
                        } else {
                            me._showPopup();
                        }
                    },
                    sticky: true,
                    toggleChangeIcon: true
                }
            },
            buttonGroup: 'mobile-toolbar'
        };
        me.log = Oskari.log('Oskari.statistics.statsgrid.plugin.ClassificationToolPlugin');

        this.__legend = Oskari.clazz.create('Oskari.statistics.statsgrid.Legend', sandbox, locale);
    }, {

        /**
         * Show popup.
         * @method @private _showPopup
         */
        _showPopup: function() {
            var me = this;
            var sandbox = me.getSandbox();
            var popupService = this.getSandbox().getService('Oskari.userinterface.component.PopupService');
            this._popup = popupService.createPopup();
            this._popup.onClose(function() {
                // detach so we dont lose eventlistener bindings
                me.getElement().detach();
                sandbox.postRequestByName('Toolbar.SelectToolButtonRequest', [null, 'mobileToolbar-mobile-toolbar']);
            });
            this._popup.addClass('statsgrid-mobile-legend');
            this._popup.show(null, this.getElement());
        },

        /**
         * Creates UI for coordinate display and places it on the maps
         * div where this plugin registered.
         * @private @method _createControlElement
         *
         * @return {jQuery}
         */
        _createControlElement: function () {
            var me = this;
            var sb = me._sandbox;
            var locale = me._locale;
            var config = me._config;

            if(me._element !== null) {
                return me._element;
            }
            me._element = me._templates.main.clone();
            this.__legend.render(me._element);
            return me._element;
        },

        teardownUI : function() {
            //detach old element from screen
            var me = this;
            this.removeFromPluginContainer(me._element, true, true);
            if (this._popup) {
                me.getElement().detach();
                this._popup.close(true);
            }
            var mobileDefs = this.getMobileDefs();
            this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
        },

        /**
         * Handle plugin UI and change it when desktop / mobile mode
         * @method  @public redrawUI
         * @param  {Boolean} mapInMobileMode is map in mobile mode
         * @param {Boolean} forced application has started and ui should be rendered with assets that are available
         */
        redrawUI: function(mapInMobileMode, forced) {
            var me = this;
            var sandbox = me.getSandbox();
            var mobileDefs = this.getMobileDefs();

            // don't do anything now if request is not available.
            // When returning false, this will be called again when the request is available
            var toolbarNotReady = this.removeToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
            if(!forced && toolbarNotReady) {
                return true;
            }
            this.teardownUI();

            me._element = me._createControlElement();
            if (!toolbarNotReady && mapInMobileMode) {
                // create mobile
                this.addToolbarButtons(mobileDefs.buttons, mobileDefs.buttonGroup);
                return;
            }

            this.addToPluginContainer(me._element);
        },

        /**
         * Get jQuery element.
         * @method @public getElement
         */
        getElement: function(){
            return this._element;
        },

        enableClassification: function(enabled) {
            this.__legend.allowClassification(enabled);
        },
        stopPlugin: function(){
            this.teardownUI();
        }
    }, {
        'extend': ['Oskari.mapping.mapmodule.plugin.BasicMapModulePlugin'],
        /**
         * @static @property {string[]} protocol array of superclasses
         */
        'protocol': [
            "Oskari.mapframework.module.Module",
            "Oskari.mapframework.ui.module.common.mapmodule.Plugin"
        ]
    });
