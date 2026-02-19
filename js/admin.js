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

  // ── XHR Helper ──
  function apiCall(method, url, body, headers, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.timeout = 15000;

    if (headers) {
      Object.keys(headers).forEach(function (k) {
        xhr.setRequestHeader(k, headers[k]);
      });
    }

    xhr.onload = function () {
      try {
        var data = JSON.parse(xhr.responseText);
        callback(null, xhr.status, data);
      } catch (e) {
        callback(null, xhr.status, { error: 'Bad response' });
      }
    };
    xhr.onerror = function () { callback('Network error'); };
    xhr.ontimeout = function () { callback('Request timed out'); };

    if (body && typeof body === 'object' && !(body instanceof File)) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(body));
    } else {
      xhr.send(body || null);
    }
  }

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
      if (btn) { btn.textContent = 'Signing in...'; btn.disabled = true; }

      apiCall('POST', '/api/admin-auth', { password: loginPassword ? loginPassword.value : '' }, null, function (err, status, data) {
        if (btn) { btn.textContent = 'Sign In'; btn.disabled = false; }
        if (err) return showLoginError(err);
        if (status === 200 && data.token) {
          token = data.token;
          sessionStorage.setItem('admin_token', token);
          showDashboard();
        } else {
          showLoginError(data.error || 'Invalid password.');
          if (loginPassword) { loginPassword.value = ''; loginPassword.focus(); }
        }
      });
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
    apiCall('GET', '/api/get-config', null, null, function (err, status, data) {
      if (!err && data) {
        if (protectionToggle) protectionToggle.checked = data.protectionEnabled !== false;
      }
    });
  }

  if (saveConfigBtn) {
    saveConfigBtn.addEventListener('click', function () {
      var body = {
        protectionEnabled: protectionToggle ? protectionToggle.checked : true
      };
      if (csPassword && csPassword.value.trim()) {
        body.csPassword = csPassword.value.trim();
      }

      saveConfigBtn.disabled = true;
      showStatus(configStatus, 'Saving...', true);

      apiCall('POST', '/api/update-config', body, { 'Authorization': 'Bearer ' + token }, function (err, status, data) {
        saveConfigBtn.disabled = false;
        if (err) return showStatus(configStatus, err, false);
        if (status === 200 && data.success) {
          showStatus(configStatus, 'Settings saved.', true);
          if (csPassword) csPassword.value = '';
        } else {
          showStatus(configStatus, data.error || 'Failed to save.', false);
        }
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

      var xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/upload-resume', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', 'application/pdf');
      xhr.timeout = 60000;

      xhr.onload = function () {
        try {
          var data = JSON.parse(xhr.responseText);
          if (xhr.status === 200 && data.success) {
            showStatus(resumeStatus, 'Resume uploaded successfully.', true);
            selectedFile = null;
            if (uploadText) uploadText.textContent = 'Choose PDF or drag here';
            uploadResumeBtn.disabled = true;
          } else {
            showStatus(resumeStatus, data.error || 'Upload failed.', false);
            uploadResumeBtn.disabled = false;
          }
        } catch (e) {
          showStatus(resumeStatus, 'Bad response (status ' + xhr.status + ')', false);
          uploadResumeBtn.disabled = false;
        }
      };
      xhr.onerror = function () { showStatus(resumeStatus, 'Network error.', false); uploadResumeBtn.disabled = false; };
      xhr.ontimeout = function () { showStatus(resumeStatus, 'Upload timed out.', false); uploadResumeBtn.disabled = false; };

      xhr.send(selectedFile);
    });
  }
})();
