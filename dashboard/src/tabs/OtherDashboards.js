import React from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid';

const OtherDashboards = () => {
  const data = [
    {
      heading: '',
      anchor: 'arcgis.com',
      quote: '',
      url:
        'https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6',
    },
    {
      heading: '',
      anchor: 'health.appliedxl',
      quote: '',
      url: 'https://health.appliedxl.com/#bar/all',
    },
    {
      heading: '',
      anchor: 'cov19.cc',
      quote: '',
      url: 'https://cov19.cc/',
    },

    {
      heading: '',
      anchor: 'coronavirus-disasterresponse.hub.arcgis.com',
      quote: '',
      url: 'https://coronavirus-disasterresponse.hub.arcgis.com/',
    },
  ];
  return (
    <>
      <StyledSection>
        <h2 id="heading-purpose">Other Dashboards</h2>
        {data.map(({ anchor, heading, quote, url }) => (
          <div key={uuidv4()}>
            <p>
              {heading && heading}
              <a href={url} target="_blank" rel="noopener noreferrer">
                {anchor}
              </a>{' '}
              {quote}
            </p>
          </div>
        ))}
      </StyledSection>
    </>
  );
};

const StyledSection = styled.section`
  max-width: 75ch;
  padding: 1.5rem;

  > div {
    margin-bottom: 1.5rem;
  }

  blockquote {
    font-style: italic;
    color: dark-gray;
    margin-left: 0;
    margin-right: 0;
  }
`;

export default OtherDashboards;
