import styled from 'styled-components';

export const StyledDragList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledDraggable = styled.li`
  background-color: #fff;
  border: 1px solid lightgray;
  margin-bottom: 1rem;
  padding: 1rem;

  &:hover {
    background-color: lightyellow;
    cursor: grab;
  }
`;
