import React from 'react';
import { Mosaic } from 'react-mosaic-component';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd';
import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { ViewId, Task, Tasks } from './types';
import { initialTasks } from './initialTasks';
import TaskComponent from './components/TaskComponent';
import './App.css';

const App: React.FC = () => {
  // Load tasks from localStorage or use initialTasks
  const [tasks, setTasks] = React.useState<Tasks>(() => {
    const savedTasks = localStorage.getItem('tasks');
    const loadedTasks = savedTasks ? JSON.parse(savedTasks) : initialTasks;
    return {
      a: loadedTasks.a || [],
      b: loadedTasks.b || [],
      c: loadedTasks.c || [],
    };
  });

  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const startColumn = source.droppableId as ViewId;
    const endColumn = destination.droppableId as ViewId;

    const startTasks = Array.from(tasks[startColumn]);
    const endTasks = Array.from(tasks[endColumn]);

    if (startColumn === endColumn) {
      const [movedTask] = startTasks.splice(source.index, 1);
      startTasks.splice(destination.index, 0, movedTask);

      setTasks((prevTasks: Tasks) => ({
        ...prevTasks,
        [startColumn]: startTasks,
      }));
    } else {
      const [movedTask] = startTasks.splice(source.index, 1);
      endTasks.splice(destination.index, 0, movedTask);

      setTasks((prevTasks: Tasks) => ({
        ...prevTasks,
        [startColumn]: startTasks,
        [endColumn]: endTasks,
      }));
    }

    // Save to localStorage
    localStorage.setItem(
      'tasks',
      JSON.stringify({
        ...tasks,
        [startColumn]: startTasks,
        [endColumn]: endTasks,
      })
    );
  };

  // Dynamically generate columns based on the tasks object
  const createColumns = () => {
    const columns: ViewId[] = ['a', 'b', 'c'];

    return columns.reduce(
      (elementsMap: { [viewId in ViewId]: JSX.Element }, columnId) => {
        elementsMap[columnId] = (
          <Droppable droppableId={columnId} key={columnId}>
            {(provided: DroppableProvided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className='mosaic-window'
              >
                <h2>Column {columnId.toUpperCase()}</h2>
                {tasks[columnId].length > 0 ? (
                  tasks[columnId].map((task: Task, index: number) => (
                    <TaskComponent key={task.id} task={task} index={index} />
                  ))
                ) : (
                  <p>No tasks available</p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        );
        return elementsMap;
      },
      {} as { [viewId in ViewId]: JSX.Element }
    );
  };

  const ELEMENT_MAP = createColumns();

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div id='app' style={{ height: '100vh' }}>
        <Mosaic<ViewId>
          renderTile={(id: ViewId) => ELEMENT_MAP[id]}
          initialValue={{
            direction: 'row',
            first: 'a',
            second: {
              direction: 'row',
              first: 'b',
              second: 'c',
            },
            splitPercentage: 33,
          }}
        />
      </div>
    </DragDropContext>
  );
};

export default App;

