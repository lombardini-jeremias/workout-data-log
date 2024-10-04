import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Colors } from "@/constants/Colors";

interface SearchBarProps {
  searchQuery: string;
  onSearch: (text: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearch }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search exercise..."
        placeholderTextColor={Colors.gray}
        autoCorrect={false}
        value={searchQuery}
        onChangeText={onSearch}
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  searchInput: {
    height: 50,
    borderColor: "#FFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 12,
    paddingRight: 12,
    backgroundColor: Colors.dark.background,
    color: Colors.text,
    fontSize: 18,
  },
});
