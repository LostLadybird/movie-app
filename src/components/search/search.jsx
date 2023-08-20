import { Component } from 'react';
import { debounce } from 'lodash';

import './search.css';

export default class Search extends Component {
  state = {
    text: '',
  };

  onValueChange = debounce((value) => {
    this.props.onAddingQuery(value);
  }, 1000);

  changeValue = (value) => {
    this.setState({
      text: value,
    });
  };

  render() {
    return (
      <div className="search">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="input"
            placeholder="Type to search..."
            autoFocus
            type="text"
            onChange={(e) => {
              this.changeValue(e.target.value);
              this.onValueChange(e.target.value);
            }}
          ></input>
        </form>
      </div>
    );
  }
}
