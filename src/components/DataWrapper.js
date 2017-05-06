import React from 'react';
import { inject, observer } from 'mobx-react';

export default function DataWrapper(Component) {
  @inject(['store']) @observer
  class DataFetcher extends Component {
    constructor(props) {
      super(props);
      this.store = this.props.store;
    }

    componentDidMount() {
      const pathname = this.props.match.url.replace('pages', 'posts');
      const id = this.props.match.id ? this.props.match.id : null;
      this.store.fetchData(pathname, id);
    }

    componentWillUnmount() {
      this.store.clearItems();
    }

    render() {
      return <Component {...this.props} />;
    }

  }
  return DataFetcher;
}
