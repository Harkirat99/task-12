let { authUser } = require(baseDir() +"helper/helper");

module.exports = async(req, res, next) => {
  let session = await authUser(req);
  if(session==null){
      return res.status(400).send({ type:"RXERROR",message:"un-Authorised Token",code:401});
  }
  req.authUser=session;

  // Middleware Logics
  next();
};
