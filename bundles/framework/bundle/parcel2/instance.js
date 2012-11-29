/**
 * @class Oskari.mapframework.bundle.parcel2.ParcelBundleInstance
 * 
 * My places functionality
 */
Oskari.clazz.define("Oskari.mapframework.bundle.parcel2.ParcelBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._localization = null;
    this.sandbox = null;
    this.buttons = undefined;
    this.categoryHandler = undefined;
    this.parcelService = undefined;
    this.idPrefix = 'parcel';
}, {
    __name : 'Parcel2',
    /**
     * @method getName
     * @return {String} the name for the component 
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getSandbox
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method getLocalization
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     * 
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if (key) {
            if (this._localization &&
                this._localization[key]) {
                return this._localization[key];
            } else {
                return key;
            }
        }
        return this._localization;
    },
    /**
     * @method showMessage
     * Shows user a message with ok button
     * @param {String} title popup title
     * @param {String} message popup message
     */
    showMessage : function(title, message) {
        var loc = this.instance.getLocalization();
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(loc.buttons.ok);
    	okBtn.addClass('primary');
    	okBtn.setHandler(function() {
            dialog.close(true);
    	});
    	dialog.show(title, message, [okBtn]);
    },
    /**
     * @method enableGfi
     * Enables/disables the gfi functionality
     * @param {Boolean} blnEnable true to enable, false to disable
     */
    enableGfi : function(blnEnable) {
        var gfiReqBuilder = this.sandbox.getRequestBuilder('MapModulePlugin.GetFeatureInfoActivationRequest');
        if(gfiReqBuilder) {
            this.sandbox.request(this.buttons, gfiReqBuilder(blnEnable));
        }
    },
    /**
     * @method getService
     * Returns the my places main service
     * @return {Oskari.mapframework.bundle.parcel2.service.ParcelService}
     */
    getService : function() {
        return this.parcelService;
    },
    /**
     * @method getDrawPlugin
     * Returns reference to the draw plugin
     * @return {Oskari.mapframework.bundle.parcel2.plugin.DrawPlugin}
     */
    getDrawPlugin : function() {
        return this.view.drawPlugin;
    },
    /**
     * @method getCategoryHandler
     * Returns reference to the category handler
     * @return {Oskari.mapframework.bundle.parcel2.CategoryHandler}
     */
    getCategoryHandler : function() {
        return this.categoryHandler;
    },
    /**
     * @method getMainView
     * Returns reference to the main view
     * @return {Oskari.mapframework.bundle.parcel2.view.MainView}
     */
    getMainView : function() {
        return this.view;
    },
    /**
     * @method update
     * implements BundleInstance protocol update method - does nothing atm
     */
    update : function() {
    },
    /**
     * @method start
     * implements BundleInstance protocol start methdod
     */
    start : function() {
        
        // Should this not come as a param?
        var sandbox = Oskari.$('sandbox');
        this.sandbox = sandbox;
        
        var me = this;
        sandbox.printDebug("Initializing my places module...");
        
        // handles toolbar buttons related to my places 
        this.buttons = Oskari.clazz.create("Oskari.mapframework.bundle.parcel2.ButtonHandler", this);
        this.buttons.start();
        
        var user = sandbox.getUser();
        if(!user.isLoggedIn()) {
            // guest users don't need anything else
            return;
        }
        // handles category related logic - syncs categories to my places map layers etc
        this.categoryHandler = Oskari.clazz.create('Oskari.mapframework.bundle.parcel2.CategoryHandler', this);
        this.categoryHandler.start();        

        var defaultCategoryName = this.getLocalization('category').defaultName;
        
        var actionUrl = this.conf.queryUrl; 
        // back end communication
        this.parcelService = Oskari.clazz.create('Oskari.mapframework.bundle.parcel2.service.ParcelService', 
            actionUrl, user.getUuid(), sandbox, defaultCategoryName);
        // register service so personal data can access it
        this.sandbox.registerService(this.parcelService);
        // init loads the places/categories
        this.parcelService.init();
        
        // handles my places insert form etc
        this.view = Oskari.clazz.create("Oskari.mapframework.bundle.parcel2.view.MainView", this);
        this.view.start();
        
        this.editRequestHandler = Oskari.clazz.create('Oskari.mapframework.bundle.parcel2.request.EditRequestHandler', sandbox, me);
        sandbox.addRequestHandler('Parcel.EditPlaceRequest', this.editRequestHandler);
        sandbox.addRequestHandler('Parcel.EditCategoryRequest', this.editRequestHandler);
        sandbox.addRequestHandler('Parcel.DeleteCategoryRequest', this.editRequestHandler);
        sandbox.addRequestHandler('Parcel.PublishCategoryRequest', this.editRequestHandler);
    },
    /**
     * @method stop
     * implements BundleInstance protocol stop method - does nothing atm
     */
    stop : function() {
        this.sandbox = null;
    }
    
}, {
    /**
     * @property {String[]} protocol
     * @static 
     */
    protocol : ['Oskari.bundle.BundleInstance']
});
