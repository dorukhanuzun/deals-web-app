// INSTRUCTIONS:
/*
  Create a new resource controller that uses the
  User as an associative collection (examples):
  - User -> Books
  - User -> Reservation

  The resource controller must contain the 7 resource actions:
  - index
  - show
  - new
  - create
  - edit
  - update
  - delete
*/

const viewPath = 'deals';
const Deal = require('../models/Deal');
const User = require('../models/User');

exports.index = async (req, res) => {
  try {
    const deals = await Deal
      .find()
      .populate('user')
      .sort({createdAt: 'desc'});

    res.render(`${viewPath}/index`, {
      pageTitle: 'Deals',
      deals: deals
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying hot deals: ${error}`);
    res.redirect('/');
  }
};

exports.show = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id)
      .populate('user');
    res.render(`${viewPath}/show`, {
      pageTitle: deal.title,
      deal: deal
    });
  } catch (error) {
    req.flash('danger', `There was an error displaying this deal: ${error}`);
    res.redirect('/');
  }
};

exports.new = (req, res) => {
  res.render(`${viewPath}/new`, {
    pageTitle: 'New Deal'
  });
};

exports.create = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});
    const deal = await Deal.create({user: user._id, ...req.body});

    req.flash('success', 'Deal created successfully');
    res.redirect(`/deals/${deal.id}`);
  } catch (error) {
    req.flash('danger', `There was an error creating this deal: ${error}`);
    req.session.formData = req.body;
    res.redirect('/deals/new');
  }
};

exports.edit = async (req, res) => {
  try {
    const deal = await Deal.findById(req.params.id);
    res.render(`${viewPath}/edit`, {
      pageTitle: deal.title,
      formData: deal
    });
  } catch (error) {
    req.flash('danger', `There was an error accessing this deal: ${error}`);
    res.redirect('/');
  }
};

exports.update = async (req, res) => {
  try {
    const { user: email } = req.session.passport;
    const user = await User.findOne({email: email});

    let deal = await Deal.findById(req.body.id);
    if (!deal) throw new Error('Deal could not be found');

    const attributes = {user: user._id, ...req.body};
    await Deal.validate(attributes);
    await Deal.findByIdAndUpdate(attributes.id, attributes);

    req.flash('success', 'The deal was updated successfully');
    res.redirect(`/deals/${req.body.id}`);
  } catch (error) {
    req.flash('danger', `There was an error updating this deal: ${error}`);
    res.redirect(`/deals/${req.body.id}/edit`);
  }
};

exports.delete = async (req, res) => {
  try {
    console.log(req.body);
    await Deal.deleteOne({_id: req.body.id});
    req.flash('success', 'The deal was deleted successfully');
    res.redirect(`/deals`);
  } catch (error) {
    req.flash('danger', `There was an error deleting this deal: ${error}`);
    res.redirect(`/deals`);
  }
};