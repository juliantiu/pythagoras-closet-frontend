import React, { useCallback, useState } from 'react';
import { withRouter, Redirect } from "react-router";
import { Link } from 'react-router-dom';
import { useAuthState } from '../../context_hooks/AuthState'
import app from "../../firebase";
import './index.css';
import '../../assets/css/style.css';
import { Container, Row, Col, Card, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const Login = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ email: '', passWord: '' });
  const { currentUser } = useAuthState();

  const handleLogin = useCallback(
    async () => {
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email, password);
          setErrorMessage({ email: '', password: '' });
        history.push('/');
      } catch {
        console.log('im in here');
        setErrorMessage({ email: 'The email may be incorrect', password: 'The password may be incorrect' });
        // throw error;
      }
    },
    [history, email, password, setErrorMessage]
  );

  const handleShowPassword = useCallback(
    () => {
      setShowPassword(prev => !prev);
    },
    [setShowPassword]
  );

  const handleChange = useCallback(
    (event) => {
      const { name, value } = event.target;
      switch (name) {
        case 'email':
          setEmail(value);
          break;
        case 'password':
          setPassword(value);
          break;
        default:
          break;
      }
    },
    [setEmail, setPassword]
  );

  if (currentUser) {
    return <Redirect to="/" />;
  }

  const passwordField = (
    <>
      <Form.Control name="password" type={showPassword ? 'text' : 'password'} value={password} onChange={handleChange} required/>
      <InputGroup.Append>
        <Button variant="outline-secondary" onClick={handleShowPassword}>{
          showPassword ?
            <FontAwesomeIcon icon={faEyeSlash} /> :
            <FontAwesomeIcon icon={faEye} />
          }
        </Button>
      </InputGroup.Append>
    </>
  )

  return (
    <Container fluid className="vh-100">
      <Row className="h-100">
        <Col lg={9} className="d-none d-lg-block px-0 login-image"><div className="dark-filter"/></Col>
        <Col sm={12} lg={3} className="d-flex justify-content-center align-items-center py-lg-0 px-lg-0 login-image">
          <div className="dark-filter"/>
          <Card className="login-card w-100 border-0 rounded-0">
            <Card.Header className="login-card-header rounded-0 font-1">Pythagora's Closet</Card.Header>
            <Card.Body>
              <Form noValidate>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <InputGroup>
                  <InputGroup.Prepend><InputGroup.Text>@</InputGroup.Text></InputGroup.Prepend>
                    <Form.Control name="email" type="email" value={email} onChange={handleChange} required/>
                  </InputGroup>
                  <Form.Text as="small" className="login-error-message">{errorMessage.email}</Form.Text>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    {passwordField}
                  </InputGroup>
                  <Form.Text as="small" className="login-error-message">{errorMessage.password}</Form.Text>
                </Form.Group>
              </Form>
              <Row>
                <Col xs={12} className="text-center w-100">
                  <small>If you haven't already, <Link to="/">sign up</Link> with us</small>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-right rounded-0">
              <Button variant="dark" onClick={handleLogin} className="font-1">Login</Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default withRouter(Login);
