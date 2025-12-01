import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";

export interface CustomNodeData {
  title: string;
  body: string;
}

const CustomNode: React.FC<NodeProps<CustomNodeData>> = ({ data }) => {
  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />
      <div className="node-content">
        <div className="node-title">{data.title}</div>
        <div
          className="node-body"
          dangerouslySetInnerHTML={{ __html: data.body }}
        />
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(CustomNode);
