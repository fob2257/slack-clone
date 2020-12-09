import React, { useState, useRef } from 'react';
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor';
import { uuid } from 'uuidv4';

import {
  signOut,
  fireStorage,
  fireDatabase,
  fireAuth
} from '../../firebase/firebase.util';

const UserPanel = ({ primaryColor, currentUser }) => {
  const [modal, setModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [contentType, setContentType] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [blob, setBlob] = useState(null);
  const editorRef = useRef(null);

  const storageRef = fireStorage.ref('avatars').child(currentUser.uid);
  const currentUserRef = fireDatabase.ref('users').child(currentUser.uid);

  const handleAvatarChange = ({
    target: {
      files: [file]
    }
  }) => {
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.addEventListener('load', () => {
      setContentType(file.type);
      setPreviewImage(reader.result);
    });
  };

  const handleCropImage = () => {
    if (!editorRef.current) return;

    editorRef.current.getImageScaledToCanvas().toBlob(blob => {
      const imageURL = URL.createObjectURL(blob);

      setCroppedImage(imageURL);
      setBlob(blob);
    });
  };

  const handleSubmitImage = () => {
    storageRef
      .child(uuid())
      .put(blob, { contentType })
      .then(async snapshot => {
        const url = await snapshot.ref.getDownloadURL();

        await changeAvatar(url);
      });
  };

  const changeAvatar = async url => {
    try {
      await Promise.all([
        fireAuth.currentUser.updateProfile({ photoUrl: url }),
        currentUserRef.update({ photoUrl: url })
      ]);

      setPreviewImage(null);
      setCroppedImage(null);
      setBlob(null);

      setModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
                  text: <span>Change Avatar</span>,
                  onClick: () => setModal(true)
                },
                {
                  text: <span>Sign Out</span>,
                  onClick: async () => await signOut()
                }
              ].map((obj, i) => ({ ...obj, key: i }))}
            />
          </Header>
        </Grid.Row>

        <Modal basic open={modal} onClose={() => setModal(false)}>
          <Modal.Header>Change Avatar</Modal.Header>
          <Modal.Content>
            <Input
              fluid
              type="file"
              label="New Avatar"
              name="previewImage"
              onChange={handleAvatarChange}
            />
            <Grid centered stackable columns={2}>
              <Grid.Row centered>
                <Grid.Column className="ui center aligned grid">
                  {previewImage && (
                    <AvatarEditor
                      ref={editorRef}
                      image={previewImage}
                      width={120}
                      height={120}
                      border={50}
                      scale={1.2}
                    />
                  )}
                </Grid.Column>
                <Grid.Column>
                  {croppedImage && (
                    <Image
                      style={{ margin: '3.5em auto' }}
                      height={100}
                      width={100}
                      src={croppedImage}
                    />
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
          <Modal.Actions>
            {croppedImage && (
              <Button color="green" inverted onClick={handleSubmitImage}>
                <Icon name="save" /> Change Avatar
              </Button>
            )}
            <Button
              color="green"
              inverted
              disabled={!previewImage}
              onClick={handleCropImage}
            >
              <Icon name="image" /> Preview
            </Button>
            <Button color="red" inverted onClick={() => setModal(false)}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid.Column>
    </Grid>
  );
};

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
});

export default connect(mapStateToProps)(UserPanel);
