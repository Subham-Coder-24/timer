import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
	ChevronDown,
	ChevronUp,
	CirclePlay as PlayCircle,
	CirclePause as PauseCircle,
	RotateCcw,
} from "lucide-react-native";
import { Timer } from "@/types/timer";
import { TimerCard } from "./TimerCard";

interface CategoryGroupProps {
	category: string;
	timers: Timer[];
	expanded: boolean;
	onToggle: () => void;
	onStartAll: () => void;
	onPauseAll: () => void;
	onResetAll: () => void;
	onTimerStart: (id: string) => void;
	onTimerPause: (id: string) => void;
	onTimerReset: (id: string) => void;
	onTimerComplete: (id: string) => void;
}

export function CategoryGroup({
	category,
	timers,
	expanded,
	onToggle,
	onStartAll,
	onPauseAll,
	onResetAll,
	onTimerStart,
	onTimerPause,
	onTimerReset,
	onTimerComplete,
}: CategoryGroupProps) {
	const hasRunningTimers = timers.some((timer) => timer.status === "running");

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={onToggle} style={styles.header}>
				<View style={styles.headerContent}>
					<Text style={styles.title}>{category}</Text>
					<Text style={styles.count}>{timers.length} timers</Text>
				</View>
				{expanded ? (
					<ChevronUp size={24} color="#666" />
				) : (
					<ChevronDown size={24} color="#666" />
				)}
			</TouchableOpacity>

			{expanded && (
				<>
					<View style={styles.controls}>
						<TouchableOpacity
							onPress={onStartAll}
							style={[styles.controlButton, styles.startButton]}
						>
							<PlayCircle size={20} color="#fff" />
							<Text style={styles.controlText}>Start All</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={onPauseAll}
							style={[styles.controlButton, styles.pauseButton]}
						>
							<PauseCircle size={20} color="#fff" />
							<Text style={styles.controlText}>Pause All</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={onResetAll}
							style={[styles.controlButton, styles.resetButton]}
						>
							<RotateCcw size={20} color="#fff" />
							<Text style={styles.controlText}>Reset All</Text>
						</TouchableOpacity>
					</View>

					<View style={styles.timerList}>
						{timers.map((timer) => (
							<TimerCard
								key={timer.id}
								timer={timer}
								onStart={() => onTimerStart(timer.id)}
								onPause={() => onTimerPause(timer.id)}
								onReset={() => onTimerReset(timer.id)}
								onComplete={() => onTimerComplete(timer.id)}
							/>
						))}
					</View>
				</>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#FFFFFF",
		borderRadius: 12,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
		overflow: "hidden",
	},

	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		padding: 16,
		backgroundColor: "#F3F4F6",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E7EB",
	},

	headerContent: {
		flex: 1,
	},

	title: {
		fontSize: 20,
		fontWeight: "600",
		color: "#333",
	},

	count: {
		fontSize: 14,
		color: "#666",
		marginTop: 4,
	},

	controls: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingVertical: 12,
		backgroundColor: "#F9FAFB",
		borderBottomWidth: 1,
		borderBottomColor: "#E5E5E5",
	},

	controlButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 10,
		paddingHorizontal: 10,
		borderRadius: 8,
		elevation: 3,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
	},

	controlText: {
		marginLeft: 8,
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "500",
	},

	// Unique colors for each button
	startButton: {
		backgroundColor: "#28a745", // Green for Start
		shadowColor: "#28a745",
	},
	pauseButton: {
		backgroundColor: "#FF9F43", // Orange for Pause
		shadowColor: "#FF9F43",
	},
	resetButton: {
		backgroundColor: "#EA5455", // Red for Reset
		shadowColor: "#EA5455",
	},

	timerList: {
		padding: 16,
	},
});
