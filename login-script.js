// 1. استيراد حزم Firebase Auth الأساسية عبر جافا سكريبت الوحدات (Modules)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 2. بيانات مشروعك الفعلي في Firebase الخاص بتطبيقك (arwadc)
const firebaseConfig = {
  apiKey: "AIzaSyChsqlxFqzsqHgl1KUlLyMwUnU0nFluw3w",
  authDomain: "arwadc.firebaseapp.com",
  databaseURL: "https://arwadc-default-rtdb.firebaseio.com",
  projectId: "arwadc",
  storageBucket: "arwadc.firebasestorage.app",
  messagingSenderId: "1015954026027",
  appId: "1:1015954026027:web:896434236d16f47856446e",
  measurementId: "G-00VXC791EV"
};

// تهيئة حزمة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// تهيئة وإدراج أيقونات فيذر آيكونز الأساسية في الصفحة فوراً عند البدء
feather.replace();

// جلب عناصر التبديل بين الواجهات وتأمين وجودها
const loginSection = document.getElementById('loginSection');
const registerSection = document.getElementById('registerSection');
const appMainContent = document.getElementById('appMainContent');

const toRegister = document.getElementById('toRegister');
const toLogin = document.getElementById('toLogin');

/* =======================================================
   ✨ نظام التنبيه المخصص والموحد مع إخفاء لوحة المفاتيح
======================================================= */
function showAlert(title, message) {
    if (document.activeElement && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
    }

    const alertOverlay = document.getElementById('customAlert');
    if (!alertOverlay) return;
    
    const alertTitle = alertOverlay.querySelector('.custom-alert-title');
    const alertMessage = document.getElementById('customAlertMessage');
    const alertBtn = document.getElementById('customAlertBtn');

    if (alertTitle && alertMessage) {
        alertTitle.innerText = title;
        alertMessage.innerText = message;
        alertOverlay.classList.remove('hidden');
        feather.replace(); 

        alertBtn.onclick = function() {
            alertOverlay.classList.add('hidden');
        };
    }
}

/* =======================================================
   🛡️ دالة التحقق الصارمة من الاتصال (تمنع أي تفاعل إذا انقطع الإنترنت)
======================================================= */
function isOffline() {
    if (!navigator.onLine) {
        showAlert('خطأ في الاتصال', 'لا يوجد اتصال بالإنترنت، لا يمكنك القيام بأي عملية حالياً. تحقق من الشبكة ثم أعد المحاولة.');
        return true;
    }
    return false;
}

function checkNetworkStatus() {
    if (!navigator.onLine) {
        showAlert('خطأ في الاتصال', 'لا يوجد اتصال بالإنترنت، يرجى التحقق من الشبكة وإعادة المحاولة.');
    }
}

window.addEventListener('DOMContentLoaded', checkNetworkStatus);
window.addEventListener('online', checkNetworkStatus);
window.addEventListener('offline', checkNetworkStatus);

/* =======================================================
   التبديل المستقر والآمن بين واجهتي الدخول والتسجيل
======================================================= */
if (toRegister) {
    toRegister.addEventListener('click', function(e) {
        e.preventDefault();
        if (isOffline()) return; 
        if (loginSection && registerSection) {
            loginSection.classList.add('hidden');
            registerSection.classList.remove('hidden');
            feather.replace(); 
        }
    });
}

if (toLogin) {
    toLogin.addEventListener('click', function(e) {
        e.preventDefault();
        if (isOffline()) return; 
        if (loginSection && registerSection) {
            registerSection.classList.add('hidden');
            loginSection.classList.remove('hidden');
            feather.replace(); 
        }
    });
}

/* =======================================================
   آلية عمل العين التفاعلية المستقرة (إظهار وإخفاء متبادل)
======================================================= */
const togglePasswordBtns = document.querySelectorAll('.toggle-password');

togglePasswordBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        if (isOffline()) return; 
        const passwordField = this.parentElement.querySelector('input');
        
        if (passwordField) {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
                this.setAttribute('data-feather', 'eye-off'); 
            } else {
                passwordField.type = 'password';
                this.setAttribute('data-feather', 'eye'); 
            }
            feather.replace(); 
        }
    });
});

/* =======================================================
   🔒 قواعد الفحص المتقدمة لسلامة كلمة المرور
======================================================= */
function checkPasswordError(password) {
    const allowedCharsRegex = /^[a-zA-Z0-9]+$/;
    
    if (!allowedCharsRegex.test(password)) {
        return 'يمنع استخدام الرموز، المسافات، الأحرف العربية، أو الحروف المزخرفة في كلمة المرور.';
    }
    if (password.length < 8 || password.length > 20) {
        return 'يجب أن يكون طول كلمة المرور بين 8 إلى 20 خانة.';
    }
    const digitsCount = (password.match(/\d/g) || []).length;
    if (digitsCount < 2) {
        return 'يجب أن تحتوي كلمة المرور على رقمين على الأقل.';
    }
    return null; 
}

