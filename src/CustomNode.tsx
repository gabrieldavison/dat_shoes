import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface CustomNodeData {
  date: string;
  body: string;
  country?: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  // Extract year from date
  const year = new Date(data.date).getFullYear();

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} id="target-top" />
      <Handle type="target" position={Position.Left} id="target-left" />
      <Handle type="target" position={Position.Right} id="target-right" />
      <div className="node-content">
        {data.country && (
          <div className="node-country">🌍 {data.country} 🌍</div>
        )}
        <div className="node-title">{year}</div>
        <div
          className="node-body"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} id="source-bottom" />
      <Handle type="source" position={Position.Left} id="source-left" />
      <Handle type="source" position={Position.Right} id="source-right" />
    </div>
  );
};

export default memo(CustomNode);
