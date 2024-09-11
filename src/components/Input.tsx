import { StyleSheet, TextInput, View } from "react-native";

interface InputProps {
  placeText: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean; 
}

export default function Input({ placeText, value, onChangeText, secureTextEntry = false }: InputProps) {
  return (
    <View style={styles.input}>
      <TextInput
        placeholderTextColor={'#7E7070'}
        style={styles.textInput}
        placeholder={placeText}
        value={value} 
        onChangeText={onChangeText} 
        secureTextEntry={secureTextEntry} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#484646',
    marginHorizontal: 13
  },
  textInput: {
    height: 55,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 8,
    paddingHorizontal: 13
  }
});
