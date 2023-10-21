
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StudentDetailScreen from "./StudentDetailScreen";
import StudentListScreen from "./StudentListScreen";
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StudentList">
        <Stack.Screen name="StudentListScreen" component={StudentListScreen} />
        <Stack.Screen name="StudentDetailScreen" component={StudentDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;