import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import BackButton from "../../components/navigation/BackButton";

const StorageViewerScreen = () => {
  const navigation = useNavigation();
  const [storageData, setStorageData] = useState([]);

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      console.log(result);
      setStorageData(result);
    } catch (error) {
      console.error("Error loading AsyncStorage:", error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton />,
    });
  }, [navigation]);

  const removeItem = async (key) => {
    try {
      await AsyncStorage.removeItem(key);
      loadStorageData();
    } catch (error) {
      console.error("Error removing item from AsyncStorage:", error);
    }
  };

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <ScrollView style={styles.screenContainer}>
      <Button
        title="Reload Storage"
        onPress={loadStorageData}
        color={"black"}
      />
      {storageData.map(([key, value], index) => (
        <View key={index} style={styles.storageItem}>
          <Text style={styles.keyText}>Key: {key}</Text>
          <Text>Value: {value}</Text>
          <TouchableOpacity
            onPress={() => removeItem(key)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
  },
  storageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: Colors.lightGray,
  },
  keyText: {
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
  },
  deleteText: {
    color: Colors.error,
  },
});

export default StorageViewerScreen;
