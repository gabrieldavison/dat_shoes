import React, { useCallback, useState } from "react";
import ReactFlow, {
  Node as FlowNode,
  Edge as FlowEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  addEdge,
  Connection,
  NodeChange,
  EdgeChange,
} from "reactflow";
import "reactflow/dist/style.css";
import "./FlowChart.css";

// Convert initial data to React Flow format
const initialNodes: FlowNode[] = [
  {
    id: "1",
    type: "default",
    position: { x: 100, y: 50 },
    data: { label: "Start" },
  },
  {
    id: "2",
    type: "default",
    position: { x: 100, y: 150 },
    data: { label: "Process 1" },
  },
  {
    id: "3",
    type: "default",
    position: { x: 300, y: 150 },
    data: { label: "Process 2" },
  },
  {
    id: "4",
    type: "default",
    position: { x: 200, y: 250 },
    data: { label: "Decision" },
  },
  {
    id: "5",
    type: "default",
    position: { x: 200, y: 350 },
    data: { label: "End" },
  },
];

const initialEdges: FlowEdge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
];

const FlowChart: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState("");

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Add a new node
  const addNode = useCallback(() => {
    const newNode: FlowNode = {
      id: `${Date.now()}`,
      type: "default",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: "New Node" },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  // Delete selected node
  const deleteNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
      setEdges((eds) =>
        eds.filter(
          (edge) => edge.source !== selectedNode && edge.target !== selectedNode
        )
      );
      setSelectedNode(null);
    }
  }, [selectedNode, setNodes, setEdges]);

  // Delete selected edge
  const deleteEdge = useCallback(() => {
    if (selectedEdge) {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedEdge));
      setSelectedEdge(null);
    }
  }, [selectedEdge, setEdges]);

  // Start editing node label
  const startEditNode = useCallback((nodeId: string, currentLabel: string) => {
    setEditingNode(nodeId);
    setEditLabel(currentLabel);
  }, []);

  // Save edited node label
  const saveNodeLabel = useCallback(() => {
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? { ...node, data: { ...node.data, label: editLabel } }
            : node
        )
      );
      setEditingNode(null);
      setEditLabel("");
    }
  }, [editingNode, editLabel, setNodes]);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditLabel("");
  }, []);

  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      setSelectedNode(node.id);
      setSelectedEdge(null);
    },
    []
  );

  // Handle edge selection
  const onEdgeClick = useCallback(
    (_event: React.MouseEvent, edge: FlowEdge) => {
      setSelectedEdge(edge.id);
      setSelectedNode(null);
    },
    []
  );

  // Handle double-click to edit node
  const onNodeDoubleClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      startEditNode(node.id, node.data.label as string);
    },
    [startEditNode]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setSelectedEdge(null);
  }, []);

  return (
    <div className="flowchart-container">
      <h1>Flow Chart Editor</h1>

      {/* Toolbar */}
      <div className="toolbar">
        <button onClick={addNode} className="btn btn-primary">
          ➕ Add Node
        </button>
        <button
          onClick={deleteNode}
          className="btn btn-danger"
          disabled={!selectedNode}
        >
          🗑️ Delete Node
        </button>
        <button
          onClick={deleteEdge}
          className="btn btn-danger"
          disabled={!selectedEdge}
        >
          ✂️ Delete Edge
        </button>
        <div className="toolbar-info">
          {selectedNode && <span>Node selected: {selectedNode}</span>}
          {selectedEdge && <span>Edge selected: {selectedEdge}</span>}
          {!selectedNode && !selectedEdge && (
            <span>
              Click to select | Double-click node to edit | Drag from node to
              connect
            </span>
          )}
        </div>
      </div>

      {/* Edit Node Modal */}
      {editingNode && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Node Label</h3>
            <input
              type="text"
              value={editLabel}
              onChange={(e) => setEditLabel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveNodeLabel();
                if (e.key === "Escape") cancelEdit();
              }}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={saveNodeLabel} className="btn btn-primary">
                Save
              </button>
              <button onClick={cancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* React Flow Canvas */}
      <div className="flowchart-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeClick={onEdgeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          onPaneClick={onPaneClick}
          fitView
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart;
