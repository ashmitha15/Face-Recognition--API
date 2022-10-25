
const handleRegister = (req,res,db,bcrypt) => {
   const {name,email,password} = req.body;
   if(!name || !email || !password){ //to validate if user doesnt enter any credentials
      return res.status(400).json("Invalid submission")
   }
   const hash = bcrypt.hashSync(password);
   db.transaction(trx => {     //trans to be in sysnc with login and users table
      trx.insert({
        hash: hash,
         email: email
      })
      .into('login')
      .returning('email')
      .then(loginEmail => {
         return trx('users')  //inorder to do a trasnaction use trx instead of db
            .returning('*') // instead of doing another select statement and grabbing the inserted datas
             .insert({      //data to be inserted
               name: name,
               email: loginEmail[0].email,
               joinedon: new Date()
             })
             .then(users => {
                res.json(users[0]);  // to respond with the registered user alone from the user's table
             })
      })
      .then(trx.commit)
      .catch(trx.rollback)
   })
   .catch(err => res.status(400).json('Unable to register. User already exists'))

   }	

   module.exports = {
      handleRegister: handleRegister
   }