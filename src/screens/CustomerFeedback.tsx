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
import { v4 as uuidv4 } from 'uuid';
import { auth, database } from '../api/firebaseConfig';
import { ref, set, onValue, update, remove } from 'firebase/database';

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
  const [isEditing, setIsEditing] = useState(false);
  const [editingFeedbackId, setEditingFeedbackId] = useState<string | null>(null); 
  const navigation = useNavigation<StackNavigationProp<RootStackParamsList>>();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (userId) {
      const feedbackRef = ref(database, `users/${userId}/feedbacks`);
      const unsubscribe = onValue(feedbackRef, (snapshot) => {
        if (snapshot.exists()) {
          const feedbackData = snapshot.val();
          const feedbackArray = Object.keys(feedbackData).map(key => feedbackData[key]);
          setFeedbacks(feedbackArray);
        } else {
          setFeedbacks([]);
        }
      });
      return () => unsubscribe();
    }
  }, [products]);

  const handleSubmitFeedback = async () => {
    if (selectedProduct && feedback) {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Usuário não autenticado");
  
      if (isEditing && editingFeedbackId) {
        await handleUpdateFeedback(editingFeedbackId);
      } else {
        const newFeedback: Feedback = {
          id: uuidv4(),
          productId: selectedProduct.id,
          comment: feedback,
          rating,
          date: new Date().toISOString(),
          productName: selectedProduct.name
        };
  
        try {
          await set(ref(database, `users/${userId}/feedbacks/${newFeedback.id}`), newFeedback);
          setSelectedProduct(null);
          setFeedback('');
          setRating(0);
        } catch (error) {
          console.error("Erro ao salvar feedback no Firebase:", error);
        }
      }
      setIsEditing(false);
      setEditingFeedbackId(null);
    } else {
      Alert.alert('Erro', 'Selecione um produto e preencha o feedback.');
    }
  };
  

  const handleEditFeedback = (feedback: Feedback) => {
    setSelectedProduct(products.find(product => product.id === feedback.productId) || null);
    setFeedback(feedback.comment);
    setRating(feedback.rating);
    setIsEditing(true);
    setEditingFeedbackId(feedback.id);
  };

  const handleUpdateFeedback = async (feedbackId: string) => {
    const updatedFeedback: Feedback = {
      id: feedbackId,
      productId: selectedProduct?.id || '',
      comment: feedback,
      rating,
      date: new Date().toISOString(),
      productName: selectedProduct?.name || ''
    };

    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("Usuário não autenticado");

      await update(ref(database, `users/${userId}/feedbacks/${feedbackId}`), updatedFeedback);

      setSelectedProduct(null);
      setFeedback('');
      setRating(0);
      setIsEditing(false);
      setEditingFeedbackId(null); 
    } catch (error) {
      console.error("Erro ao atualizar feedback no Firebase:", error);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    Alert.alert(
      "Excluir Feedback",
      "Você tem certeza que deseja excluir este feedback?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const userId = auth.currentUser?.uid;
              if (!userId) throw new Error("Usuário não autenticado");
  
              await remove(ref(database, `users/${userId}/feedbacks/${feedbackId}`));
  
              setFeedbacks(prev => prev.filter(fb => fb.id !== feedbackId));
            } catch (error) {
              console.error("Erro ao excluir feedback do Firebase:", error);
            }
          }
        }
      ],
      { cancelable: true }
    );
  };
  

  const renderFeedbackItem = (feedback: Feedback) => (
    <View key={feedback.id} style={styles.feedbackItem}>
      <Text>{feedback.comment}</Text>
      <Text>Rating: {feedback.rating}</Text>
      <View style={styles.feedbackActions}>
        <TouchableOpacity onPress={() => handleEditFeedback(feedback)}>
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteFeedback(feedback.id)}>
          <Text style={styles.deleteButton}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
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
          <IconRight onPress={() => navigation.navigate('AnalysisFeedback', { feedbacks })} />
        </View>
      </View>

      <Text style={styles.title}>Feedback dos Produtos</Text>

      <FlatList
        data={products}
        renderItem={({ item }) => {
          const hasFeedback = feedbacks.some(feedback => feedback.productId === item.id);
          return (
            <View style={styles.productItem}>
              {item.image && <Image source={{ uri: item.image }} style={styles.productImage} />}
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
              {!hasFeedback && (
                <TouchableOpacity onPress={() => { setSelectedProduct(item); setIsEditing(false); }}>
                  <Text style={styles.selectButton}>Avaliar</Text>
                </TouchableOpacity>
              )}
              {feedbacks
                .filter(feedback => feedback.productId === item.id)
                .map(renderFeedbackItem)}
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
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
              {[...Array(5)].map((_, index) => (
                <TouchableOpacity onPress={() => setRating(index + 1)} key={index}>
                  <Icon name="star" size={30} color={index < rating ? '#FFD700' : '#ccc'} style={styles.star} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <Button
            title={isEditing ? "Atualizar Feedback" : "Enviar Feedback"}
            onPress={handleSubmitFeedback}
          />
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
    paddingVertical: 10,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconLeftContainer: {
    position: 'absolute',
    left: 10,
  },
  iconRightContainer: {
    position: 'absolute',
    right: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  productList: {
    marginTop: 8,
  },
  productItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 13,
    padding: 15,
    marginBottom: 8,
    elevation: 2,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  selectButton: {
    color: '#ff6600',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  feedbackContainer: {
    marginHorizontal: 13,
    marginTop: 16,
    padding: 13,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 2,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  feedbackInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    height: 100,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 2,
  },
  feedbackItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    marginTop: 8
  },
  feedbackActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8
  },
  editButton: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
  deleteButton: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

export default CustomerFeedback;
