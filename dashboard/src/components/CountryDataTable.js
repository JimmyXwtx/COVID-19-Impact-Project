import React from 'react';
import NumberFormat from 'react-number-format';
// import slug from 'slug';
import styled from 'styled-components';
import FlagIcon from '../components/FlagIcon';
import { colorfor } from '../graph/colors';
import getCountryCode from '../js/getCountryCode';
import StyledCountryDataTable from '../styles/StyledCountryDataTable';

function percentFormat(num) {
  // num = Math.round((val / stats_total) * 1000) / 10;
  let ndigits = 1;
  if (num) {
    if (num < 0.01) ndigits = 3;
    if (num < 0.0001) ndigits = 6;
  }
  return Number(num).toLocaleString(undefined, {
    style: 'percent',
    minimumFractionDigits: ndigits,
    maximumFractionDigits: ndigits,
  });
}

const regionRow = (country, index, selectCountry, parentCountry) => {
  const { c_ref } = country;
  const countryCode = parentCountry ? null : getCountryCode(c_ref);
  if (country.n_states)
    return (
      <button
        onClick={() => {
          console.log('CountryDataTable index', index, 'country', country);
          if (selectCountry) selectCountry(country);
        }}
      >
        {countryCode ? <FlagIcon code={countryCode.toLowerCase()} /> : null}
        {c_ref}
      </button>
    );
  else
    return (
      <>
        {countryCode ? <FlagIcon code={countryCode.toLowerCase()} /> : null}
        {c_ref}
      </>
    );
};

const Rows = (props) => {
  const { items, nslices, selectCountry, parentCountry } = props;
  const rows = items.map((country, index) => {
    let { propValueTable, propValueInvalid, propPercent } = country;
    // const slugKey = `tr-${slug(c_ref).toLowerCase()}`;
    const slugKey = `tr-country-${index}`;
    const style = {
      backgroundColor:
        index < nslices - 1 ? colorfor(index) : colorfor(nslices - 1),
    };
    return (
      <tr key={slugKey}>
        <td className="region">
          {regionRow(country, index, selectCountry, parentCountry)}
        </td>
        <td className="value">
          {!propValueInvalid && (
            <NumberFormat
              value={propValueTable}
              displayType={'text'}
              thousandSeparator={true}
              decimalScale={2}
            />
          )}
        </td>
        <td className="percent">
          <StyledPercentData>
            {percentFormat(propPercent)}
            <StyledColorIndicator style={style} />
          </StyledPercentData>
        </td>
      </tr>
    );
  });
  return rows;
};

const CountryDataTable = (props) => {
  const {
    items,
    propTitle,
    pie_data,
    selectCountry,
    parentCountry,
    // regionPlusClick,
    // regionOptions,
    per100k,
  } = props;
  const pieslices = pie_data[0].slices;
  // console.log('pieslices.length', pieslices.length);
  // const { items } = props;
  // console.log('CountryDataTable items', items);
  return (
    <StyledCountryDataTable>
      <thead>
        <tr>
          {/* <th width="60%">Region</th> */}
          <th>
            {/* <button onClick={regionPlusClick}>
              {regionOptions ? '-' : '+'}
            </button>{' '} */}
            Region
          </th>
          <th>
            {propTitle} {per100k ? ' per 100k' : null}
          </th>
          <th width="10%">Percent</th>
        </tr>
      </thead>
      <tbody>
        <Rows
          items={items}
          nslices={pieslices.length}
          selectCountry={selectCountry}
          parentCountry={parentCountry}
          per100k={per100k}
        />
      </tbody>
    </StyledCountryDataTable>
  );
};

const StyledPercentData = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

const StyledColorIndicator = styled.div`
  height: 2rem;
  width: 2rem;
`;

export default CountryDataTable;
