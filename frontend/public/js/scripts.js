
async function registerUser() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Password pattern check
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordPattern.test(password)) {
        alert('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one special character, and one number.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email, password })
        });

        if (response.ok) {
            alert('Registration successful!');
            document.getElementById('registrationForm').reset();
        } else {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while registering');
    }
}



async function loginUser() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            alert('Successfully logged in!');
            document.getElementById('loginForm').reset();
            window.location.reload(); // Refresh the page after successful login
        } else {
            const errorData = await response.json();
            alert(`Invalid credentials: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while logging in');
    }
}

// Attach the loginUser function to the login form
document.getElementById('loginForm').onsubmit = function(event) {
    event.preventDefault(); // Prevent form submission
    loginUser();
};



// OTP Functionality

async function sendOtp() {
    const email = document.getElementById('email').value;
    const response = await fetch(`/api/forgotpassword?email=${email}`, { method: 'GET' });

    const data = await response.json();
    if (data.message) {
        document.getElementById('message').innerText = data.message;

        // Show OTP section if email exists
        if (data.status === 'success') {
            document.getElementById('otpSection').style.display = 'block';
        }
    }
}

async function verifyOtp() {
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;

    const response = await fetch(`/api/verifyotp`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    document.getElementById('otpMessage').innerText = data.message;

    // Show new password section if OTP is verified
    if (data.status === 'verified') {
        document.getElementById('newPasswordSection').style.display = 'block';
    }
}

async function resetPassword() {
    const email = document.getElementById('email').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate new password
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
        document.getElementById('message').innerText = 'Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character.';
        return;
    }

    if (newPassword !== confirmPassword) {
        document.getElementById('message').innerText = 'Passwords do not match.';
        return;
    }

    try {
        const response = await fetch(`/api/resetpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, newPassword }),
        });

        const data = await response.json();
        document.getElementById('message').innerText = data.message;

        // Check if password update was successful
        if (data.message === 'Password updated successfully.') {
            // Wait for 2 seconds before showing the popup
            setTimeout(() => {
                // Show confirmation popup
                if (confirm('Password updated successfully. Click OK to go back to the login page.')) {
                    window.location.href = '/login';
                }
            }, 1000);
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').innerText = 'An error occurred while resetting the password.';
    }
}