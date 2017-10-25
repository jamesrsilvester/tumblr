
const baseUrl = 'https://api.tumblr.com/v2';
const blogEndpoint = '/blog/';
const tagEndpoint = '/tagged/';
const apiKey = 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz';

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
    requestData(blogEndpoint, blogPath);
  }

  //Condition 3 - Both blog and tag were searched
  if (blogQuery.length > 0 && tagQuery.length > 0){
    console.log("Both have been submitted" + tagQuery)
    requestData(blogEndpoint, blogPath, tagQuery)
  }

  //Condition 4 - Only tag was searched
  if (blogQuery.length === 0 && tagQuery.length > 0){
    console.log("Only tag submitted")
  }
}

function requestData(endpoint, path, tag){
  $.ajax({
    method: "GET",
    url: baseUrl + endpoint + path,
    data: {
      api_key: apiKey,
      tag:tag
    },
    success: onSuccess,
    error: onError
  })
}

//AJAX SUCCESS RESPONSE
function onSuccess(json) {
  //save incoming JSON as variable
  var allPosts = json.response.posts;
  console.log("success: " + json.response.posts);
  allPosts.forEach(function(post, index) {
    // TODO: Render Logic for different types of posts
    if(post.type === "link"){
      $("#results").append($(`<div id='post${index}' class='post'><img src="${post.trail[0].blog.theme.header_image}"/><br><p>${post.type}<br>${post.summary}<p></div>`))
    }
    if(post.type === "photo"){
      $("#results").append($(`<div id='post${index}' class='post'><img src="${post.photos[0].alt_sizes[4].url}"/><br><p>${post.type}<br>${post.summary}<p></div>`))
    }
  })
};

//AJAX ERROR RESPONSE
function onError(request, status, error) {
  console.log("error " + request.responseText);
};
