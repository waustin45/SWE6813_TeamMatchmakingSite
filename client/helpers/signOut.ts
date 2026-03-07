const signOut = async () => {
    const res = await fetch('/api/auth/profile/signout', {
        method: 'POST'
    });
    if (res.ok) {
        
        window.location.href='/'; // Redirect to homepage or login page after sign-out
        // Handle successful sign-out (e.g., clear user state)
    }
}

export default signOut;