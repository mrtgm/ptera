import { useNavigate, useParams } from "@remix-run/react";
import {
	type Connection,
	Controls,
	type Edge,
	Handle,
	MiniMap,
	type Node,
	type NodeProps,
	type NodeTypes,
	Position,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState,
} from "@xyflow/react";
import type React from "react";
import { memo, useCallback, useEffect, useState } from "react";

import "@xyflow/react/dist/style.css";

import type { Game } from "~/schema";
import {
	getAllEdges,
	getAllNodesPosition,
	transfromToNodes,
} from "../player/libs/utils";

const initBgColor = "#EEEEEE";

const snapGrid = [20, 20] as [number, number];

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

type CustomNodeProps = NodeProps & {
	data: {
		label: string;
		isStart: boolean;
		isEnd: boolean;
	};
};

const CustomNode = memo((props: CustomNodeProps) => {
	const { data, selected } = props;

	let nodeStyle = {
		border: "1px solid #ddd",
		backgroundColor: "#fff",
		color: "#333",
		padding: 10,
		borderRadius: 8,
		minWidth: 120,
		width: 150,
		textAlign: "center" as const,
		transition: "all 0.2s ease",
		fontSize: "0.9rem",
		fontWeight: "normal",
	};

	if (selected) {
		nodeStyle = {
			...nodeStyle,
			border: "2px solid #3b82f6",
		};
	}

	if (data.isStart) {
		nodeStyle = {
			...nodeStyle,
			backgroundColor: "#ECFDF5",
			border: selected ? "2px solid #059669" : "1px solid #10B981",
			color: "#065F46",
			fontWeight: "bold",
		};
	}

	if (data.isEnd) {
		nodeStyle = {
			...nodeStyle,
			backgroundColor: "#FEF2F2",
			border: selected ? "2px solid #DC2626" : "1px solid #EF4444",
			color: "#991B1B",
		};
	}

	return (
		<div style={nodeStyle}>
			<div>{data.label}</div>

			<Handle type="source" position={Position.Bottom} />
			<Handle type="target" position={Position.Top} />
		</div>
	);
});

export const Graph = ({
	game,
}: {
	game: Game | null;
}) => {
	const { sceneId } = useParams();
	const navigate = useNavigate();
	const [nodes, setNodes, onNodesChange] = useNodesState(
		transfromToNodes(game, getAllNodesPosition({ game })),
	);
	const [edges, setEdges, onEdgesChange] = useEdgesState(getAllEdges({ game }));
	const [bgColor, setBgColor] = useState(initBgColor);

	const onNodeClick = useCallback(
		(event: React.MouseEvent, node: Node) => {
			navigate(`/editor/${node.id}`);
		},
		[navigate],
	);

	useEffect(() => {
		if (game) {
			setNodes([]);
			setEdges([]);

			setNodes(transfromToNodes(game, getAllNodesPosition({ game })));
			setEdges(getAllEdges({ game }));
		}
	}, [game, setNodes, setEdges]);

	useEffect(() => {
		setNodes((prevNodes) =>
			prevNodes.map((node) => {
				if (node.id === sceneId) {
					return { ...node, selected: true };
				}
				return { ...node, selected: false };
			}),
		);
	}, [sceneId, setNodes]);

	const nodeTypes: NodeTypes = {
		custom: CustomNode,
	};

	return (
		<ReactFlow
			nodes={nodes}
			edges={edges}
			onNodesChange={onNodesChange}
			onEdgesChange={onEdgesChange}
			onNodeClick={onNodeClick}
			nodeTypes={nodeTypes}
			style={{ background: bgColor }}
			snapToGrid={true}
			// nodesDraggable={false}
			snapGrid={snapGrid}
			defaultViewport={defaultViewport}
			fitView
			attributionPosition="bottom-left"
		/>
	);
};
