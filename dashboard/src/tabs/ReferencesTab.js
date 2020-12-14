import React from 'react';
import styled from 'styled-components';
import uuidv4 from 'uuid';

const ReferencesTab = () => {
  const data = [
    {
      anchor: 'COVID-19 Impact Project',
      heading: 'Documentation: ',
      quote: '',
      url: 'https://epvisual.com/COVID-19-Impact/Project/',
    },
    {
      anchor:
        '2019 Novel Coronavirus COVID-19 (2019-nCoV) Data Repository by Johns Hopkins CSSE',
      heading: 'Data source: ',
      quote:
        '"...data repository for the 2019 Novel Coronavirus Visual Dashboard operated by the Johns Hopkins University Center for Systems Science and Engineering (JHU CSSE)..."',
      url: 'https://github.com/CSSEGISandData/COVID-19',
    },
    {
      anchor: 'NYC Coronavirus Disease 2019 (COVID-19) Data',
      heading: 'New York City Data source: ',
      quote: '',
      url:
        'https://github.com/nychealth/coronavirus-data/blob/master/totals/data-by-modzcta.csv',
    },

    {
      anchor: 'NYC Comptroller Report on Frontline Workers',
      heading: '',
      quote:
        '"...workers whom we trust with our health, our nourishment, our loved ones, and our lives are too often ignored, underpaid, and overworked..."',
      url:
        'https://comptroller.nyc.gov/reports/new-york-citys-frontline-workers/',
    },
    {
      anchor: 'Remembering the New Yorkers We’ve Lost to‌ COVID‑19',
      heading: '',
      quote:
        '"...This is a space to remember and honor every person who died..."',
      url: 'https://projects.thecity.nyc/covid-19-deaths/',
    },
  ];
  return (
    <StyledSection>
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

export default ReferencesTab;
