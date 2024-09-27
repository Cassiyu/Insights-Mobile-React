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

  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  useEffect(() => {
    const checkUserSession = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (!userToken) {
        navigation.navigate('Login');
      }
    };
  
    checkUserSession();
  
    setProducts([
      {
        id: uuidv4(), 
        name: 'Smartphone XYZ',
        description: 'Smartphone com tela de 6.5" e câmera de 48MP.',
        image: 'https://a-static.mlcdn.com.br/450x450/smartphone-samsung-galaxy-a05-128gb-preto-4g-octa-core-4gb-ram-67-cam-dupla-selfie-8mp/magazineluiza/238036500/c464a9551b5703076428e1ad918542d8.jpg'
      },
      {
        id: uuidv4(), 
        name: 'Laptop ABC',
        description: 'Laptop com processador Intel i7 e 16GB de RAM.',
        image: 'https://ae01.alicdn.com/kf/H1c2384bac5394275915ffdf9f36161f70/Notebook-Laptop-14-Polegadas-barato-Laptops-De-Jogos-pre-o-De-F-brica.jpg'
      },
      {
        id: uuidv4(), 
        name: 'Headphones 123',
        description: 'Headphones com cancelamento de ruído ativo e som de alta qualidade.',
        image: 'https://m.media-amazon.com/images/I/51M5wo1PagL._AC_UF1000,1000_QL80_.jpg'
      },
      {
        id: uuidv4(), 
        name: 'Smartwatch Pro',
        description: 'Smartwatch com monitoramento de saúde e GPS integrado.',
        image: 'https://makeluz.com/cdn/shop/products/H849fd8b50bab424296cc508cb34c17ceP.jpg?v=1605639694&width=1445'
      },
      {
        id: uuidv4(), 
        name: 'Tablet DEF',
        description: 'Tablet com tela de 10.1" e 64GB de armazenamento.',
        image: 'https://i.zst.com.br/thumbs/12/35/14/-890147054.jpg'
      }
    ]);
  }, []);

  const handleAddProduct = () => {
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
      setProducts([...products, newProduct]);
      setName('');
      setDescription('');
      setImage('');
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

  const handleUpdateProduct = () => {
    if (editingProductId) {
      const updatedProducts = products.map((product) =>
        product.id === editingProductId
          ? { ...product, name, description, image }
          : product
      );
      setProducts(updatedProducts);
      setName('');
      setDescription('');
      setImage('');
      setEditingProductId(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    const filteredProducts = products.filter((product) => product.id !== id);
    setProducts(filteredProducts);
  };

  const handleNavigateToFeedback = () => {
    navigation.navigate('CustomerFeedback', { products });
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Você tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel" 
          
        },
        {
          text: "Sair",
          onPress: () => navigation.navigate('Login')
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
      <Text style={styles.title}>Cadastro de Produtos</Text>
      <Input
        placeText="Nome do Produto"
        value={name}
        onChangeText={setName}
      />
      <Input
        placeText="Descrição do Produto"
        value={description}
        onChangeText={setDescription}
      />
      <Input
        placeText="URL da Imagem"
        value={image}
        onChangeText={setImage}
      />
      {editingProductId ? (
        <Button title="Atualizar Produto" onPress={handleUpdateProduct} />
      ) : (
        <Button title="Adicionar Produto" onPress={handleAddProduct} />
      )}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}  
        style={styles.productList}
      />
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
});

export default RegisterProduct;
