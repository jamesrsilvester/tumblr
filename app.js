const tumblrAPI = {
  baseUrl: 'https://api.tumblr.com/v2',
  blogEndpoint: '/blog/jamesrsilvester.tumblr.com/posts',
  tagEndpoint: '/tagged',
  // TODO: Store API KEY AS ENV Variable?
  apiKey: 'qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz'
}
// TODO: Example to Remove "https://api.tumblr.com/v2/blog/jamesrsilvester.tumblr.com/posts?api_key=qvPkgVRPIjA1uvzj0neyThBYknIaH1R3lqsT2e5xBdfrkxDrvz";

$(document).on("ready", function(){
  console.log("scripts linked");

  $("form").on("submit", function(e) {
    e.preventDefault();
    handleSubmit();
    // getAndRenderGifs();
  });
});

function handleSubmit(){
  console.log("Button Clicked");
  getAndRenderPosts();
// TODO: Check what values have been submitted.
// TODO: Change URL PATH accordingly
};

function getAndRenderPosts() {
  $.ajax({
    method: "GET",
    url: tumblrAPI.baseUrl + tumblrAPI.blogEndpoint,
    data: {
      api_key: tumblrAPI.apiKey,
    },
    success: onSuccess,
    error: onError
  })
}

function onSuccess(json){
  console.log("success: " + json.response.posts); $(".post").remove();
  json.response.posts.forEach(function(link,index){
    $("#results").append($("<li class='.post'>"+link.short_url+"</li>"))
  })
};

function onError(request, status, error) {
  console.log("error " + request.responseText);
};
