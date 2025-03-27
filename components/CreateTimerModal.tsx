import React, { useState } from "react";
import {
	Modal,
	View,
	Text,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Switch,
} from "react-native";
import { Timer } from "@/types/timer";
import { Picker } from "@react-native-picker/picker"; // Import Picker

interface CreateTimerModalProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (
		timer: Omit<Timer, "id" | "status" | "remainingTime" | "createdAt">
	) => void;
}

const defaultCategories = ["Workout", "Study", "Break", "Other"];

export function CreateTimerModal({
	visible,
	onClose,
	onSubmit,
}: CreateTimerModalProps) {
	const [name, setName] = useState("");
	const [duration, setDuration] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Workout");
	const [customCategory, setCustomCategory] = useState("");
	const [halfwayAlert, setHalfwayAlert] = useState(false);

	const handleSubmit = () => {
		if (!name || !duration) return;

		const category =
			selectedCategory === "Other" ? customCategory : selectedCategory;
		if (!category) return; // Prevent empty category submission

		onSubmit({
			name,
			duration: parseInt(duration, 10),
			category,
			halfwayAlert,
		});

		// Reset form
		setName("");
		setDuration("");
		setSelectedCategory("Workout");
		setCustomCategory("");
		setHalfwayAlert(false);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			transparent
			onRequestClose={onClose}
		>
			<View style={styles.centeredView}>
				<View style={styles.modalView}>
					<Text style={styles.modalTitle}>Create New Timer</Text>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Name</Text>
						<TextInput
							style={styles.input}
							value={name}
							onChangeText={setName}
							placeholder="Timer name"
						/>
					</View>

					<View style={styles.inputContainer}>
						<Text style={styles.label}>Duration (seconds)</Text>
						<TextInput
							style={styles.input}
							value={duration}
							onChangeText={setDuration}
							placeholder="Enter duration in seconds"
							keyboardType="numeric"
						/>
					</View>

					{/* Category Picker */}
					<View style={styles.inputContainer}>
						<Text style={styles.label}>Category</Text>
						<Picker
							selectedValue={selectedCategory}
							onValueChange={(itemValue) =>
								setSelectedCategory(itemValue)
							}
							style={styles.picker}
							mode="dropdown"
						>
							{defaultCategories.map((category) => (
								<Picker.Item
									key={category}
									label={category}
									value={category}
								/>
							))}
						</Picker>
					</View>

					{/* Show TextInput for Custom Category */}
					{selectedCategory === "Other" && (
						<View style={styles.inputContainer}>
							<Text style={styles.label}>Custom Category</Text>
							<TextInput
								style={styles.input}
								value={customCategory}
								onChangeText={setCustomCategory}
								placeholder="Enter custom category"
							/>
						</View>
					)}

					<View style={styles.switchContainer}>
						<Text style={styles.label}>Halfway Alert</Text>
						<Switch
							value={halfwayAlert}
							onValueChange={setHalfwayAlert}
						/>
					</View>

					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.button, styles.cancelButton]}
							onPress={onClose}
						>
							<Text style={styles.buttonText}>Cancel</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[styles.button, styles.submitButton]}
							onPress={handleSubmit}
						>
							<Text
								style={[
									styles.buttonText,
									styles.submitButtonText,
								]}
							>
								Create Timer
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	centeredView: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalView: {
		width: "90%",
		backgroundColor: "white",
		borderRadius: 20,
		padding: 24,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: "600",
		marginBottom: 24,
		textAlign: "center",
	},
	inputContainer: {
		marginBottom: 16,
	},
	label: {
		fontSize: 16,
		marginBottom: 8,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
	},
	picker: {
		height: 50,
		borderWidth: 1,
		borderColor: "#E5E5E5",
		borderRadius: 8,
		backgroundColor: "#F5F5F5",
	},
	switchContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 24,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	button: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		alignItems: "center",
	},
	cancelButton: {
		backgroundColor: "#F5F5F5",
	},
	submitButton: {
		backgroundColor: "#007AFF",
	},
	buttonText: {
		fontSize: 16,
		fontWeight: "600",
	},
	submitButtonText: {
		color: "white",
	},
});