// =======================================================
// 1. معالجة تسجيل الدخول الفعلي عبر Firebase Auth
// =======================================================
const submitLoginBtn = document.getElementById('submitLogin');
if (submitLoginBtn) {
    submitLoginBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        if (isOffline()) return; 
        
        try {
            if (!loginSection) return;
            const inputField = loginSection.querySelector('input[placeholder*="البريد"]');
            const passwordField = loginSection.querySelector('.password-field');
            
            if (!inputField || !passwordField) return;
            const value = inputField.value.trim();
            const password = passwordField.value;

            if (value === "" || password === "") {
                showAlert('تنبيه إدخال', 'رجاءً املئ الحقول جيدا.');
                return;
            }

            if (!value.toLowerCase().endsWith('@gmail.com')) {
                showAlert('تنبيه إدخال', 'الرجاء إدخال بريد إلكتروني ينتهي بـ @gmail.com إجبارياً للدخول.');
                return;
            }

            submitLoginBtn.innerText = "جاري التحقق...";
            submitLoginBtn.disabled = true;

            signInWithEmailAndPassword(auth, value, password)
                .then((userCredential) => {
                    // حفظ معلومات المستخدم في localStorage
                    const user = userCredential.user;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userName', user.displayName || 'مستخدم');
                    localStorage.setItem('userGender', 'غير محدد');
                    
                    window.location.replace('home.html');
                })
                .catch((error) => {
                    submitLoginBtn.innerText = "تسجيل الدخول";
                    submitLoginBtn.disabled = false;
                    
                    if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                        showAlert('خطأ في الدخول', 'البريد الإلكتروني أو كلمة المرور غير صحيحة.');
                    } else {
                        showAlert('خطأ', 'تعذر تسجيل الدخول، تأكد من جودة الشبكة.');
                    }
                });

        } catch (error) {
            showAlert('تنبيه', 'حدث خطأ داخلي في النظام.');
        }
    });
}

// =======================================================
// 2. معالجة إنشاء الحساب الفعلي عبر Firebase Auth
// =======================================================
const submitRegisterBtn = document.getElementById('submitRegister');
if (submitRegisterBtn) {
    submitRegisterBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        if (isOffline()) return; 
        
        try {
            if (!registerSection) return;
            const emailField = registerSection.querySelector('input[placeholder="البريد الإلكتروني"]');
            const passwordField = registerSection.querySelector('.password-field');
            const nameField = registerSection.querySelector('input[placeholder="الاسم الكامل"]');
            const genderField = registerSection.querySelector('input[name="gender"]:checked');
            
            if (!emailField || !passwordField || !nameField) {
                showAlert('تنبيه', 'حدث خطأ في العثور على الحقول في الصفحة.');
                return;
            }

            const emailValue = emailField.value.trim();
            const passwordValue = passwordField.value;
            const nameValue = nameField.value.trim();
            const genderValue = genderField ? genderField.value : 'غير محدد';

            if (emailValue === "" || passwordValue === "" || nameValue === "") {
                showAlert('تنبيه إدخال', 'رجاءً املئ الحقول جيدا.');
                return;
            }

            if (!emailValue.toLowerCase().endsWith('@gmail.com')) {
                showAlert('تنبيه إدخال', 'البريد الإلكتروني المكتوب غير صحيح، يجب أن ينتهي بـ @gmail.com إجبارياً.');
                return;
            }

            const passwordError = checkPasswordError(passwordValue);
            if (passwordError) {
                showAlert('تنبيه إدخال', passwordError);
                return;
            }

            submitRegisterBtn.innerText = "جاري إنشاء الحساب...";
            submitRegisterBtn.disabled = true;

            createUserWithEmailAndPassword(auth, emailValue, passwordValue)
                .then((userCredential) => {
                    // حفظ معلومات المستخدم في localStorage
                    const user = userCredential.user;
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userName', nameValue);
                    localStorage.setItem('userGender', genderValue);
                    
                    window.location.replace('home.html');
                })
                .catch((error) => {
                    submitRegisterBtn.innerText = "أنشأ حساب";
                    submitRegisterBtn.disabled = false;

                    if (error.code === 'auth/email-already-in-use') {
                        showAlert('تنبيه', 'هذا البريد الإلكتروني مسجل بالفعل بحساب آخر.');
                    } else {
                        showAlert('خطأ الفايربيس', error.message);
                    }
                });

        } catch (error) {
            showAlert('تنبيه', 'حدث خطأ غير متوقع.');
        }
    });
}