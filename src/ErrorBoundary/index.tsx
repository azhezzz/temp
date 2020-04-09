import React from 'react';
import _ from 'lodash';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Test from './Test';
interface IProps {}
interface IState {
  hasError: boolean;
}

export const ErrorBoundaryWrap = (throwErr = false) => {
  return (WrappedComponent: any) => {
    class Enhance extends React.Component<IProps, IState> {
      static getDerivedStateFromError(error: any) {
        return { hasError: true };
      }

      constructor(props: IProps) {
        super(props);
        this.state = { hasError: false };
      }

      componentDidCatch(error: any, errorInfo: any) {
        const componentName = _.get(WrappedComponent, 'name', 'UnKnown Component');
        console.error(componentName, 'Here Are Something wrong', '\n', error);
      }

      render() {
        if (this.state.hasError) {
          return (
            <div
              className="d-flex align-items-center justify-content-center text-center flex-grow-1"
              style={{ color: 'white', fontSize: 22, padding: 20 }}
            >
              Something went wrong.
            </div>
          );
        }
        if (throwErr) return <Test />;
        return <WrappedComponent {...this.props} />;
      }
    }
    hoistNonReactStatic(Enhance, WrappedComponent);
    return (Enhance as unknown) as any;
  };
};
