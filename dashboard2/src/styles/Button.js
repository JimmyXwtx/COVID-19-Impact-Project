import styled from 'styled-components';

const Button = styled.button`
  align-items: center;
  background-color: white;
  border-radius: 0.35rem;
  border: 2px solid ${props => (props.success ? 'green' : 'crimson')};
  color: ${props => (props.success ? 'green' : 'crimson')};
  display: flex;
  height: 1.5rem;
  justify-content: center;
  padding: 1rem;
  width: 1.5rem;
  transition: background-color 225ms ease-in-out;

  &:hover,
  &:focus {
    background-color: ${props => (props.success ? 'green' : 'crimson')};
    color: white;
  }

  &:hover {
    cursor: pointer;
  }
`;

export default Button;
