import React, { useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput } from "react-native";
import ProductList from "../../components/ProductList";

const App = () => {
  const [tags, setTags] = useState(["summer"]); 

  const handleInputChange = (text) => {
    const inputTags = text.split(",").map((tag) => tag.trim());
    setTags(inputTags);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Enter tags separated by comma"
          onChangeText={handleInputChange}
        />
        <ProductList tags={tags} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default App;