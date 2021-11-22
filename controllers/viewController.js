exports.getMain = (req, res, next) => {
  res.status(200).render('base', {
    title: 'Main page',
  });
};
