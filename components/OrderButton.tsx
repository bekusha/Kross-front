import React, { useRef } from "react";
import { TouchableOpacity, StyleSheet, Animated, PanResponder } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "@/context/cartContext";

const OrderButton = ({
    onPress,
    visible,
    initialPosition = { top: 0, left: 0 },
}: {
    onPress: () => void;
    visible: boolean;
    initialPosition?: { top: number; left: number };
}) => {
    const { orderModalButtonVisible } = useCart();

    // Set up Animated.ValueXY with initial position
    const pan = useRef(new Animated.ValueXY({ x: initialPosition.left, y: initialPosition.top })).current;

    // PanResponder to handle drag gestures
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: () => true, // Allow dragging
            onPanResponderGrant: () => {
                pan.extractOffset(); // Extract the current offset
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false } // JavaScript-driven animations
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset(); // Merge offset and base value
            },
        })
    ).current;

    // If button visibility is off, return null
    if (!orderModalButtonVisible) return null;

    return (
        <Animated.View
            style={[
                styles.buttonContainer,
                { transform: pan.getTranslateTransform() }, // Apply the transformation
            ]}
            {...panResponder.panHandlers} // Bind PanResponder handlers
        >
            <TouchableOpacity style={styles.timerButton} onPress={onPress}>
                <Icon name="timer" size={30} color="#FFFFFF" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        position: "absolute",
        zIndex: 1000,
    },
    timerButton: {
        backgroundColor: "#D32F2F",
        borderRadius: 30,
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
    },
});

export default OrderButton;
