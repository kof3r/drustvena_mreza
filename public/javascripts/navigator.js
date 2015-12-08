
function loadPage() {
    var newHash = location.hash;
	var pages = ['#new-post', '#view-profile', '#edit-profile', '#manage-account'];
	if (newHash == null || newHash == '' && newHash != '#' || newHash == '#feed') {
		var main = document.getElementById('main-content');
		main.innerHTML = '';
		
		$.get('content/post', {bubble_id: 1}, function(data) {
			// provjeriti status
			if (1) {
				
				$.each(data, function() {
					var post = document.createElement('div');
					post.className = 'post col-md-6 col-sm-12';
					
					/* HEADER */
					var header = document.createElement('div');
					header.className = 'header';
					
						var link = document.createElement('a');
						link.className = 'author';
						link.href = '/profile/username';
						
							var img = document.createElement('img');
							img.src = '/images/avatar.jpg';
							img.alt = '';
							link.appendChild(img);
							
							var username = document.createElement('span');
							username.className = 'glyphicon glyphicon-user';
							link.appendChild(username);
							link.innerHTML += ' ' + this;
							
							header.appendChild(link);
							
						var datetime = document.createElement('span');
						datetime.className = 'date-time';
							
							var dticon = document.createElement('span');
							dticon.className = 'glyphicon glyphicon-time';
							datetime.appendChild(dticon);
							
						datetime.innerHTML += ' 5.11.2015. 12:00';
						
						header.appendChild(datetime);
						
					/* CONTENT */
					var content = document.createElement('div');
					content.className = 'content';
					content.innerHTML = 'blablalblas js;df ';
					
							
					
					/* ACTIONS */
					var actions = document.createElement('ul');
					actions.className = 'actions';
					
					var actionList = [{name: 'Like', className: 'like', glyName: 'check'},
										{name: 'Comment', className: 'comment', glyName: 'comment'},
										{name: 'Remove', className: 'remove', glyName: 'trash'}];
					$.each(actionList, function(act) {
						var li = document.createElement('li');
						var a = document.createElement('a');
						var span = document.createElement('span');
						a.href = '#';
						a.className = act.className;
						span.className = 'glyphicon glyphicon-' + this.glyName;
						
						a.appendChild(span);
						a.innerHTML += ' ' + this.name;
						li.appendChild(a);
						actions.appendChild(li);
					});
					
					
					/* ADDING */
					
					post.appendChild(header);
					post.appendChild(content);
					post.appendChild(actions);
					
					main.appendChild(post);
				});
				
			}
			else {alert('ne valja status');}
		});
		
	}
	else if ($.inArray(newHash, pages) != -1) {
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

function loadPageIfNeeded() {
	if (document.location.pathname == '/home/homepage') {
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
$(document).ready(loadPageIfNeeded);
