namespace demo;

entity Gyms {
    key ID        : Integer;
        gymId     : Integer;
        name      : String(25);
        streetNum : Integer;
        floor     : String;
}

entity Trainers {
    key ID        : Integer;
        trainerID : Integer;
        timeFrom  : Time;
        timeTo    : Time;
        date      : Date;
        location  : Association to Gyms;
        name      : String(25);
        surname   : String(50);
}

entity TrainingTypes {
    key ID             : UUID;
        trainingTypeId : Integer;
        name           : String(25);
        duration       : Time;
}

entity TrainingTypesPerTrainer {
    key ID          : Integer;
        trainer     : Association to Trainers;
        traininType : Association to TrainingTypes;
}

entity Trainings {
    key ID             : Integer;
        trainingID     : Integer;
        trainer        : Association to Trainers;
        traininType    : Association to TrainingTypes;
        trainingTime   : Time;
        trainingDate   : Date;
        traineeName    : String(25);
        traineeSurname : String(50);
}
