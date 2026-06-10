// تشغيل وتجهيز الأيقونات لشاشة التنبيه المخصصة فوراً
feather.replace();

const splashBox = document.getElementById('splashBox');
const alertOverlay = document.getElementById('customAlert');
const retryBtn = document.getElementById('customAlertBtn');

function checkConnection() {
    if (navigator.onLine) {
        // إذا كان يوجد إنترنت: نخفي التنبيه تماماً ونبقي الشعار ظاهراً
        if (alertOverlay) {
            alertOverlay.classList.add('hidden');
        }
        if (splashBox) {
            splashBox.classList.remove('hidden');
        }

        // الانتظار لمدة ثانيتين (2000 مللي ثانية) ثم التوجيه الذكي الصارم
        setTimeout(function() {
            // فحص حالة المستخدم: هل يملك جلسة دخول نشطة؟
            const isUserLoggedIn = localStorage.getItem('isLoggedIn');
            
            if (isUserLoggedIn === 'true') {
                window.location.replace('home.html');
            } else {
                window.location.replace('login.html');
            }
        }, 2000);

    } else {
        // إذا كان لا يوجد إنترنت: نظهر التنبيه المخصص فوراً
        if (alertOverlay) {
            alertOverlay.classList.remove('hidden');
            feather.replace(); 
        }
    }
}

// الفحص الفوري والمباشر للشبكة والحالة بمجرد فتح التطبيق
checkConnection();

// عند الضغط على زر "إعادة المحاولة" داخل التنبيه
if (retryBtn) {
    retryBtn.addEventListener('click', function() {
        retryBtn.innerText = "جاري الفحص...";
        retryBtn.disabled = true;

        setTimeout(function() {
            retryBtn.innerText = "إعادة المحاولة";
            retryBtn.disabled = false;
            checkConnection();
        }, 1000);
    });
}
