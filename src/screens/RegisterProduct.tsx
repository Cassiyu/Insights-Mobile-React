import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from '../components/Input';
import Button from '../components/Button';
import LogoText from '../components/LogoText';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamsList } from '../types/navigation';
import IconRight from '../components/IconRight';
import IconLogout from '../components/IconLogout';
import { v4 as uuidv4 } from 'uuid';
import { ref, set, get, remove } from "firebase/database";
import { auth, database } from '../api/firebaseConfig';
import 'react-native-get-random-values';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

const RegisterProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const email = await AsyncStorage.getItem('lastUserEmail');

        if (!userToken) {
          navigation.navigate('Login');
        } else {
          setUserEmail(email || '');
          loadProductsFromFirebase(userToken); 
        }
      } catch (err) {
        console.error('Erro ao carregar dados do usuário:', err);
      }
    };

    checkUserSession();
  }, []);

  const loadProductsFromFirebase = async (userId: string) => {
    try {
      const productRef = ref(database, `users/${userId}/products`);
      const snapshot = await get(productRef);

      if (snapshot.exists()) {
        const productsFromDB = snapshot.val();
        const productArray = Object.keys(productsFromDB).map((key) => productsFromDB[key]);
        setProducts(productArray);
      } else {
        console.log("Nenhum produto encontrado para o usuário.");
      }
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
    }
  };

  const handleAddProduct = async () => {
    if (name && description && image) {
      const isDuplicate = products.some(product => product.name === name);
      if (isDuplicate) {
        alert('Produto já existe.');
        return;
      }

      const newProduct: Product = {
        id: uuidv4(),
        name,
        description,
        image,
      };

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }

        const productRef = ref(database, `users/${userId}/products/${newProduct.id}`);
        await set(productRef, newProduct);

        setProducts([...products, newProduct]);
        setName('');
        setDescription('');
        setImage('');
      } catch (error) {
        console.error("Erro ao salvar produto no Firebase:", error);
      }
    } else {
      alert('Preencha todos os campos.');
    }
  };

  const handleEditProduct = (product: Product) => {
    setName(product.name);
    setDescription(product.description);
    setImage(product.image);
    setEditingProductId(product.id);
  };

  const handleUpdateProduct = async () => {
    if (editingProductId) {
      const updatedProduct: Product = {
        id: editingProductId,
        name,
        description,
        image,
      };

      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          throw new Error("Usuário não autenticado");
        }

        const productRef = ref(database, `users/${userId}/products/${editingProductId}`);
        await set(productRef, updatedProduct);

        const updatedProducts = products.map((product) =>
          product.id === editingProductId ? updatedProduct : product
        );
        setProducts(updatedProducts);
        setName('');
        setDescription('');
        setImage('');
        setEditingProductId(null);
      } catch (error) {
        console.error("Erro ao atualizar produto no Firebase:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setName('');
    setDescription('');
    setImage('');
    setEditingProductId(null);
  };

  const handleDeleteProduct = async (id: string) => {
    Alert.alert(
      "Excluir Produto",
      "Você tem certeza que deseja excluir este produto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const userId = auth.currentUser?.uid;
              if (!userId) {
                throw new Error("Usuário não autenticado");
              }
  
              const productRef = ref(database, `users/${userId}/products/${id}`);
              await remove(productRef);
  
              const filteredProducts = products.filter((product) => product.id !== id);
              setProducts(filteredProducts);
            } catch (error) {
              console.error("Erro ao excluir produto do Firebase:", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  const handleNavigateToFeedback = () => {
    navigation.navigate('CustomerFeedback', { products });
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Você tem certeza que deseja sair?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", onPress: async () => {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('lastUserEmail');
            navigation.navigate('Login');
          }
        }
      ],
      { cancelable: false }
    );
  };


  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : null}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleEditProduct(item)}>
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)}>
          <Text style={styles.buttonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconLogoutContainer}>
          <IconLogout onPress={handleLogout} />
        </View>
        <View style={styles.logoContainer}>
          <LogoText />
        </View>
        <View style={styles.iconRightContainer}>
          <IconRight onPress={handleNavigateToFeedback} />
        </View>
      </View>

      {userEmail ? (
        <Text style={styles.userEmail}>{`Usuário logado: ${userEmail}`}</Text>
      ) : null}

      <Text style={styles.title}>Cadastro de Produtos</Text>
      <Input placeText="Nome do Produto" value={name} onChangeText={setName} />
      <Input placeText="Descrição do Produto" value={description} onChangeText={setDescription} />
      <Input placeText="URL da Imagem" value={image} onChangeText={setImage} />
      
      {editingProductId ? (
        <View style={styles.editButtonsContainer}>
          <Button title="Atualizar Produto" onPress={handleUpdateProduct} />
          <Button title="Cancelar" onPress={handleCancelEdit} />
        </View>
      ) : (
        <Button title="Adicionar Produto" onPress={handleAddProduct} />
      )}
      
      <FlatList data={products} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.productList} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconRightContainer: {
    position: 'absolute',
    right: 0,
    top: 'auto',
  },
  iconLogoutContainer: {
    position: 'absolute',
    left: 0,
    top: 'auto',
  },
  userEmail: {
    textAlign: 'center',
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  productList: {
    marginTop: 8,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 13,
    padding: 13,
    marginBottom: 8,
    elevation: 1,
  },
  productImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonText: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  editButtonsContainer: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
});

export default RegisterProduct;
