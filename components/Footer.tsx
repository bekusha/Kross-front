// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
// import { NavigationProp, useNavigation } from "@react-navigation/native"; // ნავიგაციის hook
// import { RootStackParamList } from "@/types/routes";

// const Footer: React.FC = () => {
//     const navigation = useNavigation<NavigationProp<RootStackParamList>>();

//     return (
//         <View style={styles.footer}>
//             <TouchableOpacity onPress={() => navigation.navigate("Home")}>
//                 <Text style={styles.buttonText}>მთავარი</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate("MyPageScreen")}>
//                 <Text style={styles.buttonText}>ჩემი გვერდი</Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate("ContactScreen")}>
//                 <Text style={styles.buttonText}>კონტაქტი</Text>
//             </TouchableOpacity>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     footer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         backgroundColor: 'black',
//         padding: 10,
//         height: 60,
//         display: 'flex',
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//     },
// });

// export default Footer;
