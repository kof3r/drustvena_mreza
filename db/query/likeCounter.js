/**
 * Created by Gordan on 5.1.2016..
 */

var knex = require('../../config/knex');

module.exports = function (contentQuery, user_id) {
    return contentQuery.leftJoin(likeDislikeOJ('likeDislikeOJ'), 'content.id', 'likeDislikeOJ.content_id')
        .leftJoin(likeDislikeOJ('iLikeDislikeOJ'), function() {
            this.on(knex.raw('content.id = iLikeDislikeOJ.content_id and ((likeDislikeOJ.liked = iLikeDislikeOJ.liked and iLikeDislikeOJ.liked = ?) or (likeDislikeOJ.disliked = iLikeDislikeOJ.disliked and iLikeDislikeOJ.disliked = ?))', [user_id, user_id]))
        })
        .count('likeDislikeOJ.liked as likes')
        .count('likeDislikeOJ.disliked as dislikes')
        .count('iLikeDislikeOJ.liked as iLike')
        .count('iLikeDislikeOJ.disliked as iDislike')
}

function likeDislikeOJ(alias) {
    return function() {
        this.union(function() {
            this.from('like')
                .joinRaw('left join dislike on like.content_id = dislike.content_id and like.user_id = dislike.user_id')
                .column('like.content_id', 'like.user_id as liked', 'dislike.user_id as disliked')
        }).union(function () {
            this.from('like')
                .joinRaw('right join dislike on like.content_id = dislike.content_id and like.user_id = dislike.user_id')
                .column('dislike.content_id', 'like.user_id as liked', 'dislike.user_id as disliked')
        }).as(alias);
    }
}