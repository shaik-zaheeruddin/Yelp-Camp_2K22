const User = require('../models/user')
module.exports.index = function (req, res) {
    res.render('users/register')
}
module.exports.update = async function (req, res, next) {
    try {
        const { username, password, email } = req.body
        const newUser = new User({
            email,
            username
        })
        const regUser = await User.register(newUser, password)
        req.logIn(regUser, e => {
            if (e) return next(e)
            console.log(regUser)
            req.flash('success', 'registration compleated')
            res.redirect('/campgrounds')
        })

    }
    catch (error) {
        req.flash('error', error.message)
        res.redirect('/register')
    }

}
module.exports.loginForm = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!!')
    const url = req.session.lastUrl || '/campgrounds'
    delete req.session.lastUrl
    res.redirect(url)
}
module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'see you next time!!')
    res.redirect('/campgrounds')
}