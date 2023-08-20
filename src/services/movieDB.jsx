import { Component } from 'react';

export default class MovieDB extends Component {
  _apiBase = 'https://api.themoviedb.org/3';
  API_KEY = 'ff47b344f0490eb5d6fb440c76465a64';
  sessionID = '';

  async getResource(url) {
    try {
      const res = await fetch(`${this._apiBase}${url}`);

      if (!res.ok) {
        throw new Error(`Could not get data from ${this._apiBase}, received ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      throw new Error(err);
    }
  }

  async getMovies(query, page) {
    try {
      const res = await this.getResource(`/search/movie?api_key=${this.API_KEY}&query=${query}&page=${page}`);
      const array = await res;
      return array;
    } catch (err) {
      throw new Error(err);
    }
  }

  async createGuestSession() {
    try {
      const session = await this.getResource(`/authentication/guest_session/new?api_key=${this.API_KEY}`);
      return session;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getGenres() {
    try {
      const list = await this.getResource(`/genre/movie/list?api_key=${this.API_KEY}`);
      const res = await list;
      return res.genres;
    } catch (err) {
      throw new Error(err);
    }
  }

  async getRatedMovies(guestSessionId, page = 1) {
    try {
      const ratedMovies = await this.getResource(
        `/guest_session/${guestSessionId}/rated/movies?api_key=${this.API_KEY}&page=${page}`
      );
      return await ratedMovies;
    } catch (err) {
      throw new Error(err);
    }
  }

  async postRating(movieId, guestSessionId, rating) {
    const options = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify({ value: rating }),
    };
    await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.API_KEY}&guest_session_id=${guestSessionId}`,
      options
    )
      .then((response) => response.json())
      .then((response) => console.log('response', response))
      .catch((err) => console.error(err));
  }
}
