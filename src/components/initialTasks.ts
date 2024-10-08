import { ViewId, Task } from '../types';

export const initialTasks: { [key in ViewId]: Task[] } = {
  a: [
    { id: '1', title: 'Task 1 in Column 1' },
    { id: '2', title: 'Task 2 in Column 1' },
    { id: '3', title: 'Task 3 in Column 1' },
  ],
  b: [
    { id: '4', title: 'Task 1 in Column 2' },
    { id: '5', title: 'Task 2 in Column 2' },
    { id: '6', title: 'Task 3 in Column 2' },
  ],
  c: [
    { id: '7', title: 'Task 1 in Column 3' },
    { id: '8', title: 'Task 2 in Column 3' },
    { id: '9', title: 'Task 3 in Column 3' },
  ],
};

