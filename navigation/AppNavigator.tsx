// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useAuth } from '@/context/authContext';
// import HomeScreen from '@/screens/HomeScreen';
// import AuthScreen from '@/screens/AuthScreen';
// import MyPageScreen from '@/screens/MyPageScreen';
// import OilChangeScreen from '@/screens/OilChangeScreen';
// import ProductsScreen from '@/screens/ProductsScreen';
// import ProductDetails from '@/screens/productDetails';
// import Main from '@/screens/Main';
// import ChatScreen from '@/screens/ChatScreen';

// const Stack = createStackNavigator();

// const AppNavigator = () => {
//     const { isLoggedIn } = useAuth();

//     return (
//         <NavigationContainer>
//             <Stack.Navigator initialRouteName={!isLoggedIn ? "Main" : ""}>
//                 {/* Public Routes */}
//                 <Stack.Screen name="Home" component={HomeScreen} />
//                 <Stack.Screen name="Login" component={AuthScreen} />
//                 <Stack.Screen name="Products" component={ProductsScreen} />
//                 <Stack.Screen name="ProductDetails" component={ProductDetails} />
//                 <Stack.Screen name="Main" component={Main} />

//                 {/* Protected Routes */}
//                 {isLoggedIn && (
//                     <Stack.Screen name="MyPageScreen" component={MyPageScreen} />
//                 )}
//                 {!isLoggedIn && (
//                     <>
//                         <Stack.Screen name="OilChangeScreen" component={OilChangeScreen} />
//                         <Stack.Screen name="ChatScreen" component={ChatScreen} />
//                     </>
//                 )}
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// };

// export default AppNavigator;