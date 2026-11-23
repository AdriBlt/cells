import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.css';
import { App } from './site/App';

document.oncontextmenu = e => false;
ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
);
