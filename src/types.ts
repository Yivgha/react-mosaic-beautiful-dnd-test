export type ViewId = 'a' | 'b' | 'c';

export type Task = {
  id: string;
  title: string;
};

export interface Tasks {
  [key: string]: Task[];
}

