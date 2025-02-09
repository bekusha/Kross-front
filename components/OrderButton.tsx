import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, StyleSheet, Animated, PanResponder, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useCart } from "@/context/cartContext";
import { Audio } from "expo-av";

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
    const [showTooltip, setShowTooltip] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    // Set up Animated.ValueXY with initial position
    const pan = useRef(new Animated.ValueXY({ x: initialPosition.left, y: initialPosition.top })).current;

    // PanResponder to handle drag gestures
    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
            },
            onPanResponderGrant: () => {
                pan.extractOffset();
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: () => {
                pan.flattenOffset();
            },
        })
    ).current;

    const playSound = async () => {
        try {
            const { sound } = await Audio.Sound.createAsync(
                require("@/assets/sounds/mixkit-bubble-pop-up-alert-notification-2357.wav") // ფაილი ჩასვი assets/sounds/notification.mp3
            );
            await sound.playAsync();
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

    useEffect(() => {
        if (orderModalButtonVisible) {
            playSound();
            setShowTooltip(true);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500, // ტექსტის გაქრობის ანიმაცია
                    useNativeDriver: true,
                }).start(() => setShowTooltip(false)); // 10 წამში გაქრება
            }, 10000);
        }
    }, [orderModalButtonVisible]);


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
            {showTooltip && (
                <Animated.View style={[styles.tooltip, { opacity: fadeAnim }]}>
                    <Text style={styles.tooltipText}>აქ შეგიძლიათ იხილოთ შეკვეთის დეტალები</Text>
                </Animated.View>
            )}
            <TouchableOpacity
                style={styles.timerButton}
                onPress={() => {
                    console.log("🔥 OrderButton Pressed!"); // ლოგირება დავამატოთ
                    onPress();
                }}
            >
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
    tooltip: {
        position: "absolute",
        bottom: 70,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 8,
        borderRadius: 6,
        width: 200,
        right: 0,
    },
    tooltipText: {
        color: "#FFFFFF",
        fontSize: 12,
        textAlign: "center",
    },
});

export default OrderButton;
