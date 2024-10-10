// TaskComponent.tsx
import { Draggable } from '@hello-pangea/dnd'; // Change this import
import { DraggableProvided } from '@hello-pangea/dnd';
import { Task } from '../types';

const TaskComponent: React.FC<{ task: Task; index: number }> = ({
  task,
  index,
}) => (
  <Draggable draggableId={task.id} index={index}>
    {(provided: DraggableProvided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          ...provided.draggableProps.style,
        }}
        className='task'
      >
        <p>{task.title}</p>
      </div>
    )}
  </Draggable>
);

export default TaskComponent;

