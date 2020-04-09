/* eslint-disable class-methods-use-this */
import React from 'react';
export default class TestComponent extends React.PureComponent {
  render() {
    throw Error('some thing throw');
    // eslint-disable-next-line no-unreachable
    return <div>sss</div>;
  }
}
