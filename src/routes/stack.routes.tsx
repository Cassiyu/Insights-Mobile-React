import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { RootStackParamsList } from '../types/navigation'
import RegisterProduct from '../screens/RegisterProduct';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import CustomerFeedback from '../screens/CustomerFeedback';
import AnalysisFeedback from '../screens/AnalysisFeedback';

const StackNavigator = createNativeStackNavigator<RootStackParamsList>()

const StackNavigation = () => {
    return (
      <StackNavigator.Navigator initialRouteName="Login">
        <StackNavigator.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <StackNavigator.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
        <StackNavigator.Screen name="RegisterProduct" component={RegisterProduct} options={{ headerShown: false }}/>
        <StackNavigator.Screen name="CustomerFeedback" component={CustomerFeedback} options={{ headerShown: false }}/>
        <StackNavigator.Screen name="AnalysisFeedback" component={AnalysisFeedback} options={{ headerShown: false }}/>
      </StackNavigator.Navigator>
    );
  };
  
  export default StackNavigation;