import React, { useEffect, useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";

function Register(props) {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
        errors: {}
    });

    useEffect(() => {
        if (props.errors) {
            setUser({...user, errors: props.errors});
        }
    }, [props.errors]);

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.history.push("/dashboard");
        }
    }, [props.auth.isAuthenticated]);

    const onChange = e =>{
        setUser({...user, [e.target.id]: e.target.value });
    }

    const onSubmit = e => {
        //preventing the page from reloading on submit
        e.preventDefault();

        //creating the new user
        const newUser = {
          name: user.name,
          email: user.email,
          password: user.password,
          password2: user.password2
        };

        props.registerUser(newUser, props.history); 
    };

    const { errors } = user;

    return (
        <div className="container">
            <div className="row">
                <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back to
                        home
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <h4>
                            <b>Register</b> below
                        </h4>
                        <p className="grey-text text-darken-1">
                            Already have an account? <Link to="/login">Log in</Link>
                        </p>
                        <h5 className="grey-text text-darken-1">
                            Disclaimer: This application is a work in progress and is being used as a learning experience.
                        </h5>
                    </div>
                    <form noValidate onSubmit={onSubmit}>
                        <div className="input-field col s12">
                            <input
                            onChange={onChange}
                            value={user.name}
                            error={errors.name}
                            id="name"
                            type="text"
                            className={classnames("", {
                                invalid: errors.name
                              })}
                            />
                            <label htmlFor="name">Name</label>
                        </div>
                        <div className="input-field col s12">
                            <input
                            onChange={onChange}
                            value={user.email}
                            error={errors.email}
                            id="email"
                            type="email"
                            className={classnames("", {
                                invalid: errors.email
                              })}
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">{errors.email}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                            onChange={onChange}
                            value={user.password}
                            error={errors.password}
                            id="password"
                            type="password"
                            className={classnames("", {
                                invalid: errors.password
                              })}
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">{errors.password}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={onChange}
                                value={user.password2}
                                error={errors.password2}
                                id="password2"
                                type="password"
                                className={classnames("", {
                                    invalid: errors.password2
                                  })}
                                />
                            <label htmlFor="password2">Confirm Password</label>
                            <span className="red-text">{errors.password2}</span>
                        </div>
                        <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                            <button
                                style={{
                                    width: "150px",
                                    borderRadius: "3px",
                                    letterSpacing: "1.5px",
                                    marginTop: "1rem"
                                }}
                                type="submit"
                                className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                                >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));