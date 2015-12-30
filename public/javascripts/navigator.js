var globalUserId = document.getElementById('global-user-id').innerHTML;
var globalUsername = document.getElementById('global-username').innerHTML;
var dateTimeFormat = 'dd/mm/yyyy HH:MM';
//var globalUserId = document.getElementById('global-user-id').innerHTML;

function loadPartial(name, callback) {
	$.get('/partial/' + name, function(response) {
		$('#main-content').html(response);
		if (callback) {
      callback();
    }
	});
}

function loadFeed(url, element) {

	$.get(url, function(data) {
		$.each(data.contents, function() {
      if(this.content_type_id == 1) {
        this.content = escapeHtml(this.content);
        this.content = BBC2HTML(this.content);
      }
			var dt = Date.parse(this.created_at);
			this.created_at = dateFormat(dt, dateTimeFormat);
			dt = Date.parse(this.updated_at);
			this.updated_at = dateFormat(dt, dateTimeFormat);
		});
		var templateFunction = doT.template(document.getElementById('feed-tmp').text);
		var html = templateFunction( data );
		document.getElementById(element).innerHTML = html;
		initializeFeedInteractivity();
	});

}

function renderTemplate(url, template, element, callback) {
	
	$.get(url, function(data) {
		var templateFunction = doT.template(document.getElementById(template).text);
		document.getElementById(element).innerHTML = templateFunction(data);
	});
	if(callback) { callback(); }
	
}

function signOut() {
	document.getElementById('sign-out-form').submit();
}

function initializeImagePopups() {
  $('.image-popup-no-margins').magnificPopup({
    type: 'image',
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });
}

function initializeToolsTips() {
	$(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
  });
}

function initializeAjaxPopup() {
	$('.popup-ajax').magnificPopup({
		type: 'ajax'
	});
}

function initialize() {
	$.get('/api/content/myBubbles', function(data) {
		var templateFunction = doT.template(document.getElementById('my-bubbles-tmp').text  );
		var html = templateFunction(data);
		$('#my-bubbles').html(html);
	});
	
	initializeAjaxPopup();
	
	$(document).ready(function(){
      $('[data-toggle="tooltip"]').tooltip();
  });
}

function initializeFeedInteractivity() {
  initializeImagePopups();
  initializeVideos();
  initializeToolsTips();
	initializeAjaxPopup();
}

