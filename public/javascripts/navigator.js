
function loadPage() {
    var newHash = location.hash;
    if (newHash != null) {
        var pages = ['#new-post', '#feed', '#view-profile', '#edit-profile', '#manage-account'];
        if ($.inArray(newHash, pages) != -1) {
            $('#main-content').load('/partial/' + newHash.substring(1));
        }
        else if (newHash == '#sign-out')
        {
            document.getElementById('sign-out-form').submit();
        }
        else {
            //$('#main-content').html('bad request');
        }
    }
}

function chechHash() {
    if (location.hash != '') {
        loadPage();
    }
}

$('#search-form').on('submit', function(event){
  event.preventDefault();
  $.get('/search?html=1&query='+document.getElementById('search-term').value,
    function search (data, status){
      $('#searc-results').show();
      $('#search-results').html(data);
    });
});

$(window).on('hashchange', loadPage);
$(document).ready(chechHash);
