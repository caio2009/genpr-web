import styled from 'styled-components'
import { shade } from 'polished'

export const FieldInfo = styled.div`
  background: #eee;
  padding: .5rem;
  margin-bottom: 1rem;
`

export const InfoField = styled.div`
  display: flex;
  flex-direction: column;

  padding: .5rem;

  p {
    color: #555;
  }
`

export const YearMonthContainer = styled.div`
  display: flex;
  background: #eee;

  div {
    flex: 1;
    padding: .5rem;
    text-align: center;
    transition: background-color .2s;
    cursor: pointer;

    p {
      /* font-size: 1rem; */
      text-transform: uppercase;
    }

    &:hover {
      background: ${shade(0.1, '#eee')};
    }
  }
`