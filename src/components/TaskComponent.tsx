import { Draggable } from '@hello-pangea/dnd';
import { DraggableProvided } from '@hello-pangea/dnd';
import { Task } from '../types';
import { EditableText } from '@blueprintjs/core';
import React from 'react';

const TaskComponent: React.FC<{
  task: Task;
  index: number;
  onTitleChange: (id: string, title: string) => void;
}> = ({ task, index, onTitleChange }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false); // New state for hover

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleConfirm = () => {
    setIsEditing(false);
  };

  return (
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
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => setIsHovered(true)} // Set hovered state to true
          onMouseLeave={() => setIsHovered(false)} // Set hovered state to false
        >
          <EditableText
            value={task.title}
            onChange={(newTitle) => onTitleChange(task.id, newTitle)}
            onConfirm={handleConfirm}
            placeholder='Edit task title...'
            selectAllOnFocus={true}
            isEditing={isEditing}
            onCancel={() => setIsEditing(false)}
          />
          {isHovered && !isEditing && (
            <div className='hover-text'>Double click on title to edit</div>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default TaskComponent;

