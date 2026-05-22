import React from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Modal} from 'react-native';

const StatusModal = ({visible, onRetry, onLater}) => {

    return (
        <Modal visible = {visible} transparent animationType= "fade">
            <View style = {styles.modalContainer}>
                <View style = {styles.modalContent}>
                    <Text style = {styles.modalText}>
                        Não foi possível conectar ao Broker HiveMQ.
                        Verifique sua conexão e credenciais.
                    </Text>
                </View>

            </View>

        </Modal>
    );
};