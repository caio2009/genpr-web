import styled, { css } from 'styled-components'

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;

  position: relative;

  border-radius: 4px;
  transition: border-color .2s;

  label {
    height: 1rem;
    margin-bottom: .5rem;
    transition: transform .2s;
    color: ${props => props.error ? '#b71c1c' : '#555'};

    ${props => props.focus ? css`
      font-size: 1rem;
      transform: translate(0, 0);
    ` : css`
      font-size: 1.25rem;
      transform: translate(.5rem, 2.1rem);
    `}
  }

  input {
    width: 100%;
    background: ${props => props.error ? '#ffcdd2' : '#ddd'};
    border: none;
    border-radius: 4px;
    padding: .75rem;
    font-size: 1rem;
  }

  & + div {
    /* margin-top: .25rem; */
  }
`

export const Line = styled.div`
  align-self: center;

  width: calc(100% - 2px);
  height: 2px;
  margin-top: -2px;
  border-bottom-left-radius: 2px;
  border-bottom-right-radius: 2px;
  background: ${props => props.error ? '#b71c1c' : '#361190'};
  transition: transform .2s;

  transform: ${props => props.focus ? 'scale(1)' : 'scale(0)'};
`

export const ErrorContainer = styled.div`
  margin-top: .25rem;
  font-size: 1rem;
  line-height: 1rem;
  color: #b71c1c;
  text-align: right;
`