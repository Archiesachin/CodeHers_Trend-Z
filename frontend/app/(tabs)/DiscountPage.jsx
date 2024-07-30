import React, { useState } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity, Text, Image, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { icons } from "../../constants";
import DiscountImage from '../../assets/discounts.png';

const DiscountPage = () => {
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const discounts = [
    { id: "1", image: DiscountImage, discount: "20% Off", reason: "Maintaining 100 days Fwd Snap Score" },
    { id: "2", image: DiscountImage, discount: "15% Off", reason: "Reffering Friends" },
    { id: "3", image: DiscountImage, discount: "10% Off", reason: "Seasonal Sale" },
    { id: "4", image: DiscountImage, discount: "10% Off", reason: "Limited Time Offer" },
  ];

  const handleDiscountPress = (discount) => {
    setSelectedDiscount(discount);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.discountBox} onPress={() => handleDiscountPress(item)}>
      <Image source={item.image} style={styles.discountImage} resizeMode="cover" />
      <Text style={styles.discountText}>Tap for Discount</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <MaterialIcons name="chevron-left" size={32} color="#fff" onPress={() => navigation.goBack()} />
          <Text style={styles.headerText}>Discounts</Text>
          <View style={styles.profileContainer}>
            <Image source={icons.profile} resizeMode="contain" style={styles.profileImage} />
          </View>
        </View>
      </View>

      <FlatList
        data={discounts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <Modal
        visible={!!selectedDiscount}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectedDiscount(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalDiscountText}>{selectedDiscount?.discount}</Text>
            <Text style={styles.modalReasonText}>{selectedDiscount?.reason}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedDiscount(null)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingTop: 60,
    backgroundColor: "#F13AB1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F13AB1",
    paddingBottom: 20,
    paddingHorizontal: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  list: {
    padding: 8,
  },
  discountBox: {
    flex: 1,
    margin: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  discountImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  discountText: {
    marginTop: 8,
    fontSize: 16,
    color: "#333",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalDiscountText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalReasonText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF9C01",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default DiscountPage;
