import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Sentiment from 'sentiment';
import translateText from '../api/translateText'; 
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamsList } from '../types/navigation';
import LogoText from '../components/LogoText';
import IconLeft from '../components/IconLeft';

interface Feedback {
    id: string; 
    productId: string;
    productName: string;
    comment: string;
    rating: number;
    sentiment?: string;
}

const screenWidth = Dimensions.get('window').width;

const AnalysisFeedback = () => {
    const route = useRoute<RouteProp<RootStackParamsList, 'AnalysisFeedback'>>();
    const navigation = useNavigation();
    const { feedbacks } = route.params;

    const [totalFeedbacks, setTotalFeedbacks] = useState<number>(0);
    const [averageRating, setAverageRating] = useState<number>(0);
    const [sentimentStats, setSentimentStats] = useState({
        positive: 0,
        neutral: 0,
        negative: 0,
    });

    useEffect(() => {
        analyzeFeedbacks();
    }, [feedbacks]);

    const analyzeFeedbacks = async () => {
        let total = feedbacks.length;
        let sumRating = 0;
        let sentimentAnalysis = { positive: 0, neutral: 0, negative: 0 };
        const sentiment = new Sentiment();

        for (const feedback of feedbacks) {
            sumRating += feedback.rating;

            const translatedText = await translateText(feedback.comment);
            const result = sentiment.analyze(translatedText);
            const feedbackSentiment =
                result.score > 0 ? 'positive' : result.score < 0 ? 'negative' : 'neutral';

            feedback.sentiment = feedbackSentiment;
            sentimentAnalysis[feedbackSentiment]++;
        }

        setTotalFeedbacks(total);
        setAverageRating(total > 0 ? sumRating / total : 0);
        setSentimentStats(sentimentAnalysis);
    };

    const renderFeedbackItem = ({ item }: { item: Feedback }) => (
        <View style={styles.feedbackItem}>
            <Text style={styles.feedbackComment}>{item.comment}</Text>
            <Text style={styles.feedbackProduct}>Produto: {item.productName}</Text>
            <Text style={styles.feedbackRating}>Rating: {item.rating} estrelas</Text>
            <Text style={styles.feedbackSentiment}>
                Sentimento: {item.sentiment === 'positive' ? '😊 Positivo' : item.sentiment === 'negative' ? '😡 Negativo' : '😐 Neutro'}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.iconLeftContainer}>
                    <IconLeft onPress={() => navigation.goBack()} />
                </View>
                <View style={styles.logoContainer}>
                    <LogoText />
                </View>
            </View>
            <Text style={styles.title}>Análise de Feedbacks</Text>

            <View style={styles.summaryContainer}>
                <Text>Total de Feedbacks: {totalFeedbacks}</Text>
                <Text>Média de Avaliações: {averageRating.toFixed(1)} ⭐</Text>
                <Text>Positivos: {sentimentStats.positive}</Text>
                <Text>Neutros: {sentimentStats.neutral}</Text>
                <Text>Negativos: {sentimentStats.negative}</Text>
            </View>

            <BarChart
                data={{
                    labels: ['Positivos', 'Neutros', 'Negativos'],
                    datasets: [{ data: [sentimentStats.positive, sentimentStats.neutral, sentimentStats.negative] }],
                }}
                width={screenWidth - 40} 
                height={220} 
                yAxisLabel="" 
                yAxisSuffix=""
                chartConfig={{
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 0, 
                    color: (opacity = 1) => `rgba(255, 102, 0, ${opacity})`,
                    barPercentage: 0.5,
                }}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />

            <FlatList
                data={feedbacks}
                renderItem={renderFeedbackItem}
                keyExtractor={(item) => item.id}
                style={styles.feedbackList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 16,
    },
    summaryContainer: {
        marginBottom: 16,
    },
    feedbackList: {
        marginTop: 16,
    },
    feedbackItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    feedbackComment: {
        fontSize: 16,
        marginBottom: 4,
    },
    feedbackProduct: {
        fontSize: 14,
        color: '#666',
    },
    feedbackRating: {
        fontSize: 14,
        color: '#666',
    },
    feedbackSentiment: {
        fontSize: 14,
        color: '#666',
    },
});

export default AnalysisFeedback;
