export interface Node {
  x: number;
  y: number;
  title: string;
  body: string;
}

export interface Edge {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
