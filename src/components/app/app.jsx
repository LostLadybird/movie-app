import { Component } from 'react';
import { format } from 'date-fns';
import { Spin, Pagination } from 'antd';

import { Provider } from '../movieDB-context';
import MoviesList from '../movies-list';
import HeaderTabs from '../header-tabs';
import Search from '../search';
import MovieDB from '../../services/movieDB';
import ErrorIndicator from '../error-indicator';

import './app.css';

export default class App extends Component {
  apiData = new MovieDB();

  state = {
    inputText: '',
    movies: [],
    currentPage: 1,
    totalResults: 0,
    genresList: [],
    ratedMovies: [],
    rating: new Map(),
    guestSessionId: null,
    tab: '1', // 'search - 1', 'rated - 2'
    loading: false,
    error: false,
    noMoviesFound: false,
    errorData: null,
  };

  componentDidCatch() {
    this.setState(() => ({ error: true }));
  }

  componentDidMount() {
    if (!localStorage.getItem('guestSessionId')) {
      this.createSession();
    } else {
      this.setState({
        guestSessionId: localStorage.getItem('guestSessionId'),
      });
    }
    this.getGenresList();
  }

  componentDidUpdate(prevProps, prevState) {
    const { tab, currentPage, inputText } = this.state;
    if (prevState.inputText !== inputText) {
      this.setState({
        currentPage: 1,
      });
      this.getMovies();
    }
    if (prevState.tab !== tab) {
      this.setState({
        currentPage: 1,
      });
      if (tab === '1') {
        this.getMovies();
      } else {
        this.getRatedMovies();
      }
    }
    if (prevState.currentPage !== currentPage) {
      if (tab === '1') {
        this.getMovies();
      } else {
        this.getRatedMovies();
      }
    }
  }

  onError = (err) => {
    // метод обработки ошибок
    this.setState({
      error: true,
      noMoviesFound: false,
      loading: false,
      errorData: err.toString(),
    });
  };

  createSession() {
    // создание гостевой сессии через API
    this.apiData
      .createGuestSession()
      .then((data) => {
        localStorage.setItem('guestSessionId', data.guest_session_id);
        this.setState({
          guestSessionId: data.guest_session_id,
          loading: false,
        });
      })
      .catch(this.onError);
  }

  getGenresList = () => {
    // получение массива жанров с API
    this.apiData
      .getGenres()
      .then((data) => {
        this.setState({
          genresList: [...data],
        });
      })
      .catch(this.onError);
  };

  addingQuery = (value) => {
    // добавление текста инпута в State
    this.setState({
      inputText: value,
    });
  };

  getMovies() {
    // получение списка фильмов с API
    const { inputText, currentPage } = this.state;
    this.setState({
      movies: [],
      loading: true,
      error: false,
      noMoviesFound: false,
    });
    if (inputText === '') {
      return;
    } else {
      this.apiData
        .getMovies(inputText, currentPage)
        .then((data) => {
          this.setState({
            totalResults: data.total_results,
            currentPage,
          });
          if (data.results.length === 0) {
            this.setState({
              loading: false,
              noMoviesFound: true,
              currentPage: currentPage,
            });
          }
          data.results.forEach((elem) => {
            this.getMoviesList(elem);
          });
        })
        .catch(this.onError);
    }
  }

  getMoviesList = (element) => {
    // получение готового списка фильмов
    const oneMovie = this.createOneMovie(element);
    this.setState(({ movies }) => {
      const newData = [...movies, oneMovie];
      return {
        movies: newData,
        loading: false,
      };
    });
  };

  postRating = (id, guestSessionId, rate) => {
    // пост-запрос рейтинга
    this.apiData
      .postRating(id, guestSessionId, rate)
      .then(() => {
        this.setState(({ rating }) => ({
          rating: new Map(rating.set(id, rate)),
        }));
        localStorage.setItem(id, rate);
      })
      .catch(this.onError);
  };

  getRatedMovies = () => {
    // получение списка фильмов с рейтингом с API
    const { guestSessionId, currentPage } = this.state;
    this.setState({
      ratedMovies: [],
      loading: true,
      error: false,
      noMoviesFound: false,
    });

    this.apiData
      .getRatedMovies(guestSessionId, currentPage)
      .then((data) => {
        this.setState({
          totalResults: data.total_results,
          currentPage,
        });
        if (data.results.length === 0) {
          this.setState({
            loading: false,
            noMoviesFound: true,
          });
        }
        data.results.forEach((elem) => {
          this.getRatedMoviesList(elem);
        });
      })
      .catch(this.onError);
  };

  getRatedMoviesList = (element) => {
    // получение готового списка фильмов с рейтингом
    const oneRatedMovie = this.createOneMovie(element);
    this.setState(({ ratedMovies }) => {
      const newData = [...ratedMovies, oneRatedMovie];
      return {
        ratedMovies: newData,
        loading: false,
      };
    });
  };

  createOneMovie = (elem) => {
    // создание каждого фильма
    const title = elem.title;
    const genreId = elem.genre_ids;
    const averageVote = elem.vote_average;
    const overview = this.cutOverview(elem.overview);
    const poster_path = elem.poster_path;
    const release_date = elem.release_date
      ? format(new Date(elem.release_date), 'MMMM d, yyyy')
      : 'Release date is unknown';
    const id = elem.id;
    return {
      title,
      genreId,
      averageVote,
      overview,
      poster_path,
      release_date,
      id,
    };
  };

  cutOverview(overview) {
    // обрезка текста
    const maxLength = 200;
    if (overview.length > maxLength) {
      const shortText = overview.slice(0, maxLength).split(' ');
      shortText.pop();
      return `${shortText.join(' ')}...`;
    }
    return overview;
  }

  onChangePage = (page) => {
    // переключение страниц
    this.setState({
      currentPage: page,
    });
  };

  TabChange = (value) => {
    // смена табов
    console.log('tabChange', value);
    this.setState({
      tab: value,
    });
  };

  render() {
    const {
      movies,
      ratedMovies,
      loading,
      error,
      inputText,
      noMoviesFound,
      currentPage,
      totalResults,
      tab,
      genresList,
      guestSessionId,
      rating,
    } = this.state;
    const spinner = loading && !error ? <Spin size="large" tip="Loading..." className="spinner" /> : null;

    const errorMsg = error ? <ErrorIndicator /> : null;

    const showPagination =
      totalResults > 0 && !loading ? (
        <Pagination
          className="pagination"
          pageSize={20}
          current={currentPage}
          total={totalResults}
          showSizeChanger={false}
          hideOnSinglePage
          onChange={this.onChangePage}
        />
      ) : null;

    const showSearchInput = tab === '1' ? <Search onAddingQuery={this.addingQuery} value={inputText} /> : null;

    return (
      <div className="movieApp">
        <HeaderTabs onTabChange={this.TabChange} />
        {showSearchInput}
        <Provider value={genresList}>
          {spinner}
          <MoviesList
            listOfMovies={movies}
            ratedMovies={ratedMovies}
            tab={tab}
            error={errorMsg}
            spinner={spinner}
            noMovies={noMoviesFound}
            onAddRating={this.postRating}
            guestSessionId={guestSessionId}
            rating={rating}
          />
        </Provider>
        {showPagination}
      </div>
    );
  }
}
