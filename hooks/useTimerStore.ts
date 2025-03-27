import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Timer, TimerHistory, TimerGroup } from "@/types/timer";

const TIMERS_STORAGE_KEY = "@timers";
const HISTORY_STORAGE_KEY = "@timer_history";
type TimerStatus = "idle" | "running" | "paused" | "completed";

export function useTimerStore() {
	const [timers, setTimers] = useState<Timer[]>([]);
	const [history, setHistory] = useState<TimerHistory[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		loadTimers();
	}, []);

	// Timer countdown effect
	useEffect(() => {
		const interval = setInterval(() => {
			setTimers((prevTimers) =>
				prevTimers.map((timer) => {
					if (timer.status === "running" && timer.remainingTime > 0) {
						return {
							...timer,
							remainingTime: timer.remainingTime - 1,
						};
					} else if (
						timer.status === "running" &&
						timer.remainingTime === 0
					) {
						return { ...timer, status: "completed" };
					}
					return timer;
				})
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	const loadTimers = async () => {
		try {
			const storedTimers = await AsyncStorage.getItem(TIMERS_STORAGE_KEY);
			const storedHistory = await AsyncStorage.getItem(
				HISTORY_STORAGE_KEY
			);

			if (storedTimers) setTimers(JSON.parse(storedTimers));
			if (storedHistory) setHistory(JSON.parse(storedHistory));
		} catch (error) {
			console.error("Error loading timers:", error);
		} finally {
			setLoading(false);
		}
	};

	const saveTimers = async (newTimers: Timer[]) => {
		try {
			await AsyncStorage.setItem(
				TIMERS_STORAGE_KEY,
				JSON.stringify(newTimers)
			);
			setTimers(newTimers);
		} catch (error) {
			console.error("Error saving timers:", error);
		}
	};

	const saveHistory = async (newHistory: TimerHistory[]) => {
		try {
			await AsyncStorage.setItem(
				HISTORY_STORAGE_KEY,
				JSON.stringify(newHistory)
			);
			setHistory(newHistory);
		} catch (error) {
			console.error("Error saving history:", error);
		}
	};

	const addTimer = async (
		timer: Omit<Timer, "id" | "status" | "remainingTime" | "createdAt">
	) => {
		const newTimer: Timer = {
			id: Date.now().toString(),
			status: "idle",
			remainingTime: timer.duration,
			createdAt: Date.now(),
			...timer,
		};

		const newTimers = [...timers, newTimer];
		await saveTimers(newTimers);
	};

	const updateTimer = async (timerId: string, updates: Partial<Timer>) => {
		const newTimers = timers.map((timer) =>
			timer.id === timerId ? { ...timer, ...updates } : timer
		);
		await saveTimers(newTimers);
	};

	const deleteTimer = async (timerId: string) => {
		const newTimers = timers.filter((timer) => timer.id !== timerId);
		await saveTimers(newTimers);
	};

	const addToHistory = async (timer: Timer) => {
		const historyEntry: TimerHistory = {
			id: timer.id,
			name: timer.name,
			category: timer.category,
			duration: timer.duration,
			completedAt: Date.now(),
		};

		const newHistory = [historyEntry, ...history];
		await saveHistory(newHistory);
	};

	const getTimersByCategory = (): TimerGroup => {
		return timers.reduce((groups: TimerGroup, timer) => {
			const category = timer.category;
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(timer);
			return groups;
		}, {});
	};

	const startTimer = async (timerId: string) => {
		await updateTimer(timerId, { status: "running" });
	};

	const pauseTimer = async (timerId: string) => {
		await updateTimer(timerId, { status: "paused" });
	};

	const resetTimer = async (timerId: string) => {
		const timer = timers.find((t) => t.id === timerId);
		if (timer) {
			await updateTimer(timerId, {
				status: "idle",
				remainingTime: timer.duration,
			});
		}
	};

	const completeTimer = async (timerId: string) => {
		const timer = timers.find((t) => t.id === timerId);
		if (timer) {
			await updateTimer(timerId, {
				status: "completed",
				remainingTime: 0,
			});
			await addToHistory(timer);
		}
	};

	const startCategoryTimers = async (category: string) => {
		const updates = timers.map((timer) =>
			timer.category === category && timer.status !== "completed"
				? { ...timer, status: "running" as TimerStatus }
				: timer
		);
		await saveTimers(updates);
	};

	const pauseCategoryTimers = async (category: string) => {
		const updates = timers.map((timer) =>
			timer.category === category && timer.status === "running"
				? { ...timer, status: "paused" as TimerStatus }
				: timer
		);
		await saveTimers(updates);
	};

	const resetCategoryTimers = async (category: string) => {
		const updates = timers.map((timer) =>
			timer.category === category
				? {
						...timer,
						status: "idle" as TimerStatus,
						remainingTime: timer.duration,
				  }
				: timer
		);
		await saveTimers(updates);
	};

	return {
		timers,
		history,
		loading,
		addTimer,
		updateTimer,
		deleteTimer,
		getTimersByCategory,
		startTimer,
		pauseTimer,
		resetTimer,
		completeTimer,
		startCategoryTimers,
		pauseCategoryTimers,
		resetCategoryTimers,
		loadTimers,
	};
}
