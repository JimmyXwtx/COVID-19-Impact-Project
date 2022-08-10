import React from 'react';
import styled from 'styled-components';
import OtherDashboards from '../tabs/OtherDashboards';
import ReferencesTab from '../tabs/ReferencesTab';

function PurposeDiv() {
  return (
    <StyledDiv>
      <section aria-labelledby="heading-purpose">
        <h2 id="heading-purpose">Purpose</h2>
        <p>
          More than numbers, I hope this site will help contribute to answering
          these questions: <br />
          How to mourn and memorialize the thousands dying everyday from the
          COVID-19 pandemic?
          <br />
          How to assess the impact on the families and the communities of the
          deceased? <br />
          How to build enduring institutions to mitigate their suffering and
          address systemic inequalities?
        </p>
      </section>
      <section aria-labelledby="section-development">
        <h3 id="section-development">Development and Coding</h3>
        <ul>
          <li>
            <a
              href="http://johnhenrythompson.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              John Henry Thompson
            </a>
          </li>
        </ul>
        <h3>Inspiration</h3>
        <ul>
          <li>
            <a
              href="https://cooking-with-a-twist.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Shindy Johnson
            </a>
          </li>
        </ul>
        <h3>Special Thanks</h3>
        <ul>
          <li>
            <a
              href="http://philsinatra.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Phil Sinatra
            </a>
          </li>
          <li>
            <a
              href="http://epvisual.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              EP Visual Design
            </a>
          </li>
        </ul>
        <h3>Dedication</h3>
        <ul>
          <li>
            <a
              href="https://comptroller.nyc.gov/reports/new-york-citys-frontline-workers/"
              target="_blank"
              rel="noopener noreferrer"
            >
              For the Essential Workers
            </a>
          </li>
        </ul>
        <h3>Documentation</h3>
        <ul>
          <li>
            <a
              href="https://jht1493.net/COVID-19-Impact/Project/"
              target="_blank"
              rel="noopener noreferrer"
            >
              COVID-19 Impact Project
            </a>
          </li>
        </ul>
        <h3>Feedback</h3>
        <ul>
          <li>
            <a
              href="https://jhtid.typeform.com/to/RxahXQJX/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Give us feedback.
            </a>
          </li>
        </ul>
      </section>
    </StyledDiv>
  );
}
const AboutTab = () => {
  return (
    <>
      <ReferencesTab />
      <PurposeDiv />
      <OtherDashboards />
    </>
  );
};

const StyledDiv = styled.div`
  margin: 1rem 0 0;
  padding: 0 1.5rem;

  section {
    margin-bottom: 3rem;
  }
`;

export default AboutTab;
