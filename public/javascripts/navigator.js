
function loadPage() {
    var newHash = location.hash;
	var pages = ['#new-post', '#view-profile', '#edit-profile', '#manage-account'];
	
	if (newHash == null || newHash == '' && newHash != '#' || newHash == '#feed') {

		$.get('/content/timeline', function(data) {
			if(data.posts.length > 0) {
				$.each(data.posts, function() {
					this.content = BBC2HTML(this.content);
					var dt = Date.parse(this.created_at);
					this.created_at = dateFormat(dt, 'dd/mm/yyyy HH:MM');
					dt = Date.parse(this.updated_at);
					this.updated_at = dateFormat(dt, 'dd/mm/yyyy HH:MM');
				});
				var templateFunction = doT.template(document.getElementById('feed-tmp').text);
				var html = templateFunction( data );
				document.getElementById('main-content').innerHTML = html;
				initializeVideos();
			}
			else {
				document.getElementById('main-content').innerHTML = '<div class="alert alert-info">There are currently no posts to show</div>';
			}
		});
		
	}
	else if ($.inArray(newHash, pages) != -1) {
		$('#main-content').load('/partial/' + newHash.substring(1));
	}
	else if(newHash == '#new-bubble') {
		;
	}
	else if (newHash == '#sign-out')
	{
		document.getElementById('sign-out-form').submit();
	}
	else {
		//$('#main-content').html('bad request');
	}
}

function initialize() {
	if (document.location.pathname == '/home/homepage') {
		loadPage();
	}
	$.get('/content/myBubbles', function(data) {
		var templateFunction = doT.template(document.getElementById('my-bubbles-tmp').text);
		var html = templateFunction(data);
		$('#my-bubbles').html(html);
	});
	
	$('#new-bubble-menu-item').magnificPopup({
		type: 'ajax',
		alignTop: true,
		overflowY: 'scroll',
		mainClass: 'mfp-fade'
	});

	$('#new-bubble-form').magnificPopup({
		type: 'ajax'
	});
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

function loadComments(content_id) {
	if (content_id) {
		var cmtbtn = $('#post-' + content_id + ' .actions .comment span');
		cmtbtn.removeClass('glyphicon-comment');
		cmtbtn.addClass('gly-spin glyphicon-refresh');

		$.get('/content/comments/' + content_id, function (data) {
			if (data.comments.length) {
				var templateFunction = doT.template(document.getElementById('comments-tmp').text);
				$.each(data.comments, function() {
					var dt = Date.parse(this.created_at);
					this.created_at = dateFormat(dt, 'dd/mm/yyyy HH:MM');
					dt = Date.parse(this.updated_at);
					this.updated_at = dateFormat(dt, 'dd/mm/yyyy HH:MM');
				});
				var html = templateFunction(data);
				$('#post-' + content_id + ' .comments ul').html(html);
			}
			else {
				$('#post-' + content_id + ' .comments ul').html('<li>No comments</li>');
			}
			
			$('#post-' + content_id + ' .comments').slideDown();
			
			cmtbtn.removeClass('gly-spin glyphicon-refresh');
			cmtbtn.addClass('glyphicon-comment');
		});
	}
}

function postComment(content_id) {
	
	var comment = $('#post-' + content_id + ' .comments textarea');
	if(comment.val().length) {
		var pbtn = $('#post-' + content_id + ' .comments button');
		pbtn.attr('disabled', 'disabled');
		pbtn.html('Posting... <span class="glyphicon glyphicon-refresh gly-spin"></span>');
		
		$.post('/content/comment/' + content_id, {content_id: content_id, comment: comment.val()}, function (data) {
		
		pbtn.html('Post');
		pbtn.removeAttr('disabled');
		loadComments(content_id);
		comment.val('');
		});
	}
	else {
		comment.focus();
	}
}

function initializeVideos() {

	$(document).ready(function() {
        $('#main-content .popup-youtube, #main-content .popup-vimeo, #main-content .popup-gmaps').magnificPopup({
          disableOn: 700,
          type: 'iframe',
          mainClass: 'mfp-fade',
          removalDelay: 160,
          preloader: false,

          fixedContentPos: false
        });
    });
}


$(window).on('hashchange', loadPage);
$(document).ready(initialize);
