const tumblrAPI = {
  baseUrl: 'https://api.tumblr.com/v2',
  blogEndpoint: '/blog/',
  tagEndpoint: '/tagged/',
  tagExample: 'gif',
  // TODO: Store API KEY AS ENV Variable?
  apiKey: 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz'
}
// TODO: Example to Remove "https://api.tumblr.com/v2/blog/jamesrsilvester.tumblr.com/posts?api_key=qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz";

$(document).on("ready", function() {
  console.log("scripts linked");

  $("form").on("submit", function(e) {
    e.preventDefault();
    handleSubmit();
    // getAndRenderGifs();
  });
});

function handleSubmit() {
  getAndRenderPosts();
  // TODO: Check what values have been submitted.
  // TODO: Change URL PATH accordingly
};

function getAndRenderPosts() {
  // TODO: Is this an appropriate place to store this?
  var blogQuery = document.getElementById('blogInput').value;
  var blogPath = `${blogQuery}.tumblr.com/posts;`
  console.log(`Searching for ${blogQuery}.tumblr.com`);
  if (!blogQuery) {
    alert("Search must not be empty");
  }
  else {
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
}

function onSuccess(json) {
  var allPosts = json.response.posts;
  console.log("success: " + json.response.posts);
  $(".post").remove();
  allPosts.forEach(function(link, index) {
    $("#results").append($("<li class='post'>" + link.short_url + "</li>"))
  })
};

function onError(request, status, error) {
  console.log("error " + request.responseText);
};
