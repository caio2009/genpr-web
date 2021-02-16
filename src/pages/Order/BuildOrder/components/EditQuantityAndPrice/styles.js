import styled from 'styled-components'

export const Wrapper = styled.div`
  & + div {
    margin-top: 1rem;
  }

  h4 {
    margin-bottom: .5rem;
  }
`

export const ProductField = styled.div`
  display: flex;
  flex-direction: column;

  padding: .5rem;
  background: #eee;

  & + div {
    margin-top: .5rem;
  }

  input {
    padding: .5rem;
    border: none;
    border-radius: 4px;
    background: #ddd;
    font-size: 1.25rem;
    text-align: center;
  }
`