import React, { useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	useColorScheme,
} from "react-native";
import { useTimerStore } from "@/hooks/useTimerStore";
import { useFocusEffect } from "@react-navigation/native";

export default function HistoryScreen() {
	const { history, loadTimers } = useTimerStore();
	const theme = null;

	useFocusEffect(
		useCallback(() => {
			loadTimers();
		}, [])
	);

	const formatDate = (timestamp: number) => {
		return new Date(timestamp).toLocaleString();
	};

	const formatDuration = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}m ${remainingSeconds}s`;
	};

	return (
		<ScrollView
			style={[
				styles.container,
				{ backgroundColor: theme === "dark" ? "#121212" : "#F8F8F8" },
			]}
		>
			{history.map((entry) => (
				<View
					key={`${entry.id}-${entry.completedAt}`}
					style={[
						styles.historyItem,
						{
							backgroundColor:
								theme === "dark" ? "#1E1E1E" : "white",
						},
					]}
				>
					<View style={styles.header}>
						<Text
							style={[
								styles.name,
								{ color: theme === "dark" ? "#FFF" : "#000" },
							]}
						>
							{entry.name}
						</Text>
						<Text
							style={[
								styles.category,
								{
									backgroundColor:
										theme === "dark" ? "#333" : "#E0E0E0",
									color: theme === "dark" ? "#FFF" : "#000",
								},
							]}
						>
							{entry.category}
						</Text>
					</View>

					<View style={styles.details}>
						<Text style={styles.detailText}>
							⏳ Duration: {formatDuration(entry.duration)}
						</Text>
						<Text style={styles.detailText}>
							📅 Completed: {formatDate(entry.completedAt)}
						</Text>
					</View>
				</View>
			))}

			{history.length === 0 && (
				<View style={styles.emptyState}>
					<Text style={styles.emptyStateText}>
						No completed timers yet. Start a timer to see its
						history here!
					</Text>
				</View>
			)}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	historyItem: {
		borderRadius: 12,
		padding: 16,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	name: {
		fontSize: 22,
		fontWeight: "600",
	},
	category: {
		fontSize: 16,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		overflow: "hidden",
	},
	details: {
		borderTopWidth: 1,
		borderTopColor: "#E0E0E0",
		paddingTop: 8,
		marginTop: 6,
	},
	detailText: {
		fontSize: 18,
		color: "#666",
		marginBottom: 4,
	},
	emptyState: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 40,
	},
	emptyStateText: {
		fontSize: 18,
		color: "#666",
		textAlign: "center",
		maxWidth: "80%",
	},
});
