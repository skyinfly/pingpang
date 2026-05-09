<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  AdminMatchRow,
  AdminSummary,
  AdminUserRow,
  AdminVenueRow,
  createAdminApiClient,
  resolveAdminApiBaseUrl,
} from './services/admin-api';
import { DEFAULT_ADMIN_TOKEN, getStoredAdminToken, saveAdminToken } from './services/admin-token';

type TabKey = 'matches' | 'users' | 'venues';
type EditorState = {
  resource: TabKey;
  id?: string;
};

const token = ref(getStoredAdminToken() || DEFAULT_ADMIN_TOKEN);
const activeTab = ref<TabKey>('matches');
const loading = ref(true);
const savingToken = ref(false);
const savingEditor = ref(false);
const errorMessage = ref('');
const summary = ref<AdminSummary | null>(null);
const matches = ref<AdminMatchRow[]>([]);
const users = ref<AdminUserRow[]>([]);
const venues = ref<AdminVenueRow[]>([]);
const editor = ref<EditorState | null>(null);
const form = ref<Record<string, string | number | boolean>>({});

const api = computed(() =>
  createAdminApiClient({
    baseUrl: resolveAdminApiBaseUrl(),
    tokenProvider: () => token.value,
  }),
);

const metricCards = computed(() => [
  { label: '用户总数', value: summary.value?.users ?? 0, hint: '已注册球友' },
  { label: '球局总数', value: summary.value?.matches ?? 0, hint: '全部约球记录' },
  { label: '待审核报名', value: summary.value?.pendingApplications ?? 0, hint: '需要主理人处理' },
  { label: '活跃球馆', value: summary.value?.activeVenues ?? 0, hint: '可被用户选择' },
  { label: '未读消息', value: summary.value?.unreadMessages ?? 0, hint: '站内通知与聊天' },
  { label: '评价数量', value: summary.value?.reviews ?? 0, hint: '信用体系样本' },
]);

async function loadDashboard() {
  loading.value = true;
  errorMessage.value = '';

  try {
    const [summaryPayload, matchPayload, userPayload, venuePayload] = await Promise.all([
      api.value.getSummary(),
      api.value.listMatches(),
      api.value.listUsers(),
      api.value.listVenues(),
    ]);

    summary.value = summaryPayload;
    matches.value = matchPayload.items;
    users.value = userPayload.items;
    venues.value = venuePayload.items;
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '后台数据请求失败，请稍后重试';
  } finally {
    loading.value = false;
  }
}

async function refreshSummary() {
  try {
    summary.value = await api.value.getSummary();
  } catch {
    // Keep table edits visible even if the metric refresh fails.
  }
}

function saveTokenAndReload() {
  savingToken.value = true;
  saveAdminToken(token.value);
  void loadDashboard().finally(() => {
    savingToken.value = false;
  });
}

function switchTab(tab: TabKey) {
  activeTab.value = tab;
  editor.value = null;
  form.value = {};
}

function openCreate(resource: TabKey) {
  editor.value = { resource };

  if (resource === 'venues') {
    form.value = { name: '', city: '上海', district: '', distanceKm: 0, isActive: true };
    return;
  }

  if (resource === 'users') {
    form.value = { phone: '', nickname: '', city: '上海', level: 'intermediate', creditScore: 100 };
    return;
  }

  form.value = {
    title: '',
    hostUserId: users.value[0]?.id ?? '',
    venueId: venues.value[0]?.id ?? '',
    courtId: '',
    slotId: '',
    level: 'intermediate',
    maxPlayers: 4,
  };
}

function openEdit(resource: TabKey, row: AdminMatchRow | AdminUserRow | AdminVenueRow) {
  editor.value = { resource, id: row.id };

  if (resource === 'venues') {
    const venue = row as AdminVenueRow;
    form.value = {
      name: venue.name,
      city: venue.city,
      district: venue.district ?? '',
      distanceKm: venue.distanceKm,
      isActive: venue.isActive,
    };
    return;
  }

  if (resource === 'users') {
    const user = row as AdminUserRow;
    form.value = {
      phone: user.phone,
      nickname: user.nickname,
      city: user.city,
      level: user.level,
      creditScore: user.creditScore,
    };
    return;
  }

  const match = row as AdminMatchRow;
  form.value = {
    title: match.title,
    level: match.level,
    maxPlayers: match.maxPlayers,
  };
}

function closeEditor() {
  editor.value = null;
  form.value = {};
}

function upsertById<T extends { id: string }>(rows: T[], item: T) {
  const index = rows.findIndex((row) => row.id === item.id);

  if (index >= 0) {
    rows.splice(index, 1, item);
    return;
  }

  rows.unshift(item);
}

