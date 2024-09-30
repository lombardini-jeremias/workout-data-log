export type RootStackParamList = {
  ExerciseListScreen: { fromScreen?: string }; // Agrega los parámetros que aceptan tus pantallas
  CreateExerciseScreen: undefined; // No acepta parámetros
  ExerciseDetailScreen: { exerciseId: number }; // Asegúrate de que el tipo sea correcto
};