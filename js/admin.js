(function () {
  // ── Elements ──
  var loginScreen = document.getElementById('adminLogin');
  var dashboard = document.getElementById('adminDashboard');
  var loginForm = document.getElementById('loginForm');
  var loginPassword = document.getElementById('loginPassword');
  var loginError = document.getElementById('loginError');
  var logoutBtn = document.getElementById('logoutBtn');
  var toggleEye = document.getElementById('toggleEye');

  var protectionToggle = document.getElementById('protectionToggle');
  var csPassword = document.getElementById('csPassword');
  var saveConfigBtn = document.getElementById('saveConfigBtn');
  var configStatus = document.getElementById('configStatus');

  var resumeFile = document.getElementById('resumeFile');
  var uploadArea = document.getElementById('uploadArea');
  var uploadText = document.getElementById('uploadText');
  var uploadResumeBtn = document.getElementById('uploadResumeBtn');
  var resumeStatus = document.getElementById('resumeStatus');

  var token = sessionStorage.getItem('admin_token');

  // ── Helpers ──
  function showStatus(el, msg, success) {
    el.textContent = msg;
    el.className = 'admin-status ' + (success ? 'admin-status--success' : 'admin-status--error');
  }

  function showLoginError(msg) {
    loginError.textContent = msg;
    loginError.classList.add('admin-login__error--visible');
  }

  function authHeaders() {
    return { 'Authorization': 'Bearer ' + token };
  }

  // ── Eye toggle ──
  toggleEye.addEventListener('click', function () {
    var isPassword = loginPassword.type === 'password';
    loginPassword.type = isPassword ? 'text' : 'password';
    toggleEye.querySelector('.eye-open').style.display = isPassword ? 'none' : '';
    toggleEye.querySelector('.eye-closed').style.display = isPassword ? '' : 'none';
    loginPassword.focus();
  });

  // ── Auth ──
  function showDashboard() {
    loginScreen.hidden = true;
    dashboard.hidden = false;
    loadConfig();
  }

  if (token) {
    showDashboard();
  }

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    loginError.classList.remove('admin-login__error--visible');

    var btn = loginForm.querySelector('.admin-login__btn');
    btn.textContent = 'Signing in...';
    btn.disabled = true;

    fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: loginPassword.value })
    })
      .then(function (r) {
        return r.text().then(function (text) {
          try {
            var data = JSON.parse(text);
            return { ok: r.ok, status: r.status, data: data };
          } catch (e) {
            return { ok: false, status: r.status, data: { error: 'Server error (' + r.status + ')' } };
          }
        });
      })
      .then(function (res) {
        btn.textContent = 'Sign In';
        btn.disabled = false;
        if (res.ok && res.data.token) {
          token = res.data.token;
          sessionStorage.setItem('admin_token', token);
          showDashboard();
        } else {
          showLoginError(res.data.error || 'Invalid password.');
          loginPassword.value = '';
          loginPassword.focus();
        }
      })
      .catch(function (err) {
        btn.textContent = 'Sign In';
        btn.disabled = false;
        showLoginError('Connection failed. Check console.');
        console.error('Admin auth error:', err);
      });
  });

  logoutBtn.addEventListener('click', function () {
    sessionStorage.removeItem('admin_token');
    token = null;
    loginScreen.hidden = false;
    dashboard.hidden = true;
    loginPassword.value = '';
    loginPassword.focus();
  });

  // ── Config ──
  function loadConfig() {
    fetch('/api/get-config')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        protectionToggle.checked = data.protectionEnabled !== false;
      })
      .catch(function () { /* keep defaults */ });
  }

  saveConfigBtn.addEventListener('click', function () {
    var body = {
      protectionEnabled: protectionToggle.checked
    };
    if (csPassword.value.trim()) {
      body.csPassword = csPassword.value.trim();
    }

    fetch('/api/update-config', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, authHeaders()),
      body: JSON.stringify(body)
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (res.ok && res.data.success) {
          showStatus(configStatus, 'Settings saved.', true);
          csPassword.value = '';
        } else {
          showStatus(configStatus, res.data.error || 'Failed to save.', false);
        }
      })
      .catch(function () {
        showStatus(configStatus, 'Network error.', false);
      });
  });

  // ── Resume Upload ──
  var selectedFile = null;

  resumeFile.addEventListener('change', function () {
    if (resumeFile.files.length > 0) {
      selectedFile = resumeFile.files[0];
      uploadText.textContent = selectedFile.name;
      uploadResumeBtn.disabled = false;
    }
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', function (e) {
    e.preventDefault();
    uploadArea.classList.add('admin-upload--dragover');
  });

  uploadArea.addEventListener('dragleave', function () {
    uploadArea.classList.remove('admin-upload--dragover');
  });

  uploadArea.addEventListener('drop', function (e) {
    e.preventDefault();
    uploadArea.classList.remove('admin-upload--dragover');
    if (e.dataTransfer.files.length > 0) {
      var file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        selectedFile = file;
        uploadText.textContent = file.name;
        uploadResumeBtn.disabled = false;
      } else {
        showStatus(resumeStatus, 'Only PDF files are accepted.', false);
      }
    }
  });

  uploadResumeBtn.addEventListener('click', function () {
    if (!selectedFile) return;

    uploadResumeBtn.disabled = true;
    showStatus(resumeStatus, 'Uploading...', true);

    fetch('/api/upload-resume', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/pdf' }, authHeaders()),
      body: selectedFile
    })
      .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, data: d }; }); })
      .then(function (res) {
        if (res.ok && res.data.success) {
          showStatus(resumeStatus, 'Resume uploaded successfully.', true);
          selectedFile = null;
          uploadText.textContent = 'Choose PDF or drag here';
          uploadResumeBtn.disabled = true;
        } else {
          showStatus(resumeStatus, res.data.error || 'Upload failed.', false);
          uploadResumeBtn.disabled = false;
        }
      })
      .catch(function () {
        showStatus(resumeStatus, 'Network error.', false);
        uploadResumeBtn.disabled = false;
      });
  });
})();
