export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  status: 'Production' | 'Beta' | 'Concept';
  icon: string;
}

export interface NavLink {
  name: string;
  path: string;
}