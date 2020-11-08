import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Loader,
  Menu,
  Select,
} from 'semantic-ui-react';
import styled from 'styled-components';
import CountryDataTable from '../components/CountryDataTable';
import DateSlider from '../components/DateSlider';
import World from '../graph/World';
import extract_slices from '../graph/extract_slices';
import AboutTab from '../graph_tabs/AboutTab';
import FocusTab from '../graph_tabs/FocusTab';
import ReferencesTab from '../graph_tabs/ReferencesTab';
import SoftBodyTab from '../graph_tabs/SoftBodyTab';
import useInterval from '../hooks/useInterval';
import useLocalStorage from '../hooks/useLocalStorage';
import fetchData from '../js/fetchData';

const nslice = 8;
const top_label = 'World';
const playDelayInit = 0.1;
const playEndDelayInit = 3;

ReactGA.initialize('UA-168322336-1');
ReactGA.pageview(window.location.pathname + window.location.search);

function ui_key(uname) {
  return { key: uname, value: uname, text: uname };
}

const Graph = () => {
  const [loaderActive, setLoaderActive] = useState(true);
  const [propFocus, setPropFocus] = useLocalStorage('key-propFocus', 'Deaths');
  const [sumFocus, setSumFocus] = useLocalStorage('key-sumFocus', 'totals');
  // const [dateFocus, setDateFocus] = useLocalStorage('key-dateFocus', '');
  const [dateFocus, setDateFocus] = useState();
  // const [countryFocus, setCountryFocus] = useLocalStorage(
  //   'key-countryFocus',
  //   top_label
  // );
  const [
    focusCountries,
    setFocusCountries,
  ] = useLocalStorage('key-focusCountries', [
    'China',
    'United States',
    'Jamaica',
  ]);
  const [focusIndex, setFocusIndex] = useState(-1);
  const [countryFocus, setCountryFocus] = useState(top_label);
  const [dateList, setDateList] = useState();
  const [countryList, setCountryList] = useState();
  const [playingState, setPlayingState] = useState(false);
  const [playIndex, setPlayIndex] = useState(-1);
  const [playDelay, setPlayDelay] = useState(playDelayInit);
  const [pieData, setPieData] = useState();
  const [dateStats, setDateStats] = useState({
    items: [],
  });
  const [metaDict, setMetaDict] = useState();
  const [bottomTab, setBottomTab] = useLocalStorage('key-source', 'places');
  const [dateIndex, setDateIndex] = useLocalStorage('key-dataIndex', 0);
  const [sortedItems, setSortedItems] = useState([]);
  const [countrySelected, setCountrySelected] = useState();

  // dateStats = { date, items }
  // items [{
  //   totals: {
  //    "Cases": 1486757,
  //    "Deaths": 89562,
  //    "Recovered": 272265},
  //   daily: {
  //    "Cases": 1486757,
  //    "Deaths": 89562,
  //   },
  //   "Country_Region": "US"
  // },]

  const dataPrefix = (countrySelected) => {
    let prefix = '';
    if (countrySelected && countrySelected.Country_Region) {
      prefix = countrySelected.Country_Region;
      prefix = prefix.replace(/ /g, '_').replace(/,/g, '');
    }
    prefix = prefix ? 'c_states/' + prefix + '/' : '';
    return prefix;
  };

  useEffect(() => {
    // console.log('useEffect dates.json');
    const prefix = dataPrefix(countrySelected);
    fetchData('./c_data/' + prefix + 'c_meta.json', (meta) => {
      const process_dates = (dates) => {
        if (!dates) dates = [];
        const list = dates.map((uname) => ui_key(uname));
        setDateList(list);
      };

      // Odd: react complains of missing dependency if process_regions is defined
      // outside fo here.
      const process_regions = (regions) => {
        if (!regions) regions = [];
        if (countrySelected) {
          regions.forEach((item) => {
            item.Country_Region = item.Province_State;
          });
        }
        const dict = {};
        const list = regions.map((item) => {
          const uname = item.Country_Region;
          dict[uname] = item;
          return ui_key(uname);
        });
        const forui = ui_key(top_label);
        const nlist = [forui].concat(list);
        setCountryList(nlist);
        setMetaDict(dict);
      };

      if (!meta) meta = {};
      process_dates(meta.dates);
      process_regions(meta.regions);
    });
  }, [countrySelected]);

  useEffect(() => {
    // console.log(
    //   'useEffect dateFocus',
    //   dateFocus,
    //   'dateStats',
    //   dateStats
    // );
    if (!dateStats.isLoading && metaDict) {
      if (
        dateFocus &&
        !(
          dateStats.date === dateFocus &&
          dateStats.countrySelected === countrySelected
        )
      ) {
        // setDateStats({ date: dateFocus, items: [] });
        dateStats.isLoading = true;
        const prefix = dataPrefix(countrySelected);
        fetchData(
          './c_data/' + prefix + 'c_days/' + dateFocus + '.json',
          (items) => {
            if (!items) items = [];
            items.forEach((item) => {
              if (countrySelected) item.Country_Region = item.Province_State;
              const ent = metaDict[item.Country_Region];
              if (ent) item.n_states = ent.n_states;
            });
            setDateStats({ date: dateFocus, items, countrySelected });
          }
        );
      }
    }
  }, [dateFocus, dateStats, countrySelected, metaDict]);

  useEffect(() => {
    // console.log('useEffect dateStats.items', dateStats.items);
    // console.log('useEffect sumFocus', sumFocus);
    // console.log('useEffect propFocus', propFocus);
    const sortFunc = (item1, item2) => {
      const rank = item2[sumFocus][propFocus] - item1[sumFocus][propFocus];
      if (rank === 0)
        return item1.Country_Region.localeCompare(item2.Country_Region);
      return rank;
    };
    const items = dateStats.items
      .concat()
      .sort((item1, item2) => sortFunc(item1, item2));
    let slideIndex = items.findIndex(
      (item) => item.Country_Region === countryFocus
    );
    if (slideIndex < 0) slideIndex = 0;
    //   { slices, stats_total, yprop };
    const percents = 1;
    const spec = { sumFocus, propFocus };
    // console.log('spec', spec);
    const pie0 = extract_slices(items, spec, nslice, percents, slideIndex);
    const pie1 = extract_slices(items, spec, nslice, 0, slideIndex);
    setPieData([pie0, pie1]);
    const total = pie0.ostats_total;
    items.forEach((item) => {
      let yvalue = item[sumFocus][propFocus];
      item.propValue = yvalue;
      if (yvalue < 0) {
        // !!@ 2020-08-17 United Kingdom -5,337
        yvalue = 0;
      }
      item.propPercent = total ? yvalue / total : 0;
    });
    setSortedItems(items);
  }, [dateStats.items, propFocus, countryFocus, sumFocus]);

  useInterval(
    () => {
      // console.log('useInterval playIndex', playIndex, 'isLoading', isLoading);
      if (!dateList || dateStats.isLoading) return;
      if (playIndex < 0) {
        return;
      }
      let ndelay = playDelayInit;
      if (!ndelay) return;
      let nplayIndex = playIndex + 1;
      if (nplayIndex >= dateList.length) {
        nplayIndex = 0;
      } else if (nplayIndex === dateList.length - 1) {
        ndelay = playEndDelayInit;
      }
      setPlayDelay(ndelay);
      setPlayIndex(nplayIndex);
      setDateFocus(dateList[nplayIndex].value);
      setDateIndex(nplayIndex);
    },
    playingState ? playDelay * 1000 : null
  );

  // console.log('Graph countryFocus', countryFocus);

  if (!pieData) {
    return <Loader active={loaderActive} inline></Loader>;
  }

  const setDateIndexFocus = (value) => {
    const index = dateList.findIndex((item) => item.value === value);
    setDateIndex(index);
    setDateFocus(value);
  };

  if (!dateFocus && dateList && dateList.length) {
    setDateIndexFocus(dateList[dateList.length - 1].value);
  }

  if (sortedItems.length > 0 && loaderActive) {
    setLoaderActive(false);
  }

  const playAction = () => {
    if (!playingState) {
      const nindex = dateList.findIndex((item) => item.value === dateFocus);
      setPlayIndex(nindex);
      setPlayDelay(playDelayInit);
      setPlayingState(true);
    } else {
      setPlayingState(false);
    }
  };

  const pauseAction = () => {
    setPlayingState(false);
  };

  const previousAction = () => {
    stepAction(-1);
  };

  const nextAction = () => {
    stepAction(1);
  };

  const stepAction = (delta) => {
    if (!dateList) return;
    let index = dateList.findIndex((item) => item.value === dateFocus);
    index += delta;
    if (index >= dateList.length) {
      index = 0;
    } else if (index < 0) {
      index = dateList.length - 1;
    }
    setDateIndexFocus(dateList[index].value);
    pauseAction();
  };

  const showStatsJSON = () => {
    const dat = pieData[0];
    dat.date = dateFocus;
    const str = JSON.stringify(dat, null, 2);
    console.log('pieData 0');
    console.log(str);
  };

  const findFirstDate = () => {
    console.log('findFirstDate countryFocus', countryFocus);
    if (countryFocus !== top_label && metaDict) {
      const ent = metaDict[countryFocus];
      if (ent) {
        const ndate = ent.first_date[propFocus];
        if (ndate) {
          setDateIndexFocus(ndate);
        }
      }
    } else if (dateList && dateList.length) {
      const ndate = dateList[0].value;
      setDateIndexFocus(ndate);
    }
  };

  const findLastestDate = () => {
    if (dateList && dateList.length) {
      const ndate = dateList[dateList.length - 1].value;
      setDateIndexFocus(ndate);
    }
  };

  const DateFocusSelect = () => {
    // console.log('DateFocusSelect', dateFocus);
    return (
      <Select
        search
        value={dateFocus}
        onChange={(param, data) => {
          setDateIndexFocus(data.value);
        }}
        options={dateList || []}
      />
    );
  };

  const CountrySelect = () => {
    return (
      <Select
        placeholder="Select Country"
        search
        selection
        value={countryFocus}
        onChange={(param, data) => {
          setCountryFocus(data.value);
          let nindex = focusCountries.indexOf(data.value);
          if (nindex >= 0) {
            setFocusIndex(nindex);
          } else {
            let nindex = focusIndex;
            if (nindex < 0) {
              nindex = 0;
              setFocusIndex(nindex);
            }
            const nfocusCountries = focusCountries.concat();
            nfocusCountries[nindex] = data.value;
            setFocusCountries(nfocusCountries);
            // setFocusCountries([data.value, focusCountries[0], focusCountries[1]]);
          }
        }}
        options={countryList || []}
      />
    );
  };

  const showWorldAction = () => {
    setFocusIndex(-1);
    setCountryFocus(top_label);
  };

  const showCountryAction = (index) => {
    setFocusIndex(index);
    setCountryFocus(focusCountries[index]);
  };

  // On desktop: play/pause button flashes when playingState active
  // Not sure why - avoid for now
  // const ButtonPlayPause = () => {
  //   if (!playingState) {
  //   return (
  //     <Button size="mini" onClick={playAction}>
  //       <Icon name="play" />
  //     </Button>
  //   );
  //   }
  //   return (
  //     <Button size="mini" onClick={pauseAction}>
  //       <Icon name="pause" />
  //     </Button>
  //   );
  // };

  const handleBottomTab = (event, { name }) => {
    console.log('handleBottomTab name', name);
    setBottomTab(name);
  };

  const selectCasesAction = () => {
    setPropFocus('Cases');
  };
  const selectDeathsAction = () => {
    setPropFocus('Deaths');
  };

  const selectTotals = () => {
    setSumFocus('totals');
  };
  const selectDaily = () => {
    setSumFocus('daily');
  };

  const cactive = propFocus === 'Cases';
  const dactive = propFocus === 'Deaths';
  // const uiprop_s = cactive ? 'Cases' : propFocus;
  const uiprop_s = propFocus;
  const uiprop = uiprop_s.substring(0, uiprop_s.length - 1);
  const focus_actions = {
    CountrySelect,
    showWorldAction,
    findFirstDate,
    findLastestDate,
    showStatsJSON,
    uiprop,
    focusCountries,
    showCountryAction,
    focusIndex,
  };
  const to_active = sumFocus === 'totals';
  const da_active = sumFocus === 'daily';
  const uisum = sumFocus === 'totals' ? 'Total' : 'Daily';
  const upto_on = sumFocus === 'totals' ? 'Total to' : 'On';

  const updateSlider = (key) => {
    // console.log('updateSlider key', key);
    setDateFocus(dateList[key].value);
  };

  const graphOpacity = bottomTab === 'softbody' ? 0.6 : 1.0;

  const dateFocusShort = dateFocus && dateFocus.substring(5);

  const selectCountry = (country) => {
    console.log('selectCountry country', country);
    setDateFocus();
    setDateList();
    setMetaDict();
    setCountrySelected(country);
  };

  const ui_top = countrySelected ? countrySelected.Country_Region : 'WorldWide';

  const selectWorldwide = () => {
    setCountrySelected();
  };

  return (
    <>
      <Container style={{ marginTop: '1rem' }}>
        {/* <Dimmer active={loaderActive} inverted>
          <Loader>Loading</Loader>
        </Dimmer> */}
        <Loader active={loaderActive} inline></Loader>
        {/* <Header as="h3">{countrySelected}</Header> */}
        {/* <Header as="h3">
          Worldwide {uisum} {uiprop_s}: {pieData[0].stats_total} on{' '}
          {dateFocusShort}
        </Header> */}
        <Header as="h3">
          {ui_top} {pieData[0].stats_total} {uiprop_s} {upto_on}{' '}
          {dateFocusShort}
        </Header>
        {/* {bottomTab !== 'softbody' && <World pie_data={pieData}></World>} */}
        <World pie_data={pieData} opacity={graphOpacity} />
        <Header as="h3">
          {countrySelected && (
            // <Button.Group>
            //   <Button size="mini" onClick={selectWorldwide}>
            //     &larr; Worldwide
            //   </Button>
            // </Button.Group>
            <button onClick={selectWorldwide}>&larr; Worldwide</button>
          )}
          &nbsp;
          {ui_top} {pieData[0].stats_total} {uiprop_s} {upto_on}{' '}
          {dateFocusShort}
        </Header>
        <Grid>
          <Grid.Row
            style={{
              padding: '0 16px',
            }}
          >
            <DateSlider
              dateIndex={dateIndex}
              dateListLength={(dateList || []).length}
              updateSlider={updateSlider}
            />
          </Grid.Row>
          <Grid.Row>
            <StyledControlRow>
              <Button.Group>
                <Button
                  size="mini"
                  onClick={selectCasesAction}
                  active={cactive}
                >
                  Cases
                </Button>
                <Button
                  size="mini"
                  onClick={selectDeathsAction}
                  active={dactive}
                >
                  Deaths
                </Button>
              </Button.Group>
              <Button.Group>
                <Button size="mini" onClick={selectTotals} active={to_active}>
                  Total:
                </Button>
                <Button size="mini" onClick={selectDaily} active={da_active}>
                  On date:
                </Button>
              </Button.Group>
              <div>
                <DateFocusSelect />
              </div>
              <Button.Group>
                <span>
                  <Button size="mini" onClick={previousAction}>
                    <Icon name="step backward" />
                  </Button>
                  {/* <ButtonPlayPause /> */}
                  <Button size="mini" onClick={playAction}>
                    <Icon name="play" />
                  </Button>
                  <Button size="mini" onClick={nextAction}>
                    <Icon name="step forward" />
                  </Button>
                </span>
              </Button.Group>
            </StyledControlRow>
          </Grid.Row>
        </Grid>
      </Container>
      <StyledDetailsContainer>
        <Menu tabular>
          <Menu.Item
            name="places"
            active={bottomTab === 'places'}
            content="Regions"
            onClick={handleBottomTab}
          />
          <Menu.Item
            name="purpose"
            active={bottomTab === 'purpose'}
            onClick={handleBottomTab}
          />
          <Menu.Item
            name="focus"
            active={bottomTab === 'focus'}
            onClick={handleBottomTab}
          />
          <Menu.Item
            name="softbody"
            content="p5js"
            active={bottomTab === 'softbody'}
            onClick={handleBottomTab}
          />
          <Menu.Item
            name="references"
            active={bottomTab === 'references'}
            onClick={handleBottomTab}
          />
        </Menu>
        {bottomTab === 'places' && (
          <CountryDataTable
            items={sortedItems}
            propTitle={uisum + ' ' + uiprop_s}
            pie_data={pieData}
            selectCountry={selectCountry}
          />
        )}
        {bottomTab === 'purpose' && <AboutTab />}
        {bottomTab === 'focus' && <FocusTab actions={focus_actions} />}
        {bottomTab === 'softbody' && <SoftBodyTab pie_data={pieData[0]} />}
        {bottomTab === 'references' && <ReferencesTab />}
      </StyledDetailsContainer>
    </>
  );
};

const StyledDetailsContainer = styled.div`
  margin: 3rem auto 1.5rem;
  max-width: 1172px;
`;

const StyledControlRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 1rem;
  width: 100%;

  @media screen and (min-width: 64em) {
    justify-content: flex-end;

    .buttons,
    > div {
      margin-left: 1.5rem;
    }
  }

  .ui {
    margin-top: 8px;
  }
`;

export default Graph;
