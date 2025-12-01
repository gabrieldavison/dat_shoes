export interface Node {
  x: number;
  y: number;
  date: string;
  body: string;
  country?: string;
}

export interface Edge {
  from: { x: number; y: number };
  to: { x: number; y: number };
}
