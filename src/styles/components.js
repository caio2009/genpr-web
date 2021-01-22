import styled, { css } from 'styled-components'

export const Container = styled.section`
  ${props => props.page && css`
    margin-top: 48px;
  `}

  padding: 1.25rem 1rem;
`

export const Title = styled.h1`
  font-size: ${props => props.size ? `${props.size}rem` : '1.5rem'};
  font-weight: bold;
`