function stringField(key: string) {
  return String(form.value[key] ?? '').trim();
}

function numberField(key: string) {
  return Number(form.value[key] ?? 0);
}

async function saveEditor() {
  if (!editor.value) {
    return;
  }

  savingEditor.value = true;
  errorMessage.value = '';

  try {
    if (editor.value.resource === 'venues') {
      const payload = {
        name: stringField('name'),
        city: stringField('city'),
        district: stringField('district'),
        distanceKm: numberField('distanceKm'),
        isActive: Boolean(form.value.isActive),
      };
      const saved = editor.value.id
        ? await api.value.updateVenue(editor.value.id, payload)
        : await api.value.createVenue(payload);
      upsertById(venues.value, saved);
    }

    if (editor.value.resource === 'users') {
      const payload = {
        phone: stringField('phone'),
        nickname: stringField('nickname'),
        city: stringField('city'),
        level: stringField('level'),
        creditScore: numberField('creditScore'),
      };
      const saved = editor.value.id
        ? await api.value.updateUser(editor.value.id, payload)
        : await api.value.createUser(payload);
      upsertById(users.value, saved);
    }

    if (editor.value.resource === 'matches') {
      const payload = {
        title: stringField('title'),
        hostUserId: stringField('hostUserId'),
        venueId: stringField('venueId'),
        courtId: stringField('courtId'),
        slotId: stringField('slotId'),
        level: stringField('level'),
        maxPlayers: numberField('maxPlayers'),
      };
      const saved = editor.value.id
        ? await api.value.updateMatch(editor.value.id, {
            title: payload.title,
            level: payload.level,
            maxPlayers: payload.maxPlayers,
          })
        : await api.value.createMatch(payload);
      upsertById(matches.value, saved);
    }

    closeEditor();
    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '保存失败，请检查填写内容';
  } finally {
    savingEditor.value = false;
  }
}

