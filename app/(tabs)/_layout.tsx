import { Tabs } from "expo-router";
import { Timer, History } from "lucide-react-native";
export default function TabLayout() {
	const theme = null;

	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: theme === "dark" ? "#121212" : "#ffffff",
					shadowColor: "rgba(0, 0, 0, 0.1)",
				},
				headerTitleStyle: {
					fontSize: 30, // Increased font size
					fontWeight: "bold",
					color: theme === "dark" ? "#ffffff" : "#121212",
				},
				headerTintColor: theme === "dark" ? "#ffffff" : "#000000",
				tabBarStyle: {
					backgroundColor: theme === "dark" ? "#1A1A1A" : "#ffffff",
					borderTopWidth: 0,
					elevation: 3,
					height: 55,
				},
				tabBarActiveTintColor: "#007AFF",
				tabBarInactiveTintColor: theme === "dark" ? "#888" : "#666",
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Timers",
					tabBarIcon: ({ color, size }) => (
						<Timer
							size={size}
							color={color}
							style={{ paddingBottom: 2 }}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="history"
				options={{
					title: "History",
					tabBarIcon: ({ color, size }) => (
						<History
							size={size}
							color={color}
							style={{ paddingBottom: 2 }}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
