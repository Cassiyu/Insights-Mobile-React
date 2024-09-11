import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  buttonStyle?: ViewStyle;  
  textStyle?: TextStyle;   
}

export default function Button({ title, onPress, buttonStyle, textStyle }: ButtonProps) {
  return (
    <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
    height: 55,
    backgroundColor: '#ff6600', 
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 13
  },
  text: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  }
});
