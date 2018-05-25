// function to execute on sign-in
function onSignIn(googleUser) {
  if ($('#pre-auth').hasClass('show')){
    $('#pre-auth').removeClass('show').addClass('hide');
  }
  if ($('#post-auth').hasClass('hide')){
    $('#post-auth').removeClass('hide').addClass('show');
  }
  loadAPIClientInterfaces();
}

// function to execute on sign-in failure
function onSignInFailure() {
  if ($('#post-auth').hasClass('show')){
    $('#post-auth').removeClass('show').addClass('hide');
  }
  if ($('#pre-auth').hasClass('hide')){
    $('#pre-auth').removeClass('hide').addClass('show');
  }
}

// function to load youtube API
function loadAPIClientInterfaces() {
  gapi.client.load('youtube', 'v3', function() {
    handleAPILoaded();
  });
}

// function to execute on sign-out
$("#sign-out").on("click", function(){
  var auth = gapi.auth2.getAuthInstance();
  auth.signOut().then(function () {
    alert('Sign out successful.');
  });
  if ($('#post-auth').hasClass('show')){
    $('#post-auth').removeClass('show').addClass('hide');
  }
  if ($('#pre-auth').hasClass('hide')){
    $('#pre-auth').removeClass('hide').addClass('show');
  }
});