async function deleteRow(resource: TabKey, id: string) {
  errorMessage.value = '';

  try {
    if (resource === 'venues') {
      await api.value.deleteVenue(id);
      venues.value = venues.value.filter((item) => item.id !== id);
    }

    if (resource === 'users') {
      await api.value.deleteUser(id);
      users.value = users.value.filter((item) => item.id !== id);
    }

    if (resource === 'matches') {
      await api.value.deleteMatch(id);
      matches.value = matches.value.filter((item) => item.id !== id);
    }

    void refreshSummary();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '删除失败，该数据可能仍有关联记录';
  }
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

onMounted(() => {
  saveAdminToken(token.value);
  void loadDashboard();
});
</script>

<template>
  <main class="admin-shell">
    <section class="hero">
      <div>
        <p class="eyebrow">运营后台</p>
        <h1>Pingpang 后台管理</h1>
        <p class="hero-copy">集中管理球局、用户和球馆数据，让运营操作真正闭环。</p>
      </div>

      <form class="token-card" @submit.prevent="saveTokenAndReload">
        <label for="admin-token">后台访问令牌</label>
        <div class="token-row">
          <input id="admin-token" v-model="token" type="password" autocomplete="off" />
          <button type="submit" :disabled="savingToken">
            {{ savingToken ? '保存中' : '保存并刷新' }}
          </button>
        </div>
        <p>本地开发默认令牌为 dev-admin-token，生产环境请配置 ADMIN_TOKEN。</p>
      </form>
    </section>

    <section v-if="errorMessage" class="state-card error">
      {{ errorMessage }}
    </section>

    <section v-if="loading" class="state-card">
      正在加载后台数据，请稍等...
    </section>

    <template v-else>
      <section class="metrics" aria-label="后台指标">
        <article v-for="card in metricCards" :key="card.label" class="metric-card">
          <span>{{ card.label }}</span>
          <strong>{{ card.value }}</strong>
          <small>{{ card.hint }}</small>
        </article>
      </section>

      <section class="panel">
        <div class="panel-toolbar">
          <div class="tabs" role="tablist" aria-label="后台数据表">
            <button
              data-testid="tab-matches"
              :class="{ active: activeTab === 'matches' }"
              type="button"
              @click="switchTab('matches')"
            >
              球局管理
            </button>
            <button
              data-testid="tab-users"
              :class="{ active: activeTab === 'users' }"
              type="button"
              @click="switchTab('users')"
            >
              用户管理
            </button>
            <button
              data-testid="tab-venues"
              :class="{ active: activeTab === 'venues' }"
              type="button"
              @click="switchTab('venues')"
            >
              球馆管理
            </button>
          </div>

          <button
            v-if="activeTab === 'matches'"
            data-testid="create-matches"
            class="primary-action"
            type="button"
            @click="openCreate('matches')"
          >
            新增球局
          </button>
          <button
            v-if="activeTab === 'users'"
            data-testid="create-users"
            class="primary-action"
            type="button"
            @click="openCreate('users')"
          >
            新增用户
          </button>
          <button
            v-if="activeTab === 'venues'"
            data-testid="create-venues"
            class="primary-action"
            type="button"
            @click="openCreate('venues')"
          >
            新增球馆
          </button>
        </div>

        <form v-if="editor" data-testid="submit-editor" class="editor-card" @submit.prevent="saveEditor">
          <header>
            <h2>{{ editor.id ? '编辑' : '新增' }}{{ editor.resource === 'matches' ? '球局' : editor.resource === 'users' ? '用户' : '球馆' }}</h2>
            <button type="button" @click="closeEditor">取消</button>
          </header>

          <div v-if="editor.resource === 'venues'" class="form-grid">
            <label>球馆名称<input data-testid="venue-name" v-model="form.name" required /></label>
            <label>城市<input data-testid="venue-city" v-model="form.city" required /></label>
            <label>区域<input data-testid="venue-district" v-model="form.district" /></label>
            <label>距离<input data-testid="venue-distance" v-model.number="form.distanceKm" type="number" min="0" step="0.1" /></label>
            <label class="checkbox"><input v-model="form.isActive" type="checkbox" /> 启用球馆</label>
          </div>

          <div v-if="editor.resource === 'users'" class="form-grid">
            <label>手机号<input v-model="form.phone" required /></label>
            <label>昵称<input v-model="form.nickname" required /></label>
            <label>城市<input v-model="form.city" required /></label>
            <label>水平<input v-model="form.level" required /></label>
            <label>信用分<input v-model.number="form.creditScore" type="number" min="0" max="100" /></label>
          </div>

          <div v-if="editor.resource === 'matches'" class="form-grid">
            <label>标题<input v-model="form.title" required /></label>
            <label v-if="!editor.id">主理人ID<input v-model="form.hostUserId" required /></label>
            <label v-if="!editor.id">球馆ID<input v-model="form.venueId" required /></label>
            <label v-if="!editor.id">球台ID<input v-model="form.courtId" required /></label>
            <label v-if="!editor.id">时段ID<input v-model="form.slotId" required /></label>
            <label>水平<input v-model="form.level" required /></label>
            <label>人数<input v-model.number="form.maxPlayers" type="number" min="1" /></label>
          </div>

          <button class="primary-action" type="submit" :disabled="savingEditor">
            {{ savingEditor ? '保存中' : '保存' }}
          </button>
        </form>

        <div v-if="activeTab === 'matches'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>球局</th>
                <th>球馆</th>
                <th>时间</th>
                <th>主理人</th>
                <th>席位</th>
                <th>报名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="match in matches" :key="match.id">
                <td>
                  <strong>{{ match.title }}</strong>
                  <small>{{ match.city }} / {{ match.level }}</small>
                </td>
                <td>{{ match.venueName }}</td>
                <td>{{ formatDateTime(match.startTime) }}</td>
                <td>
                  {{ match.hostNickname }}
                  <small>{{ match.hostPhone }}</small>
                </td>
                <td>{{ match.maxPlayers - match.openSlots }}/{{ match.maxPlayers }}</td>
                <td>
                  待审 {{ match.applicationCounts.pending }} / 通过 {{ match.applicationCounts.approved }} / 拒绝
                  {{ match.applicationCounts.rejected }}
                </td>
                <td class="actions">
                  <button type="button" @click="openEdit('matches', match)">编辑</button>
                  <button type="button" @click="deleteRow('matches', match.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'users'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>用户</th>
                <th>城市</th>
                <th>水平</th>
                <th>信用分</th>
                <th>发起</th>
                <th>参加</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>
                  <strong>{{ user.nickname }}</strong>
                  <small>{{ user.phone }}</small>
                </td>
                <td>{{ user.city }}</td>
                <td>{{ user.level }}</td>
                <td>{{ user.creditScore }}</td>
                <td>{{ user.hostedMatches }}</td>
                <td>{{ user.joinedMatches }}</td>
                <td class="actions">
                  <button type="button" @click="openEdit('users', user)">编辑</button>
                  <button type="button" @click="deleteRow('users', user.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'venues'" class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>球馆</th>
                <th>区域</th>
                <th>距离</th>
                <th>状态</th>
                <th>球台/时段</th>
                <th>关联球局</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="venue in venues" :key="venue.id">
                <td>
                  <strong>{{ venue.name }}</strong>
                  <small>{{ venue.city }}</small>
                </td>
                <td>{{ venue.district || '未填写' }}</td>
                <td>{{ venue.distanceKm }}km</td>
                <td>
                  <span class="status" :class="{ muted: !venue.isActive }">
                    {{ venue.isActive ? '启用中' : '已停用' }}
                  </span>
                </td>
                <td>{{ venue.courtCount }} / {{ venue.slotCount }}</td>
                <td>{{ venue.matchCount }}</td>
                <td class="actions">
                  <button type="button" @click="openEdit('venues', venue)">编辑</button>
                  <button type="button" @click="deleteRow('venues', venue.id)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </template>
  </main>
</template>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

:global(body) {
  margin: 0;
  min-width: 1080px;
  background:
    radial-gradient(circle at top left, rgba(255, 196, 87, 0.35), transparent 28rem),
    linear-gradient(135deg, #f8f1df 0%, #e7f4ea 48%, #edf1ff 100%);
  color: #17201a;
  font-family: "LXGW WenKai", "Source Han Serif SC", "Microsoft YaHei", sans-serif;
}

button,
input {
  font: inherit;
}

.admin-shell {
  padding: 32px;
}

.hero {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 24px;
  align-items: stretch;
  margin-bottom: 24px;
}

.eyebrow {
  margin: 0 0 8px;
  color: #6b5b2a;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.22em;
}

h1 {
  margin: 0;
  font-size: 52px;
  line-height: 1;
}

.hero-copy {
  max-width: 720px;
  margin: 18px 0 0;
  color: #4a554f;
  font-size: 18px;
  line-height: 1.8;
}

.token-card,
.state-card,
.metric-card,
.panel,
.editor-card {
  border: 1px solid rgba(29, 52, 39, 0.12);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 80px rgba(48, 62, 53, 0.12);
  backdrop-filter: blur(16px);
}

.token-card,
.editor-card {
  padding: 22px;
}

.token-card label {
  display: block;
  margin-bottom: 12px;
  font-weight: 800;
}

.token-row,
.panel-toolbar,
.tabs,
.actions,
.editor-card header {
  display: flex;
  gap: 10px;
  align-items: center;
}

.token-row input,
.form-grid input {
  min-width: 0;
  width: 100%;
  border: 1px solid #ced8cf;
  border-radius: 16px;
  padding: 12px 14px;
  background: #fffdf7;
}

.token-row button,
.tabs button,
.primary-action,
.actions button,
.editor-card header button {
  border: 0;
  border-radius: 16px;
  padding: 12px 16px;
  background: #183b2a;
  color: white;
  cursor: pointer;
  font-weight: 800;
}

.actions button,
.editor-card header button {
  background: rgba(24, 59, 42, 0.1);
  color: #183b2a;
}

.token-card p {
  margin: 12px 0 0;
  color: #68756c;
  font-size: 13px;
}

.state-card {
  margin-bottom: 18px;
  padding: 20px;
  color: #4f5b52;
}

.state-card.error {
  border-color: rgba(180, 58, 44, 0.28);
  background: rgba(255, 235, 230, 0.86);
  color: #8e2e22;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 22px;
}

.metric-card {
  padding: 20px;
}

.metric-card span,
.metric-card small {
  display: block;
  color: #67736c;
}

.metric-card strong {
  display: block;
  margin: 12px 0 8px;
  font-size: 34px;
}

.panel {
  overflow: hidden;
}

.panel-toolbar {
  justify-content: space-between;
  padding: 18px;
  border-bottom: 1px solid rgba(29, 52, 39, 0.12);
}

.tabs button {
  background: rgba(24, 59, 42, 0.1);
  color: #183b2a;
}

.tabs button.active {
  background: #183b2a;
  color: white;
}

.editor-card {
  margin: 18px;
}

.editor-card header {
  justify-content: space-between;
  margin-bottom: 16px;
}

.editor-card h2 {
  margin: 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 16px;
}

.form-grid label {
  color: #526058;
  font-weight: 800;
}

.form-grid .checkbox {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form-grid .checkbox input {
  width: auto;
}

.table-wrap {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 18px 20px;
  border-bottom: 1px solid rgba(29, 52, 39, 0.1);
  text-align: left;
  vertical-align: top;
}

th {
  color: #657168;
  font-size: 13px;
  letter-spacing: 0.12em;
}

td strong,
td small {
  display: block;
}

td small {
  margin-top: 4px;
  color: #748078;
}

.status {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 10px;
  background: #dff3dc;
  color: #246332;
  font-weight: 800;
}

.status.muted {
  background: #eeeeee;
  color: #7a7a7a;
}
</style>
