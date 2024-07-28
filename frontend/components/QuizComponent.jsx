import React, { useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from "expo-router";
import products from '../data/thisthat'; // Adjust the import path as needed
import barbie from "../assets/images/Barbie Core.png"
import academia from "../assets/images/academia-core.png"
import brat from "../assets/images/brat-core.png"
import goth from "../assets/images/goth-core.png"
import street from "../assets/images/street-core.png"
import corporate from "../assets/images/Corporate-core.png"
import cottage from "../assets/images/cottage-core.png"

const QuizComponent = () => {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [userChoices, setUserChoices] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const questions = [
    { question: "Outfit for a Day Out", optionA: barbie, optionB: cottage },
    { question: "Work Attire", optionA: corporate, optionB: street },
    { question: "Favorite Academic Style", optionA: academia, optionB: brat },
    { question: "Party Look", optionA: corporate, optionB: goth },
    { question: "Weekend Vibes", optionA: barbie, optionB: cottage },
  ];

  const cores = {
    'Barbie': 0,
    'Cottage': 0,
    'Corporate': 0,
    'Street': 0,
    'Brat': 0,
    'Old Academia': 0,
    'Goth': 0
  };

  const questionToCore = {
    0: { 'A': 'Barbie', 'B': 'Cottage' },
    1: { 'A': 'Corporate', 'B': 'Street' },
    2: { 'A': 'Old Academia', 'B': 'Brat' },
    3: { 'A': 'Corporate', 'B': 'Goth' },
    4: { 'A': 'Barbie', 'B': 'Cottage' }
  };

  const handleChoice = (choice) => {
    const newChoices = [...userChoices, choice];
    setUserChoices(newChoices);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate core scores
      newChoices.forEach((choice, index) => {
        const core = questionToCore[index][choice];
        cores[core]++;
      });

      // Determine the recommended core
      const recommendedCore = Object.keys(cores).reduce((a, b) => cores[a] > cores[b] ? a : b);

      // Filter products based on recommended core
      const filtered = products.filter(product =>
        product.cores && product.cores.toLowerCase().includes(recommendedCore.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleProductPress = (item) => {
    router.push({
      pathname: "/ProductDetailScreen",
      params: { product: JSON.stringify(item) },
    });
  };

  const renderQuiz = () => {
    if (step < questions.length) {
      const currentQuestion = questions[step];
      return (
        <View style={styles.quizContainer}>
          <Text style={styles.quizHeading}>CHOOSE YOUR CORE</Text>
          <Text style={styles.quizQuestion}>{currentQuestion.question}</Text>
          <View style={styles.quizOptions}>
            <TouchableOpacity
              style={styles.quizOption}
              onPress={() => handleChoice('A')}
            >
              <Image source={currentQuestion.optionA} style={styles.optionImage} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quizOption}
              onPress={() => handleChoice('B')}
            >
              <Image source={currentQuestion.optionB} style={styles.optionImage} />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return null;
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.cores}>{item.cores}</Text>
      <TouchableOpacity onPress={() => Linking.openURL(item.url)}>
        <Text style={styles.url} onPress={() => handleProductPress(item)}>View Product</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderQuiz()}
      {filteredProducts.length > 0 && (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  quizContainer: {
    marginBottom: 20,
    justifyContent: 'center',
  },
  quizHeading: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color:"#F13AB1",
    fontSize : 30 ,
    lineHeight: 36 ,
  },
  quizQuestion: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  quizOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quizOption: {
    flex: 1,
    padding: 10
  },
  optionImage: {
    width: '100%',
    height: 200,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    margin: 8,
    elevation: 2,
    alignItems: "center",
    width:200
  },
  image: {
    width: "100%",
    height: 150,
    borderRadius: 8,
  },
  cores: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  url: {
    marginTop: 5,
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    backgroundColor:'#FF9C01',
    paddingHorizontal: 20,
    padding:10,
    borderRadius: 5
  },
  row: {
    justifyContent: 'space-between',
  },
});

export default QuizComponent;
