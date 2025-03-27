import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { Play, Pause, RotateCcw } from "lucide-react-native";
import { Timer } from "@/types/timer";
import Svg, { Circle, G } from "react-native-svg";

interface TimerCardProps {
	timer: Timer;
	onStart: () => void;
	onPause: () => void;
	onReset: () => void;
	onComplete: () => void;
}

export function TimerCard({
	timer,
	onStart,
	onPause,
	onReset,
	onComplete,
}: TimerCardProps) {
	const intervalRef = useRef<NodeJS.Timeout>();
	const [halfwayModalVisible, setHalfwayModalVisible] = useState(false);

	useEffect(() => {
		if (timer.status === "running") {
			intervalRef.current = setInterval(() => {
				if (
					timer.halfwayAlert &&
					timer.remainingTime === Math.floor(timer.duration / 2)
				) {
					setHalfwayModalVisible(true);
					setTimeout(() => {
						setHalfwayModalVisible(false);
					}, 2000);
				}

				if (timer.remainingTime <= 0) {
					clearInterval(intervalRef.current);
					onComplete();
				}
			}, 1000);
		} else {
			clearInterval(intervalRef.current);
		}

		return () => clearInterval(intervalRef.current);
	}, [timer.status, timer.remainingTime]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
			.toString()
			.padStart(2, "0")}`;
	};

	const getStatusColor = () => {
		switch (timer.status) {
			case "idle":
				return "#FFA500"; // Orange
			case "running":
				return "#28a745"; // Green
			case "paused":
				return "#FF6347"; // Tomato Red
			case "completed":
				return "#1E90FF"; // Dodger Blue
			default:
				return "#666"; // Default Gray
		}
	};

	const circleSize = 200;
	const strokeWidth = 15;
	const radius = (circleSize - strokeWidth) / 2;
	const circumference = radius * 2 * Math.PI;
	const progress = (timer.remainingTime / timer.duration) * circumference;

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.name}>🕒 {timer.name}</Text>
				<Text style={[styles.status, { color: getStatusColor() }]}>
					{timer.status.toUpperCase()}
				</Text>
			</View>

			<View style={styles.circularProgressContainer}>
				<Svg width={circleSize} height={circleSize}>
					<G
						rotation="-90"
						origin={`${circleSize / 2}, ${circleSize / 2}`}
					>
						{/* Background Circle */}
						<Circle
							cx={circleSize / 2}
							cy={circleSize / 2}
							r={radius}
							fill="transparent"
							stroke="#E0E0E0"
							strokeWidth={strokeWidth}
						/>
						{/* Progress Circle */}
						<Circle
							cx={circleSize / 2}
							cy={circleSize / 2}
							r={radius}
							fill="transparent"
							stroke={getStatusColor()}
							strokeWidth={strokeWidth}
							strokeDasharray={circumference}
							strokeDashoffset={circumference - progress}
						/>
					</G>
				</Svg>
				<View style={styles.timeOverlay}>
					<Text style={styles.time}>
						{formatTime(timer.remainingTime)}
					</Text>
				</View>
			</View>
			<View style={styles.controls}>
				{timer.status === "running" ? (
					<TouchableOpacity
						onPress={onPause}
						style={[styles.button, styles.pauseButton]}
					>
						<Pause size={24} color="#fff" />
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						onPress={onStart}
						style={[styles.button, styles.startButton]}
					>
						<Play size={24} color="#fff" />
					</TouchableOpacity>
				)}

				<TouchableOpacity
					onPress={onReset}
					style={[styles.button, styles.resetButton]}
				>
					<RotateCcw size={24} color="#fff" />
				</TouchableOpacity>
			</View>

			<Modal
				visible={halfwayModalVisible}
				transparent={true}
				animationType="fade"
			>
				<View style={styles.modalOverlay}>
					<View style={styles.modalView}>
						<Text style={styles.modalText}>
							Halfway there! ⏳ Keep going with your {timer.name}{" "}
							timer!
						</Text>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#F8F9FA",
		borderRadius: 15,
		borderColor: "#E5E7EB",
		borderWidth: 2,
		padding: 20,
		marginVertical: 12,
		shadowColor: "#b0b0b0",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 6,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
	},
	name: {
		fontSize: 20,
		fontWeight: "700",
		color: "#333",
	},
	status: {
		fontSize: 14,
		fontWeight: "600",
	},
	circularProgressContainer: {
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 20,
	},
	timeOverlay: {
		position: "absolute",
		justifyContent: "center",
		alignItems: "center",
	},
	time: {
		fontSize: 40,
		fontWeight: "800",
		color: "#333",
	},
	controls: {
		flexDirection: "row",
		justifyContent: "center",
		gap: 20,
	},
	button: {
		padding: 7,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		elevation: 3,
		width: 60,
		height: 60,
	},
	startButton: {
		backgroundColor: "#28a745",
	},
	pauseButton: {
		backgroundColor: "#FF9F43",
	},
	resetButton: {
		backgroundColor: "#EA5455",
	},
	modalOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	modalView: {
		width: "85%",
		backgroundColor: "#ffffff",
		paddingVertical: 30,
		paddingHorizontal: 20,
		borderRadius: 15,
		alignItems: "center",
		shadowColor: "#b0b0b0",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 10,
		elevation: 5,
	},
	modalText: {
		fontSize: 20,
		color: "#333",
		textAlign: "center",
		fontWeight: "500",
	},
});
