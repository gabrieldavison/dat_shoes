import React, { useCallback, useState } from "react";
import ReactFlow, {
  Node as FlowNode,
  Edge as FlowEdge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
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
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [nodeName, setNodeName] = useState("");
  const [nodeX, setNodeX] = useState(250);
  const [nodeY, setNodeY] = useState(250);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Add a new node
  const addNode = () => {
    const newNode: FlowNode = {
      id: `${nodes.length + 1}`,
      type: "default",
      position: { x: nodeX, y: nodeY },
      data: { label: nodeName || `Node ${nodes.length + 1}` },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeName("");
  };

  // Delete selected node
  const deleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
      setSelectedNode(null);
    }
  };

  // Update node label
  const updateNodeLabel = (newLabel: string) => {
    if (selectedNode) {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === selectedNode.id
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
      setSelectedNode((prev) =>
        prev ? { ...prev, data: { ...prev.data, label: newLabel } } : null
      );
    }
  };

  // Handle node selection
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: FlowNode) => {
      setSelectedNode(node);
    },
    []
  );

  // Delete edge
  const deleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
  };

  return (
    <div className="flowchart-container">
      <h1>Flow Chart Editor</h1>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-section">
          <h3>Add Node</h3>
          <div className="form-group">
            <input
              type="text"
              placeholder="Node Name"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
            />
            <input
              type="number"
              placeholder="X Position"
              value={nodeX}
              onChange={(e) => setNodeX(Number(e.target.value))}
            />
            <input
              type="number"
              placeholder="Y Position"
              value={nodeY}
              onChange={(e) => setNodeY(Number(e.target.value))}
            />
            <button onClick={addNode}>Add Node</button>
          </div>
        </div>

        {selectedNode && (
          <div className="control-section">
            <h3>Edit Selected Node</h3>
            <div className="form-group">
              <input
                type="text"
                placeholder="Node Label"
                value={selectedNode.data.label as string}
                onChange={(e) => updateNodeLabel(e.target.value)}
              />
              <p className="node-info">
                Position: ({Math.round(selectedNode.position.x)},{" "}
                {Math.round(selectedNode.position.y)})
              </p>
              <button onClick={deleteNode}>Delete Node</button>
              <button onClick={() => setSelectedNode(null)}>Deselect</button>
            </div>
          </div>
        )}

        <div className="control-section">
          <h3>Edges ({edges.length})</h3>
          <div className="edge-list">
            {edges.map((edge) => (
              <div key={edge.id} className="edge-item">
                <span>
                  {edge.source} → {edge.target}
                </span>
                <button onClick={() => deleteEdge(edge.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="control-section">
          <h3>Instructions</h3>
          <ul className="instructions">
            <li>Drag nodes to reposition them</li>
            <li>Click a node to select and edit it</li>
            <li>Drag from a node handle to create connections</li>
            <li>Use controls in the bottom-left for zoom/fit</li>
          </ul>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div className="flowchart-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          fitView
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
