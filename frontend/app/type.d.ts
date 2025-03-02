interface GameSaveData {
	currentSceneId: string;
	currentEventId: string;
	playHistory: string[]; // 訪れたシーンのID履歴
	timestamp: number;
}
