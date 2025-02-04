import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useColorScheme } from 'react-native'; // Detect light or dark mode
import { FontAwesome } from '@expo/vector-icons'; // For Google icon
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useNavigation } from '@react-navigation/native'; // For navigation

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const colorScheme = useColorScheme(); // Detect light or dark mode
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '<YOUR_GOOGLE_CLIENT_ID>', // Replace with your Google OAuth Client ID
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      handleGoogleSignIn(authentication?.accessToken);
    }
  }, [response]);

  const handleGoogleSignIn = async (accessToken) => {
    try {
      // Send token to your backend API
      const backendResponse = await fetch('https://your-backend-api.com/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: accessToken }),
      });

      if (!backendResponse.ok) {
        throw new Error('Failed to authenticate with backend');
      }

      const userData = await backendResponse.json();
      // Redirect to the Explore page with user data
      navigation.navigate('Explore', { userData });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fc9d03', // Orange background
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colorScheme === 'dark' ? '#033dfc' : '#033dfc', // Button color based on theme
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
    },
    buttonText: {
      color: colorScheme === 'dark' ? '#fff' : '#000', // Text color based on theme
      fontSize: 16,
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <FontAwesome name="google" size={24} color={colorScheme === 'dark' ? '#fff' : '#DB4437'} />
        <Text style={styles.buttonText}>Sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
