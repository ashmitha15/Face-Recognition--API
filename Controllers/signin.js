
const handleSignIn = (req,res,db,bcrypt) => {
   const {email,password} = req.body;
   if(!email || !password){ //to validate if user doesnt enter any credentials
      return res.status(400).json("Invalid submission")
   }
   db.select('email','hash').from('login')
   .where('email','=',email)
   .then(data => {
     const isValid = bcrypt.compareSync(password,data[0].hash);
     if(isValid){
      db.select('*').from('users')
      .where('email','=',email)
      .then(user =>{
         res.json(user[0]) //res.json converts the data into json and sends it to the front end
       })
      .catch(err => res.status(400).json("unable to request the user"))
     } else{
      res.status(400).json('password doesnt exist')
     }
   })
   .catch(err => res.status(400).json("wrong credentials"))

}

module.exports = {
      handleSignIn: handleSignIn
   }