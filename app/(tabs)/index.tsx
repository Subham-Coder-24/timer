import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Plus } from "lucide-react-native";
import { useTimerStore } from "@/hooks/useTimerStore";
import { CategoryGroup } from "@/components/CategoryGroup";
import { CreateTimerModal } from "@/components/CreateTimerModal";
import { CompletionModal } from "@/components/CompletionModal";
import { Timer } from "@/types/timer";

export default function TimersScreen() {
	const {
		timers,
		loading,
		addTimer,
		updateTimer,
		getTimersByCategory,
		startTimer,
		pauseTimer,
		resetTimer,
		completeTimer,
		startCategoryTimers,
		pauseCategoryTimers,
		resetCategoryTimers,
	} = useTimerStore();

	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [completionModalVisible, setCompletionModalVisible] = useState(false);
	const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set()
	);

	const timersByCategory = getTimersByCategory();

	const toggleCategory = (category: string) => {
		const newExpanded = new Set(expandedCategories);
		if (newExpanded.has(category)) {
			newExpanded.delete(category);
		} else {
			newExpanded.add(category);
		}
		setExpandedCategories(newExpanded);
	};

	const handleTimerComplete = async (timerId: string) => {
		const timer = timers.find((t) => t.id === timerId);
		if (timer) {
			await completeTimer(timerId);
			setCompletedTimer(timer);
			setCompletionModalVisible(true);
		}
	};

	if (loading) {
		return <View style={styles.container} />;
	}

	return (
		<View style={styles.container}>
			<ScrollView style={styles.scrollView}>
				{Object.entries(timersByCategory).map(
					([category, categoryTimers]) => (
						<CategoryGroup
							key={category}
							category={category}
							timers={categoryTimers}
							expanded={expandedCategories.has(category)}
							onToggle={() => toggleCategory(category)}
							onStartAll={() => startCategoryTimers(category)}
							onPauseAll={() => pauseCategoryTimers(category)}
							onResetAll={() => resetCategoryTimers(category)}
							onTimerStart={startTimer}
							onTimerPause={pauseTimer}
							onTimerReset={resetTimer}
							onTimerComplete={handleTimerComplete}
						/>
					)
				)}
			</ScrollView>

			<TouchableOpacity
				style={styles.fab}
				onPress={() => setCreateModalVisible(true)}
			>
				<Plus color="white" size={24} />
			</TouchableOpacity>

			<CreateTimerModal
				visible={createModalVisible}
				onClose={() => setCreateModalVisible(false)}
				onSubmit={addTimer}
			/>

			<CompletionModal
				timer={completedTimer}
				visible={completionModalVisible}
				onClose={() => {
					setCompletionModalVisible(false);
					setCompletedTimer(null);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F8F8F8",
	},
	scrollView: {
		flex: 1,
		padding: 16,
	},
	fab: {
		position: "absolute",
		right: 16,
		bottom: 16,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: "#007AFF",
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});
