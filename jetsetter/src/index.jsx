import React from 'react';
import { render } from 'react-dom';

import './style.css';
import { Application } from './components/Application';
import { database } from './database';

render(
  <Application database={database} />,
  document.getElementById('application')
);
