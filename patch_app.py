import re
with open(r'D:\CODE\pingpang\apps\admin\src\App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace script variables
content = re.sub(
    r'const token = ref\(getStoredAdminToken\(\) \|\| DEFAULT_ADMIN_TOKEN\);',
    'const username = ref("");\nconst password = ref("");\nconst token = ref(getStoredAdminToken() || DEFAULT_ADMIN_TOKEN);',
    content
)

# Replace saveTokenAndReload function
new_func = """async function saveTokenAndReload() {
  savingToken.value = true;
  try {
    const res = await api.value.login({ username: username.value, password: password.value });
    token.value = res.token;
    saveAdminToken(token.value);
    await loadDashboard();
  } catch (e) {
    errorMessage.value = '登录失败，请检查账号密码';
    token.value = '';
    saveAdminToken('');
  } finally {
    savingToken.value = false;
  }
}"""
content = re.sub(r'function saveTokenAndReload\(\) \{.*?(?=\n  function switchTab)', new_func + "\n", content, flags=re.DOTALL)

# Replace HTML template
old_html = """      <form class="token-card" @submit.prevent="saveTokenAndReload">
        <label for="admin-token">后台访问令牌</label>
        <div class="token-row">
          <input id="admin-token" v-model="token" type="password" autocomplete="off" />
          <button type="submit" :disabled="savingToken">
            {{ savingToken ? '保存中' : '保存并刷新' }}
          </button>
        </div>
        <p>本地开发默认令牌为 dev-admin-token，生产环境请配置 ADMIN_TOKEN。</p>
      </form>"""
      
new_html = """      <form class="token-card" @submit.prevent="saveTokenAndReload">
        <div style="margin-bottom: 12px;">
          <label for="admin-username">账号</label>
          <input id="admin-username" v-model="username" type="text" autocomplete="off" class="auth-input" />
        </div>
        <div style="margin-bottom: 12px;">
          <label for="admin-password">密码</label>
          <input id="admin-password" v-model="password" type="password" autocomplete="off" class="auth-input" />
        </div>
        <div class="token-row">
          <button type="submit" :disabled="savingToken" style="width: 100%;">
            {{ savingToken ? '登录中' : '登录' }}
          </button>
        </div>
      </form>"""
content = content.replace(old_html, new_html)

# Add .auth-input styles
styles = """
.auth-input {
  width: 100%;
  padding: 10px;
  border: 1px solid rgba(29, 52, 39, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
}
"""
content = content + styles

with open(r'D:\CODE\pingpang\apps\admin\src\App.vue', 'w', encoding='utf-8') as f:
    f.write(content)
