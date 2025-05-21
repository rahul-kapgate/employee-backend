import User from "../../models/User/User.model.js";

export const createUser  = async (req, res) => {
    try {
        const { fname, lname, mobile, password } = req.body;
       //validation
        if(!fname || !lname || !mobile || !password){
            return res.status(400).json({ message: "All fields are required" });
        }

        //check if user already exists
        const existingUser = await User.findOne({mobile});
        if(existingUser){
            return res
              .status(400)
              .json({ message: "Mobile number already registered" });
        }

        //create new user
        const newUser = new User({fname, lname, mobile, password});
        await newUser.save();

        res
          .status(201)
          .json({ message: "User created successfully", user: newUser });

    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Server error" });
    }
}