import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationProp } from '../types/navigation'; 
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const inputProps1  = {
    placeText: 'Email'
  };

  const inputProps2  = {
    placeText: 'Senha'
  };

  const navigation = useNavigation<LoginNavigationProp>();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          navigation.navigate('RegisterProduct');
        }
      } catch (err) {
        console.error('Erro ao verificar sessão', err);
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = userCredential.user.uid; 

      await AsyncStorage.setItem('userToken', token);

      console.log('Login bem-sucedido!');
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
        placeText={inputProps1.placeText}
        value={email}
        onChangeText={setEmail}
      />

      <Input 
        placeText={inputProps2.placeText}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? <Text style={{ marginTop: 8, color: 'red', textAlign: 'center' }}>{error}</Text> : null}
      
      <Button 
        title="Login" 
        onPress={handleLogin} 
      />
    
      <Text  
        style={styles.text} 
        onPress={() => navigation.navigate('SignUp')}
      >
        Novo por aqui? Crie uma conta
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1, 
    justifyContent: 'center'
  },
  text: {
    marginTop: 8,
    textAlign: 'center',
    color: '#ff6600',
    fontWeight: 'semibold'
  }
});

export default Login;
