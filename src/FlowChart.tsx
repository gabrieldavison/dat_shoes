import React, { useCallback, useState, useMemo, useEffect } from "react";
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
} from "reactflow";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "reactflow/dist/style.css";
import "./FlowChart.css";
import CustomNode, { CustomNodeData } from "./CustomNode";
import { useAuth } from "./lib/AuthContext";
import {
  saveFlowchart,
  loadFlowchart,
  subscribeToFlowchart,
} from "./lib/flowchartService";

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
  const { isAdmin, signOut } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">(
    "saved"
  );

  // Define custom node types
  const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);

  // Load flowchart from database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadFlowchart();
        if (data) {
          setNodes(data.nodes);
          setEdges(data.edges);
        }
      } catch (error) {
        console.error("Error loading flowchart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    // Subscribe to real-time changes
    const unsubscribe = subscribeToFlowchart((data) => {
      setNodes(data.nodes);
      setEdges(data.edges);
    });

    return () => {
      unsubscribe();
    };
  }, [setNodes, setEdges]);

  // Auto-save changes to database (admins only)
  useEffect(() => {
    if (!isAdmin || loading) return;

    const timeoutId = setTimeout(async () => {
      try {
        setSaveStatus("saving");
        await saveFlowchart({ nodes, edges });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Error saving flowchart:", error);
        setSaveStatus("error");
      }
    }, 1000); // Debounce for 1 second

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, isAdmin, loading]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
      // Extract year from date string
      const year = new Date(currentDate).getFullYear().toString();
      setEditDate(year);
      setEditBody(currentBody);
      setEditCountry(currentCountry || "");
    },
    []
  );

  // Autosave changes when editing
  useEffect(() => {
    if (editingNode) {
      const timeoutId = setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) =>
            node.id === editingNode
              ? {
                  ...node,
                  data: {
                    // Convert year to date string format (YYYY-01-01)
                    date: `${editDate}-01-01`,
                    body: editBody,
                    ...(editCountry && { country: editCountry }),
                  },
                }
              : node
          )
        );
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [editingNode, editDate, editBody, editCountry, setNodes]);

  // Close modal
  const closeModal = useCallback(() => {
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

  if (loading) {
    return (
      <div className="flowchart-container">
        <div className="loading-message">Loading flowchart...</div>
      </div>
    );
  }

  return (
    <div className="flowchart-container">
      <div className="header">
        <h1>Flow Chart {isAdmin ? "Editor" : "Viewer"}</h1>
        <div className="header-actions">
          {saveStatus === "saving" && isAdmin && (
            <span className="save-status saving">Saving...</span>
          )}
          {saveStatus === "saved" && isAdmin && (
            <span className="save-status saved">✓ Saved</span>
          )}
          {saveStatus === "error" && isAdmin && (
            <span className="save-status error">⚠ Error saving</span>
          )}
          {!isAdmin && <span className="view-mode-badge">👁️ View Only</span>}
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </div>

      {/* Toolbar - only show edit buttons for admins */}
      {isAdmin && (
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
      )}

      {!isAdmin && (
        <div className="view-mode-notice">
          You are viewing this flowchart in read-only mode. Admin access is
          required to make changes.
        </div>
      )}

      {/* Edit Node Modal - only for admins */}
      {editingNode && isAdmin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Node</h3>
              <button
                className="modal-close"
                onClick={closeModal}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="modal-field">
              <label htmlFor="node-date">Year</label>
              <input
                id="node-date"
                type="number"
                value={editDate}
                onChange={(e) => setEditDate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeModal();
                }}
                min="1878"
                max="2100"
                step="1"
                placeholder="e.g., 1945"
                autoFocus
              />
            </div>

            <div className="modal-field">
              <label htmlFor="node-country">Country (optional)</label>
              <input
                id="node-country"
                type="text"
                value={editCountry}
                onChange={(e) => setEditCountry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") closeModal();
                }}
                placeholder="Leave empty to inherit from parent"
              />
            </div>

            <div className="modal-field">
              <label htmlFor="node-body">Description</label>
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
            </div>

            <div className="autosave-indicator">
              <span>✓ Changes saved automatically</span>
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
          onNodeDoubleClick={isAdmin ? onNodeDoubleClick : undefined}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          nodesDraggable={isAdmin}
          nodesConnectable={isAdmin}
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
