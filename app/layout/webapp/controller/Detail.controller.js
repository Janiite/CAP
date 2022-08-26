sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/Fragment",
  ],
  function (Controller, Filter, FilterOperator, DateFormat, Fragment) {
    "use strict";

    return Controller.extend("demo.layout.controller.Detail", {
      onInit: function () {
        var oOwnerComponent = this.getOwnerComponent();

        this.oRouter = oOwnerComponent.getRouter();
        this.oModel = oOwnerComponent.getModel();

        this.oRouter
          .getRoute("master")
          .attachPatternMatched(this._onProductMatched, this);
        this.oRouter
          .getRoute("detail")
          .attachPatternMatched(this._onProductMatched, this);
      },

      _onProductMatched: function (oEvent) {
        this.sObjectId = oEvent.getParameter("arguments").objectId;
        this.getView().bindContext(`/Trainers(${this.sObjectId})`);

        //Filter table by selected trainer id
        let oTrainingsTable = this.getView().byId("trainingsTable");
        let oFilterTrainerId = this.sObjectId
          ? new Filter("trainer_ID", FilterOperator.EQ, this.sObjectId)
          : null;
        oTrainingsTable.getBinding("items").filter(oFilterTrainerId);
      },

      onEditToggleButtonPress: function () {
        var oObjectPage = this.getView().byId("ObjectPageLayout"),
          bCurrentShowFooterState = oObjectPage.getShowFooter();

        oObjectPage.setShowFooter(!bCurrentShowFooterState);
      },
      // formatDateTime: function(dateTime) {
      //   var oDateInstance = DateFormat.getDateInstance();
      //   console.log(oDateInstance);
      //   return oDateInstance.format(oDateInstance.parse(dateTime));
      // },
      onDelete: function () {
        var oTable = this.getView().byId("trainingsTable"),
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
            name: "demo.layout.view.CreateTraining",
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
      onSubmitTraining: function (oEvent) {
       
        //Get values from popup
        let newSurname = this.getView().byId("trainingSurname").getValue();
        let newName = this.getView().byId("trainingSurname").getValue();
        let sNewType = parseInt(this.byId("type").getSelectedKey());
        let sNewDate =this.byId("DP1").getValue();
        let sNewTime = this.byId("TP1").getValue();

        console.log(sNewDate); 

        //Create new trainer
        var oContext = this.getView()
          .byId("trainingsTable")
          .getBinding("items")
          .create({
            trainer_ID: parseInt(this.sObjectId),
            traininType_ID: sNewType,
            trainingDate : sNewDate,
            traineeName: newName,
            traineeSurname: newSurname,
          });

        // Note: This promise fails only if the transient entity is deleted
        oContext.created().then(
          function () {
            this.byId("createTrainingPopover").close();
          },
          function (oError) {
            // handle rejection of entity creation; if oError.canceled === true then the transient entity has been deleted
          }
        );
        // Refresh table
        var oTable = this.byId("trainingsTable");
        oTable.getBinding("items").refresh();
      },

      onExit: function () {
        this.oRouter
          .getRoute("master")
          .detachPatternMatched(this._onProductMatched, this);
        this.oRouter
          .getRoute("detail")
          .detachPatternMatched(this._onProductMatched, this);
      },
    });
  }
);
