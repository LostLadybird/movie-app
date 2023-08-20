import { Component } from 'react';
import { Alert } from 'antd';

import MovieItem from '../movie-item';

import './movies-list.css';

export default class MoviesList extends Component {
  render() {
    const { listOfMovies, ratedMovies, tab, error, spinner, noMovies, onAddRating, guestSessionId, rating } =
      this.props;

    if (error) {
      return error;
    }

    if (!listOfMovies) {
      return spinner;
    }

    if (noMovies) {
      return <Alert showIcon type="info" className="error-message" message="Sorry, no movies found." />;
    }

    const trueListOfMovies = tab === '1' ? listOfMovies : ratedMovies;

    const elements = trueListOfMovies.map((item) => {
      return (
        <MovieItem
          key={item.id}
          movie={item}
          onAddRating={onAddRating}
          guestSessionId={guestSessionId}
          rating={rating.get(item.id) || localStorage.getItem(item.id) || 0}
        />
      );
    });

    return (
      <section className="main">
        <ul className="list">{elements}</ul>
      </section>
    );
  }
}
