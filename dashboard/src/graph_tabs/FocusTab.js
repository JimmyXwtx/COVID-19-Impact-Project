import React from 'react';
import { Button, Grid } from 'semantic-ui-react';
import styled from 'styled-components';
import uuidv4 from 'uuid';

const FocusTab = (props) => {
  const {
    CountrySelect,
    showWorldAction,
    findFirstDate,
    findLastestDate,
    uiprop,
    focusCountries,
    showCountryAction,
    focusIndex,
  } = props.actions;

  const shortcuts = [1, 0, 2];

  return (
    <StyledDiv>
      <Grid style={{ margin: 0 }}>
        <Grid.Row>
          Use these tools to quickly focus the graph on a selected region.
        </Grid.Row>
        <Grid.Row>
          <CountrySelect />
        </Grid.Row>
        <Grid.Row style={{ paddingBottom: 0 }}>
          <p>
            <b>Quick Access</b>
          </p>
        </Grid.Row>
        <Grid.Row>
          <div className="quick-access-buttons">
            <Button onClick={showWorldAction}>World</Button>
            {shortcuts.map((id) => (
              <Button
                active={focusIndex === id}
                onClick={() => showCountryAction(id)}
                key={uuidv4()}
              >
                {focusCountries[id]}
              </Button>
            ))}
            <Button onClick={findFirstDate}>First {uiprop}</Button>
            <Button onClick={findLastestDate}>Latest Date</Button>
          </div>
        </Grid.Row>
      </Grid>
    </StyledDiv>
  );
};

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

export default FocusTab;
