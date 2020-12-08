import React from 'react';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';
import { connect } from 'react-redux';

import { signOut } from '../../firebase/firebase.util';

const UserPanel = ({ primaryColor, currentUser }) => (
  <Grid style={{ background: primaryColor }}>
    <Grid.Column>
      <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
        <Header as="h2" floated="left" inverted>
          <Icon name="code" />
          <Header.Content>DevChat</Header.Content>
        </Header>

        {/* Dropdown */}
        <Header as="h4" inverted style={{ padding: '0.25em' }}>
          <Dropdown
            trigger={
              <span>
                <Image src={currentUser.photoUrl} spaced="right" avatar />
                {currentUser.displayName}
              </span>
            }
            options={[
              {
                text: (
                  <span>
                    Signed in as <strong>{currentUser.displayName}</strong>
                  </span>
                ),
                disabled: true
              },
              {
                text: <span>Change Avatar</span>
              },
              {
                text: <span>Sign Out</span>,
                onClick: async () => await signOut()
              }
            ].map((obj, i) => ({ ...obj, key: i }))}
          />
        </Header>
      </Grid.Row>
    </Grid.Column>
  </Grid>
);

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(UserPanel);
