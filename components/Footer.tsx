import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install @expo/vector-icons

const Footer = () => {
  const navigation = useNavigation();
  const [isOpen, setIsOpen] = useState(false);
  const heightAnimation = useState(new Animated.Value(0))[0];

  const toggleFooter = () => {
    setIsOpen(!isOpen);
    Animated.timing(heightAnimation, {
      toValue: isOpen ? 0 : 240,
      duration: 300,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
      useNativeDriver: false,
    }).start();
  };

  const handleNavigation = (route: string) => {
    console.log('Navigating to:', route);
    navigation.navigate(route as never);
    toggleFooter(); // Close menu after navigation
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isOpen && styles.buttonActive]}
        onPress={toggleFooter}
      >
        <Animated.View
          style={{
            transform: [{
              rotate: heightAnimation.interpolate({
                inputRange: [0, 240],
                outputRange: ['0deg', '0deg']
              })
            }]
          }}
        >
          <Ionicons name="chevron-up" size={32} color="#FFF" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View style={[styles.popupContainer, { height: heightAnimation }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("Products")}
          >
            <Ionicons name="grid-outline" size={24} color="#FFF" />
            <Text style={styles.menuText}>ყველა პროდუქტი</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("OilChangeScreen")}
          >
            <Ionicons name="construct-outline" size={24} color="#FFF" />
            <Text style={styles.menuText}>ზეთის შეცვლა გამოძახებით</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("ChatScreen")}
          >
            <Ionicons name="chatbubble-ellipses-outline" size={24} color="#FFF" />
            <Text style={styles.menuText}>შეარჩიე სწორი ზეთი</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#D32F2F',
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ rotate: '0deg' }],
  },
  buttonActive: {
    backgroundColor: '#dc2626', // Red color when active
    transform: [{ rotate: '180deg' }],
  },
  popupContainer: {
    position: 'absolute',
    bottom: 70,
    backgroundColor: 'rgba(17, 24, 39, 0.95)', // Dark background with opacity
    borderRadius: 20,
    width: 290,
    padding: 20,
    gap: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    gap: 15,
    width: "100%",
    height: 60,
  },
  menuText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Footer;

