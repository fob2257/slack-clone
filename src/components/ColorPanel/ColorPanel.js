import React, { useState, useEffect } from 'react';
import {
  Sidebar,
  Menu,
  Divider,
  Button,
  Modal,
  Icon,
  Label,
  Segment
} from 'semantic-ui-react';
import { SliderPicker } from 'react-color';
import { connect } from 'react-redux';

import { fireDatabase } from '../../firebase/firebase.util';

import { setUserColors } from '../../redux/actions/userActions';

const ColorPanel = ({ currentUser, selectedColors, setSelectedColors }) => {
  const colorsInitialState = { primary: '', secondary: '' };
  const [modal, setModal] = useState(false);
  const [colors, setColors] = useState(colorsInitialState);
  const [userColors, setUserColors] = useState([]);

  const userColorsRef = fireDatabase
    .ref('users')
    .child(`${currentUser.uid}/colors`);

  useEffect(() => {
    let values = [];
    userColorsRef.on('child_added', snapshot => {
      values = [snapshot.val(), ...values];

      setUserColors(values);
    });

    return () => {
      userColorsRef.off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSaveColors = async () => {
    if (!colors.primary || !colors.secondary) return;

    try {
      const colorRef = await userColorsRef.push();
      await colorRef.update({ ...colors, id: colorRef.key });

      setModal(false);
      setColors(colorsInitialState);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Sidebar
      as={Menu}
      icon="labeled"
      width="very thin"
      inverted
      vertical
      visible
    >
      <Divider />
      <Button
        icon="add"
        size="small"
        color="blue"
        onClick={() => setModal(true)}
      />

      {userColors.map((colors, i) => (
        <React.Fragment key={i}>
          <Divider />
          <div
            className="color__container"
            onClick={() => setSelectedColors(colors)}
          >
            <div
              className="color__square"
              style={{ background: colors.primary }}
            >
              <div
                className="color__overlay"
                style={{ background: colors.secondary }}
              ></div>
            </div>
          </div>
        </React.Fragment>
      ))}

      <Modal basic open={modal} onClose={() => setModal(false)}>
        <Modal.Header>Choose App Colors</Modal.Header>
        <Modal.Content>
          <Segment inverted>
            <Label content="Primary Color" />
            <SliderPicker
              color={colors.primary || '#4c3c4c'}
              onChange={color => setColors({ ...colors, primary: color.hex })}
            />
          </Segment>
          <Segment inverted>
            <Label content="Secondary Color" />
            <SliderPicker
              color={colors.secondary || '#eee'}
              onChange={color => setColors({ ...colors, secondary: color.hex })}
            />
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={handleSaveColors}>
            <Icon name="checkmark" /> Save Colors
          </Button>
          <Button color="red" inverted onClick={() => setModal(false)}>
            <Icon name="remove" /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    </Sidebar>
  );
};

const mapStateToProps = ({
  user: { currentUser, colors: selectedColors }
}) => ({
  currentUser,
  selectedColors
});

const mapDispatchToProps = dispatch => ({
  setSelectedColors: colors => dispatch(setUserColors(colors))
});

export default connect(mapStateToProps, mapDispatchToProps)(ColorPanel);
