import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigation } from '@react-navigation/native';
import { SignUpNavigationProp } from '../types/navigation';
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const navigation = useNavigation<SignUpNavigationProp>();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('As senhas não correspondem');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Cadastro bem-sucedido!');
      navigation.navigate('RegisterProduct'); 
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError('Erro desconhecido');
      }
    }
  };

  return (
    <View style={styles.view}>
      <Logo />
      <Input 
        placeText="Email"
        value={email}
        onChangeText={setEmail}
      />

      <Input 
        placeText="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Input 
        placeText="Confirme a Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <Button 
        title="Cadastrar" 
        onPress={handleSignUp} 
      />
    
      <Text  
        style={styles.text} 
        onPress={() => navigation.navigate('Login')}
      >Já está cadastrado? Entre</Text>
    
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    padding: 16
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
    color: '#ff6600',
    fontWeight: 'semibold'
  },
  errorText: {
    marginTop: 8,
    color: 'red',
    textAlign: 'center'
  }
});

export default SignUp;
