import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import './Register.style.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  return (
    <Grid textAlign='center' verticalAlign='middle' className='register'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header
          as='h2'
          color='orange'
          textAlign='center'
          icon
        >
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>
        <Form size='large'>
          <Segment stacked>
            <Form.Input
              type='text'
              name='username'
              placeholder='Username'
              icon='user'
              iconPosition='left'
              fluid
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Form.Input
              type='email'
              name='email'
              placeholder='Email Address'
              icon='mail'
              iconPosition='left'
              fluid
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Input
              type='password'
              name='password'
              placeholder='Password'
              icon='lock'
              iconPosition='left'
              fluid
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Input
              type='password'
              name='passwordConfirmation'
              placeholder='Password Confirmation'
              icon='repeat'
              iconPosition='left'
              fluid
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />

            <Button color='orange' size='large' fluid>
              Submit
            </Button>
          </Segment>
        </Form>
        <Message>
          Already an user? <Link to='/logIn'>LogIn</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
