const User = require('../Models/userModel');

//Fetching users using query
const fetchUsers = async (req, res) => {
  const keyword = req.query.search && {
    //or method from mongodb will perform both of the tasks
    $or: [
      //Serching name with the keyword
      { name: { $regex: req.query.search, $options: 'i' } },
      //Serching email with the keyword
      { email: { $regex: req.query.search, $options: 'i' } },
    ],
  };

  //using find method to search user from databse
  //first fing method will find the users searched for and the second find mehtod will not display the user that is already logged in
   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
   res.send(users);
};

module.exports = { fetchUsers };
