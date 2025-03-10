import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
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
                Alert.alert('Permission Denied', 'Location permission is required to track your route.');
                return;
            }
        })();
    }, []);

    const startTracking = async () => {
        setTracking(true);
        await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 2000, // Update location every 2 seconds
                distanceInterval: 5, // Update if user moves 5 meters
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
                    latitude: location?.latitude || 37.7749,
                    longitude: location?.longitude || -122.4194,
                    latitudeDelta: 0.01,
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
                <button onPress={startTracking} disabled={tracking}>Start Tracking</button>
                <button onPress={stopTracking} disabled={!tracking}>Stop Tracking</button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { flex: 1 },
    buttons: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 10,
    },
});

export default RouteMapping;
