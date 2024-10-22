import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from "react-native";

const { height: screenHeight } = Dimensions.get("window");

interface BottomSheetReusableProps {
  isVisible: boolean;
  onClose: () => void;
  onDeleteSet: () => void;
}

export default function BottomSheetReusable({
  isVisible,
  onClose,
  onDeleteSet,
}: BottomSheetReusableProps) {
  const translateY = useRef(new Animated.Value(screenHeight)).current;

  // Create panResponder for dragging the sheet
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: translateY }], {
            useNativeDriver: false,
          })(event, gestureState);
        }
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 50) {
          closeSheet(); // Close the sheet if dragged down
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const openSheet = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(translateY, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(onClose);
  };

  if (isVisible) {
    openSheet();
  }

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={closeSheet}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.background} onPress={closeSheet} />
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.sheetContainer,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Options</Text>
          <TouchableOpacity onPress={onDeleteSet}>
            <Text style={styles.optionText1}>Delete Set</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={closeSheet}>
            <Text style={styles.optionText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sheetContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    borderRadius: 2.5,
    marginVertical: 10,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionText1: {
    color: "red",
    fontSize: 16,
    paddingVertical: 10,
    textAlign: "center",
  },
  optionText: {
    fontSize: 16,
    paddingVertical: 10,
    textAlign: "center",
  },
});
