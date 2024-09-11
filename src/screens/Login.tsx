import React, { useState } from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../api/firebase';
import { useNavigation } from '@react-navigation/native';
import { LoginNavigationProp } from '../types/navigation'; 
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const inputProps1  = {
    placeText: 'Email'
  }

  const inputProps2  = {
    placeText: 'Senha'
  }

  
  const navigation = useNavigation<LoginNavigationProp>();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
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
      <Logo/>
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
      >Novo por aqui? Crie uma conta</Text>
    
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
})

export default Login;


