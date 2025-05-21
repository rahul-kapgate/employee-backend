import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { fname, lname, mobile, password } = req.body;

    if (!fname || !lname || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Mobile number already registered" });
    }

    // Generate username like: test_user_03_98
    const processedFname = fname.toLowerCase().trim().replace(/\s+/g, "_"); // spaces → underscores

    let usernameBase = `${processedFname}`;

    // Ensure uniqueness by appending random digits if exists
    let username = usernameBase;
    while (await User.findOne({ username })) {
      username = `${usernameBase}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname,
      lname,
      mobile,
      username,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        username: newUser.username,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Server error" });
  }
};
