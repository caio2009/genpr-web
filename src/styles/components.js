import styled, { css } from 'styled-components'
import { shade } from 'polished'

export const Container = styled.section`
  ${props => props.page && css`
    margin-top: 48px;
  `}

  padding: 1.25rem 1rem;
`

export const Title = styled.h1`
  font-size: ${props => props.size ? `${props.size}rem` : '1.5rem'};
  font-weight: bold;
  margin-bottom: 1.25rem;
`

export const Subtitle = styled.h2`
  font-size: ${props => props.size ? `${props.size}rem` : '1rem'};
  font-weight: bold;
  color: #999;
  margin-bottom: .5rem;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;

  padding: .75rem;
  background: #eee;
  border: 2px solid transparent;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color .2s;
  -webkit-tap-highlight-color: transparent;

  & + div {
    margin-top: .5rem;
  }

  /* &:hover {
    background: ${shade(0.05, '#eee')};
  } */

  ${props => props.isSelected && css`
    background: #d1c4e9;
    border: 2px solid #4527a0;
  `}
`

export const ListItemBox = styled.div`
  flex-grow: ${props => props.grow ? props.grow : 'auto'};
`