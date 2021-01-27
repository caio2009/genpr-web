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
    outline: none;
    font-family: 'Nunito', serif;
  }

  *:focus {
    outline: none;
  }

  h1, h2, h3, h4, h5, h6, p {
    @media screen and (max-width: 375px) {
      user-select: none;
    }
  }

  button {
    cursor: pointer;
  }

  .ripple {
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
      background: #0001;
      transform: scaleX(0);
      transform-origin: 0% 50%;
    }

    &:active::after {
      animation: ripple .3s linear;
    }
  }
`