export function isLoggedIn() {
  try {
    const authData = JSON.parse(localStorage.getItem("auth_data")); 
    return authData?.userInfo ? true : false;
  } catch (err) {
    return false; 
  }
}

// Usage
if (isLoggedIn()) {
  console.log("User is logged in");
} else {
  console.log("User is not logged in");
}

// Optional: get current user
export function getCurrentUser() {
  const authData = JSON.parse(localStorage.getItem("auth_data") || "{}");
  console.log('authDataauthDataauthData',authData)
  return authData.userInfo || null;
}