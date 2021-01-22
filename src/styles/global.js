import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    background: #1a237e;
  }

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: 0;
    font-family: 'Nunito', serif;
  }

  button {
    cursor: pointer;
  }
`