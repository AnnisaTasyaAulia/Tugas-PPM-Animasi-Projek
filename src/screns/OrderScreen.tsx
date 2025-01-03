import React, { useState, useContext, useEffect } from 'react';
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity, Modal, Image, Alert, Dimensions, Button } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CartContext } from '../cart/CartContext';

export default function OrderScreen({ route, navigation }) {
  const { cart, setCart } = useContext(CartContext);
  const [quantities, setQuantities] = useState(cart.length > 0 ? cart.map(() => 1) : []);
  const [modalVisible, setModalVisible] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    const updateLayout = () => {
      const { width, height } = Dimensions.get('window');
      setOrientation(width > height ? 'landscape' : 'portrait');
    };

    const subscription = Dimensions.addEventListener('change', updateLayout);
    updateLayout(); // Panggil fungsi untuk set awal

    return () => {
      subscription?.remove(); // Menghapus listener saat komponen di-unmount
    };
  }, []);

  const handleCheckout = () => {
    setModalVisible(true);
    console.log("Proceed to checkout");
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    const newQuantities = quantities.filter((_, i) => i !== index);
    setCart(newCart);
    setQuantities(newQuantities);
    Alert.alert("Successfully.");
  };

  const increaseQuantity = (index) => {
    const newQuantities = [...quantities];
    newQuantities[index] += 1;
    setQuantities(newQuantities);
  };

  const decreaseQuantity = (index) => {
    if (quantities[index] > 1) {
      const newQuantities = [...quantities];
      newQuantities[index] -= 1;
      setQuantities(newQuantities);
    } else {
      Alert.alert(
        "Delete Order",
        "Are sure to delete this item?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress: () => removeItem(index) }
        ]
      );
    }
  };

  const calculateTotalPrice = () => {
    const total = cart.reduce((total, item, index) => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")) || 0; // Menghapus simbol mata uang
      const quantity = quantities[index] || 0;
      return total + (price * quantity);
    }, 0);

    return total.toFixed(2);
  };

  const totalPrice = calculateTotalPrice(); // Menghitung total harga

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Order</Text>
      </View>
      <ScrollView>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <Image source={{ uri: item.strCategoryThumb }} style={styles.cartItemImage} />
              <View style={styles.cartItemDetails}>
                <Text style={styles.mealCategory}>{item.strCategory}</Text>
                <Text style={styles.cartItemPrice}>{item.price}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => decreaseQuantity(index)} style={styles.quantityButton}>
                  <Ionicons name="remove-circle-outline" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{quantities[index]}</Text>
                <TouchableOpacity onPress={() => increaseQuantity(index)} style={styles.quantityButton}>
                  <Ionicons name="add-circle-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noItemsText}>Your cart is empty</Text>
        )}
      </ScrollView>
      {cart.length > 0 && (
        <View style={styles.totalCheckoutContainer}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalPriceText}>Total: $ {totalPrice}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your order is being processed</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEEEE5', padding: 20 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  cartItem: {
    backgroundColor: '#FDE0CF',
    marginBottom: 15,
    padding: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 10,
  },
  cartItemDetails: {
    flex: 1,
  },
  mealCategory: { fontSize: 18, fontWeight: 'bold' },
  cartItemPrice: { fontSize: 16, color: '#555' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
    justifyContent: 'center'
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 18,
  },
  noItemsText: { fontSize: 18, textAlign: 'center', marginTop: 20 },
  totalCheckoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalContainer: {
    flex: 1, // Memastikan total mengambil ruang yang tersedia
    alignItems: 'center', // Menempatkan teks total di sebelah kiri
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#EEAB81',
    padding: 20,
    borderRadius: 5,
    marginLeft: 10,
    width: '50%',
  },
  checkoutButtonText: {
    color: 'black', fontWeight: 'bold', textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    height: 120,
    padding: 20,
    backgroundColor: '#FDE0CF',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  buttonContainer: {
    position: 'absolute', // Menggunakan posisi absolut
    bottom: 18, // Jarak dari bawah
    right: 18, 
  },
  closeButton: {
    fontSize: 16,
    color: 'red', // Warna teks tombol
  },
});
