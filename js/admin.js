(function () {
  'use strict';

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
    if (!el) return;
    el.textContent = msg;
    el.className = 'admin-status ' + (success ? 'admin-status--success' : 'admin-status--error');
  }

  function showLoginError(msg) {
    if (!loginError) return;
    loginError.textContent = msg;
    loginError.classList.add('admin-login__error--visible');
  }

  function authHeaders() {
    return { 'Authorization': 'Bearer ' + token };
  }

  // ── Eye toggle ──
  if (toggleEye && loginPassword) {
    toggleEye.addEventListener('click', function () {
      var isPassword = loginPassword.type === 'password';
      loginPassword.type = isPassword ? 'text' : 'password';
      var eyeOpen = toggleEye.querySelector('.eye-open');
      var eyeClosed = toggleEye.querySelector('.eye-closed');
      if (eyeOpen) eyeOpen.style.display = isPassword ? 'none' : '';
      if (eyeClosed) eyeClosed.style.display = isPassword ? '' : 'none';
      loginPassword.focus();
    });
  }

  // ── Auth ──
  function showDashboard() {
    if (loginScreen) loginScreen.hidden = true;
    if (dashboard) dashboard.hidden = false;
    loadConfig();
  }

  if (token) {
    showDashboard();
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (loginError) loginError.classList.remove('admin-login__error--visible');

      var btn = loginForm.querySelector('.admin-login__btn');
      if (btn) {
        btn.textContent = 'Signing in...';
        btn.disabled = true;
      }

      var pw = loginPassword ? loginPassword.value : '';

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/admin-auth', true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.timeout = 15000;

      xhr.onload = function () {
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
        try {
          var data = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && data.token) {
            token = data.token;
            sessionStorage.setItem('admin_token', token);
            showDashboard();
          } else {
            showLoginError(data.error || 'Invalid password.');
            if (loginPassword) { loginPassword.value = ''; loginPassword.focus(); }
          }
        } catch (parseErr) {
          showLoginError('Bad response (status ' + xhr.status + ')');
        }
      };

      xhr.onerror = function () {
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
        showLoginError('Network error — could not reach server.');
      };

      xhr.ontimeout = function () {
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
        showLoginError('Request timed out.');
      };

      xhr.send(JSON.stringify({ password: pw }));
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      sessionStorage.removeItem('admin_token');
      token = null;
      if (loginScreen) loginScreen.hidden = false;
      if (dashboard) dashboard.hidden = true;
      if (loginPassword) { loginPassword.value = ''; loginPassword.focus(); }
    });
  }

  // ── Config ──
  function loadConfig() {
    fetch('/api/get-config')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (protectionToggle) protectionToggle.checked = data.protectionEnabled !== false;
      })
      .catch(function () { /* keep defaults */ });
  }

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', function () {
      var body = {
        protectionEnabled: protectionToggle ? protectionToggle.checked : true
      };
      if (csPassword && csPassword.value.trim()) {
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
            if (csPassword) csPassword.value = '';
          } else {
            showStatus(configStatus, res.data.error || 'Failed to save.', false);
          }
        })
        .catch(function () {
          showStatus(configStatus, 'Network error.', false);
        });
    });
  }

  // ── Resume Upload ──
  var selectedFile = null;

  if (resumeFile) {
    resumeFile.addEventListener('change', function () {
      if (resumeFile.files.length > 0) {
        selectedFile = resumeFile.files[0];
        if (uploadText) uploadText.textContent = selectedFile.name;
        if (uploadResumeBtn) uploadResumeBtn.disabled = false;
      }
    });
  }

  if (uploadArea) {
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
          if (uploadText) uploadText.textContent = file.name;
          if (uploadResumeBtn) uploadResumeBtn.disabled = false;
        } else {
          showStatus(resumeStatus, 'Only PDF files are accepted.', false);
        }
      }
    });
  }

  if (uploadResumeBtn) {
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
            if (uploadText) uploadText.textContent = 'Choose PDF or drag here';
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
  }
})();
