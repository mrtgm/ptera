import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~/components/shadcn/alert";
import { Button } from "~/components/shadcn/button";

interface Usage {
	sceneId: string;
	sceneName: string;
	eventId: string;
	eventType: string;
}

interface ValidationErrorAlertProps {
	message: string;
	usages: Usage[];
	onClose: () => void;
	onNavigate?: (sceneId: string, eventId: string) => void;
}

export const ValidationErrorAlert = ({
	message,
	usages,
	onClose,
	onNavigate,
}: ValidationErrorAlertProps) => {
	return (
		<Alert variant="destructive" className="mb-4">
			<AlertTriangle className="h-4 w-4" />
			<AlertTitle>削除できません</AlertTitle>
			<AlertDescription>
				<p>{message}</p>
				{usages.length > 0 && (
					<div className="mt-2 max-h-32 overflow-y-auto">
						<ul className="text-xs list-disc pl-5">
							{usages.map((usage, index) => (
								<li
									key={`${usage.sceneId}-${usage.eventId}-${index}`}
									className="mb-1"
								>
									<span>
										シーン「{usage.sceneName}」の「{usage.eventType}」
									</span>
									{onNavigate && (
										<button
											onClick={() => onNavigate(usage.sceneId, usage.eventId)}
											className="ml-2 text-blue-300 hover:underline text-xs"
											type="button"
										>
											移動
										</button>
									)}
								</li>
							))}
						</ul>
					</div>
				)}
				<Button variant="outline" size="sm" onClick={onClose} className="mt-2">
					閉じる
				</Button>
			</AlertDescription>
		</Alert>
	);
};
