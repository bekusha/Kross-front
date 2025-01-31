import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import moment from "moment";

const OrderCountdown = ({ deliveryTime }: { deliveryTime: string }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const updateTimer = () => {
            if (!deliveryTime) {
                setTimeLeft("მიუწვდომელია");
                return;
            }

            const now = moment();
            const deliveryMoment = moment(deliveryTime);
            const duration = moment.duration(deliveryMoment.diff(now));

            if (duration.asSeconds() <= 0) {
                setTimeLeft("კურიერი უკვე მოვიდა!");
            } else {
                setTimeLeft(
                    `${duration.minutes()} წთ ${duration.seconds()} წმ`
                );
            }
        };

        updateTimer(); // თავიდანვე დავთვალოთ
        const interval = setInterval(updateTimer, 1000); // განვაახლოთ ყოველ წამს

        return () => clearInterval(interval); // გავწმინდოთ კომპონენტის დახურვისას
    }, [deliveryTime]);

    return (
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF5733" }}>
            {timeLeft}
        </Text>
    );
};

export default OrderCountdown;