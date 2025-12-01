export interface Node {
  x: number;
  y: number;
  text: string;
}

export interface Edge {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
