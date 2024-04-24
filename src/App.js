import './App.css';

import Cover from './containers/Cover.js'
import Explorer from './containers/Explorer.js';
import Indicators from './containers/Indicators.js';
import ScrollyTelling from './containers/Scrollytelling.js';
import GenderGap from './containers/GenderGap.js';

function App() {
  return (
    <div className="App">
      <Cover/>
      <Indicators/>
      <Explorer/>
      <ScrollyTelling/>
      <GenderGap/>
    </div>
  );
}

export default App;
