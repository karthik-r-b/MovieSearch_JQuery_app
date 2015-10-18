jQuery(document).ready(function ($) {
    //api url
    var apiUrl = "http://www.omdbapi.com/";
    
    //Event binding on enter button pressed inside movie search input box
    $('#search-movie').keyup(function () {
        if (event.keyCode == 13) {
            $('#search-by-title-button').click();
        } else {
            return false
        }
    });

    //Event binding on search button click
    $('#search-by-title-button').click(function () {
        var searchString = $('#search-movie').val();
        var searchUrl = apiUrl+'?s='+ searchString;

        //Remove previous movie list
        $('#search-results .movie-list').empty();

        //Remove previous searched Movie
        $('#search-results .movie').empty();
        
        //Get Movie list from api using search string
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: searchUrl,
            statusCode: {
                403: function () {
                    $('#search-results').html('HTTP 403 Forbidden!');
                }
            },
            success: function (response) {
                var result=JSON.parse(response);

                //check if no movie found
                if (result.Response == "False") {
                    $('#search-results .movie-list').html("<li class='list-group-item'>"+result.Error+"</li>");
                }else{
                    var MovieArray=result.Search;
                    var resultLength=MovieArray.length;
                    movieListHtml="";
                    MovieArray.forEach(function(movie){
                        movieListHtml+="<li movieID='"+movie.imdbID+"' class='list-group-item'>"+movie.Title+"</li>";  
                    });
                    $('#search-results .movie-list').html(movieListHtml);
                    
                    //binding event on movie list
                    addEventOnMovieList();
                }
            }
        });
});

function addEventOnMovieList(){
    //binding click event on movie list
    $("#search-results .movie-list li").on('click',function(event) {

        var movieID = $(this).attr("movieID");
        console.log(movieID);
        var searchMovieUrl = apiUrl+'?i='+ movieID;
        var movieHtml="";
        
        //For remove previous search list
        $('#search-results .movie-list').empty();
        //For remove previous searched movie
        $('#search-results .movie').empty();
        
        //Get movie data using movie id 
        $.ajax({
            type: 'GET',
            dataType: 'text',
            url: searchMovieUrl,
            statusCode: {
                403: function () {
                    $('#search-results .movie').html('HTTP 403 Forbidden!');
                }
            },
            success: function (response) {
                var result=JSON.parse(response);
                //check if no movie not found
                if (result.Response == "False") {
                    $('#search-results .movie').html("<span>"+result.Error+"</span>");
                }else{
                    var movie=result;
                    movieHtml+="<div> Movie Title :"+movie.Title+"</div>";
                    movieHtml+="<div> Year        :"+movie.Year+"</div>";
                    movieHtml+="<div>Cast :"+movie.Actors+"</div>";
                    movieHtml+="<div> Plot :"+movie.Plot+"</div>";
                    $('#search-results .movie').html(movieHtml);
                    var img = new Image();
                    //load movie image
                    $(img).load(function(){$('#search-results .movie').append($(this));}).attr({src: movie.Poster}).error(function(){
                     $('#search-results .movie').append("<span>Image not avilable !!</span>");
                 });
                }
            }
        })
});
}

});