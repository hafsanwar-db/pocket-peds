// import React from 'react';

// export const navigationRef = React.createRef();

// const navigate = (name, params) => {
//   console.log('entered navigating'); // does not print
//   navigationRef.current?.navigate(name, params);
// };

// export default {
//   navigate
// };
import * as React from 'react';

export const isReadyRef = React.createRef();
export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name, params);
  }
}

export function resetRoot(params = { index: 0, routes: [] }) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.resetRoot(params);
  }
}