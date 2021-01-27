import styled, { css } from 'styled-components'
import { shade } from 'polished'
import colors from './colors'

export const Container = styled.section`
  ${props => props.page && css`
    margin-top: 48px;
  `}

  padding: 1.25rem 1rem;
`

export const Title = styled.h1`
  ${props => props.flex && css`flex: ${props.flex};`}

  font-size: ${props => props.size ? `${props.size}rem` : '1.5rem'};
  font-weight: bold;
  margin-bottom: ${props => props.marginBottom !== undefined ? props.marginBottom : '1.25rem'};
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

  position: relative;
  overflow: hidden;

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

  @keyframes ripple {
    to {
      transform: scaleX(1)
    }
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff5;
    transform: scaleX(0);
    transform-origin: 0% 50%;
    /* transition: transform .4s; */
  }

  &:active::after {
    /* transform: scale(1); */
    animation: ripple .4s linear;
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

export const FlexRow = styled.div`
  display: flex;
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.justifyContent && css`justify-content: ${props.justifyContent};`}

  ${props => props.gap && css`
    & > *:first-child {
      margin-left: 0;
      margin-right: ${props => `calc(.25rem * ${props.gap})`};
    }

    & > * {
      margin-left: ${props => `calc(.25rem * ${props.gap})`};
      margin-right: ${props => `calc(.25rem * ${props.gap})`};
    }

    & > *:last-child {
      margin-left: ${props => `calc(.25rem * ${props.gap})`};
      margin-right: 0;
    } 
  `}
`

export const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;
  background: transparent;
`

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: .25rem .5rem;
  border: none;
  font-size: 1rem;
  color: ${props => colors[props.color] || colors.black};
  background: transparent;
`