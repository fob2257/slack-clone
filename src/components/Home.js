import React from 'react';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import ColorPanel from './ColorPanel/ColorPanel';
import SidePanel from './SidePanel/SidePanel';
import Messages from './Messages/Messages';
import MetaPanel from './MetaPanel/MetaPanel';

const Home = ({ selectedColors }) => {
  const primaryColor = selectedColors.primary || '#4c3c4c';
  const secondaryColor = selectedColors.secondary || '#eee';

  return (
    <Grid
      columns="equal"
      className="app"
      style={{ background: secondaryColor }}
    >
      <ColorPanel />
      <SidePanel primaryColor={primaryColor} />

      <Grid.Column
        style={{
          marginLeft: 320,
          height: '100vh',
          marginTop: '1em',
          paddingLeft: '2em'
        }}
      >
        <Messages />
      </Grid.Column>

      <Grid.Column width={4} style={{ marginTop: '1em', marginRight: '1em' }}>
        <MetaPanel />
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user: { colors: selectedColors } }) => ({
  selectedColors
});

export default connect(mapStateToProps)(Home);
