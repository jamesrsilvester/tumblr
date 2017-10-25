
const baseUrl = 'https://api.tumblr.com/v2';
const blogEndpoint = '/blog/';
const tagEndpoint = '/tagged';
const apiKey = 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz';
const favButton = `<div class="favBtn"><img src="./assets/star_empty.png"/></div>`;

$(document).on("ready", function() {
  console.log("scripts linked");

  $("form").on("submit", function(e) {
    e.preventDefault();
    //clear previous results from page
    $(".post").remove();
    //check for completed fields.
    validateFormInput();
  });
});

function validateFormInput() {
  //save both search terms as variables
  var blogQuery = document.getElementById('blogInput').value.trim()
  var tagQuery = document.getElementById('tagInput').value.trim();
  var blogPath = `${blogQuery}.tumblr.com/posts`;

  // Condition 1 - Check whether both searches are empty.
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
    console.log("Both have been submitted" + tagQuery)
    requestBlogData(blogEndpoint, blogPath, tagQuery)
  }

  //Condition 4 - Only tag was searched
  if (blogQuery.length === 0 && tagQuery.length > 0){
    console.log("Only tag submitted" + tagEndpoint + tagQuery)
    requestTagData(tagEndpoint, tagQuery)
  }
}

function requestBlogData(endpoint, path, tag){
  $.ajax({
    method: "GET",
    url: baseUrl + endpoint + path,
    data: {
      api_key: apiKey,
      tag:tag
    },
    success: onBlogSuccess,
    error: onError
  })
}

function requestTagData(endpoint, tag){
  $.ajax({
    method: "GET",
    url: baseUrl + endpoint,
    data: {
      api_key: apiKey,
      tag:tag
    },
    success: onTagSuccess,
    error: onError
  })
}

function onTagSuccess(json) {
  //save incoming JSON to var
  var tagPosts = json.response;
  console.log("success: " + tagPosts);
  renderResults(tagPosts)
};

//AJAX SUCCESS RESPONSE
function onBlogSuccess(json) {
  //save incoming JSON to var
  var blogPosts = json.response.posts;
  console.log("success: " + blogPosts);
  renderResults(blogPosts);
};

function renderResults(posts) {
  posts.forEach(function(post, index) {
    //RENDER INSTRUCTIONS: LINK
    if(post.type === "link"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10'>
            <a href="${post.url}">${post.title}</a>
            <div>
              ${post.description}
            </div>
          </div>
          ${favButton}
        </div>`
      ))
    }
    //RENDER INSTRUCTIONS: PHOTO
    if(post.type === "photo"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10'>
            <img src="${post.photos[0].original_size.url}"/>
            <p>${post.summary}
            </p>
          </div>
          ${favButton}
        </div>`
      ))
    };
    //RENDER INSTRUCTIONS: TEXT
    if(post.type === "text"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10'>
            <h3>${post.title}</h3>
            <div>${post.body}</div>
          </div>
          ${favButton}
        </div>`
      ))
    };
    // RENDER INSTRUCTIONS: QUOTE
    if(post.type === "quote"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10'>
            <h1>${post.summary}</h1>
            <h4>${post.source}</h4>
          </div>
          ${favButton}
        </div>`
      ))
    };
    // RENDER INSTRUCTIONS: AUDIO
    if(post.type === "audio"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10 align audioPlayer'>
              ${post.embed}
          </div>
          ${favButton}
        </div>`
      ))
    };
    // RENDER INSTRUCTIONS: VIDEO
    if(post.type === "video"){
      $("#results").append($(
        `<div id='${post.type}${index}' class='post hoverable'>
          <div class='col m10'>
            <a target="_blank" href="${post.video_url}">
              <img class="video" src="${post.thumbnail_url}"/>
            </a>
          </div>
          ${favButton}
        </div>`
      ))
    };
    // // TODO: RENDER INSTRUCTIONS: CHAT .map? (dialogue is array of objects)
  })
}

//AJAX ERROR RESPONSE
function onError(request, status, error) {
  console.log("error " + request.responseText);
};
