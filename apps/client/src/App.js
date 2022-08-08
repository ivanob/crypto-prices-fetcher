import './App.css';
import {gql, useLazyQuery} from "@apollo/client"
import {Stats} from "./components/Stats"
import { RadioButton } from './components/RadioButton';
import { useState } from 'react';

const PeriodIntervalOptions = {
  ALL_TIME: "All time",
  LAST_WEEK: "Last week",
  TODAY: "Today"
};

const Options = {
  "Today": "TODAY",
  "Last week": "ONE_WEEK_AGO",
  "All time": "ALL_TIMES"
};

const allStatsQuery = gql`
query findStatsByPeriodicity($periodicity: TimePeriodEnum!){
  stats(temp: $periodicity){
    crypto,
    highestPrice,
    lowestPrice,
    numberOfReadings
  }
}
`

function App() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [PeriodOption, setPeriodOption] = useState("PERIOD");
  const [getStats, result] = useLazyQuery(allStatsQuery);
  
  const radioChangeHandler = (e) => {
    setPeriodOption(e.target.value);
    getStats({variables: {periodicity: Options[e.target.value]}})
  };
console.log(result)
  // eslint-disable-next-line react/style-prop-object
  if(result.error) return <span style='color: red'>{result.error}</span>

  return (
    <div className="App">
      <header className="App-header">
       {result.loading 
        ? <p>Loading ...</p>
        : (
          <div>
            <div className="radio-btn-container" style={{ display: "flex" }}>
              <RadioButton
                changed={radioChangeHandler}
                id="1"
                isSelected={PeriodOption === PeriodIntervalOptions.ALL_TIME}
                label={PeriodIntervalOptions.ALL_TIME}
                value={PeriodIntervalOptions.ALL_TIME}
              />
              <RadioButton
                changed={radioChangeHandler}
                id="2"
                isSelected={PeriodOption === PeriodIntervalOptions.LAST_WEEK}
                label={PeriodIntervalOptions.LAST_WEEK}
                value={PeriodIntervalOptions.LAST_WEEK}
              />
               <RadioButton
                changed={radioChangeHandler}
                id="3"
                isSelected={PeriodOption === PeriodIntervalOptions.TODAY}
                label={PeriodIntervalOptions.TODAY}
                value={PeriodIntervalOptions.TODAY}
              />
            </div>
            <Stats stats={result.data?.stats}/>
          </div>
        )
      }
      </header>
    </div>
  );
}

export default App;
