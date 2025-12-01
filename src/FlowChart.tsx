import React, { useCallback, useState, useMemo } from "react";
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
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "reactflow/dist/style.css";
import "./FlowChart.css";
import CustomNode, { CustomNodeData } from "./CustomNode";

// Convert initial data to React Flow format
const initialNodes: FlowNode<CustomNodeData>[] = [
  {
    id: "1",
    type: "customNode",
    position: { x: 100, y: 50 },
    data: {
      date: "1878-01-01",
      body: "Begin the process",
      country: "United Kingdom",
    },
  },
  {
    id: "2",
    type: "customNode",
    position: { x: 100, y: 180 },
    data: { date: "1890-06-15", body: "First processing step" },
  },
  {
    id: "3",
    type: "customNode",
    position: { x: 300, y: 180 },
    data: {
      date: "1905-03-20",
      body: "Second processing step",
      country: "United States",
    },
  },
  {
    id: "4",
    type: "customNode",
    position: { x: 200, y: 310 },
    data: { date: "1920-12-10", body: "Make a choice" },
  },
  {
    id: "5",
    type: "customNode",
    position: { x: 200, y: 440 },
    data: { date: "1945-05-08", body: "Process complete" },
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
  const [editDate, setEditDate] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCountry, setEditCountry] = useState("");

  // Define custom node types
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Handle connecting nodes
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  // Add a new node
  const addNode = useCallback(() => {
    const newNode: FlowNode<CustomNodeData> = {
      id: `${Date.now()}`,
      type: "customNode",
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { date: "1878-01-01", body: "Add description here" },
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

  // Start editing node
  const startEditNode = useCallback(
    (
      nodeId: string,
      currentDate: string,
      currentBody: string,
      currentCountry?: string
    ) => {
      setEditingNode(nodeId);
      setEditDate(currentDate);
      setEditBody(currentBody);
      setEditCountry(currentCountry || "");
    },
    []
  );

  // Save edited node
  const saveNode = useCallback(() => {
    if (editingNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === editingNode
            ? {
                ...node,
                data: {
                  date: editDate,
                  body: editBody,
                  ...(editCountry && { country: editCountry }),
                },
              }
            : node
        )
      );
      setEditingNode(null);
      setEditDate("");
      setEditBody("");
      setEditCountry("");
    }
  }, [editingNode, editDate, editBody, editCountry, setNodes]);

  // Cancel editing
  const cancelEdit = useCallback(() => {
    setEditingNode(null);
    setEditDate("");
    setEditBody("");
    setEditCountry("");
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
    (_event: React.MouseEvent, node: FlowNode<CustomNodeData>) => {
      startEditNode(node.id, node.data.date, node.data.body, node.data.country);
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
            <h3>Edit Node</h3>
            <label htmlFor="node-date">Date</label>
            <input
              id="node-date"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEdit();
              }}
              min="1878-01-01"
              autoFocus
            />
            <label htmlFor="node-country">Country (optional)</label>
            <input
              id="node-country"
              type="text"
              value={editCountry}
              onChange={(e) => setEditCountry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") cancelEdit();
              }}
              placeholder="Leave empty to inherit from parent"
            />
            <label htmlFor="node-body">Body</label>
            <ReactQuill
              theme="snow"
              value={editBody}
              onChange={setEditBody}
              placeholder="Enter description"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ color: [] }, { background: [] }],
                  ["link"],
                  ["clean"],
                ],
              }}
            />
            <div className="modal-actions">
              <button onClick={saveNode} className="btn btn-primary">
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
          nodeTypes={nodeTypes}
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
