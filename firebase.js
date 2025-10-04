const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', handleRegister);
}

const googleLoginBtn = document.getElementById('googleLogin');
if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', handleGoogleLogin);
}

const googleRegisterBtn = document.getElementById('googleRegister');
if (googleRegisterBtn) {
    googleRegisterBtn.addEventListener('click', handleGoogleLogin);
}

const forgotPasswordLink = document.getElementById('forgotPassword');
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', handleForgotPassword);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    showMessage('Iniciando sesión...', 'info');
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            if (remember) {
                localStorage.setItem('orionix_user', JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    uid: user.uid
                }));
            }
            
            showMessage('Sesión iniciada correctamente', 'success');
            setTimeout(() => {
                window.location.href = 'index22.html';
            }, 1000);
        })
        .catch((error) => {
            console.error('Error:', error);
            let message = 'Error al iniciar sesión';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    message = 'No existe una cuenta con este correo';
                    break;
                case 'auth/wrong-password':
                    message = 'Contraseña incorrecta';
                    break;
                case 'auth/invalid-email':
                    message = 'Correo electrónico inválido';
                    break;
                case 'auth/user-disabled':
                    message = 'Esta cuenta ha sido deshabilitada';
                    break;
                case 'auth/too-many-requests':
                    message = 'Demasiados intentos. Intenta más tarde';
                    break;
                case 'auth/invalid-credential':
                    message = 'Credenciales inválidas. Verifica tu email y contraseña';
                    break;
                default:
                    message = 'Error: ' + error.message;
            }
            
            showMessage(message, 'error');
        });
}

function handleRegister(e) {
    e.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    if (!fullname || !email || !password || !confirmPassword) {
        showMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Las contraseñas no coinciden', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('La contraseña debe tener al menos 8 caracteres', 'error');
        return;
    }
    
    if (!terms) {
        showMessage('Debes aceptar los términos y condiciones', 'error');
        return;
    }
    
    showMessage('Creando cuenta...', 'info');
    
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            
            return updateProfile(user, {
                displayName: fullname
            });
        })
        .then(() => {
            showMessage('Cuenta creada exitosamente', 'success');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        })
        .catch((error) => {
            console.error('Error:', error);
            let message = 'Error al crear cuenta';
            
            switch(error.code) {
                case 'auth/email-already-in-use':
                    message = 'Este correo ya está registrado';
                    break;
                case 'auth/invalid-email':
                    message = 'Correo electrónico inválido';
                    break;
                case 'auth/weak-password':
                    message = 'La contraseña es muy débil';
                    break;
                case 'auth/operation-not-allowed':
                    message = 'Operación no permitida. Contacta al administrador';
                    break;
                default:
                    message = 'Error: ' + error.message;
            }
            
            showMessage(message, 'error');
        });
}

function handleGoogleLogin(e) {
    e.preventDefault();
    
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    
    showMessage('Conectando con Google...', 'info');
    
    signInWithPopup(auth, provider)
        .then((result) => {
            const user = result.user;
            
            localStorage.setItem('orionix_user', JSON.stringify({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                uid: user.uid
            }));
            
            showMessage('Sesión iniciada con Google', 'success');
            setTimeout(() => {
                window.location.href = 'index22.html';
            }, 1000);
        })
        .catch((error) => {
            console.error('Error:', error);
            let message = 'Error al conectar con Google';
            
            switch(error.code) {
                case 'auth/popup-closed-by-user':
                    message = 'Ventana cerrada. Intenta nuevamente';
                    break;
                case 'auth/popup-blocked':
                    message = 'Las ventanas emergentes están bloqueadas';
                    break;
                case 'auth/cancelled-popup-request':
                    message = 'Operación cancelada';
                    break;
                case 'auth/account-exists-with-different-credential':
                    message = 'Ya existe una cuenta con este correo';
                    break;
                default:
                    message = 'Error: ' + error.message;
            }
            
            showMessage(message, 'error');
        });
}

function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('Ingresa tu correo electrónico primero', 'error');
        return;
    }
    
    showMessage('Enviando correo de recuperación...', 'info');
    
    sendPasswordResetEmail(auth, email)
        .then(() => {
            showMessage('Correo de recuperación enviado. Revisa tu bandeja de entrada', 'success');
        })
        .catch((error) => {
            console.error('Error:', error);
            let message = 'Error al enviar correo';
            
            switch(error.code) {
                case 'auth/user-not-found':
                    message = 'No existe una cuenta con este correo';
                    break;
                case 'auth/invalid-email':
                    message = 'Correo electrónico inválido';
                    break;
                default:
                    message = 'Error: ' + error.message;
            }
            
            showMessage(message, 'error');
        });
}

function showMessage(message, type) {
    const existingMessage = document.querySelector('.notification-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `notification-message ${type}`;
    messageDiv.textContent = message;
    
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6'
    };
    
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: white;
        padding: 16px 24px;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
        font-size: 14px;
        font-weight: 500;
        max-width: 350px;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 4000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);