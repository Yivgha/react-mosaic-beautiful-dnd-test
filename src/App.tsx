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
import { EditableText, Icon } from '@blueprintjs/core';

const App: React.FC = () => {
  const [tasks, setTasks] = React.useState<Tasks>(() => {
    const savedTasks = localStorage.getItem('tasks');
    const loadedTasks = savedTasks ? JSON.parse(savedTasks) : initialTasks;
    return {
      a: loadedTasks.a || [],
      b: loadedTasks.b || [],
      c: loadedTasks.c || [],
    };
  });

  const [columnNames, setColumnNames] = React.useState<Record<ViewId, string>>(
    () => {
      const savedColumnNames = localStorage.getItem('columnNames');
      return savedColumnNames
        ? JSON.parse(savedColumnNames)
        : { a: 'Column A', b: 'Column B', c: 'Column C' };
    }
  );

  const onDragEnd = (result: any) => {
    const { destination, source } = result;

    if (!destination) return;

    const startColumn = source.droppableId as ViewId;
    const endColumn = destination.droppableId as ViewId;

    const startTasks = Array.from(tasks[startColumn]);
    const endTasks = Array.from(tasks[endColumn]);

    // If the task is moved to the same column
    if (startColumn === endColumn) {
      const [movedTask] = startTasks.splice(source.index, 1);
      startTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = {
        ...tasks,
        [startColumn]: startTasks,
      };

      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } else {
      // If the task is moved to a different column
      const [movedTask] = startTasks.splice(source.index, 1);
      endTasks.splice(destination.index, 0, movedTask);

      const updatedTasks = {
        ...tasks,
        [startColumn]: startTasks,
        [endColumn]: endTasks,
      };

      setTasks(updatedTasks);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    }
  };

  const handleColumnNameChange = (columnId: ViewId, newName: string) => {
    setColumnNames((prevNames) => ({
      ...prevNames,
      [columnId]: newName,
    }));

    localStorage.setItem(
      'columnNames',
      JSON.stringify({
        ...columnNames,
        [columnId]: newName,
      })
    );
  };

  const handleTaskTitleChange = (taskId: string, newTitle: string) => {
    const updatedTasks = { ...tasks };
    const columnKeys = Object.keys(tasks) as ViewId[];

    for (const columnKey of columnKeys) {
      const taskIndex = updatedTasks[columnKey].findIndex(
        (task) => task.id === taskId
      );

      if (taskIndex !== -1) {
        updatedTasks[columnKey][taskIndex] = {
          ...updatedTasks[columnKey][taskIndex],
          title: newTitle,
        };
        break;
      }
    }

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Dynamically generate columns
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
                <div className='edit-column-name'>
                  <EditableText
                    value={columnNames[columnId]}
                    onChange={(newName) =>
                      handleColumnNameChange(columnId, newName)
                    }
                    className='edit-column-name-text'
                  />
                  <Icon icon='edit' className='edit-column-icon' />
                </div>

                {tasks[columnId].length > 0 ? (
                  tasks[columnId].map((task: Task, index: number) => (
                    <TaskComponent
                      key={task.id}
                      task={task}
                      index={index}
                      onTitleChange={handleTaskTitleChange}
                    />
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

