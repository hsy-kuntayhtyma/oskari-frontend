/**
 * @class Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance
 *
 * Sample extension bundle definition which inherits most functionality
 * from DefaultExtension class.
 *
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance',
    /**
     * @static constructor function
     */

    function () {
        this.state = {
            indicators: [],
            layerId: null,
            // Increment this whenever statsgrid has non-backward compatible changes related to embedded maps.
            // Also implement handling to publishedgrid.
            version: 2
        };
    }, {
        "getMainPanel" : function() {
            if(!this.__mainPanel) {
                this.__mainPanel = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.view.MainPanel', this,
                        this.getLocalization(),
                        this.getSandbox());
                this.__mainPanel.state = this.state;
            }
            return this.__mainPanel;

        },
        "getService" : function() {
            // previously known as this.statsService
            if(!this.__service) {
                this.__service = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.StatisticsService',
                        this.getSandbox());
            }
            return this.__service;

        },
        "getUserSelections" : function() {
            if(!this.__userSelections) {
                var sb = this.getSandbox();
                this.__userSelections = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.UserSelectionsService', sb);
                // register to sandbox so other bundles can see it too
                sb.registerService(this.__userSelections);
            }
            return this.__userSelections;
        },
        "afterStart": function (sandbox) {
            var me = this;
            var tooltipRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.TooltipContentRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.TooltipContentRequest', tooltipRequestHandler);

            var indicatorRequestHandler = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.request.IndicatorsRequestHandler', this);
            sandbox.addRequestHandler('StatsGrid.IndicatorsRequest', indicatorRequestHandler);

            var locale = me.getLocalization(),
                mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
            this.mapModule = mapModule;

            var statsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.StatisticsService',
                me.sandbox
            );
            sandbox.registerService(statsService);
            me.statsService = statsService;

            // Handles user indicators
            var userIndicatorsService = Oskari.clazz.create(
                'Oskari.statistics.bundle.statsgrid.UserIndicatorsService',
                me
            );
            sandbox.registerService(userIndicatorsService);
            userIndicatorsService.init();
            me.userIndicatorsService = userIndicatorsService;

            // Register classification plugin for map.
            var classifyPlugin = Oskari.clazz.create('Oskari.statistics.bundle.statsgrid.plugin.ManageClassificationPlugin', {
                'state': me._getState()
            }, locale);
            mapModule.registerPlugin(classifyPlugin);
            mapModule.startPlugin(classifyPlugin);
            this.classifyPlugin = classifyPlugin;

            this.setState(this.state);
            this._enableTile(true);
            // request available -> personal data has been loaded before this bundle
            if(sandbox.getRequestBuilder('PersonalData.AddTabRequest')) {
                this.__addIndicatorTab();
            }
        },
        "__addIndicatorTab": function() {
          if(this.userIndicatorsTab) {
              return;
          }
          var locale = this.getLocalization();
          if (this.sandbox.getUser().isLoggedIn()) {
              var userIndicatorsTab = Oskari.clazz.create(
                  'Oskari.statistics.bundle.statsgrid.UserIndicatorsTab',
                  this, locale.tab
              );
              this.userIndicatorsTab = userIndicatorsTab;
          }
        },
        "eventHandlers": {
            'Personaldata.PersonaldataLoadedEvent': function () {
                // personal data has been loaded after this bundle
                this.__addIndicatorTab();
            },
            /**
             * @method userinterface.ExtensionUpdatedEvent
             */
            'userinterface.ExtensionUpdatedEvent': function (event) {
                var me = this,
                    view = this.getView();

                if (event.getExtension().getName() !== me.getName() || !this._isLayerPresent()) {
                    // not me -> do nothing
                    return;
                }

                var isShown = event.getViewState() !== "close";
                view.prepareMode(isShown, null, true);
            },
            /**
             * @method MapStats.StatsVisualizationChangeEvent
             */
            'MapStats.StatsVisualizationChangeEvent': function (event) {
                this._afterStatsVisualizationChangeEvent(event);
            },
            /**
             * @method AfterMapMoveEvent
             */
            'AfterMapMoveEvent': function (event) {
                var view = this.getView();
                if (view.isVisible && view._layer) {
                    this._createPrintParams(view._layer);
                }
            },
            'AfterMapLayerRemoveEvent': function (event) {
                this._afterMapLayerRemoveEvent(event);
            },
            /**
             * @method MapLayerEvent
             * @param {Oskari.mapframework.event.common.MapLayerEvent} event
             *
             */
            'MapLayerEvent': function (event) {
                // Enable tile when stats layer is available
                // FIXME: check for statslayer instead of assuming that its there when the event is received
                this._enableTile(true);
            }
        },
        "sendTooltipData": function(feature) {
            return this.__mainPanel.sendTooltipData(feature);
        },
        "_enableTile": function (blnEnable) {
            var layerPresent = this._isLayerPresent(),
                tile = this.plugins['Oskari.userinterface.Tile'];
            if (layerPresent && tile) {
                tile.setEnabled(blnEnable);
            }
        },
        "isLayerVisible": function () {
            var ret,
                layer = this.sandbox.findMapLayerFromSelectedMapLayers(this.conf.defaultLayerId);
            ret = layer !== null && layer !== undefined;
            return ret;
        },
        "_isLayerPresent": function () {
            var service = this.sandbox.getService('Oskari.mapframework.service.MapLayerService');
            if (this.conf && this.conf.defaultLayerId) {
                var layer = service.findMapLayer(this.conf.defaultLayerId);
                return (layer !== null && layer !== undefined && layer.isLayerOfType('STATS'));
            }
            var layers = service.getLayersOfType('STATS');
            if (layers && layers.length > 0) {
                this.conf.defaultLayerId = layers[0].getId();
                return true;
            }
            return false;
        },
        /**
         * Returns the user indicators service.
         *
         * @method getUserIndicatorsService
         * @return {Oskari.statistics.bundle.statsgrid.UserIndicatorsService}
         */
        getUserIndicatorsService: function () {
            return this.userIndicatorsService;
        },
        /**
         * @method addUserIndicator
         * @param {Object} indicator
         */
        "addUserIndicator": function (userIndicator) {
            // This is used in the user indicators tab in personal data panel.
            var me = this,
                view = me.getView(),
                state = me._getState();

            state.selectedIndicators = state.selectedIndicators || [];

            var indicator = {
              datasourceId: 'fi.nls.oskari.control.statistics.plugins.user.UserIndicatorsStatisticalDatasourcePlugin',
              indicatorId: userIndicator.id,
              selectors: []
            };

            state.selectedIndicators.push(indicator);
            if (!view.isVisible) {
                view.prepareMode(true, null, true);
                // show the view.
                state.layerId = indicator.layerId || state.layerId;
                state.regionCategory = indicator.category;
                me.setState(state);
            }
            me.getMainPanel().render(view.getEl());
        },
        /**
         * Sets the map state to one specified in the parameter. State is bundle specific, check the
         * bundle documentation for details.
         *
         * @method setState
         * @param {Object} state bundle state as JSON
         * @param {Boolean} ignoreLocation true to NOT set map location based on state
         */
        "setState": function (state, ignoreLocation) {
            var me = this;
            this.state = jQuery.extend({}, {
                indicators: [],
                layerId: null
            }, state);

            // We need to notify the grid of the current state
            // so it can load the right indicators.
            //this.gridPlugin.setState(this.state);
            this.classifyPlugin.setState(this.state);
            // Reset the classify plugin
            this.classifyPlugin.resetUI(this.state);

            if (me.state.isActive) {
                var view = this.getView(),
                    layerId = this.state.layerId,
                    layer = null;

                if (layerId !== null && layerId !== undefined) {
                    layer = this.sandbox.getService('Oskari.mapframework.service.MapLayerService').findMapLayer(layerId);
                }

                // view._layer isn't set if we call this without a layer...
                view.prepareMode(true, layer, false);

                if (me.state.selectedIndicators && me.__mainPanel && me.__mainPanel.element) {
                    me.__mainPanel.state = me.state;
                    me.__mainPanel.element.selectedIndicators = me.state.selectedIndicators;
                }
            }
        },
        "_getState": function () {
            // Including the main panel state into this. The main panel state contains all the indicator stuff.
            // The main panel is used without this statsgrid instance in embedded views, so the view state should be stored there.
            return jQuery.extend({}, this.state, this.getMainPanel()._getState());
        },

        /**
         * Get state parameters.
         * Returns string with statsgrid state. State value keys are before the '-' separator and
         * the indicators are after the '-' separator. The indicators are further separated by ',' and
         * both state values and indicator values are separated by '+'.
         *
         * @method getStateParameters
         * @return {String} statsgrid state
         */
        "getStateParameters": function () {
            var me = this,
                view = me.getView(),
                state = me._getState();

            // If there's no view or it's not visible, nothing to do here!
            if (!view || !view.isVisible) {
                return null;
            }
            // If the state is null or an empty object, nothing to do here!
            if (!state || jQuery.isEmptyObject(state)) {
                return null;
            }

            var i = null,
                ilen = null,
                ilast = null,
                statsgridState = "statsgrid=",
                valueSeparator = "+",
                indicatorSeparator = ",",
                stateValues = "",
                indicatorValues = "",
                colorsValues = null,
                colors = state.colors || {},
                keys = [
                    'layerId',
                    'currentColumn',
                    // Old notation: indicator42014total means SotkaIndicator number 4, year 2014, both sexes.
                    //               indicator10892015total means User Indicator number 1089, year 2015, both sexes.
                    // This is pretty much unparseable, so we will use indicator values instead.
                    'methodId',
                    'numberOfClasses',
                    'classificationMode',
                    'manualBreaksInput',
                    'allowClassification',
                    'version'
                ],
                colorKeys = ['set', 'index', 'flipped'],
                indicators = state.selectedIndicators || [],
                value;

            // Note! keys needs to be handled in the backend as well.
            // Therefore the key order is important as well as actual values.
            // 'classificationMode' can be an empty string but it must be the
            // fifth value.
            // 'manualBreaksInput' can be an empty string but it must be the
            // sixth value.
            for (i = 0, ilen = keys.length, ilast = ilen - 1; i < ilen; i++) {
                value = state[keys[i]];
                if (value !== null && value !== undefined && value !== '') {
                    // skip undefined and null
                    stateValues += value;
                } else {
                    // There must always be some value inserted. We use 0 to designate null.
                    // Don't use anything with - or +.
                    stateValues += '0';
                }
                if (i !== ilast) {
                    stateValues += valueSeparator;
                }
            }

            // handle indicators separately
            for (i = 0, len = indicators.length, last = len - 1; i < len; i += 1) {
                indicatorValues += indicators[i].id;
                // In the old system this was for example 4, meaning the Sotka indicator number 4,
                // requiring the next parameters also to interpret it: +2014+total
                // In the new system this is: fi.nls.oskari.control.statistics.plugins.sotka.SotkaStatisticalDatasourcePlugin:167:11:{%22sex%22:%22female%22,%22year%22:%221992%22}
                // Note: We will need to use a parsing rule to determine whether the link is from the old system or from the new.
                if (i !== last) {
                    indicatorValues += valueSeparator;
                }
            }

            // handle colors separately
            var colorArr = [],
                cKey;
            colors.flipped = colors.flipped === true;
            for (i = 0, ilen = colorKeys.length; i < ilen; ++i) {
                cKey = colorKeys[i];
                if (colors.hasOwnProperty(cKey) && colors[cKey] !== null && colors[cKey] !== undefined) {
                    colorArr.push(colors[cKey]);
                }
            }
            if (colorArr.length === 3) {
                colorsValues = colorArr.join(',');
            }

            var ret = null;
            if (stateValues && indicatorValues) {
                ret = statsgridState + stateValues + "-" + indicatorValues + "-";
                if (colorsValues) {
                    ret += colorsValues;
                }
                // Should the mode be open or not
                ret += (view && view.isVisible) ? "-1" : "-0";
            }

            return ret;
        },

        "getView": function () {
            return this.plugins['Oskari.userinterface.View'];
        },

        /**
         * Gets the instance sandbox.
         *
         * @method getSandbox
         * @return {Object} return the sandbox associated with this instance
         */
        "getSandbox": function () {
            return this.sandbox;
        },

        /**
         * Returns the open indicators of the instance's grid plugin.
         *
         * @method getGridIndicators
         * @return {Object/null} returns the open indicators of the grid plugin, or null if no grid plugin
         */
        "getGridIndicators": function () {
            // FIXME: Implement or remove
            return null;
        },

        /**
         * Creates parameters for printout bundle and sends an event to it.
         * Params include the BBOX and the image url of the layer with current
         * visualization parameters.
         *
         * @method _createPrintParams
         * @private
         * @param {Object} layer
         */
        "_createPrintParams": function (layer) {
            if (!layer) {
                return;
            }

            var oLayers = this.mapModule.getOLMapLayers(layer.getId());
            if (!oLayers) {
                return;
            }
            var data = {},
                oLayer = _.first(oLayers),
                tile = {
                    // The max extent of the layer
                    bbox: oLayer.maxExtent.toArray(),
                    // URL of the image with current viewport
                    // bounds and all the original parameters
                    url: oLayer.getURL(oLayer.getExtent())
                },
                retainEvent,
                eventBuilder;
            data[layer.getId()] = [];
            data[layer.getId()].push(tile);

            // If the event is already defined, just update the data.
            if (this.printEvent) {
                retainEvent = true;
                this.printEvent.setLayer(layer);
                this.printEvent.setTileData(data);
            } else {
                // Otherwise create the event with the data.
                retainEvent = false;
                eventBuilder = this.sandbox.getEventBuilder('Printout.PrintableContentEvent');
                if (eventBuilder) {
                    this.printEvent = eventBuilder(this.getName(), layer, data);
                }
            }

            if (this.printEvent) {
                this.sandbox.notifyAll(this.printEvent, retainEvent);
            }
        },

        /**
         * Saves params to the state and sends them to the print service as well.
         *
         * @method _afterStatsVisualizationChangeEvent
         * @private
         * @param {Object} event
         */
        "_afterStatsVisualizationChangeEvent": function (event) {
            var me = this,
                params = event.getParams(),
                layer = event.getLayer();

            // Saving state
            me.state.methodId = params.methodId;
            me.state.numberOfClasses = params.numberOfClasses;
            me.state.manualBreaksInput = params.manualBreaksInput;
            me.state.colors = params.colors;
            me.state.classificationMode = params.classificationMode;
            // Send data to printout bundle
            me._createPrintParams(layer);
        },

        /**
         * Exits the stats mode after the stats layer gets removed.
         *
         * @method _afterMapLayerRemoveEvent
         * @private
         * @param {Object} event
         */
        "_afterMapLayerRemoveEvent": function (event) {
            var layer = event.getMapLayer(),
                layerId = layer.getId(),
                view = this.getView();

            // Exit the mode
            if (view._layer && (layerId === view._layer.getId())) {
                view.prepareMode(false);
            }
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultExtension"]
    });