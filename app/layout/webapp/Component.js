sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "demo/layout/model/models",
        'sap/f/FlexibleColumnLayoutSemanticHelper',
        'sap/f/library'
    ],
    function (UIComponent, Device, models, FlexibleColumnLayoutSemanticHelper, fioriLibrary ) {
        "use strict";

        return UIComponent.extend("demo.layout.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
              
                this.getRouter().initialize();
               
                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            },
            _getFcl: function () {
                return new Promise(function(resolve, reject) {
                    var oFCL = this.getRootControl().byId('flexibleColumnLayout');
                    if (!oFCL) {
                        this.getRootControl().attachAfterInit(function(oEvent) {
                            resolve(oEvent.getSource().byId('flexibleColumnLayout'));
                        }, this);
                        return;
                    }
                    resolve(oFCL);
    
                }.bind(this));
            }
        });
    }
);