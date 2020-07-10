const { new: _new, index, show, create, edit, update, delete: _delete } = require('../controllers/DealsController');

function auth (req, res, next) {
  if (!req.isAuthenticated()) {
    req.flash('danger', 'You need to login first.');
    return res.redirect('/login');
  }
  next();
}

module.exports = router => {
  router.get('/deals', index); 
  router.get('/deals/new', auth, _new); 
  router.post('/deals', auth, create);  
  router.post('/deals/update', auth, update);  
  router.post('/deals/delete', auth, _delete);  
  router.get('/deals/:id/edit', auth, edit);  
  router.get('/deals/:id', show); 
};