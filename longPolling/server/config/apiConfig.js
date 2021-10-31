'use strict';
const config = {
    "default_success_http_code" : 200,
    "default_error_http_code" : 500,
    "unauthorized_error_code": 401,
    "bad_request_code": 400,
    // custom error codes & messages
    "default_success_code" : 0,
    "default_error_code" : 7,
    "default_session_expiry_code" : 9,
    "default_not_found_message": "No records found",
    "default_success_message" : "Successfully processed the request",
    "default_error_message" : "Sorry, invalid request",
    "service_error_message" : "Error encountered processing the request",
    "params_error_message" : "Please make sure you are passing valid parameters",
    "unauthorized_view_message" : "You are not authorized to view the information",
    "unauthorized_operation_message" : "You are not authorized to perform this operation",
    "unauthorized_access_message" : "You are not authorized to access",
    "service_down_message" : "Oops, something went wrong, please try again later",
    "session_expired_message" : "Sorry, looks like you are not logged in",
    "session_logout_message" : "Successfully logged out",
    "bad_request_message": "bad request",
    "session_logout_devices_message" : "Successfully logged out from all the devices",
    "unauthorized_error_message": "Access is denied due to invalid credentials"
};

module.exports = config;
