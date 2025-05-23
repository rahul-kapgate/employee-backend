import User from "../../models/User/User.model.js";
import bcrypt from "bcrypt";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  console.log("🔍 LOGIN ATTEMPT:");
  console.log("Email:", email);
  console.log("Password provided length:", password?.length);
  console.log("Password provided:", password); // REMOVE THIS IN PRODUCTION!
  
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ 
        message: "Invalid credentials: user not found",
        errorCode: "USER_NOT_FOUND"
      });
    }
    
    console.log("✅ User found in database:");
    console.log("DB User email:", user.email);
    console.log("DB User password length:", user.password?.length);
    console.log("DB User password starts with:", user.password?.substring(0, 10) + "...");
    console.log("DB User password is bcrypt hash?", user.password?.startsWith("$2b$"));
    
    // ✅ Compare plain text password with hashed password
    console.log("🔐 Comparing passwords...");
    console.log("Plain password:", password);
    console.log("Hashed password:", user.password);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("🔐 bcrypt.compare result:", isPasswordValid);
    
    if (!isPasswordValid) {
      console.log("❌ Password comparison failed");
      
      // Additional debugging - let's try manual verification
      console.log("🔍 Manual hash verification:");
      const manualHash = await bcrypt.hash(password, 10);
      console.log("Manual hash of provided password:", manualHash);
      
      return res.status(401).json({ 
        message: "Invalid credentials: password does not match",
        errorCode: "INVALID_PASSWORD"
      });
    }
    
    console.log("✅ Password comparison successful");
    
    res.status(200).json({ 
      message: "Login successful", 
      user: { 
        email: user.email, 
        username: user.username,
        fname: user.fname,
        lname: user.lname
      } 
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};