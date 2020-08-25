import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

function Feature({ imageUrl, title, description, href }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <a href={href}>
            <img className={styles.featureImage} src={imgUrl} alt={title} />
          </a>
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  const main_href = useBaseUrl('docs/');
  const docs_ref = 'docs/';

  const features = [
    {
      // title: <>to mourn and memorialize</>,
      imageUrl: 'img/prayer-1f64f-1f3fe.png',
      href: docs_ref,
      description: (
        <>
          How can we mourn and memorialize the thousands dying everyday from the
          COVID-19 pandemic?
        </>
      ),
    },
    {
      // title: <>to assess the impact</>,
      imageUrl: 'img/ruler-1f4cf.png',
      href: docs_ref,
      description: (
        <>
          How can we assess the impact on the families and communities of the
          deceased?
        </>
      ),
    },
    {
      // title: <>to build enduring institutions</>,
      imageUrl: 'img/building-blue-1f3db.png',
      href: docs_ref,
      description: (
        <>
          How can we work to build enduring institutions to mitigate the
          suffering of these families and address systemic inequalities?
        </>
      ),
    },
  ];

  return (
    <Layout
      title={siteConfig.title}
      // title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted
              )}
              to={main_href}
            >
              Why? How?
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
