
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomerFeedback from '../screens/CustomerFeedback'
import { Feather } from '@expo/vector-icons'
import { RootStackParamsList } from '../types/navigation'
import RegisterProduct from '../screens/RegisterProduct'
import AnalysisFeedback from '../screens/AnalysisFeedback'

const DrawerNavigator = createDrawerNavigator<RootStackParamsList>()

const DrawerNavigation = () => {
  return (
    <DrawerNavigator.Navigator>
      <DrawerNavigator.Screen name='RegisterProduct' component={RegisterProduct} options={{
        drawerIcon: ({ color, size }) => <Feather name='home' size={size} color={color} />
      }} />
      <DrawerNavigator.Screen name='CustomerFeedback' component={CustomerFeedback} options={{
        drawerIcon: ({ color, size }) => <Feather name='user' size={size} color={color} />
      }} />
      <DrawerNavigator.Screen name='AnalysisFeedback' component={AnalysisFeedback} options={{
        drawerIcon: ({ color, size }) => <Feather name='user' size={size} color={color} />
      }} />
    </DrawerNavigator.Navigator>
  );
};

export default DrawerNavigation;