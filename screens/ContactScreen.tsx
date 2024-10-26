// ContactScreen.tsx

import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';

const ContactScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:androjorjikia@yahoo.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:577442003');
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.contactContainer}>
        <Text style={styles.heading}>კონტაქტები</Text>
        <Text style={styles.intro}>მოგვწერეთ მაილზე ან დაგვირეკეთ ქვემოთ მითითებულ ნომერზე</Text>

        <Animatable.View animation="fadeInUp" delay={300} style={styles.contactItem}>
          <Ionicons name="mail-outline" size={28} color="#D32F2F" />
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.contactText}>test</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={500} style={styles.contactItem}>
          <Ionicons name="call-outline" size={28} color="#D32F2F" />
          <TouchableOpacity onPress={handlePhonePress}>
            <Text style={styles.contactText}>+955 577442003</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: -10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
   
  },
  contactContainer: {
    top: -60,
    width: '90%',
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D32F2F', 
    textAlign: 'center',
    marginBottom: 10,
  },
  intro: {
    fontSize: 16,
    color: '#333333', 
    marginBottom: 20,
    textAlign: 'center',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    borderColor: '#D32F2F',
    borderWidth: 1,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  contactText: {
    fontSize: 18,
    color: '#000000', 
    marginLeft: 10,
  },
});

export default ContactScreen;
