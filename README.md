## TO DO:

1. createExerciseScreen setup Save function:

   1. Setup selection of Equipment
   2. Setup selection of Force
   3. Setup selection of mechanic
   4. Setup selection of Level
   5. Setup selection of Muscles
   6. Setup selection of Category

2. exerciseListScreen setup:

   1. setup Styles. **_DONE_**
   2. setup function onSelect more >1 exercise **_DONE_**
   3. Create button "Add Exercise" **_DONE_**
      (function: add selected Exercises to createDayActivityScreen Flatlist )

3. createDayActivityScreen setup:
   1. Setup configuration of saving right. **_DONE_**
   2. Setup dayActivity Entity. ("uuid", "name"). **_DONE_**
   3. Setup workout Entity. (
      id: Date.now().toString(),
      date: formattedDate,
      exerciseId: exercise.id,
      dayActivityId: dayActivity.uuid,
      sets: setsArray,
      reps: repsArray,
      weight: weightArray,
      comment: "",) **_DONE_**
   4. Fix Alert popups when dayActivity saved and workout Saved
      (only one pop up "workout saved!") **_DONE_**
   5. Keep data saved on screen when navigating to exerciseListScreen and coming back.
      (useContext)
4. workoutTab:
   1. Setup Flatlist to visualize all Day Activities saved under "New Activity" button. **_DONE_**
5. exerciseListScreen on Styles need to config Colors constants so when we use Colors.text its one for all, for light or dark theme.

6. dayActivityDetailScreen

   1. Add EditButton that navigates to Edit setup.
   2. Edit setup should be same Screen as createDayActivityScreen.
      ( change Tab SaveButton to UpadteButton )
      ( Add Tab CancelButton and when onPress() an Alert: "discard Changes?" / "cancel" )

7. editDayActivityScreen:
   1. Add ellipsis-vertical to "workoutContainer" && navigation to Options-popUp.
   2. Add SuperSet info on the "workoutContainer".
   3. Create component Options-popUp
   4. On Options-popUp Add function: Reorder Exercises, Replace Exercise, create SuperSet / Remove from SuperSet, Remove Exercise.
   5.

Reorder Tabs screen and Stack Screen : "https://www.youtube.com/watch?v=4-shpLyYBLc"
