// ═══════════════════════════════════════════════════════
//  1. تهيئة وإعداد الربط بـ Appwrite
// ═══════════════════════════════════════════════════════
const { Client, Storage, ID } = Appwrite;

const client = new Client();
client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('6a29dd0a001d12f59a5d');           

const appwriteStorage = new Storage(client);
const BUCKET_ID = 'arakom'; 

// ═══════════════════════════════════════════════════════
//  2. دالة رفع الملفات الأساسية (معدلة)
// ═══════════════════════════════════════════════════════
async function uploadFileToAppwrite(fileObject) {
  try {
    const response = await appwriteStorage.createFile(
      BUCKET_ID,
      ID.unique(),
      fileObject
    );
    return `https://fra.cloudappwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=6a29dd0a001d12f59a5d`;
  } catch (error) {
    console.error("❌ خطأ في الرفع:", error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════
//  3. دالة رفع صورة الملف الشخصي (معدلة)
// ═══════════════════════════════════════════════════════
async function uploadProfileImage(fileObject) {
  try {
    const response = await appwriteStorage.createFile(
      BUCKET_ID,
      ID.unique(),
      fileObject
    );
    const imageUrl = `https://fra.cloudappwrite.io/v1/storage/buckets/${BUCKET_ID}/files/${response.$id}/view?project=6a29dd0a001d12f59a5d`;
    
    // حفظ رابط الصورة في localStorage
    localStorage.setItem('profileImage', imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("❌ خطأ في رفع الصورة:", error.message);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════
//  4. إدارة واجهات التبويب والتحكم بالحقن (شريط التنقل)
// ═══════════════════════════════════════════════════════

function switchTab(tabName) {
  const container = document.getElementById('mainContainer');
  if (!container) return;

  const tabs = {
    home: "الرئيسية",
    feed: "المنشورات",
    rooms: "الغرف",
    chats: "المحادثات",
    me: "حسابي"
  };
  
  // عرض محتوى التبويب الرئيسي
  if (tabName === 'home') {
    container.innerHTML = `
      <div style="padding:30px; text-align:center; color:var(--text);">
        <div style="background:var(--card); border-radius:16px; padding:30px; border:1px solid var(--border);">
          <h2 style="color:var(--primary); font-size:22px; margin-bottom:20px;">
            🏠 مرحباً بك في التطبيق
          </h2>
          <p style="color:var(--muted); font-size:16px; margin-bottom:25px;">
            تم ربط Appwrite بنجاح 👌
          </p>
          <button onclick="diagnosticTest()" style="background:var(--primary); color:white; border:none; padding:10px 25px; border-radius:8px; cursor:pointer; font-family:'Tajawal',sans-serif; font-size:14px;">
            🔍 تشغيل الاختبار التشخيصي
          </button>
        </div>
      </div>
    `;
  } else if (tabName === 'me') {
    // عرض معلومات المستخدم بنفس التصميم
    showUserProfile(container);
  } else {
    container.innerHTML = `<div style="padding:40px; text-align:center; color:var(--text); font-weight:bold;">تبويب ${tabs[tabName] || tabName} فارغ حالياً</div>`;
  }
}

// ═══════════════════════════════════════════════════════
//  5. عرض معلومات المستخدم مع جميع التفاعلات (معدل - إصدار بسيط)
// ═══════════════════════════════════════════════════════

function showUserProfile(container) {
  // جلب معلومات المستخدم من localStorage
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  const userName = localStorage.getItem('userName') || 'مستخدم';
  const userGender = localStorage.getItem('userGender') || 'غير محدد';
  const profileImage = localStorage.getItem('profileImage') || '';
  
  console.log('📸 صورة الملف الشخصي:', profileImage);
  
  // الحرف الأول من الاسم للصورة (في حال عدم وجود صورة)
  const firstLetter = userName.charAt(0).toUpperCase();
  
  // بناء الصورة - استخدام طريقة بسيطة ومباشرة
  let imageHtml = '';
  if (profileImage && profileImage.trim() !== '') {
    imageHtml = `
      <div style="position:relative; width:100px; height:100px; cursor:pointer;" onclick="document.getElementById('profileImageInput').click()">
        <img src="${profileImage}" 
             style="width:100px; height:100px; border-radius:50%; object-fit:cover; border:2px solid var(--border);"
             onerror="this.style.display='none'; this.parentElement.innerHTML='<div style=\\'width:100px; height:100px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-size:42px; color:white; border:2px solid var(--border);\\'>${firstLetter}</div>'">
        <div style="position:absolute; bottom:2px; right:2px; width:20px; height:20px; border-radius:50%; background:var(--success); border:2px solid var(--bg2);"></div>
      </div>
    `;
  } else {
    imageHtml = `
      <div style="position:relative; width:100px; height:100px; cursor:pointer;" onclick="document.getElementById('profileImageInput').click()">
        <div style="width:100px; height:100px; border-radius:50%; background:var(--primary); display:flex; align-items:center; justify-content:center; font-size:42px; color:white; border:2px solid var(--border);">
          ${firstLetter}
        </div>
        <div style="position:absolute; bottom:2px; right:2px; width:20px; height:20px; border-radius:50%; background:var(--success); border:2px solid var(--bg2);"></div>
      </div>
    `;
  }
  
  // عرض الصفحة كاملة
  container.innerHTML = `
    <div style="padding:0; color:var(--text);">
      
      <!-- رأس الصفحة مع عنوان "حسابي" -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:15px 20px; background:var(--bg2); border-bottom:1px solid var(--border);">
        <div style="width:40px; height:40px; border-radius:50%; border:1px solid var(--border); display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="showSettings()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h2 style="color:var(--text); font-size:18px; font-weight:bold;">حسابي</h2>
        <div style="width:40px;"></div>
      </div>
      
      <!-- صورة البروفايل مع إمكانية التغيير -->
      <div style="padding:30px 20px 20px; display:flex; flex-direction:column; align-items:center; background:var(--bg);">
        ${imageHtml}
        <p style="color:var(--muted); font-size:12px; margin-top:5px; cursor:pointer;" onclick="document.getElementById('profileImageInput').click()">
          📷 اضغط لتغيير الصورة
        </p>
        <input type="file" id="profileImageInput" accept="image/*" style="display:none;" onchange="handleProfileImageUpload(event)">
      </div>
      
      <!-- الأزرار الثلاثة (خروج، تغيير، منشور) -->
      <div style="display:flex; gap:10px; padding:0 20px 15px; background:var(--bg);">
        <button onclick="logoutUser()" style="flex:1; background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:8px 0; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; color:var(--text); font-family:'Tajawal',sans-serif;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span style="font-size:11px; font-weight:600;">خروج</span>
        </button>
        
        <button onclick="editProfile()" style="flex:1; background:var(--bg3); border:1px solid var(--border); border-radius:12px; padding:8px 0; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; color:var(--text); font-family:'Tajawal',sans-serif;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          <span style="font-size:11px; font-weight:600;">تغيير</span>
        </button>
        
        <button onclick="createPost()" style="flex:1; background:var(--primary); border:none; border-radius:12px; padding:8px 0; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; color:white; font-family:'Tajawal',sans-serif;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
          <span style="font-size:11px; font-weight:600;">منشور</span>
        </button>
      </div>
      
      <!-- اسم المستخدم والبريد -->
      <div style="padding:0 20px 10px; background:var(--bg); text-align:right;">
        <h3 style="color:var(--text); font-size:18px; font-weight:bold; margin-bottom:2px;">${userName}</h3>
        <p style="color:var(--muted); font-size:13px;">${userEmail}</p>
      </div>
      
      <!-- صف الإحصائيات (منشور، إعجاب، تعليق، غرفة) -->
      <div style="display:flex; background:var(--bg2); border-top:1px solid var(--border); border-bottom:1px solid var(--border);">
        <div style="flex:1; text-align:center; padding:15px 0; border-left:1px solid var(--border);">
          <p style="font-size:18px; font-weight:bold; color:var(--primary);">0</p>
          <p style="font-size:11px; color:var(--muted);">منشور</p>
        </div>
        <div style="flex:1; text-align:center; padding:15px 0; border-left:1px solid var(--border);">
          <p style="font-size:18px; font-weight:bold; color:var(--primary);">0</p>
          <p style="font-size:11px; color:var(--muted);">إعجاب</p>
        </div>
        <div style="flex:1; text-align:center; padding:15px 0; border-left:1px solid var(--border);">
          <p style="font-size:18px; font-weight:bold; color:var(--primary);">0</p>
          <p style="font-size:11px; color:var(--muted);">تعليق</p>
        </div>
        <div style="flex:1; text-align:center; padding:15px 0;">
          <p style="font-size:18px; font-weight:bold; color:var(--primary);">0</p>
          <p style="font-size:11px; color:var(--muted);">غرفة</p>
        </div>
      </div>
      
      <!-- التبويبات (منشوراتي، أعجبني، غرفي) -->
      <div style="display:flex; background:var(--bg);">
        <div style="flex:1; text-align:center; padding:15px 0; border-bottom:2px solid var(--primary); cursor:pointer;" onclick="showMyPosts()">
          <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            <span style="font-size:13px; font-weight:600; color:var(--primary);">منشوراتي</span>
          </div>
        </div>
        <div style="flex:1; text-align:center; padding:15px 0; cursor:pointer;" onclick="showLikedPosts()">
          <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span style="font-size:13px; font-weight:600; color:var(--muted);">أعجبني</span>
          </div>
        </div>
        <div style="flex:1; text-align:center; padding:15px 0; cursor:pointer;" onclick="showMyRooms()">
          <div style="display:flex; align-items:center; justify-content:center; gap:5px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>
            <span style="font-size:13px; font-weight:600; color:var(--muted);">غرفي</span>
          </div>
        </div>
      </div>
      
    </div>
  `;
}

// ═══════════════════════════════════════════════════════
//  6. تفاعلات الأزرار
// ═══════════════════════════════════════════════════════

// عرض الإعدادات
function showSettings() {
  alert('⚙️ الإعدادات - قريباً');
}

// تعديل الملف الشخصي
function editProfile() {
  const userName = localStorage.getItem('userName') || 'مستخدم';
  const newName = prompt('أدخل الاسم الجديد:', userName);
  if (newName && newName.trim() !== '') {
    localStorage.setItem('userName', newName.trim());
    // إعادة عرض الملف الشخصي
    const container = document.getElementById('mainContainer');
    showUserProfile(container);
  }
}

// إنشاء منشور جديد
function createPost() {
  const content = prompt('اكتب منشورك الجديد:');
  if (content && content.trim() !== '') {
    alert('✅ تم نشر المنشور بنجاح!');
    // هنا يمكن إضافة كود حفظ المنشور في Appwrite
  }
}

// عرض منشوراتي
function showMyPosts() {
  const container = document.getElementById('mainContainer');
  const postsSection = container.querySelector('#postsSection');
  if (postsSection) {
    postsSection.innerHTML = `
      <div style="background:var(--card); padding:30px; text-align:center; border-bottom:1px solid var(--border);">
        <p style="color:var(--muted); font-size:14px;">📄 منشوراتي - قريباً</p>
      </div>
    `;
  }
}

// عرض الإعجابات
function showLikedPosts() {
  const container = document.getElementById('mainContainer');
  const postsSection = container.querySelector('#postsSection');
  if (postsSection) {
    postsSection.innerHTML = `
      <div style="background:var(--card); padding:30px; text-align:center; border-bottom:1px solid var(--border);">
        <p style="color:var(--muted); font-size:14px;">❤️ المنشورات التي أعجبتني - قريباً</p>
      </div>
    `;
  }
}

// عرض غرفي
function showMyRooms() {
  const container = document.getElementById('mainContainer');
  const postsSection = container.querySelector('#postsSection');
  if (postsSection) {
    postsSection.innerHTML = `
      <div style="background:var(--card); padding:30px; text-align:center; border-bottom:1px solid var(--border);">
        <p style="color:var(--muted); font-size:14px;">🏠 غرفي - قريباً</p>
      </div>
    `;
  }
}

// تفعيل الإعجاب
function toggleLike(element) {
  const countSpan = element.querySelector('span');
  let count = parseInt(countSpan.textContent);
  const icon = element.querySelector('svg');
  
  if (icon.getAttribute('fill') === 'var(--primary)') {
    // إزالة الإعجاب
    icon.setAttribute('fill', 'none');
    icon.setAttribute('stroke', 'var(--muted)');
    countSpan.textContent = count - 1;
  } else {
    // إضافة إعجاب
    icon.setAttribute('fill', 'var(--primary)');
    icon.setAttribute('stroke', 'var(--primary)');
    countSpan.textContent = count + 1;
  }
}

// تفعيل التعليق
function toggleComment(element) {
  const comment = prompt('اكتب تعليقك:');
  if (comment && comment.trim() !== '') {
    const countSpan = element.querySelector('span');
    let count = parseInt(countSpan.textContent);
    countSpan.textContent = count + 1;
    alert('✅ تم إضافة تعليقك بنجاح!');
  }
}

// مشاركة المنشور
function sharePost(element) {
  const postContent = 'مرحباً! هذه أول منشوراتي في التطبيق.';
  if (navigator.share) {
    navigator.share({
      title: 'منشور من تطبيق المجتمع',
      text: postContent,
    }).catch(() => {});
  } else {
    // نسخ النص إلى الحافظة
    navigator.clipboard.writeText(postContent).then(() => {
      alert('✅ تم نسخ المنشور للمشاركة!');
    }).catch(() => {
      alert('📋 انسخ هذا النص: ' + postContent);
    });
  }
}

// ═══════════════════════════════════════════════════════
//  7. دالة معالجة رفع صورة الملف الشخصي (معدلة)
// ═══════════════════════════════════════════════════════

async function handleProfileImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // التحقق من نوع الملف
  if (!file.type.startsWith('image/')) {
    alert('يرجى اختيار صورة فقط');
    return;
  }
  
  // التحقق من حجم الملف (حد أقصى 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 5MB');
    return;
  }
  
  try {
    // عرض مؤشر التحميل
    const container = document.getElementById('mainContainer');
    if (!container) {
      alert('خطأ: عنصر mainContainer غير موجود');
      return;
    }
    
    container.innerHTML = `
      <div style="padding:30px; text-align:center; color:var(--text);">
        <div style="background:var(--card); border-radius:16px; padding:30px; border:1px solid var(--border);">
          <h2 style="color:var(--primary); font-size:22px; margin-bottom:20px;">
            🔄 جاري رفع الصورة...
          </h2>
          <div style="margin:20px auto; width:40px; height:40px; border:4px solid var(--border); border-top:4px solid var(--primary); border-radius:50%; animation:spin 1s linear infinite;"></div>
        </div>
      </div>
    `;
    
    // رفع الصورة إلى Appwrite
    const imageUrl = await uploadProfileImage(file);
    
    // التحقق من أن الرابط صحيح
    if (imageUrl && imageUrl.trim() !== '') {
      // حفظ الرابط في localStorage
      localStorage.setItem('profileImage', imageUrl);
      console.log('✅ تم حفظ الصورة:', imageUrl);
      
      // إعادة تحميل الصفحة لضمان ظهور الصورة
      alert('✅ تم رفع الصورة بنجاح! سيتم تحديث الصفحة.');
      window.location.reload();
      
    } else {
      throw new Error('الرابط غير صحيح');
    }
    
  } catch (error) {
    console.error('❌ خطأ في رفع الصورة:', error);
    alert('حدث خطأ أثناء رفع الصورة: ' + error.message);
  }
}

// ═══════════════════════════════════════════════════════
//  8. دالة تسجيل الخروج
// ═══════════════════════════════════════════════════════

function logoutUser() {
  if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userGender');
    localStorage.removeItem('profileImage');
    window.location.replace('login.html');
  }
}

// دالة تفعيل مستمعات الضغط على الأزرار بشكل مباشر ودقيق
function initNavigationSystem() {
  const navButtons = document.querySelectorAll('.nav-i');
  
  if (navButtons.length === 0) {
    setTimeout(initNavigationSystem, 100);
    return;
  }

  navButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();

      // 1. إزالة كلاس النشاط 'on' من كل الأزرار
      navButtons.forEach(btn => btn.classList.remove('on'));
      
      // 2. إضافة كلاس النشاط للزر الحالي الذي ضغطت عليه
      this.classList.add('on');
      
      // 3. جلب اسم التبويب وتفعيله داخل الشاشة
      const targetTab = this.getAttribute('data-t');
      if (targetTab) {
        switchTab(targetTab);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════
//  9. تشغيل النظام عند تحميل الصفحة
// ═══════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', function() {
  initNavigationSystem();
  switchTab('home');
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initNavigationSystem();
  switchTab('home');
}

// ═══════════════════════════════════════════════════════
//  10. اختبار تشخيصي كامل لتحديد المشكلة
// ═══════════════════════════════════════════════════════

async function diagnosticTest() {
  console.log('🔍 بدء الاختبار التشخيصي...');
  const container = document.getElementById('mainContainer');
  
  let results = '';
  let allPassed = true;
  
  // اختبار 1: التحقق من وجود Appwrite
  results += '📌 اختبار 1: التحقق من وجود Appwrite... ';
  if (typeof Appwrite !== 'undefined') {
    results += '✅ موجود\n';
    console.log('✅ Appwrite موجود');
  } else {
    results += '❌ غير موجود\n';
    allPassed = false;
    console.error('❌ Appwrite غير موجود');
  }
  
  // اختبار 2: التحقق من اتصال Appwrite
  results += '📌 اختبار 2: التحقق من اتصال Appwrite... ';
  try {
    const testFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    const response = await appwriteStorage.createFile(BUCKET_ID, ID.unique(), testFile);
    results += `✅ متصل (File ID: ${response.$id})\n`;
    console.log('✅ Appwrite متصل');
    
    // حذف الملف التجريبي
    try {
      await appwriteStorage.deleteFile(BUCKET_ID, response.$id);
      console.log('✅ تم حذف الملف التجريبي');
    } catch (e) {
      console.warn('⚠️ لم يتم حذف الملف التجريبي:', e.message);
    }
  } catch (error) {
    results += `❌ فشل: ${error.message}\n`;
    allPassed = false;
    console.error('❌ فشل اتصال Appwrite:', error);
  }
  
  // اختبار 3: التحقق من وجود صورة في localStorage
  results += '📌 اختبار 3: التحقق من وجود صورة في localStorage... ';
  const profileImage = localStorage.getItem('profileImage');
  if (profileImage) {
    results += `✅ موجود (${profileImage.substring(0, 50)}...)\n`;
    console.log('✅ صورة موجودة في localStorage:', profileImage);
  } else {
    results += '❌ غير موجود\n';
    allPassed = false;
    console.error('❌ لا توجد صورة في localStorage');
  }
  
  // اختبار 4: التحقق من صحة رابط الصورة
  results += '📌 اختبار 4: التحقق من صحة رابط الصورة... ';
  if (profileImage) {
    try {
      const response = await fetch(profileImage, { method: 'HEAD' });
      if (response.ok) {
        results += '✅ رابط صحيح\n';
        console.log('✅ رابط الصورة صحيح');
      } else {
        results += `❌ رابط غير صحيح (HTTP ${response.status})\n`;
        allPassed = false;
        console.error('❌ رابط الصورة غير صحيح:', response.status);
      }
    } catch (error) {
      results += `❌ فشل التحقق: ${error.message}\n`;
      allPassed = false;
      console.error('❌ فشل التحقق من الرابط:', error);
    }
  } else {
    results += '⚠️ لا يمكن التحقق (لا توجد صورة)\n';
  }
  
  // اختبار 5: التحقق من عرض الصورة في DOM
  results += '📌 اختبار 5: التحقق من عرض الصورة في DOM... ';
  const imgElement = document.querySelector('#mainContainer img');
  if (imgElement) {
    results += '✅ موجود\n';
    console.log('✅ عنصر الصورة موجود في DOM');
    
    // التحقق من تحميل الصورة
    if (imgElement.complete) {
      if (imgElement.naturalWidth > 0) {
        results += '   ✅ الصورة محملة بنجاح\n';
        console.log('✅ الصورة محملة بنجاح');
      } else {
        results += '   ❌ الصورة لم تحمل\n';
        allPassed = false;
        console.error('❌ الصورة لم تحمل');
      }
    } else {
      results += '   ⚠️ الصورة لا تزال قيد التحميل\n';
    }
  } else {
    results += '❌ غير موجود\n';
    allPassed = false;
    console.error('❌ عنصر الصورة غير موجود في DOM');
  }
  
  // عرض النتائج
  container.innerHTML = `
    <div style="padding:20px; color:var(--text);">
      <div style="background:var(--card); border-radius:16px; padding:20px; border:1px solid var(--border);">
        <h2 style="color:${allPassed ? 'var(--success)' : 'var(--danger)'}; font-size:20px; margin-bottom:15px;">
          ${allPassed ? '✅ جميع الاختبارات ناجحة!' : '❌ يوجد مشاكل في التوصيل'}
        </h2>
        <pre style="background:var(--bg3); padding:15px; border-radius:8px; font-size:13px; line-height:1.6; white-space:pre-wrap; direction:ltr; text-align:left;">
${results}
        </pre>
        <div style="margin-top:15px; display:flex; gap:10px; justify-content:center;">
          <button onclick="switchTab('me')" style="background:var(--primary); color:white; border:none; padding:8px 20px; border-radius:8px; cursor:pointer; font-family:'Tajawal',sans-serif;">
            🔄 العودة للملف الشخصي
          </button>
          <button onclick="diagnosticTest()" style="background:var(--bg3); border:1px solid var(--border); padding:8px 20px; border-radius:8px; cursor:pointer; font-family:'Tajawal',sans-serif; color:var(--text);">
            🔄 إعادة الاختبار
          </button>
        </div>
      </div>
    </div>
  `;
  
  return { allPassed, results };
}
