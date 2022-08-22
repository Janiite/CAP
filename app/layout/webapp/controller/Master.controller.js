sap.ui.define(
  [
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/f/library",
    "sap/ui/core/Fragment",
  ],
  /**
   * @param {typeof sap.ui.core.mvc.Controller} Controller
   */
  function (
    JSONModel,
    Controller,
    Filter,
    FilterOperator,
    fioriLibrary,
    Fragment
  ) {
    "use strict";

    return Controller.extend("demo.layout.controller.Master", {
      onInit: function () {
        this.oRouter = this.getOwnerComponent().getRouter();
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

      onListItemPress: function (oEvent) {
        const sTrainerId = oEvent.getSource().getBindingContext("Trainers").getProperty("ID");
				

			  this.oRouter.navTo("detail", { id: sTrainerId});

        var oFCL = this.oView.getParent().getParent();
        oFCL.setLayout(fioriLibrary.LayoutType.TwoColumnsMidExpanded);
      },

      onSubmitTrainer: function (oEvent) {
        //Get values from popup
        let newName = this.getView().byId("name").getValue();
        let newSurname = this.getView().byId("surname").getValue();
        let sNewLocation = parseInt(this.byId("gym").getSelectedKey());

        //Create new trainer
        var oContext = this.getView()
          .byId("trainerTable")
          .getBinding("items")
          .create({
            name: newName,
            surname: newSurname,
            location_ID: sNewLocation,
          });

        // Note: This promise fails only if the transient entity is deleted
        oContext.created().then(
          function () {
            this.byId("myPopover").close();
          },
          function (oError) {
            // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
          }
        );
        // Refresh table
        var oTable = this.byId("trainerTable");
        oTable.getBinding("items").refresh();
      },
      onDelete: function () {
        var oTable = this.getView().byId("trainerTable"),
          oContext = oTable.getSelectedItem().getBindingContext();

        oContext.delete("$auto").then(
          function () {
            oTable.removeSelections();
          },
          function () {}
        );
      },

      handlePopoverPress: function (oEvent) {
        var oButton = oEvent.getSource(),
          oView = this.getView();

        // create popover
        if (!this._pPopover) {
          this._pPopover = Fragment.load({
            id: oView.getId(),
            name: "demo.layout.view.Popover",
            controller: this,
          }).then(function (oPopover) {
            oView.addDependent(oPopover);

            return oPopover;
          });
        }
        this._pPopover.then(function (oPopover) {
          oPopover.openBy(oButton);
        });
      },
    });
  }
);
