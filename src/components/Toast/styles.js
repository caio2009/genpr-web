import styled from 'styled-components'
import colors from '../../styles/colors'

const types = {
  success: { bg: colors.lightPurple, fc: colors.white },
  error: { bg: colors.red, fc: colors.white },
  warning: { bg: colors.yellow, fc: colors.black },
  info: { bg: colors.blue, fc: colors.white }
}

export const Wrapper = styled.div`
  display: flex;
  align-items: flex-start;

  max-width: 400px;
  padding: .5rem;
  border-radius: 4px;
  background: ${props => types[props.type].bg};
  color: ${props => types[props.type].fc};
  box-shadow: 0 0 2px 2px #0005;

  & + div {
    margin-top: .5rem;
  }

  @media screen and (max-width: 375px) {
    max-width: 100%;
    width: 100%;
  }
`

export const IconWrapper = styled.div`
  padding: .5rem .25rem 0 0;
`

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  padding: .25rem;
`

export const Title = styled.div`
  font-weight: bold;
  font-size: 1.25rem;
`

export const Description = styled.div`
  font-size: 1rem;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  border: none;
  border-radius: 50%;
  background: transparent;
  color: inherit;
`