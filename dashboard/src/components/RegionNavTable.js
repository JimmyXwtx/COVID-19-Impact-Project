import React from 'react';
import NumberFormat from 'react-number-format';
import styled from 'styled-components';
import StyledRegionNavTable from '../styles/StyledRegionNavTable';

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

const regionRow = (country) => {
  const { c_ref } = country;
  return <>{c_ref}</>;
};

const Rows = (props) => {
  const { items } = props;
  const rows = items.map((country, index) => {
    let {
      propValueTable,
      propValueInvalid,
      propPercent,
      propPercentInvalid,
    } = country;
    const slugKey = `tr-rnav-${index}`;
    return (
      <tr key={slugKey}>
        <td className="region">{regionRow(country)}</td>
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
            <StyledPercentData>{percentFormat(propPercent)}</StyledPercentData>
          )}
        </td>
      </tr>
    );
  });
  return rows;
};

const RegionNavTable = (props) => {
  const { items } = props;
  console.log('RegionNavTable items', items);
  return (
    <StyledRegionNavTable>
      <tbody>
        <Rows items={items} />
      </tbody>
    </StyledRegionNavTable>
  );
};

const StyledPercentData = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`;

export default RegionNavTable;
