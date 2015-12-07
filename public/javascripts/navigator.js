
function loadPage() {
    var newHash = location.hash;
	var pages = ['#new-post', '#view-profile', '#edit-profile', '#manage-account'];
	
	if ($.inArray(newHash, pages) != -1) {
		$('#main-content').load('/partial/' + newHash.substring(1));
	}
	else if (newHash == '' || newHash == null || newHash == '#feed') {
		var users = document.getElementById('users-template').innerHTML;
		var names = ['loki', 'tobi', 'jane', 'sido'];
		var html = ejs.render(users, { names: names });
		alert(names + ' ;;; ' + html);
		document.getElementById('main-content').innerHTML = html;
	}
	else if (newHash == '#sign-out')
	{
		document.getElementById('sign-out-form').submit();
	}
	else {
		//$('#main-content').html('bad request');
	}
}

function chechHash() {
    if (location.hash != '') {
        loadPage();
    }
}

function clearSearchResults() {
	var sr = document.getElementById('search-results');
	sr.innerHTML = '';
	sr.style='display:none';
}

$('#search-form').on('submit', function(event){
	event.preventDefault();
	
	var st = $('#search-term');
	if (st.val() == '') {
		st.focus();
	}
	else {
		var sr = $('#search-results');
		var sb = $('#search-form button span.glyphicon');
		sb.removeClass('glyphicon-search');
		sb.addClass('glyphicon-refresh');
		sb.addClass('gly-spin');
		
		$.get('/search?query='+ st.val(), function (data, status) {
			sr.html('<li class="dropdown-header"><span class="glyphicon glyphicon-user"> Contacts<li><li role="separator" class="divider"></li>');
			$.each(data.users, function() {
				itemLi = document.createElement('li');
				itemA = document.createElement('a');
				itemA.href = '/profile/view/'+ this.username;
				itemA.innerHTML = this.first_name +' '+ this.last_name;
				itemLi.appendChild(itemA);
				sr.append(itemLi);
			});
				
			sb.removeClass('gly-spin');
			sb.removeClass('glyphicon-refresh');
			sb.addClass('glyphicon glyphicon-search');
			
			$('#search-results').css('display', 'block');
			
			sb.on('click', clearSearchResults);
		});
	}
});

$(document).click(function(event) { 
    if(!$(event.target).closest('#search-results').length) {
        if($('#search-results').css('display') == 'block') {
            $('#search-results').css('display', 'none');
        }
    }        
})


$(window).on('hashchange', loadPage);
$(document).ready(chechHash);
