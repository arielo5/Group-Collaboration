$(document).ready(function() {
    let api_key = 'd748f076b1e977b08676c44b46816848';
    let mainURL = `https://api.themoviedb.org/3/discover/movie/?api_key=${api_key}&language=en-US&sort_by=popularity.desc&include_adult=false&with_genres=`;

    //listener to movie button
    $('.movie-moods').on('click', function() {
        let genreEl = $(this).val();
        let queryURL =
            `${mainURL}${genreEl}` + '&page=' + [Math.floor(Math.random() * 9 + 1)];
        ajaxMovieCall(queryURL);
    });
    // call function
    function ajaxMovieCall(queryURL) {
        $.ajax({
            url: queryURL,
            method: 'GET',
            success: function(response) {
                console.log(response);
            },
            error: function(response) {
                console.log(response);
            },
        }).then(function(response) {
            console.log(response);
            console.log(response.results[0].poster_path);
            renderMovies(response, 1);
        });
    }
    //fuction that renders movie
    function renderMovie(movie) {
        let posterImageCode = movie.backdrop_path;
        let posterImageURL = `https://image.tmdb.org/t/p/w500/${posterImageCode}`;
        document.getElementById("picturelink").src = posterImageURL;
        let titleMovie = movie.title;
        document.getElementById("movieT").innerHTML = titleMovie;
        let overviewMovie = movie.overview;
        document.getElementById("overview").innerHTML = "Synopsis: " + overviewMovie;
        let releaseMovie = movie.release_date;
        document.getElementById("release").innerHTML = "Release Date: " + releaseMovie;
        let ratingMovie = movie.vote_average;
        document.getElementById("ratings").innerHTML = "Rating: " + ratingMovie;
        let moviesList = $('#movies-list');


        moviesList.append(movieContent);
    }

    function cleanMoviesList(movie) {
        let moviesList = $('#movies-list');
        moviesList.empty();
    }
    //generating random number
    function getRandomMovie(movies) {
        let randomNumber = Math.floor(Math.random() * movies.results.length);
        let movie = movies.results[randomNumber];

        return movie;
    }
    //for loop if user would like to display more than one movie
    function renderMovies(movies, length) {
        cleanMoviesList();

        for (let i = 0; i < length; i++) {
            let randomMovie = getRandomMovie(movies);
            renderMovie(randomMovie);
        }
    }
});