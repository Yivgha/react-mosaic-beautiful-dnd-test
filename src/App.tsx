import React from 'react';
import { Mosaic } from 'react-mosaic-component';
import {
  DragDropContext,
  Droppable,
  DroppableProvided,
} from '@hello-pangea/dnd';

import 'react-mosaic-component/react-mosaic-component.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { ViewId } from './types';
import { initialTasks } from './initialTasks';
import TaskComponent from './components/TaskComponent';

import './App.css';

const App: React.FC = () => {
  const [tasks, setTasks] = React.useState(initialTasks);

  // Handle drag end event
  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = source.droppableId as ViewId;
    const endColumn = destination.droppableId as ViewId;

    // Copy tasks for source and destination columns
    const startTasks = Array.from(tasks[startColumn]);
    const endTasks = Array.from(tasks[endColumn]);

    // Moving between columns
    if (startColumn !== endColumn) {
      const [movedTask] = startTasks.splice(source.index, 1);
      endTasks.splice(destination.index, 0, movedTask);

      // Update the tasks in state
      setTasks((prevTasks) => ({
        ...prevTasks,
        [startColumn]: startTasks,
        [endColumn]: endTasks,
      }));
    } else {
      // Reorder within the same column
      const [movedTask] = startTasks.splice(source.index, 1);
      startTasks.splice(destination.index, 0, movedTask);

      // Update the state with reordered tasks
      setTasks((prevTasks) => ({
        ...prevTasks,
        [startColumn]: startTasks,
      }));
    }
  };

  // Create ELEMENT_MAP dynamically from tasks state
  const ELEMENT_MAP: { [viewId in ViewId]: JSX.Element } = {
    a: (
      <Droppable droppableId='a'>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='mosaic-window'
          >
            <h2>Column 1</h2>
            {tasks.a.map((task, index) => (
              <TaskComponent key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ),
    b: (
      <Droppable droppableId='b'>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='mosaic-window'
          >
            <h2>Column 2</h2>
            {tasks.b.map((task, index) => (
              <TaskComponent key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ),
    c: (
      <Droppable droppableId='c'>
        {(provided: DroppableProvided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className='mosaic-window'
          >
            <h2>Column 3</h2>
            {tasks.c.map((task, index) => (
              <TaskComponent key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    ),
  };

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

