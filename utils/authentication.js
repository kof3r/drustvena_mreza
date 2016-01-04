/**
 * Created by Gordan on 8.12.2015..
 */

module.exports = function (req, res, next) {
    if(req.isAuthenticated()) {
        next();
    } else {
        if(req.useragent.isAndroid) {
            res.status(403).end();
        } else {
            res.redirect('/');
        }
    }
};