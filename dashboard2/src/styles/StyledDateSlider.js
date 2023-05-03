import styled from 'styled-components';

const StyledDateSlider = styled.input`
  background-color: var(--color-contrast);
  -webkit-appearance: none;
  margin: 1rem 0;
  width: 100%;

  &:focus {
    outline: none;
  }

  &::webkit-slider-runnable-track {
    animate: 0.2s;
    background: var(--color-background);
    border-radius: 1.3px;
    /* border: 0.2px solid #010101;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    cursor: pointer;
    height: 8.4px;
    width: 100%;
  }

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    /* background: var(--color-red); */
    background: var(--color-thumb);
    border-radius: 3px;
    /* border: 1px solid #000000; */
    /* box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    cursor: pointer;
    height: 1rem;
    /* margin-top: -14px; */
    width: 1rem;
  }

  &:focus::-webkit-slider-runnable-track {
    background: #367ebd;
  }

  &::-moz-range-track {
    animate: 0.2s;
    background: var(--color-background);
    border-radius: 1.3px;
    /* border: 0.2px solid #010101;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    cursor: pointer;
    height: 8.4px;
    width: 100%;
  }
  &::-moz-range-thumb {
    /* background: var(--color-red); */
    background: var(--color-thumb);
    border-radius: 3px;
    /* border: 1px solid #000000;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d; */
    cursor: pointer;
    height: 1rem;
    width: 1rem;
  }
  &::-ms-track {
    width: 100%;
    height: 8.4px;
    cursor: pointer;
    animate: 0.2s;
    background: transparent;
    border-color: transparent;
    border-width: 16px 0;
    color: transparent;
  }
  &::-ms-fill-lower {
    background: #2a6495;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  &::-ms-fill-upper {
    background: #3071a9;
    border: 0.2px solid #010101;
    border-radius: 2.6px;
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  }
  &::-ms-thumb {
    box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
    border: 1px solid #000000;
    height: 36px;
    width: 16px;
    border-radius: 3px;
    background: #ffffff;
    cursor: pointer;
  }
  &:focus::-ms-fill-lower {
    background: #3071a9;
  }
  &:focus::-ms-fill-upper {
    background: #367ebd;
  }
`;

export default StyledDateSlider;
