import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 1rem;

  button + button {
    margin-top: .5rem;
  }
`

export const Receipt = styled.table`
  width: 100%;
  font-size: 10px;

  hr {
    height: 1px;
    background: #000;
    margin: .25rem 0;
  }
`