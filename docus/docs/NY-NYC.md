---
id: NYC
title: New York City
sidebar_label: NYC
---

COVID-19 stats for New York City from the New York Times publication.

Source:

- https://www.nytimes.com/interactive/2020/nyregion/new-york-city-coronavirus-cases.html

** New York City Case and Death Count **

| Date  | Total Cases | Total Deaths |
| ----- | ----------- | ------------ |
| 12/07 | 335,768     | 24,365       |
| 11/30 | 314,223     | 24,268       |
| 11/19 | 293,592     | 24,167       |
| 11/04 | 271,112     | 24,034       |
| 09/17 | 243,644     | 23,767       |
| 09/08 | 240,919     | 23,736       |
| 08/24 | 236,822     | 23,658       |
| 08/13 | 233,422     | 23,602       |
| 08/12 | 233,416     | 23,592       |
| 08/11 | 232,756     | 23,586       |
| 08/06 | 231,268     | 23,034       |
| 07/28 | 228,939     | 22,977       |
| 07/27 | 228,445     | 22,956       |
| 07/24 | 227,517     | 22,934       |
| 07/23 | 227,130     | 22,899       |
| 07/16 | 224,662     | 22,825       |
| 07/15 | 224,293     | 22,808       |
| 07/14 | 223,382     | 22,750       |
| 07/10 | 222,723     | 22,719       |

## Issues

### 2020-12-07 nyc stats reconciliation

NYC Heath data from

- https://www1.nyc.gov/site/doh/covid/covid-19-data.page
- https://github.com/nychealth/coronavirus-data
- https://github.com/nychealth/coronavirus-data/blob/master/totals/data-by-modzcta.csv

Deaths in New York City reconciliation issues

| 12/07 | 335,768 | 24,365 |

-- From JHU data:
23,171 -- diff 1194 vs. 24,365

| Borough       | Deaths |
| ------------- | ------ |
| Brooklyn      | 7,529  |
| Queens        | 7,375  |
| Bronx         | 5,032  |
| Manhattan     | 3,235  |
| Staten Island | 1,157  |

-- From NYC heath data:
19,288 -- diff 3883 vs. 23,171

| Borough   | Deaths |
| --------- | ------ |
| Brooklyn  | 5,748  |
| Queens    | 6,024  |
| Bronx     | 4,036  |
| Manhattan | 2,520  |
| Staten Is | 960    |

-- Dashboard matches NY Times
11234 Bergen Beach/Flatlands/Marine Park/Mill Basin 187

Cases

| 12/07 | 335,768 | 24,365 |

-- JHU Total
331,006 -- diff 4762 vs. 335,768

| Borough       | Cases  |
| ------------- | ------ |
| Queens        | 95,446 |
| Brooklyn      | 94,312 |
| Bronx         | 67,257 |
| Manhattan     | 48,521 |
| Staten Island | 25,470 |

-- From NYC heath data:
294,585 -- diff 36,421 vs. 331,006

| Borough   | Cases  |
| --------- | ------ |
| Brooklyn  | 86,187 |
| Queens    | 83,706 |
| Bronx     | 61,987 |
| Manhattan | 39,925 |
| Staten Is | 22,780 |

Source:

- https://github.com/nychealth/coronavirus-data/blob/master/totals/summary.csv

| MEASURE                             | NUMBER_OF_NYC_RESIDENTS |
| ----------------------------------- | ----------------------- |
| NYC_CASE_COUNT                      | 309566                  |
| NYC_PROBABLE_CASE_COUNT             | 29810                   |
| NYC_TOTAL_CASE_COUNT                | 339376                  |
| NYC_HOSPITALIZED_COUNT              | 62651                   |
| NYC_CONFIRMED_DEATH_COUNT           | 19673                   |
| NYC_PROBABLE_DEATH_COUNT            | 4714                    |
| NYC_TOTAL_DEATH_COUNT               | 24387                   |
| DATE_UPDATED December 7, at 10 a.m. |                         |
