import React, { useState } from 'react';
import { Grid, Form, Segment, Button, Header, Message, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import { signInWithEmail } from '../firebase/firebase.util';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const clearInputs = () =>
    [
      setEmail,
      setPassword,
    ].map(fn => fn(''));

  const isFormValid = () => email.length && password.length;

  const handleSubmit = async e => {
    e.preventDefault();

    setErrors(errors);
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await signInWithEmail(email, password);

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
          color='violet'
          textAlign='center'
          icon
        >
          <Icon name='code branch' color='violet' />
          LogIn to DevChat
        </Header>
        <Form size='large' onSubmit={handleSubmit}>
          <Segment stacked>
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

            <Button
              type='submit'
              color='violet'
              size='large'
              fluid
              className={`${loading && 'loading'}`}
              disabled={loading}
            >
              Submit
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
          Don't have an account? <Link to='/register'>Register</Link>
        </Message>
      </Grid.Column>
    </Grid>
  );
};

export default LogIn;
