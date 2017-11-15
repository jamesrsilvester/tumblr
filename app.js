(function(window) {
  const baseUrl = 'https://api.tumblr.com/v2';
  //Search by Blog endpoint
  const blogEndpoint = '/blog/';
  //Search by Tag endpoint
  const tagEndpoint = '/tagged';
  //store as env.variable?
  const apiKey = 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz';

  // @NOTE:  Lookup browser ready events as-per below
  // DOMContentLoaded
  // Ready
  $(document).on("ready", function() {
    $("form").on("submit", function(e) {
      e.preventDefault();
      //clear previous results from page
      $("#results").empty();
      //check for empty fields.
      validateFormInput();
    });
  });

  //attach listeners to buttons, and append posts between results and favorites
  function attachHandlers(){
    $('.favBtn').on("click", function (e) {
      if ($(this).text() === 'Favorite') {
        $('#favorites').append($(this).closest('.post'));
        $(this).text('Unfavorite');
      }
      else {
        $('#results').append($(this).closest('.post'));
        $(this).text('Favorite');
      }
    })
  };

  //determine type of search input, then directs to AJAX request
  function validateFormInput() {
    //save both search terms as variables
    var blogQuery = document.getElementById('blogInput').value.trim()
    var tagQuery = document.getElementById('tagInput').value.trim();
    var blogPath = `${blogQuery}.tumblr.com/posts`;

    // Condition 1 - Check whether both searches are empty
    if(blogQuery.length === 0 && tagQuery.length === 0){
      alert("Search must not be empty");
    }

    //Condition 2 - Only blog was searched
    if (blogQuery.length > 0 && tagQuery.length === 0) {
      console.log("only blog has been submitted");
      //AJAX blog search
      console.log(`Searching for ${blogQuery}.tumblr.com`);
      requestBlogData(blogEndpoint, blogPath, tagQuery);
    }

    //Condition 3 - Both blog and tag were searched
    if (blogQuery.length > 0 && tagQuery.length > 0){
      console.log("Both tag and blog were submitted")
      console.log(`Searching for ${tagQuery} tagged posts from ${blogQuery}.tumblr.com`);
      requestBlogData(blogEndpoint, blogPath, tagQuery)
    }

    //Condition 4 - Only tag was searched
    if (blogQuery.length === 0 && tagQuery.length > 0){
      console.log("Only tag submitted")
      console.log(`Retrieving all posts with tag ${tagQuery}`)
      requestTagData(tagEndpoint, tagQuery)
    }
  }

  //AJAX call for blog endpoint only
  function requestBlogData(endpoint, path, tag){
    $.ajax({
      method: "GET",
      url: baseUrl + endpoint + path,
      data: {
        api_key: apiKey,
        tag:tag,
        limit: 20
      },
      success: onBlogSuccess,
      error: onError
    })
  }

  //AJAX call for tag endpoint only
  function requestTagData(endpoint, tag){
    $.ajax({
      method: "GET",
      url: baseUrl + endpoint,
      data: {
        api_key: apiKey,
        tag:tag,
        limit:20
      },
      success: onTagSuccess,
      error: onError
    })
  }

  //Fires on successful AJAX request for Tag-only search
  function onTagSuccess(json) {
    var tagPosts = json.response;
    console.log("success: " + tagPosts);
    renderResults(tagPosts)
    attachHandlers();
  };

  //Fires on successful AJAX request for Blog and Blog + Tag search
  function onBlogSuccess(json) {
    var blogPosts = json.response.posts;
    console.log("success: " + blogPosts);
    renderResults(blogPosts);
    attachHandlers();
  };

  //Render instructions, by type of post
  function renderResults(posts) {
    posts.forEach(function(post, index) {
      console.error('rendered');
      //RENDER INSTRUCTIONS: LINK
      if(post.type === "link"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10'>
              <a target="_blank" href="${post.url}">${post.title}</a>
              <div>
                ${post.description}
              </div>
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      //RENDER INSTRUCTIONS: PHOTO
      else if(post.type === "photo"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10'>
              <img src="${post.photos[0].original_size.url}"/>
              <p>${post.summary}
              </p>
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      //RENDER INSTRUCTIONS: TEXT
      else if(post.type === "text"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10'>
              <div>${post.body}</div>
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      // RENDER INSTRUCTIONS: QUOTE
      else if(post.type === "quote"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10'>
              <h1>${post.summary}</h1>
              <h4>${post.source}</h4>
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      // RENDER INSTRUCTIONS: AUDIO
      else if(post.type === "audio"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10 align'>
                ${post.embed}
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      // RENDER INSTRUCTIONS: VIDEO
      else if(post.type === "video"){
        $("#results").append($(
          `<div id='${post.type}${index}' class='post hoverable'>
            <div class='col m10'>
              <img class="video" src="${post.thumbnail_url}"/>
              ${post.caption}
            </div>
            <button class="favBtn">Favorite</button>
          </div>`
        ))
      }
      //catch for any unexpected post.types
      else {
        console.error('Found post type:' + post.type);
      }
    })
  }

  //AJAX error response
  function onError(request, status, error) {
    console.log("error " + request.responseText);
  };

})(this);
