import { Component } from 'react';
import { Rate } from 'antd';

import { Consumer } from '../movieDB-context';
import noImagePic from '../../images/no-image.jpg';

import './movie-item.css';

export default class MovieItem extends Component {
  onAddingRating = (id, guestSessionId, value) => {
    this.props.onAddRating(id, guestSessionId, value);
  };

  getMovieGenres = (genresId, genresList) => {
    // получение жанров для каждого фильма
    const genresArr = [];
    for (let id of genresId) {
      genresList.forEach((elem) => {
        if (elem.id === id) {
          genresArr.push(elem.name);
        }
      });
    }

    const movieGenres = (
      <>
        {genresArr.map((el) => {
          return (
            <span className="genres-list__item" key={el}>
              {el}
            </span>
          );
        })}
      </>
    );
    return movieGenres;
  };

  getRatingColor = (num) => {
    if (num > 0 && num < 3) {
      return '#E90000';
    } else if (num > 3 && num < 5) {
      return '#E97E00';
    } else if (num > 5 && num < 7) {
      return '#E9D100';
    } else if (num > 7) {
      return '#66E900';
    }
  };

  render() {
    const { movie, guestSessionId, rating } = this.props;
    const { title, overview, poster_path, release_date, averageVote, genreId, id } = movie;

    const _imgBase = 'https://image.tmdb.org/t/p/w500';

    const poster = `${_imgBase}${poster_path}`;
    const showImg = poster_path == null ? noImagePic : poster;
    const color = this.getRatingColor(averageVote);
    const grade = averageVote.toFixed(1);

    return (
      <Consumer>
        {(genresList) => {
          return (
            <li className="list-item">
              <div className="img-box">
                <img src={showImg} alt="movie poster"></img>
              </div>
              <div className="info-box">
                <h2 className="title">{title}</h2>
                <p className="date">{release_date}</p>
                <div className="genres-list">{this.getMovieGenres(genreId, genresList)}</div>
                <p className="info">{overview}</p>
                <Rate
                  className="list-item--stars"
                  allowHalf
                  allowClear={false}
                  value={rating}
                  count={10}
                  onChange={(value) => {
                    this.onAddingRating(id, guestSessionId, value);
                  }}
                />
              </div>
              <span style={{ borderColor: `${color}` }} className="list-item--average-rating">
                {grade}
              </span>
            </li>
          );
        }}
      </Consumer>
    );
  }
}
