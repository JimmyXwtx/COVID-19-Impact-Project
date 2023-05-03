import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import StyledDateSlider from '../styles/StyledDateSlider';

const DateSlider = ({ dateIndex, dateListLength, updateSlider }) => {
  const [currentKey, setCurrentKey] = useState(dateIndex);

  useEffect(() => {
    setCurrentKey(dateIndex);
  }, [dateIndex]);

  return (
    <StyledDateSlider
      type="range"
      min="0"
      max={dateListLength - 1}
      value={currentKey}
      step="1"
      onChange={(event) => {
        const value = event.target.value;
        setCurrentKey(value);
        updateSlider(value);
      }}
    />
  );
};

DateSlider.propTypes = {
  dateListLength: PropTypes.number.isRequired,
  updateSlider: PropTypes.func.isRequired,
};

export default DateSlider;
