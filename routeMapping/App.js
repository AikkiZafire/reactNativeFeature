import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TouchableOpacity, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';

const RouteMapping = () => {
    const [location, setLocation] = useState(null);
    const [route, setRoute] = useState([]);
    const [tracking, setTracking] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Location access is required for tracking.');
                return;
            }
    
            // Get initial location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            });
        })();
    }, []);


    const startTracking = async () => {
        setTracking(true);
    
        // Start location tracking
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 1000,  // Updates location every 1 second
                distanceInterval: 3, // Updates when user moves 3 meters
            },
            (newLocation) => {
                const { latitude, longitude } = newLocation.coords;
                setLocation({ latitude, longitude });
    
                setRoute((prevRoute) => [...prevRoute, { latitude, longitude }]);
            }
        );
    };
  

    const stopTracking = () => {
        setTracking(false);
    };

    return (
        <View style={styles.container}>

            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 49.2827, // Vancouver latitude
                    longitude: -123.1207, // Vancouver longitude
                    latitudeDelta: 0.01, // Zoom level
                    longitudeDelta: 0.01,
                }}
                showsUserLocation={true}
            >
                {route.length > 0 && (
                    <>
                        <Polyline coordinates={route} strokeWidth={4} strokeColor="blue" />
                        <Marker coordinate={route[0]} title="Start" pinColor="green" />
                        <Marker coordinate={route[route.length - 1]} title="Current" pinColor="red" />
                    </>
                )}
            </MapView>

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.button} onPress={startTracking} disabled={tracking}>
                  <Text style={styles.buttonText}>Start Tracking</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.button} onPress={stopTracking} disabled={!tracking}>
                  <Text style={styles.buttonText}>Stop Tracking</Text>
              </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'flex-end', 
    paddingTop: 40, 
   },
  map: { flex: 1 },
  buttons: {
      position: 'absolute',
      bottom: 50, // Move the button closer to the bottom
      alignSelf: 'center',
      flexDirection: 'row',
      gap: 10,
  },
  button: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
  },
  buttonText: {
      color: 'white',
      fontWeight: 'bold',
  },
});

export default RouteMapping;
