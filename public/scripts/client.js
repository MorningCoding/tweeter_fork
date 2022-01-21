/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function(){

    //Render the tweets into the tweets-container class
    const renderTweets = function(data) {
        $('.tweets-container').empty();
        data.forEach( (tweet) => {
          $('.tweets-container').prepend(createTweetElement(tweet));
        })
    }

    //This function is used to escape text to prevent cross site scripting
    const escape = function(str) {
        let div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };
    
    //Time Ago
    const timeAgo = function(timeNumbers){
        return timeago.format(timeNumbers);
    };

    //Dynamic tweets: Create HTML mark-up using template literals
    const createTweetElement = function(data) {
        let $tweet = $(`
        <article class="tweet">
            <header>
                <div class="user">
                    <img class="name1" src="${escape(data.user.avatars)}"
                    <p class="name2">${escape(data.user.name)}</p>
                </div>
                <h4>${escape(data.user.handle)}</h4>
            </header>
            <p class="tweet-content">${escape(data.content.text)}</p>
            <footer>
                <span>${escape(timeAgo(data.created_at))}</span>
                <div class="right-icons">
                    <i class="fas fa-flag"></i>
                    <i class="fas fa-retweet"></i>
                    <i class="fas fa-heart"></i>
                </div>
            </footer>
        </article>
        `);
        return $tweet;
    };

    //On tweet submit function
    $('.tweetform').submit(function(event){
        //prevent the default submission        
        event.preventDefault();
        
        //slide the error message up at the beginning
        $(".error").slideUp();

        //Form Validation: No value or too long
        if (!$('textarea', this).val()){
            return $('.error').text("Error: There is nothing there!").slideDown();
        }

        if ($('textarea', this).val().length > 140){
            return $('.error').text("Error: Too long! Too many characters!").slideDown();
        }

        if ($('textarea', this).val() && ($('textarea', this).val().length < 140)){
            let tweettext = $(this).serialize();
            //ajax post request
                $.ajax({
                    type: "POST",
                    url: "/tweets",
                    data: tweettext,
                }).then(function(){
                    //loadTweets will do a GET request to load the tweets
                    loadTweets();
                })
        }
    })

    const loadTweets = function () {
        $.ajax({
            type: 'GET',
            url: "/tweets",
            data: $(".tweetform").serialize(),
            dataType: 'JSON'
        })
        .then( data => {
            renderTweets(data);
        })
    }
    
    loadTweets();
});
