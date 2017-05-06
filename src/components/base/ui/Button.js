import React from 'react';

const Button = ({ ...props }) => (<a className='button' onClick={props.onClick}>{props.title}</a>);

export default Button;
