/**
 * @class Oskari.mapframework.mapmodule.WmsLayerPlugin
 * Provides functionality to draw WMS layers on the map
 */
Oskari.clazz.define(
    'Oskari.mapframework.mapmodule.WmsLayerPlugin',

    /**
     * @static @method create called automatically on construction
     */
    function () {
    },
    {
        __name : 'WmsLayerPlugin',
        _clazz : 'Oskari.mapframework.mapmodule.WmsLayerPlugin',
        layertype : 'wmslayer',

        getLayerTypeSelector : function() {
            return 'WMS';
        },

        _createPluginEventHandlers: function () {
            return {
                AfterChangeMapLayerStyleEvent: function (event) {
                    this._afterChangeMapLayerStyleEvent(event);
                }
            };
        },
        /**
         * @method addMapLayerToMap
         * @private
         * Adds a single WMS layer to this map
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Boolean} keepLayerOnTop
         * @param {Boolean} isBaseMap
         */
        addMapLayerToMap : function(layer, keepLayerOnTop, isBaseMap) {
            if (!this.isLayerSupported(layer)) {
                return;
            }

            var layers = [],
                olLayers = [],
                layerIdPrefix = 'layer_';
            // insert layer or sublayers into array to handle them identically
            if ((layer.isGroupLayer() || layer.isBaseLayer() || isBaseMap === true) && (layer.getSubLayers().length > 0)) {
                // replace layers with sublayers
                layers = layer.getSubLayers();
                layerIdPrefix = 'basemap_';
            } else {
                // add layer into layers
                layers.push(layer);
            }

            // loop all layers and add these on the map
            for (var i = 0, ilen = layers.length; i < ilen; i++) {
                var _layer = layers[i];
                var layerScales = this.getMapModule().calculateLayerScales(_layer.getMaxScale(), _layer.getMinScale());
                var defaultParams = {
                        'LAYERS': _layer.getLayerName(),
                        'TRANSPARENT': true,
                        'ID': _layer.getId(),
                        'STYLES': _layer.getCurrentStyle().getName(),
                        'FORMAT': 'image/png',
                        'VERSION' : _layer.getVersion() || '1.3.0'
                    },
                    layerParams = _layer.getParams() || {},
                    layerOptions = _layer.getOptions() || {};

                if (_layer.isRealtime()) {
                    var date = new Date();
                    defaultParams['TIME'] = date.toISOString();
                }
                // override default params and options from layer
                for (var key in layerParams) {
                    if (layerParams.hasOwnProperty(key)) {
                        defaultParams[key.toUpperCase()] = layerParams[key];
                    }
                }
                var layerImpl = null;
                if(layerOptions.singleTile === true) {

                      layerImpl = new ol.layer.Image({
                        source: new ol.source.ImageWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams,
                            crossOrigin : _layer.getAttributes('crossOrigin')
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                } else {
                    layerImpl = new ol.layer.Tile({
                        source : new ol.source.TileWMS({
                            url : _layer.getLayerUrl(),
                            params : defaultParams,
                            crossOrigin : _layer.getAttributes('crossOrigin')
                        }),
                        visible: layer.isInScale(this.getMapModule().getMapScale()) && layer.isVisible(),
                        opacity: layer.getOpacity() / 100
                    });
                }
                // Set min max Resolutions
                if (_layer.getMaxScale() && _layer.getMaxScale() !== -1 ) {
                    layerImpl.setMinResolution(this.getMapModule().getResolutionForScale(_layer.getMaxScale()));
                }
                // No definition, if scale is greater than max resolution scale
                if (_layer.getMinScale()  && _layer.getMinScale() !== -1 && (_layer.getMinScale() < this.getMapModule().getScaleArray()[0] )) {
                    layerImpl.setMaxResolution(this.getMapModule().getResolutionForScale(_layer.getMinScale()));
                }
                this.mapModule.addLayer(layerImpl,!keepLayerOnTop);
                // gather references to layers
                olLayers.push(layerImpl);

                this._sandbox.printDebug("#!#! CREATED ol.layer.TileLayer for " + _layer.getId());
            }
            // store reference to layers
            this.setOLMapLayers(layer.getId(), olLayers);
        },

        /**
         * Handle AfterChangeMapLayerStyleEvent
         * @private
         * @param {Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent}
         *            event
         */
        _afterChangeMapLayerStyleEvent : function(event) {
            var layer = event.getMapLayer();
            var layerList = this.getOLMapLayers(layer);
            if(!layerList) {
                return;
            }
            layerList.forEach(function(openlayer) {
                openlayer.getSource().updateParams({
                    styles : layer.getCurrentStyle().getName()
                });
            });
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol' : ["Oskari.mapframework.module.Module", "Oskari.mapframework.ui.module.common.mapmodule.Plugin"],
        "extend" : ["Oskari.mapping.mapmodule.AbstractMapLayerPlugin"]
    }
);