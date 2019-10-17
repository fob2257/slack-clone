import React from 'react';
import { Progress } from 'semantic-ui-react';

import './ProgressBar.style.css';

const ProgressBar = ({ percentage }) => (
  <Progress
    className='progress__bar'
    percent={percentage}
    size='medium'
    progress
    indicating
    inverted
  />
);

export default ProgressBar;
