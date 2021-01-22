import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  body {
    /* background: #1a237e; */
    /* background: #3f51b5; */
  }

  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    outline: 0;
    font-family: 'Nunito', serif;
  }

  h1, h2, h3, h4, h5, h6, p {
    @media screen and (max-width: 375px) {
      user-select: none;
    }
  }

  button {
    cursor: pointer;
  }
`