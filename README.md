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

_USE REF_ (MAYBE CAN HELP IN EDIT SCREEN FUNCTIONS)
`useRef` is a hook in React that allows you to persist values across renders without causing a re-render when the value is updated. It's commonly used for:

1. **Accessing and interacting with DOM elements** (or component instances in React Native).
2. **Storing mutable values** that don’t need to trigger a re-render when they change, such as timers, previous values, or some custom states.
3. **Preserving values across renders** without re-initializing them, like keeping a stable reference to a variable.

Unlike `useState`, changing a `useRef` value doesn’t trigger a re-render of the component. This makes it useful in scenarios where you need to retain information, but don’t want the component to re-render every time that value changes.

### Syntax

```javascript
const ref = useRef(initialValue);
```

### Key Characteristics:

- `useRef` returns a **mutable object** where the `.current` property stores the value.
- The value inside `.current` persists across renders.
- Changing `.current` does **not** trigger a re-render.

### Common Use Cases

#### 1. **Accessing DOM Elements (or native elements in React Native)**

In React web apps, `useRef` is often used to directly access and manipulate DOM elements without needing to use `document.querySelector`.

**Example 1: Accessing an input field and focusing it**

```jsx
import React, { useRef } from "react";

function FocusInput() {
  const inputRef = useRef(null); // Create a reference to store the input DOM element

  const handleFocus = () => {
    // Access the DOM element through ref and call focus() on it
    inputRef.current.focus();
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        placeholder="Click the button to focus me"
      />
      <button onClick={handleFocus}>Focus the input</button>
    </div>
  );
}

export default FocusInput;
```

In this example:

- `inputRef.current` holds a reference to the input element.
- The `handleFocus` function directly interacts with the DOM by focusing on the input when the button is clicked.

#### 2. **Storing Values Across Renders Without Re-Rendering**

`useRef` is also used for storing values that persist across renders but don’t cause the component to re-render.

**Example 2: Tracking the number of renders**

```jsx
import React, { useRef, useState, useEffect } from "react";

function RenderCounter() {
  const [count, setCount] = useState(0);
  const renders = useRef(0); // Create a ref to track render counts

  useEffect(() => {
    renders.current += 1; // Increment render count on every render
  });

  return (
    <div>
      <p>Count: {count}</p>
      <p>This component has rendered {renders.current} times.</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
}

export default RenderCounter;
```

In this example:

- `renders.current` is updated on each render, but since it’s inside a `useRef`, changing its value does **not** cause the component to re-render.
- We can keep track of how many times the component has rendered.

#### 3. **Persisting Values Between Renders**

If you have a value or state that doesn't need to trigger a re-render when updated but still needs to be kept across renders (such as storing previous state or keeping a timer), `useRef` is a good choice.

**Example 3: Timer with `setInterval`**

```jsx
import React, { useRef, useState, useEffect } from "react";

function Timer() {
  const [time, setTime] = useState(0);
  const timerRef = useRef(null); // Use ref to store timer ID

  useEffect(() => {
    // Start the timer
    timerRef.current = setInterval(() => {
      setTime((prevTime) => prevTime + 1);
    }, 1000);

    // Cleanup timer when component unmounts
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div>
      <p>Timer: {time} seconds</p>
      <button onClick={() => clearInterval(timerRef.current)}>
        Stop Timer
      </button>
    </div>
  );
}

export default Timer;
```

In this example:

- `timerRef.current` holds the `setInterval` ID.
- You can stop the timer by clearing the interval without causing a re-render because the `useRef` stores the timer ID without causing an update to the state.

#### 4. **Holding Previous Values**

You can also use `useRef` to keep track of the previous value of a state.

**Example 4: Store the previous count**

```jsx
import React, { useState, useRef, useEffect } from "react";

function PreviousValue() {
  const [count, setCount] = useState(0);
  const prevCount = useRef(null); // Create a ref to store the previous count value

  useEffect(() => {
    prevCount.current = count; // Update the ref with the current value after every render
  }, [count]);

  return (
    <div>
      <p>Current Count: {count}</p>
      <p>Previous Count: {prevCount.current}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
    </div>
  );
}

export default PreviousValue;
```

In this example:

- `prevCount.current` stores the previous value of `count` across renders.
- Even though the component re-renders when the state changes, `prevCount.current` retains its previous value.

### Summary of Key Points:

- `useRef` is used to persist values across renders without triggering a re-render when they change.
- It is commonly used for accessing DOM elements (or native elements in React Native) and storing mutable values such as timers, input states, or counters.
- Unlike `useState`, updating a `useRef` value doesn’t cause a re-render.

`useRef` is a simple and effective tool for handling references and storing values that should persist across renders without influencing the UI.
