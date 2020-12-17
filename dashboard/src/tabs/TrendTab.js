// import React, { useState } from 'react';
import React, { useEffect, useState } from 'react';
import { Button, Grid, Select } from 'semantic-ui-react';
import styled from 'styled-components';
import GraphTrend from '../graph/GraphTrend';
// import useLocalStorage from '../hooks/useLocalStorage';
import fetchData from '../js/fetchData';

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

function dataForGraph(data, propFocus, propDiff) {
  const data1 = [];
  let oy = 0;
  for (let index = 0; index < data.length; index++) {
    const item = data[index];
    let y = item[propFocus] || 0;
    if (propDiff) {
      const ny = y;
      y = y - oy;
      oy = ny;
    }
    data1.push({ x: index, y });
  }
  return data1;
}

function TrendTab(props) {
  const [compareIndex1, setCompareIndex1] = useState(0);
  const [compareIndex2, setCompareIndex2] = useState(1);
  const [dateItems1, setDateItems1] = useState([]);
  const [dateItems2, setDateItems2] = useState([]);
  // const [propFocus, setPropFocus] = useLocalStorage('co-propFocus', 'Deaths');
  // const [sumFocus, setSumFocus] = useLocalStorage('co-sumFocus', 'totals');
  const [propFocus, setPropFocus] = useState('Deaths');
  const [sumFocus, setSumFocus] = useState('totals');

  useEffect(() => {
    setPropFocus(props.propFocus);
    setSumFocus(props.sumFocus);
    const title1 = props.selected_items[0].c_ref;
    const title2 = props.selected_items[1].c_ref;
    props.all_items.forEach((item, index) => {
      if (item.c_ref === title1 && compareIndex1 !== index)
        setCompareIndex1(index);
      if (item.c_ref === title2 && compareIndex2 !== index)
        setCompareIndex2(index);
    });
  }, []);

  console.log('TrendTab propFocus', propFocus);
  console.log('TrendTab sumFocus', sumFocus);

  const data_prefix = props.data_prefix;
  const c_dates = props.c_dates;
  const items = props.all_items;
  const options = items.map((item, index) => {
    return { key: item.c_ref, value: index, text: item.c_ref };
  });
  const value1 = compareIndex1;
  const value2 = compareIndex2;
  const title1 = (items[value1] || {}).c_ref;
  const title2 = (items[value2] || {}).c_ref;
  const titles = [title1, title2];
  const propDiff = sumFocus === 'daily';

  // console.log('TrendTab items', items);
  // console.log('TrendTab options', options);
  // console.log('TrendTab value1', value1);
  console.log('TrendTab title1', title1);

  useEffect(() => {
    console.log('TrendTab useEffect title1', title1);
    if (!title1) return;
    let cname = title1.replace(/ /g, '_').replace(/,/g, '');
    fetchData(data_prefix + 'c_series/' + cname + '.json', (data) => {
      console.log('TrendTab data1', data);
      if (!data) data = [];
      setDateItems1(dataForGraph(data, propFocus, propDiff));
    });
  }, [data_prefix, title1, propFocus, propDiff]);

  useEffect(() => {
    console.log('TrendTab useEffect title2', title2);
    if (!title2) return;
    let cname = title2.replace(/ /g, '_').replace(/,/g, '');
    fetchData(data_prefix + 'c_series/' + cname + '.json', (data) => {
      console.log('TrendTab data2', data);
      if (!data) data = [];
      setDateItems2(dataForGraph(data, propFocus, propDiff));
    });
  }, [data_prefix, title2, propFocus, propDiff]);

  function casesAction() {
    setPropFocus('Cases');
  }
  function deathsAction() {
    setPropFocus('Deaths');
  }
  function cumulativeAction() {
    setSumFocus('totals');
  }
  function dailyAction() {
    setSumFocus('daily');
  }

  const cases_active = propFocus === 'Cases';
  const deaths_active = propFocus === 'Deaths';
  const total_active = !propDiff;
  const daily_active = propDiff;

  return (
    <StyledDiv>
      <GraphTrend
        titles={titles}
        data={[dateItems1, dateItems2]}
        c_dates={c_dates}
        propFocus={propFocus}
      />
      <Grid style={{ margin: 0 }}>
        <Button.Group>
          <Button size="mini" onClick={casesAction} active={cases_active}>
            Cases
          </Button>
          <Button size="mini" onClick={deathsAction} active={deaths_active}>
            Deaths
          </Button>
        </Button.Group>
        <Button.Group>
          <Button size="mini" onClick={cumulativeAction} active={total_active}>
            Cumulative
          </Button>
          <Button size="mini" onClick={dailyAction} active={daily_active}>
            Daily
          </Button>
        </Button.Group>

        <Grid.Row>
          <RegionSelect
            value={value1}
            options={options}
            setValue={setCompareIndex1}
          />
          <RegionSelect
            value={value2}
            options={options}
            setValue={setCompareIndex2}
          />
        </Grid.Row>

        {/* <CountryTabBackNav /> */}
      </Grid>
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

export default TrendTab;
