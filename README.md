# COVID-19 Impact Project

Visualization of COVID-19 statistics from

- "JHU CSSE COVID-19 Data"
- "COVID-19 Data Repository by the Center for Systems Science and Engineering (CSSE) at Johns Hopkins University"
- https://github.com/CSSEGISandData/COVID-19

## Links

- site:
  https://epvisual.com/COVID-19-Impact/Dashboard/

- project documentation:
  https://epvisual.com/COVID-19-Impact/Project/

- demo video:
  https://www.youtube.com/watch?v=pRV5CIoGmLE

## Setup

- [setup.md](./setup.md) : Setup instructions to run locally client and express server

## Folders

- ./dashboard : Browser app to view graphs of daily data

- ./dashboard/public/c_data/ : csv data from COVID-19-JHU converted to json

  - ... /c_data/c_meta.json -- per country info and populations
  - ... /c_data/c_days/2020-01-22.json -- daily summary stats by country
  - ...
  - ... /c_data/c_days/2020-11-11.json

- ./docus : Docusaurus based documentation

- ./parse : nodejs code to convert CSV to JSON

- ./COVID-19-JHU : data source git repo https://github.com/CSSEGISandData/COVID-19

## Other visualization sites:

- [arcgis.com](https://www.arcgis.com/apps/opsdashboard/index.html#/bda7594740fd40299423467b48e9ecf6)
- [appliedxl.com](https://health.appliedxl.com/#bar/all)
- [ncov2019](https://ncov2019.live/data)
- [cov19.cc](https://cov19.cc)

## Acknowledgements

- Shindy Melanie Johnson - concept inspiration
- Phil Sinatra - react UI and build framework setup
- EP Visual Design
