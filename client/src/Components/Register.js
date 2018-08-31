import React from 'react';
import { Button, Icon } from 'semantic-ui-react'
import { Link, withRouter } from 'react-router-dom';
import { Field, reduxForm, getFormValues, getFormSyncErrors, Form } from 'redux-form'
import { connect } from 'react-redux';
import { renderField } from './Input';
import { removeToken } from './Token';
import { required, phone, email, maxValue } from './Validation'
import { register } from '../API/API';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { clear } from "../Actions/Actions";

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      lowercase: undefined,
      uppercase: undefined,
      characters: undefined,
      digits: undefined,
    }
  }

  componentWillMount(){
    removeToken();
    this.props.clear();
  }

  onSubmit = e => {
    e.preventDefault();

    const values = this.props.formValues;

    register(values).then(errors => {
      if (errors.length !== 0) {
        for (let i = 0; i < errors.length; i++) {
          NotificationManager.error(errors[i]);
        }
      } else {
        this.props.history.push('/');
      }
    })
  };


  componentWillReceiveProps(nextProps){
    const values = nextProps.formValues;

    if (values && values.password && values.password.length >= 8) {
      this.setState({ characters: true });
    }
    else {
      this.setState({ characters: undefined });
    }

    if (values && values.password && /(?=.*[a-z])/.test(values.password)) {
      this.setState({ lowercase: true });
    }
    else {
      this.setState({ lowercase: undefined });
    }

    if (values && values.password && /(?=.*[A-Z])/.test(values.password)) {
      this.setState({ uppercase: true });
    }
    else {
      this.setState({ uppercase: undefined });
    }

    if (values && values.password && /(?=.*[0-9])/.test(values.password)) {
      this.setState({ digits: true });
    }
    else {
      this.setState({ digits: undefined });
    }
  } //Password check

  render() {
    const { formErrors } = this.props;
    const { uppercase, lowercase, characters, digits } = this.state;
    const validation = uppercase && lowercase && characters && digits;

    return (
      <div className="guest">
        <h2 className="login-title title">
          Register to Books Library
        </h2>
        <Form className="bookForm loginForm" onSubmit={e => this.onSubmit(e)}>
          <Field
            name="firstName"
            label="First Name"
            component={renderField}
            validate={required}
            placeholder="Enter your first name"
            autoComplete="firstName"
          />
          <Field
            name="lastName"
            label="Last Name"
            component={renderField}
            validate={required}
            placeholder="Enter your last name"
            autoComplete="lastName"
          />
          <Field
            name="userName"
            label="Username"
            component={renderField}
            validate={[required, maxValue]}
            placeholder="Enter your username"
            autoComplete="userName"
          />
          <Field
            name="country"
            label="Country"
            component={renderField}
            validate={required}
            placeholder="Enter your country"
            autoComplete="country"
          />
          <Field
            name="email"
            label="Email"
            component={renderField}
            validate={[required, email]}
            placeholder="Enter your email"
            autoComplete="email"
          />
          <Field
            name="phoneNumber"
            label="Phone Number"
            component={renderField}
            validate={[required, phone]}
            placeholder="Enter your phone number"
            autoComplete="phoneNumber"
          />
          <Field
            name="password"
            label="Password"
            component={renderField}
            validate={[required]}
            placeholder="Enter your password"
            type="password"
            autoComplete="new-password"
          />
          <div className="password-require">
            <Icon name={characters ? "check circle" : "warning circle"} style={{ color: characters ? "green" : "red" }} />
            <span>At least 8 characters long</span>
          </div>
          <div className="password-require">
            <Icon name={lowercase ? "check circle" : "warning circle"} style={{ color: lowercase ? "green" : "red" }} />
            <span>One lowercase character</span>
          </div>
          <div className="password-require">
            <Icon name={uppercase ? "check circle" : "warning circle"} style={{ color: uppercase ? "green" : "red" }} />
            <span>One uppercase character</span>
          </div>
          <div className="password-require">
            <Icon name={digits ? "check circle" : "warning circle"} style={{ color: digits ? "green" : "red" }} />
            <span>At least one number</span>
          </div>
          <Button
            content="Register"
            className="login"
            disabled={Object.keys(formErrors).length !== 0 || !validation}
          />
          <div>
            Already have an account? <Link to="/login">Login</Link>
          </div>
          <NotificationContainer />
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  formValues: getFormValues('register')(state),
  formErrors: getFormSyncErrors('register')(state),
});

const mapDispatchToProps = dispatch => {
  return {
    clear: () => dispatch(clear()),
  };
};

const formConfig = {
  form: 'register',
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxForm(formConfig)(Register)));