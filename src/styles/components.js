import styled, { css } from 'styled-components'
import { shade } from 'polished'
import colors from './colors'

export const Container = styled.section`
  ${props => props.page && css`
    margin-top: 48px;
    margin-bottom: 30px;
  `}

  padding: 1.25rem 1rem;
`

export const Title = styled.h1`
  ${props => props.flex && css`flex: ${props.flex};`}

  font-size: ${props => props.size ? props.size : 1.25}rem;
  font-weight: bold;
  margin-bottom: ${props => props.marginBottom !== undefined ? props.marginBottom : 1}rem;
  text-transform: uppercase;

  ${props => props.centered && css`text-align: center;`}
`

export const Subtitle = styled.h2`
  display: flex;

  font-size: ${props => props.size ? `${props.size}rem` : '1rem'};
  font-weight: bold;
  margin-bottom: ${props => props.marginBottom !== undefined ? props.marginBottom : 0.5}rem;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
`

export const ListEmpty = styled.p`
  margin-top: .5rem;
  padding: 1rem;
  text-align: center;
  background: #eee;
`

export const ListItem = styled.div`
  display: flex;
  align-items: center;

  position: relative;
  overflow: hidden;

  padding: .75rem;
  background: #eee;
  border: 2px solid transparent;
  cursor: pointer;
  transition: background-color .2s;
  -webkit-tap-highlight-color: transparent;

  & + div {
    margin-top: .5rem;
  }

  ${props => props.hoverable && css`
    &:hover {
      background: ${shade(0.05, '#eee')};
    }
  `}
`

export const ListItemBox = styled.div`
  flex-grow: ${props => props.grow ? props.grow : 'auto'};
`

export const FlexRow = styled.div`
  display: flex;
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.justifyContent && css`justify-content: ${props.justifyContent};`}
  flex-wrap: wrap;

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

  ${props => props.bottom && css`
    margin-bottom: ${props.bottom}rem;
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

export const AvatarImg = styled.img`
  width: ${props => props.size ? `${props.size}rem` : '4rem'};
  height: ${props => props.size ? `${props.size}rem` : '4rem'};
  border-radius: 50%;
  background: ${colors.white};
`

export const SelectContainer = styled.div`
  flex: 1;
  padding: .5rem;
  background: #eee;
  transition: background-color .2s;
  cursor: pointer;

  p {
    text-transform: uppercase;
    font-weight: bold;

    & + p {
      margin-top: .5rem;
      color: #555;
      font-weight: normal;
    }
  }

  &:hover {
    background: ${shade(0.1, '#eee')};
  }
`