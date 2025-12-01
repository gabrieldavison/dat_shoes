import { supabase } from "./supabase";
import { Node as FlowNode, Edge as FlowEdge } from "reactflow";
import { CustomNodeData } from "../CustomNode";

const FLOWCHART_ID = "main-flowchart"; // Single flowchart for now

export interface FlowchartData {
  nodes: FlowNode<CustomNodeData>[];
  edges: FlowEdge[];
}

export const saveFlowchart = async (data: FlowchartData): Promise<void> => {
  const { error } = await supabase.from("flowcharts").upsert({
    id: FLOWCHART_ID,
    nodes: data.nodes,
    edges: data.edges,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error saving flowchart:", error);
    throw error;
  }
};

export const loadFlowchart = async (): Promise<FlowchartData | null> => {
  const { data, error } = await supabase
    .from("flowcharts")
    .select("*")
    .eq("id", FLOWCHART_ID)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No data found, return null
      return null;
    }
    console.error("Error loading flowchart:", error);
    throw error;
  }

  return {
    nodes: data.nodes as FlowNode<CustomNodeData>[],
    edges: data.edges as FlowEdge[],
  };
};

// Subscribe to real-time changes
export const subscribeToFlowchart = (
  callback: (data: FlowchartData) => void
) => {
  const channel = supabase
    .channel("flowchart-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "flowcharts",
        filter: `id=eq.${FLOWCHART_ID}`,
      },
      (payload) => {
        if (payload.new && typeof payload.new === "object") {
          const data = payload.new as any;
          callback({
            nodes: data.nodes as FlowNode<CustomNodeData>[],
            edges: data.edges as FlowEdge[],
          });
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
};
