import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamsList, Feedback } from '../types/navigation';
import Button from '../components/Button'; 
import Icon from 'react-native-vector-icons/FontAwesome';
import LogoText from '../components/LogoText';
import { StackNavigationProp } from '@react-navigation/stack';
import IconRight from '../components/IconRight';
import IconLeft from '../components/IconLeft';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

const CustomerFeedback = () => {
  const route = useRoute<RouteProp<RootStackParamsList, 'CustomerFeedback'>>();
  const { products } = route.params;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]); 

  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  const handleSubmitFeedback = () => {
    if (selectedProduct && feedback) {
      const newFeedback: Feedback = {
        id: new Date().toISOString(),
        productId: selectedProduct.id,
        comment: feedback,
        rating: rating,
        date: new Date().toISOString(),
        sentiment: '',
        productName: selectedProduct.name
      };

      setFeedbacks((prevFeedbacks) => [...prevFeedbacks, newFeedback]);

      setSelectedProduct(null);
      setFeedback('');
      setRating(0);
    } else {
      Alert.alert('Erro', 'Selecione um produto e preencha o feedback.');
    }
  };

  const simulateRandomFeedbacks = () => {
    const randomFeedbacks = [
      'Ótimo produto!',
      'Gostei bastante, recomendo!',
      'Bom, mas pode melhorar.',
      'Não atendeu minhas expectativas.',
      'Produto incrível, superou as expectativas!'
    ];
  
    const randomRating = () => Math.floor(Math.random() * 5) + 1;
  
    const generatedFeedbacks: Feedback[] = products.slice(0, 5).map((product) => {
      const randomFeedback = randomFeedbacks[Math.floor(Math.random() * randomFeedbacks.length)];
      const rating = randomRating();
      return {
        id: new Date().toISOString(),
        productId: product.id,
        productName: product.name,
        comment: randomFeedback,
        rating: rating,
        date: new Date().toISOString(),
        sentiment: ''
      };
    });
  
    console.log('Generated Feedbacks:', generatedFeedbacks); 

    setFeedbacks((prevFeedbacks) => [...prevFeedbacks, ...generatedFeedbacks]);
  };

  useEffect(() => {
    simulateRandomFeedbacks();
  }, [products]);

  const handleNavigateToAnalysisFeedback = () => {
    navigation.navigate('AnalysisFeedback', { feedbacks });
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.productItem}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.productImage} />
      ) : null}
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productDescription}>{item.description}</Text>
      <TouchableOpacity onPress={() => setSelectedProduct(item)}>
        <Text style={styles.selectButton}>Selecionar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderStar = (index: number) => (
    <TouchableOpacity key={index} onPress={() => setRating(index + 1)}>
      <Icon
        name="star"
        size={30}
        color={index < rating ? '#FFD700' : '#ccc'}
        style={styles.star}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconLeftContainer}>
          <IconLeft onPress={() => navigation.navigate('RegisterProduct')} />
        </View>
        <View style={styles.logoContainer}>
          <LogoText />
        </View>
        <View style={styles.iconRightContainer}>
          <IconRight onPress={handleNavigateToAnalysisFeedback} />
        </View>
      </View>
      <Text style={styles.title}>Feedback dos Produtos</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.productList}
      />
      {selectedProduct && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackTitle}>Deixe seu feedback para {selectedProduct.name}</Text>
          <TextInput
            style={styles.feedbackInput}
            placeholder="Escreva seu feedback aqui"
            value={feedback}
            onChangeText={setFeedback}
            multiline
          />
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Avaliação (0 a 5 estrelas)</Text>
            <View style={styles.starsContainer}>
              {[...Array(5)].map((_, index) => renderStar(index))}
            </View>
          </View>
          <Button title="Enviar Feedback" onPress={handleSubmitFeedback} />
        </View>
      )}
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
  iconLeftContainer: {
    position: 'absolute',
    left: 0,
    top: 'auto',
  },
  iconRightContainer: {
    position: 'absolute',
    right: 0,
    top: 'auto',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
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
  selectButton: {
    color: '#ff6600',
    fontWeight: 'bold',
  },
  feedbackContainer: {
    marginHorizontal: 13,
    marginTop: 16,
    padding: 13,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  feedbackInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    height: 100,
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
});

export default CustomerFeedback;
