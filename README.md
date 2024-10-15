## TO DO:

1. createExerciseScreen setup Save function:

   1. Setup selection of Equipment **_DONE_**
   2. Setup selection of Muscles **_DONE_**
   3. Setup selection of ExerciseType **_DONE_**
   4. Muscles Secondary able to select more than 1

2. exerciseListScreen setup:
   1. setup Styles. **_DONE_**
   2. setup function onSelect more >1 exercise **_DONE_**
   3. Create button "Add Exercise" **_DONE_**
      (function: add selected Exercises to createDayActivityScreen Flatlist )

3. workoutPlanCreateScreen setup:
   1. Setup configuration of saving right. **_DONE_**
   2. Setup dayActivity Entity. ("uuid", "name"). **_DONE_**
   3. Fix Alert popups when dayActivity saved and workout Saved
      (only one pop up "workout saved!") **_DONE_**
   4. Keep data saved on screen when navigating to exerciseListScreen and coming back.
      (useContext)

4. workoutTab:
   1. Setup Flatlist to visualize all workout Plans saved under "New Activity" button. **_DONE_**
   2. Style the components
   

5. exerciseListScreen on Styles need to config Colors constants so when we use Colors.text its one for all, for light or dark theme.

6. workoutPlanDetailScreen
   1. Add EditButton that navigates to Edit setup.
   2. Edit setup should be same Screen as createDayActivityScreen.
      ( change Tab SaveButton to UpadteButton )
      ( Add Tab CancelButton and when onPress() an Alert: "discard Changes?" / "cancel" )

7. workoutPlanEditScreen:
   1. Add ellipsis-vertical to "workoutContainer" && navigation to Options-popUp.
   2. Add SuperSet info on the "workoutContainer".
   3. Create component Options-popUp
   4. On Options-popUp Add function: Reorder Exercises, Replace Exercise, create SuperSet / Remove from SuperSet, Remove Exercise.

Reorder Tabs screen and Stack Screen : "https://www.youtube.com/watch?v=4-shpLyYBLc"
Add "ellipsis-horizontal-sharp" on workoutTab on each dayActivity as touchable options
