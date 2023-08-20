// date-fns
// отображение картинок DONE
// выводить список фильмов
// настроить пакеты
//функция для сокращения текста описания

из movie-item updateMovie()
movie.forEach((el) => {
this.setState({
title: el.title,
text: el.overview,
image: el.poster_path,
date: el.release_date,
});
});