function clearSearchResults() {
	var sr = document.getElementById('search-results');
	sr.style='display:none';
	sr.innerHTML = '';
	document.getElementById('search-term').value = "";
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
		
		$.get('/api/search?query='+ st.val(), function (data, status) {
			sr.html('<li class="dropdown-header"><span class="glyphicon glyphicon-user"> Contacts<li><li role="separator" class="divider"></li>');
			$.each(data.users, function() {
				itemLi = document.createElement('li');
				itemA = document.createElement('a');
				itemA.href = '/profile/'+ this.username +'/view';
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

// hide search results when click outside happens
$(document).click(function(event) { 
    if(!$(event.target).closest('#search-results').length) {
        if($('#search-results').css('display') == 'block') {
            clearSearchResults();
        }
    }        
})

function toggleOpinion(opinion, content_id) {
	$.post('/api/content/' + opinion + '/' + content_id, function() {
    var postIdn = '#post-' + content_id;
		var btn = $(postIdn + ' .actions .' + opinion);
		
		var statsIdn = postIdn + ' > .header > .stats';
		var karma = $(statsIdn + ' > .karma');
		
		if(btn.hasClass('active')) {
			btn.removeClass('active');
			
      if(opinion == 'like') {
        var likes = $(statsIdn + ' > .likes')
        likes.html(parseInt(likes.html()) - 1);
        karma.html(parseInt(karma.html()) - 1);
      }
      else if(opinion == 'dislike') {
        var dislikes = $(statsIdn + ' > .dislikes');
        dislikes.html(parseInt(dislikes.html()) - 1);
        karma.html(parseInt(karma.html()) + 1);
      }
		}
		else {
			btn.addClass('active');
			
      if(opinion == 'like') {
        var likes = $(statsIdn + ' > .likes')
        likes.html(parseInt(likes.html()) + 1);
        karma.html(parseInt(karma.html()) + 1);
      }
      else if(opinion == 'dislike') {
        var dislikes = $(statsIdn + ' > .dislikes');
        dislikes.html(parseInt(dislikes.html()) + 1);
        karma.html(parseInt(karma.html()) - 1);
      }
		}
      
	});
}

function whoLikes(content_id) {
    $('body').css('cursor', 'progress');
    $.get('/api/content/likes/' + content_id, function(data) {
        var txt = '';
        $.each(data.users, function() {
            if (this.first_name) txt += this.first_name + ' ';
            if (this.middle_name) txt += this.middle_name + ' ';
            if (this.last_name) txt += this.last_name + ' ';
            txt += '(' + this.username + ')\r\n';
        });
        $('#post-' + content_id + ' .stats .likes').attr('title', txt).tooltip('fixTitle').tooltip('show');
        $('body').css('cursor', 'auto');
    });
    
}

function loadComments(content_id) {
	if (content_id) {
		$('#post-' + content_id + ' .actions .comment').addClass('active');
		var cmtbtn = $('#post-' + content_id + ' .actions .comment span');
		cmtbtn.removeClass('glyphicon-comment');
		cmtbtn.addClass('gly-spin glyphicon-refresh');
        $('body').css('cursor', 'progress');

		$.get('/api/content/comments/' + content_id, function (data) {
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
            $('body').css('cursor', 'auto');
		});
	}
}

function postComment(content_id) {
	
	var comment = $('#post-' + content_id + ' > .comments > div > textarea');
	if(comment.val().length) {
		var pbtn = $('#post-' + content_id + ' > .comments > div > button');
		pbtn.attr('disabled', 'disabled');
		pbtn.html('Posting... <span class="glyphicon glyphicon-refresh gly-spin"></span>');
        $('body').css('cursor', 'progress');
		
		$.post('/api/content/comment/' + content_id, {content_id: content_id, comment: comment.val()}, function (data) {
		
		pbtn.html('Post');
		pbtn.removeAttr('disabled');
		loadComments(content_id);
		comment.val('');
        $('body').css('cursor', 'auto');
		});
	}
	else {
		comment.focus();
	}
}

function editComment(comment_id) {
	var commentIdn = '#comment-' + comment_id;
	
	if($(commentIdn).children().length == 0) {
		var commentTxt = $(commentIdn).html();
		$(commentIdn).html('<textarea>' + commentTxt + '</textarea>');
		var editor = $(commentIdn + ' textarea');
		editor.select();
		$(commentIdn).keypress(function(e) {
			if(e.which == 13) {
				var newCommentTxt = editor.val();
                $('body').css('cursor', 'progress');
				$.post('/api/comment/edit/' + comment_id, {comment: newCommentTxt }, function() {
					$(commentIdn).html(newCommentTxt);
                    $('body').css('cursor', 'auto');
				});
			}
		});
	}
	else {
		$(commentIdn + ' > textarea').select();
	}
}

function removeComment(comment_id) {
    $('body').css('cursor', 'progress');
	$.post('/api/comment/delete/' + comment_id, function() {
		$('#comment-' + comment_id).parent().hide(200);
        $('body').css('cursor', 'auto');
	});
}

function removeContent(content_id) {
  if(confirm('Are you sure you want to remove the selected content?')) {
    var url = '/api/content/delete/' + content_id;
    $('body').css('cursor', 'progress');
    $.post(url, function() {
        $('#post-' + content_id).hide(250);
        $('body').css('cursor', 'auto');
    });
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

function contactRequest(id, callback) {
    $.post('/api/user/contactRequest', {user_id: id}, function() {
        if(callback) { callback(); }
    });
}

function escapeHtml(unsafe) {
    if (!unsafe) { return; }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function navigate(menuClass) {
    $('#main-content').html('<div class="preloader"></div>');
    $('body').removeClass();
    $('body').addClass(menuClass);
}

page('/homepage', function(){
    loadFeed('/api/home/feed', 'main-content');
    navigate('homepage');
});

page('/bubble/:id/', function(context) {
  loadFeed('/api/bubble/' + context.params.id + '/content', 'main-content');
  navigate('bubbles');
});

page('/image/edit/', function(context) {
	loadPartial('edit-image/');
  navigate('new');
});

page('/image/edit/:id', function(context) {
  loadPartial('edit-image/' + context.params.id);
  navigate('profile');
});

page('/messages', function(){
  loadPartial('messages');
    navigate('messages');
});

page('/messages/:username', function(context){
  loadPartial('messages?username=' + context.params.username);
});

page('/content/new/:type', function(context){
	var type = context.params.type;
	loadPartial('new-content', function() {
		$('#new-content-category-' + type).attr('checked', 'checked');
	});
  navigate('new');
});
page('/content/:type/:id/edit', function(context){
	var type = context.params.type;
	loadPartial('edit-content/' + context.params.id, function() {
		$('#new-content-category-' + type).attr('checked', 'checked');
	});
    navigate('new');
});

page('/profile/view', function() {
	loadPartial('view-profile');
  navigate('profile');
});

page('/profile/:id/view', function(context) {
	loadPartial('view-profile/' + context.params.id);
});

page('/profile/edit', function() {
	loadPartial('edit-profile');
  navigate('profile');
});

page('/account/manage', function() {
	loadPartial('manage-account');
  navigate('profile');
});

page('/sign-out', function() {
	signOut();
});

page('/*', function(){
  loadPartial('404');
});

page.start();

$(document).ready(initialize);
