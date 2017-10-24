// TODO: Example to Remove "https://api.tumblr.com/v2/blog/jamesrsilvester.tumblr.com/posts?api_key=qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz";

const tumblrAPI = {
  baseUrl: 'https://api.tumblr.com/v2',
  blogEndpoint: '/blog/',
  tagEndpoint: '/tagged/',
  tagExample: 'gif',
  // TODO: Store API KEY AS ENV Variable?
  apiKey: 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz'
}

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
  var blogPath = `${blogQuery}.tumblr.com/posts;`;
  // Condition 1 - Check whether both searches are empty.
  if(blogQuery.length === 0 && tagQuery.length === 0){
    alert("Search must not be empty");
  }

  //Condition 2 - Only blog is being searched for.
  if (blogQuery.length > 0 && tagQuery.length === 0) {
    console.log("only blog has been submitted");
    //AJAX blog search
    console.log(`Searching for ${blogQuery}.tumblr.com`);
    $.ajax({
      method: "GET",
      url: tumblrAPI.baseUrl + tumblrAPI.blogEndpoint + blogPath,
      data: {
        api_key: tumblrAPI.apiKey
      },
      success: onSuccess,
      error: onError
    })
  }

  //Condition 3 - Both blog and tag were searched
  if (blogQuery.length > 0 && tagQuery.length > 0){
    console.log("Both have been submitted")
  }

  //Condition 4 - Only Tag was searched
  if (blogQuery.length === 0 && tagQuery.length > 0){
    console.log("Only tag submitted")
  }
}

//AJAX SUCCESS RESPONSE
function onSuccess(json) {
  //save incoming JSON as variable
  var allPosts = json.response.posts;
  console.log("success: " + json.response.posts);
  allPosts.forEach(function(link, index) {
    $("#results").append($("<li class='post'>" + link.short_url + "</li>"))
  })
};

//AJAX ERROR RESPONSE
function onError(request, status, error) {
  console.log("error " + request.responseText);
};
