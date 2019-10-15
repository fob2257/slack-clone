import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import './Register.style.css';

import { fireAuth, createUserDocument } from '../../firebase/firebase.util';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearInputs = () =>
    [
      setUsername,
      setEmail,
      setPassword,
      setPasswordConfirmation,
    ].map(fn => fn(''));

  const isFormValid = () => {
    const errors = [];

    if (!username.length
      || !email.length
      || !password.length
      || !passwordConfirmation.length) errors.push({ message: 'Fill in all the fields' });

    if (password.length < 6) errors.push({ message: 'Password must be at least 6 characters long' });

    if (password !== passwordConfirmation) errors.push({ message: 'Passwords did not match' });

    return !(errors.length > 0);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    setErrors(errors);
    if (!isFormValid()) return;

    setLoading(true);
    try {
      const { user } = await fireAuth.createUserWithEmailAndPassword(email, password);
      await createUserDocument(user, { displayName: username });

      clearInputs();
    } catch (error) {
      console.error(error);
      setErrors([error]);
    }
    setLoading(false);
  };

  return (
    <Grid textAlign='center' verticalAlign='middle' className='register'>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header
          as='h1'
          color='orange'
          textAlign='center'
          icon
        >
          <Icon name='puzzle piece' color='orange' />
          Register for DevChat
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
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

            <Button
              type='submit'
              color='orange'
              size='large'
              fluid
              className={`${loading && 'loading'}`}
              disabled={loading}
            >
              Submit
            </Button>
            <Button
              size='large'
              fluid
              style={{ marginTop: '2%' }}
              onClick={(e) => {
                e.preventDefault();
                clearInputs();
              }}
            >
              Clear Inputs
            </Button>
          </Segment>
        </Form>
        {
          errors.length ? (
            <Message error>
              <h3>Error</h3>
              {
                errors.map((err, i) => <p key={i}>{err.message}</p>)
              }
            </Message>
          ) : null
        }
        <Message>
          Already an user? <Link to='/logIn'>LogIn</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default Register;
