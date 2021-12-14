import React, { useState, useEffect } from "react";
import {Alert, SafeAreaView, ScrollView, Text, Image, StyleSheet } from "react-native";
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpotList from "../components/SpotList";

import logo from '../assets/logo.png'

export default function List({ navigation }) {

    const [ techs , setTechs] = useState([]);

    useEffect(() => {
        AsyncStorage.getItem('user').then(user_id => {
            const socket = io('http://192.168.10.165:3333', {
                query: {user_id}
            })

            socket.on('booking_response', booking => {
                Alert.alert(`Sua reserva em ${booking.spot.company} em ${booking.date} foi ${booking.approved ? 'APROVADA' : 'REJEITADA'}`);
            });
        });
    }, []);

    useEffect(() => {

        AsyncStorage.getItem('techs').then(storageTechs => {
            const techsArray = storageTechs.split(',').map(tech => tech.trim());

            setTechs(techsArray);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <Image style={styles.logo} source={logo} />

            <ScrollView>
                {techs.map(tech => <SpotList key={tech} tech={tech} />)}
            </ScrollView>
        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30,
    },

    logo: {
        height: 32,
        resizeMode: "contain",
        alignSelf: 'center',
        marginTop: 10
    },

    
});