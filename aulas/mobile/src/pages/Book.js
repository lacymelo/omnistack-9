import React, { useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View, Alert, TextInput, Text, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "../services/api";

export default function Book() {
    const [date, setDate] = useState('');
    const [id, setSpot] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
        async function showSpot(){

            const response = await AsyncStorage.getItem('spotId');

            setSpot(response);
        }

        showSpot();
    }, []);

    async function handleSubmit() {
        const user_id = await AsyncStorage.getItem('user');

        await api.post(`/spots/${id}/booking`, {
            date
        }, {
            headers: {user_id}
        })

        Alert.alert('Solicitação de reserva enviada.');

        await AsyncStorage.getItem('spotId');
        
        navigation.navigate('List');
    }

    function handleCancel (){
        navigation.navigate('List');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>DATA DE INTERESSE *</Text>
            
            <TextInput style={styles.input}
            placeholder="Qual data você quer reservar?"
            placeholderTextColor="#999"
            autoCapitalize="words"
            autoCorrect={false}
            value={date}
            onChangeText={setDate} />

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}> Solicitar Reserva </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleCancel} style={[styles.button, styles.cancelButton]}>
              <Text style={styles.buttonText}> Cancelar </Text>
            </TouchableOpacity>

        </SafeAreaView>
    ); 
}

const styles = StyleSheet.create({

    container: {
        margin: 30,
    },

    label: {
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 8,
        marginTop: 20,
    },
  
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#444',
        height: 44,
        marginBottom: 20,
        borderRadius: 2
    },

    button: {
        height: 42,
        backgroundColor: '#f05a5b',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
    },

    cancelButton: {
        backgroundColor: '#ccc',
        marginTop: 10,
    },
  
    buttonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    }
});