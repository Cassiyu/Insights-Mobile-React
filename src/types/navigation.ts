import { StackNavigationProp } from '@react-navigation/stack';

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Feedback {
  sentiment: string;
  id: string;
  productId: string;
  productName: string;
  comment: string;
  rating: number;
  date: string;
}


export type RootStackParamsList = {
  RegisterProduct: undefined;
  Login: undefined;
  CustomerFeedback: { products: Product[] };
  AnalysisFeedback: { feedbacks: Feedback[] };
  Settings: undefined;
  SignUp: undefined;
};

export type LoginNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'Login'
>;

export type SignUpNavigationProp = StackNavigationProp<
  RootStackParamsList,
  'SignUp'
>;