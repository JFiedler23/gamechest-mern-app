import React, { useEffect, useState, } from 'react';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";

function Login(props){
    const [user, setUser] = useState({
        email: "",
        password: "",
        errors: {}
    });

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.history.push("/dashboard"); // push user to dashboard when they login
        }
  
        if (props.errors) {
            setUser({...user, errors: props.errors});
        }

    }, [props.auth.isAuthenticated, props.errors]);

    useEffect(() => {
        if (props.auth.isAuthenticated) {
            props.history.push("/dashboard");
        }
    }, [props.auth.isAuthenticated]);

    const onChange = e => {
        setUser({...user, [e.target.id]: e.target.value });
    };

    const onSubmit = e => {
        e.preventDefault();
        
        const userData = {
          email: user.email,
          password: user.password
        };

        props.loginUser(userData); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    };

    const { errors } = user;

    return(
        <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
                <div className="col s8 offset-s2">
                    <Link to="/" className="btn-flat waves-effect">
                        <i className="material-icons left">keyboard_backspace</i> Back to
                        home
                    </Link>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <h4>
                            <b>Login</b> below
                        </h4>
                        <p className="grey-text text-darken-1">
                            Don't have an account? <Link to="/register">Register</Link>
                        </p>
                    </div>
                    <form noValidate onSubmit={onSubmit}>
                        <div className="input-field col s12">
                            <input
                                onChange={onChange}
                                value={user.email}
                                error={errors.email}
                                id="email"
                                type="email"
                                className={classnames("", {
                                    invalid: errors.email || errors.emailnotfound
                                })}
                            />
                            <label htmlFor="email">Email</label>
                            <span className="red-text">{errors.email}{errors.emailnotfound}</span>
                        </div>
                        <div className="input-field col s12">
                            <input
                                onChange={onChange}
                                value={user.password}
                                error={errors.password}
                                id="password"
                                type="password"
                                className={classnames("", {
                                    invalid: errors.password || errors.passwordincorrect
                                })}
                            />
                            <label htmlFor="password">Password</label>
                            <span className="red-text">{errors.password}{errors.passwordincorrect}</span>
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
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};
  
const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);