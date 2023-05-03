import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @font-face {
      /* font-family: 'noto_sansbold'; */
      font-family: 'Noto Sans';
      src: url('/fonts/notosans-bold-webfont.woff2') format('woff2'), url('/fonts/notosans-bold-webfont.woff') format('woff');
      font-weight: bold;
      font-style: normal;
  }

  @font-face {
      /* font-family: 'noto_sansbold_italic'; */
      font-family: 'Noto Sans';
      src: url('/fonts/notosans-bolditalic-webfont.woff2') format('woff2'), url('/fonts/notosans-bolditalic-webfont.woff') format('woff');
      font-weight: bold;
      font-style: italic;
  }

  @font-face {
      /* font-family: 'noto_sansregular'; */
      font-family: 'Noto Sans';
      src: url('/fonts/notosans-regular-webfont.woff2') format('woff2'), url('/fonts/notosans-regular-webfont.woff') format('woff');
      font-weight: normal;
      font-style: normal;
  }

  @font-face {
      /* font-family: 'noto_sansitalic'; */
      font-family: 'Noto Sans';
      src: url('/fonts/notosans-regularitalic-webfont.woff2') format('woff2'), url('/fonts/notosans-regularitalic-webfont.woff') format('woff');
      font-weight: normal;
      font-style: italic;
  }

  *, ::before, ::after { box-sizing: border-box; }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.001s !important;
      transition-duration: 0.001s !important;
      animation-iteration-count: 1 !important;
    }
  }

  :root {
    /* https://dribbble.com/shots/9193028-DahePico-branding */
    --color-black: hsla(245, 49%, 9%, 1.000);
    --color-blue-bright: hsla(192, 100%, 43%, 1.000);
    --color-blue: hsla(203, 91%, 29%, 1.000);
    --color-gray: hsla(109, 0%, 90%, 1.000);
    --color-green: hsla(140, 100%, 35%, 1.000);
    --color-orange: hsla(30, 100%, 57%, 1.000);
    --color-pink: hsla(337, 100%, 68%, 1.000);
    --color-purple-light: hsla(265, 26%, 30%, 1.000);
    --color-purple: hsla(270, 29%, 22%, 1.000);
    --color-red: hsla(357, 100%, 68%, 1.000);
    --color-white: hsla(104, 100%, 100%, 1.000);
    --color-yellow: hsla(48, 97%, 52%, 1.000);

    /*
    --color-background: var(--color-black);
    --color-foreground: var(--color-white);
    */
    --color-background: var(--color-white);
    --color-foreground: var(--color-black);
    --color-contrast: rgba(240, 240, 240, 1.000);
    --color-thumb: rgba(150, 150, 150, 1.000);

    line-sizing: normal;
    overflow-x: hidden;
    text-spacing: trim-start allow-end trim-adjacent ideograph-alpha ideograph-numeric;
    touch-action: manipulation;
    -webkit-text-size-adjust: 100%;

    @supports (font-kerning: normal) and (font-varient-ligatures: common-ligatures contextual) and (font-variant-numeric: oldstyle-nums proportional-nums) {
      font-feature-settings: normal;
      font-kerning: normal;
      font-variant-ligatures: common-ligatures contextual;
      font-variant-numeric: oldstyl-nums proportional-nums;
    }

    /* @media screen and (min-width: 80em) {
      font-size: 150%;
    } */
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-weight: normal;
    margin: 0;
  }

  .fonts-loaded {
    body {
      font-family: 'Noto Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    }
  }

  h1, h2, h3, h4, h5, h6 {
    line-height: 1;
  }

  p, ul, ol, dl, address {
    line-height: 1.5;
  }

  pre {
    white-space: pre-wrap;
  }

  nav ul {
    list-style: none;
  }

  img, video, canvas, audio, iframe, embed, object  {
    display: block;
    vertical-align: middle;
  }

  img, video {
    max-width: 100%;
    height: auto;
  }

  img {
    border-style: none;
  }

  abbr {
    font-feature-settings: 'kern', 'liga', 'clig', 'calt', 'c2sc', 'smcp';

    @supports (font-variant-caps: all-small-caps) {
      font-feature-settings: normal;
      font-variant-caps: all-small-caps;
    }
  }

  [hidden] { display: none !important; }

  .visually-hidden {
    clip: rect(1px, 1px, 1px 1px);
    height: 1px;
    overflow: hidden;
    position: absolute;
    visibility: hidden;
    width: 1px;
  }

  .no-break { hyphens: none; }
  .numbers { letter-spacing: .01em; }

  .ui.search.dropdown { min-width: auto; }


  .VictoryContainer {
    user-select: auto !important;
    pointer-events: auto !important;
    touch-action: auto !important;
    }    
`;

export default GlobalStyle;
