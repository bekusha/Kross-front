
import React from 'react';
import { View, Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const ContactScreen = () => {
  const handleEmailPress = () => {
    Linking.openURL('mailto:androjorjikia@yahoo.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:577979701');
  };


  const location = {
    latitude: 41.7257,
    longitude: 44.7839,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" style={styles.contactContainer}>
        <Text style={styles.heading}>კონტაქტი</Text>
        <Text style={styles.intro}>მოგვწერეთ მაილზე ან დაგვირეკეთ ქვემოთ მითითებულ ნომერზე</Text>

        <Animatable.View animation="fadeInUp" delay={300} style={styles.contactItem}>
          <Ionicons name="mail-outline" size={28} color="#D32F2F" />
          <TouchableOpacity onPress={handleEmailPress}>
            <Text style={styles.contactText}>Kross Georgia</Text>
          </TouchableOpacity>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={500} style={styles.contactItem}>
          <Ionicons name="call-outline" size={28} color="#D32F2F" />
          <TouchableOpacity onPress={handlePhonePress}>
            <Text style={styles.contactText}>+955 577 97 97 01</Text>
          </TouchableOpacity>
        </Animatable.View>
      </Animatable.View>

      <Animatable.View animation="slideInUp" duration={800} delay={800} style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={location}
        >
          <Marker coordinate={location} title="Kross Georgia" description="30 Khosharauli Street, Tbilisi, Georgia" />
        </MapView>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
    width: '100%',
  },
  contactContainer: {
    width: '90%',
    padding: 20,
    alignSelf: 'center',
    borderRadius: 15,
    backgroundColor: '#F9F9F9',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
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
  mapContainer: {
    width: '90%',
    height: 250,
    borderRadius: 15,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
    borderColor: '#D32F2F',
    borderWidth: 2,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default ContactScreen;