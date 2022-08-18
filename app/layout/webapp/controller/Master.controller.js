sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/f/library",
    "sap/ui/core/IconPool",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/library",
	"sap/m/List",
    "sap/m/Input",
	"sap/m/StandardListItem",
	"sap/m/Text"
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    JSONModel,
    Controller,
    Filter,
    FilterOperator,
    Sorter,
    MessageBox,
    fioriLibrary,
    IconPool, 
    Dialog, 
    Button, 
    mobileLibrary, 
    List, 
    Input, 
    StandardListItem, 
    Text
  ) {
    "use strict";

    return Controller.extend("demo.layout.controller.Master", {
      onInit: function () {
        this.oView = this.getView();
        this._bDescendingSort = false;
        this.oTrainersTable = this.oView.byId("trainersTable");
      },
      onSearch: function (oEvent) {
        let sLocation = this.byId("selectLocation").getSelectedKey(),
          oTable = this.byId("trainerTable");

        let oFilterLocation = sLocation
          ? new Filter("location_ID", FilterOperator.EQ, sLocation)
          : null;

        oTable.getBinding("items").filter(oFilterLocation);
      },

      onAdd: function () {
        console.log("Add something");
      },
      onListItemPress: function () {
        var oFCL = this.oView.getParent().getParent();
        oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
      },

      onDefaultDialogPress: function () {
			if (!this.oDefaultDialog) {
				this.oDefaultDialog = new Dialog({
					title: "Create Trainer",
					content: new Input({
						placeholder: "Trainer name",
                        value: "{name}"
					}),
					beginButton: new Button({
						text: "OK",
						press: function () {
							this.oDefaultDialog.close();
						}.bind(this)
					}),
					endButton: new Button({
						text: "Close",
						press: function () {
							this.oDefaultDialog.close();
						}.bind(this)
					})
				});

				// to get access to the controller's model
				this.getView().addDependent(this.oDefaultDialog);
			}

			this.oDefaultDialog.open();
		},

    });
  }
);
