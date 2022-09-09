sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
  ],
  function (
    Controller,
    Filter,
    FilterOperator,
    Fragment,
    MessageBox,
    MessageToast
  ) {
    "use strict";

    // Set today
    let date = new Date();
    const day = date.toLocaleString("default", { day: "2-digit" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const year = date.toLocaleString("default", { year: "numeric" });
    let today = year + "-" + month + "-" + day;

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

        // Values for filtering
        let oTrainingsTable = this.getView().byId("trainingsTable");

        // Filter table by today
        var oFilterDay = today
          ? new Filter("trainingDate", FilterOperator.EQ, today)
          : null;
        oTrainingsTable.getBinding("items").filter(oFilterDay);

        //Filter table by selected trainer id

        let oFilterTrainerId = this.sObjectId
          ? new Filter("trainer_trainerID", FilterOperator.EQ, this.sObjectId)
          : null;

        // Apply filters
        oTrainingsTable
          .getBinding("items")
          .filter([oFilterTrainerId, oFilterDay]);
      },
      openDatePicker: function (oEvent) {
        this.getView().byId("Today").openBy(oEvent.getSource().getDomRef());
      },

      handleChange: function () {
        let oFilterTrainerId = this.sObjectId
          ? new Filter("trainer_trainerID", FilterOperator.EQ, this.sObjectId)
          : null;

        let oTrainingsTable = this.getView().byId("trainingsTable");
        let sDay = this.byId("Today").getValue();
        var oFilterDay = sDay
          ? new Filter("trainingDate", FilterOperator.EQ, sDay)
          : null;
        oTrainingsTable
          .getBinding("items")
          .filter([oFilterTrainerId, oFilterDay]);
        this.getView().byId("Today").setValue(null);
      },
      onSubmitTraining: function (oEvent) {
        //Get values from Dialog
        let newSurname = this.getView().byId("trainingSurname").getValue();
        let newName = this.getView().byId("trainingName").getValue();
        let sNewType = parseInt(this.byId("type").getSelectedKey());
        let sNewDate = this.byId("DP1").getValue();
        let sNewTime = this.byId("TP1").getValue();

        console.log(sNewTime);

        //Create new trainer
        if (sNewDate >= today) {
          var oContext = this.getView()
            .byId("trainingsTable")
            .getBinding("items")
            .create({
              trainer_trainerID: parseInt(this.sObjectId),
              traininType_trainingTypeId: sNewType,
              trainingTime: sNewTime,
              trainingDate: sNewDate,
              traineeName: newName,
              traineeSurname: newSurname,
            });

          this.byId("createTraining").close();
          this.clearCreateData();

          // Refresh table
          var oTable = this.byId("trainingsTable");
          oTable.getBinding("items").refresh();
        } else {
          this.getView()
            .byId("DP1")
            .setValueState(sap.ui.core.ValueState.Error);
          var msg = "Please select today or date in future ";
          MessageToast.show(msg);
        }
      },
      clearCreateData: function () {
        this.getView().byId("trainingSurname").setValue("");
        this.getView().byId("trainingName").setValue("");
        this.byId("DP1").setValue("");
        this.byId("TP1").setValue("");
      },

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

        // create dialog
        if (!this.pDialog) {
          this.pDialog = this.loadFragment({
            name: "demo.layout.view.CreateTraining",
          });
        }
        this.pDialog.then(function (oDialog) {
          oDialog.open();
        });
      },
      handleEditPress: function (oEvent) {
        var oTable = this.getView().byId("trainingsTable"),
          oContext = oTable.getSelectedItem();
        console.log(oContext);
        if (oContext == null) {
          var msg = "Please select training ";
          MessageBox.error(msg);
        } else {
          oContext = oContext.getBindingContext();
          var sPath = oContext.getPath();
          console.log(sPath);

          // create dialog
          if (!this.pDialog) {
            this.pDialog = this.loadFragment({
              name: "demo.layout.view.EditTraining",
            });
          }
          this.pDialog.then(function (oDialog) {
            oDialog.bindElement({ path: sPath });
            oDialog.open();
          });
        }
      },
      onCancelPress: function () {
        this.byId("myDialog").close();
      },
      onCloselPress: function () {
        this.clearCreateData();
        this.byId("createTraining").close();
      },

      onOkPress: function () {
        this.byId("myDialog").close();
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
