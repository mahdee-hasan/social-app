const validate = (email, password, name, showName) => {
  const newErrors = {};
  if (showName) {
    if (!name.trim()) newErrors.displayName = "Name is required";
  }

  if (!email.includes("@")) newErrors.email = "Please enter a valid email";

  // 🔹 custom password validation
  if (password.length < 8)
    newErrors.password = "Password must be at least 8 characters";
  else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(password))
    newErrors.password = "Must contain at least one letter and number";

  return newErrors;
};
export default validate;
