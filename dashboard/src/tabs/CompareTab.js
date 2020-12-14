// import React, { useState } from 'react';
import React from 'react';
import { Grid } from 'semantic-ui-react';
import { Select } from 'semantic-ui-react';
import styled from 'styled-components';
import GraphCompare from '../graph/GraphCompare';
import useLocalStorage from '../hooks/useLocalStorage';

function RegionSelect(props) {
  return (
    <Select
      search
      selection
      value={props.value}
      onChange={(param, data) => {
        console.log('RegionSelect param', param);
        console.log('RegionSelect data', data);
        // setCountryFocus(data.value);
        props.setValue(data.value);
      }}
      options={props.options}
    />
  );
}

function CompareTab(props) {
  const [compareIndex1, setCompareIndex1] = useLocalStorage('co-iregion-1', 0);
  const [compareIndex2, setCompareIndex2] = useLocalStorage('co-iregion-2', 1);
  const items = props.items;
  // const ui_key = props.ui_key;
  // const options = props.items.map((item) => ui_key(item.c_ref));
  const options = props.items.map((item, index) => {
    return { key: item.c_ref, value: index, text: item.c_ref };
  });
  const value1 = compareIndex1;
  const value2 = compareIndex2;
  const title1 = options[value1].c_ref;
  const title2 = options[value2].c_ref;

  console.log('CompareTab items', items);

  return (
    <StyledDiv>
      <Grid style={{ margin: 0 }}>
        <Grid.Row>Compare two regions over time.</Grid.Row>
        <Grid.Row>
          <RegionSelect
            value={value1}
            options={options}
            setValue={setCompareIndex1}
          />
          &nbsp; vs. &nbsp;
          <RegionSelect
            value={value2}
            options={options}
            setValue={setCompareIndex2}
          />
        </Grid.Row>
      </Grid>
      <GraphCompare titles={[title1, title2]} />
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  padding: 0 1.5rem 1.5rem;

  div.selection {
    width: 100%;
    @media screen and (min-width: 48em) {
      max-width: 18.75rem;
    }
  }

  .quick-access-buttons {
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;

    @media screen and (min-width: 48em) {
      max-width: 18.75rem;
    }

    button {
      display: block;
      margin-bottom: 0.75rem;
      width: 100%;
    }
  }
`;

export default CompareTab;
