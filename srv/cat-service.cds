using demo as my from '../db/schema';

service CatalogService {
  entity Gyms as projection on my.Gyms;
  entity Trainers as projection on my.Trainers;
  entity TrainingTypes  as projection on my.TrainingTypes;
  entity TrainingTypesPerTrainer  as projection on my.TrainingTypesPerTrainer;
  entity Trainings  as projection on my.Trainings;
}