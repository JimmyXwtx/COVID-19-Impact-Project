import React from 'react';
import NumberFormat from 'react-number-format';
import { Button } from 'semantic-ui-react';
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
  const { title } = country;
  const countryCode = parentCountry ? null : getCountryCode(title);
  if (country.n_subs)
    return (
      <Button
        basic
        size="tiny"
        onClick={() => {
          // console.log('CountryDataTable index', index, 'country', country);
          if (selectCountry) selectCountry(country);
        }}
      >
        {countryCode ? <FlagIcon code={countryCode.toLowerCase()} /> : null}
        {title}
      </Button>
    );
  else
    return (
      <>
        {countryCode ? <FlagIcon code={countryCode.toLowerCase()} /> : null}
        {title}
      </>
    );
};

const Rows = (props) => {
  const { items, nslices, selectCountry, parentCountry } = props;
  const rows = items.map((country, index) => {
    let {
      propValueTable,
      propValueInvalid,
      propPercent,
      propPercentInvalid,
      iorder,
    } = country;
    const slugKey = `tr-country-${index}`;
    const style = {
      backgroundColor:
        iorder < nslices - 1 ? colorfor(iorder) : colorfor(nslices - 1),
      // index < nslices - 1 ? colorfor(index) : colorfor(nslices - 1),
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
        <td className="percent" width="10%">
          {!propPercentInvalid && (
            <StyledPercentData>
              {percentFormat(propPercent)}
              <StyledColorIndicator style={style} />
            </StyledPercentData>
          )}
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
    nslices,
    selectCountry,
    parentCountry,
    per100k,
    // sortActionSpec,
    regionTitle,
  } = props;
  // console.log('CountryDataTable items', items);
  return (
    <StyledCountryDataTable>
      {/* {sortActionSpec && ( */}
      <thead>
        <tr>
          <th>{regionTitle}</th>
          <th>
            {propTitle} {per100k ? ' per 100,000' : null}
          </th>
          <th>Percent</th>
          {/* <th width="60%">Region</th> */}
          {/* <th style={sortActionSpec.region.style}>
              <Button basic size="tiny" onClick={sortActionSpec.region.onclick}>
                ▼ {regionTitle}
              </Button>
            </th>
            <th style={sortActionSpec.prop.style}>
              <Button basic size="tiny" onClick={sortActionSpec.prop.onclick}>
                ▼ {propTitle} {per100k ? ' per 100,000' : null}
              </Button>
            </th>
            <th width="10%" style={sortActionSpec.percent.style}>
              <Button
                basic
                size="tiny"
                onClick={sortActionSpec.percent.onclick}
              >
                ▼ Percent
              </Button>
            </th> */}
        </tr>
      </thead>
      {/* )} */}
      <tbody>
        <Rows
          items={items}
          nslices={nslices}
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
