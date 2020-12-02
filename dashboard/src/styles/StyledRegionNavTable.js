import styled from 'styled-components';

const StyledCountryDataTable = styled.table`
  border-collapse: collapse;
  font-size: 1rem;
  width: 100%;

  th {
    padding: 0.625rem;
    text-align: left;
  }

  td {
    padding: 0.625rem;
    font-weight: bold;
  }

  thead {
    background-color: var(--color-background);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody {
    // tr {
    //   &:nth-child(odd) {
    //     background-color: var(--color-contrast);
    //   }
    // }

    .region {
      /* max-width: 140px; */
      /* width: 140px; */
      /* white-space: nowrap;
      overflow: hidden; */
      text-overflow: ellipsis;
    }
  }

  .flag-icon {
    height: 1rem !important;
    margin-right: 0.5rem;
    transform: translateY(-2px);
    width: 1rem !important;
  }
`;

export default StyledCountryDataTable;
