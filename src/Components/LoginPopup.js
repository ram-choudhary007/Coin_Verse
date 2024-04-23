import React, { useState } from 'react';
import { auth, googleProvider } from './config/firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from './config/firebase';

// Function to create a new document with initial wallet structure
const createWalletDocument = async (userId) => {
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, {
      wallet: {
        availableAmount: 500.00,
        amountInvested: 0.00,
        fundTransferDetails: [],
      },
    });                 // or this will also work->  }, { merge: true });
  };

  
const LoginPopup = ({ setIsPopupOpen, isLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState(null);
    const [isResetPassword, setIsResetPassword] = useState(false);

    const signIn = async (e) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("User logged in successfully");
            setIsPopupOpen(false);
        } catch (error) {
            setError(error.message);
            console.error('Error signing in:', error.message);
        }
    };

    const signUp = async (e) => {
        e.preventDefault();

        // Check if any input field is empty
        if (!name || !email || !password) {
            setError("Please fill all fields");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update user's profile to set the displayName
            await updateProfile(user, {
                displayName: name
            });

            console.log("User signed up successfully");
            // Create a new document for the user's wallet in the database  
            await createWalletDocument(user.uid);
            setIsPopupOpen(false);
        } catch (error) {
            setError(error.message);
            console.error('Error signing up:', error.message);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setIsResetPassword(false);
            setPassword('');
            setError(`Password reset email sent successfully`); // Clear any previous error
            console.log("Password reset email sent successfully");
            // Optionally, you can provide feedback to the user here
        } catch (error) {
            setError(error.message);
            console.error('Error sending password reset email:', error.message);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User logged in successfully");
    
            // Check if the user's wallet document already exists
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);
    
            // If the document does not exist, create a new wallet document
            if (!docSnap.exists()) {
                await createWalletDocument(user.uid);
                console.log("Wallet document created successfully");
            } else {
                console.log("User already has a wallet document");
            }
        } catch (error) {
            setError(error.message);
            console.error('Error signing in with Google:', error.message);
        }
        setIsPopupOpen(false);
    };
    

    return (
        <div className="loginPopup">
            <div className="loginBox">
                <div className="Log_close_Btn">
                    <button onClick={() => setIsPopupOpen(false)}>close</button>
                </div>
                {isLogin ? (
                    <div className='LoginPage'>
                        <h2>Log In</h2>
                        <br />
                        {isResetPassword ? (
                            // Password reset form
                            <div>
                                <div className="label">Email Address</div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <br />
                                <button className='submit_btn' onClick={handleForgotPassword}>Reset Password</button>
                                <br />
                                <button className='back_btn' onClick={()=>setIsResetPassword(false)}>Back</button>
                            </div>
                        ) : (
                            // Login form
                            <form onSubmit={signIn}>
                                <div className="label">Email Address</div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <div className="label">Password</div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <br />
                                <button className='forgot_password_btn' onClick={() => setIsResetPassword(true)}>Forgot password</button>
                                <br />
                                <b style={{ color: "red" }}>{error}</b>
                                <br />
                                <button className='submit_btn' type="submit">Log In</button>
                            </form>
                        )}
                    </div>
                ) : (
                    <>
                        <h2>Sign Up</h2>
                        <br />
                        <form onSubmit={signUp}>
                            <div className="label">Name</div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <div className="label">Email Address</div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <div className="label">Password</div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br />
                            <b style={{ color: "red" }}>{error}</b>
                            <br />
                            <button className='submit_btn' type="submit">Create Account</button>
                        </form>
                    </>
                )}
                <br />
                <p>or</p>
                <br />
                <button className='gooleLoginBtn' onClick={handleGoogleSignIn}>Continue with Google</button>
            </div>
        </div>
    );
};

export default LoginPopup;
