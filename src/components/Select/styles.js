import styled, { css } from 'styled-components'
import { shade } from 'polished'

export const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;

  & + div {
    margin-top: 1rem;
  }
`

export const InputContainer = styled.div`
  display: block;

  & + div {
    margin-top: .25rem;
  }
`

export const Label = styled.div`
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
`

export const Input = styled.div`
  width: 100%;
  height: 2.75rem;
  background: ${props => props.error ? '#ffa4a2' : '#ddd'};
  border: none;
  padding: .75rem;
  font-size: 1rem;
`

export const Line = styled.div`
  align-self: center;

  width: calc(100% - 2px);
  height: 2px;
  margin-top: -2px;
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

export const OptionsContainer = styled.div`
  ${props => props.show ? css`
    display: flex;
    flex-direction: column;
  ` : css`
    display: none;
  `}

  max-height: calc(5 * 2.4rem);
  overflow-y: auto;
  background: #ddd;
`

export const Option = styled.div`
  padding: .5rem;
  font-size: 1rem;

  &:hover {
    background: ${shade(0.1, '#ddd')};
  }
`