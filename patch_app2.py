import re

with open('apps/admin/src/App.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import Pagination
if "import Pagination" not in content:
    content = content.replace("import EChart from './components/EChart.vue';", 
                              "import EChart from './components/EChart.vue';\nimport Pagination from './components/Pagination.vue';")

# Add missing state variables
state_vars = """
const matchPage = ref(1);
const matchPageSize = ref(20);
const userPage = ref(1);
const userPageSize = ref(20);
const venuePage = ref(1);
const venuePageSize = ref(20);
const applicationPageSize = ref(20);
const reviewPage = ref(1);
const reviewPageSize = ref(20);
const reviewTotal = ref(0);
const reportPage = ref(1);
const reportPageSize = ref(20);
const reportTotal = ref(0);
"""
if "const matchPage = ref(1);" not in content:
    content = content.replace("const venueTotal = ref(0);", "const venueTotal = ref(0);" + state_vars)

# Fix loading functions
content = content.replace("await api.value.listMatches(search.trim());", "await api.value.listMatches(search.trim(), matchPage.value);")
content = content.replace("matches.value = response.items;\n    matchTotal.value = response.total;", "matches.value = response.items;\n    matchTotal.value = response.total;\n    matchPageSize.value = response.pageSize;")

content = content.replace("await api.value.listUsers(search.trim());", "await api.value.listUsers(search.trim(), userPage.value);")
content = content.replace("users.value = response.items;\n    userTotal.value = response.total;", "users.value = response.items;\n    userTotal.value = response.total;\n    userPageSize.value = response.pageSize;")

content = content.replace("await api.value.listVenues(search.trim());", "await api.value.listVenues(search.trim(), venuePage.value);")
content = content.replace("venues.value = response.items;\n    venueTotal.value = response.total;", "venues.value = response.items;\n    venueTotal.value = response.total;\n    venuePageSize.value = response.pageSize;")

content = content.replace("applications.value = response.items;\n    applicationTotal.value = response.total;", "applications.value = response.items;\n    applicationTotal.value = response.total;\n    applicationPageSize.value = response.pageSize;")

# add loadReviews and loadReports
load_funcs = """
async function reloadReviews() {
  loading.value = true;
  try {
    const response = await api.value.listReviews({ page: reviewPage.value });
    reviews.value = response.items;
    reviewTotal.value = response.total;
    reviewPageSize.value = response.pageSize;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function reloadReports() {
  loading.value = true;
  try {
    const response = await api.value.listReports({ status: 'open', page: reportPage.value });
    reports.value = response.items;
    reportTotal.value = response.total;
    reportPageSize.value = response.pageSize;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
"""
if "async function reloadReviews()" not in content:
    content = content.replace("async function reloadApplications() {", load_funcs + "\nasync function reloadApplications() {")

# update watch for tabs
tab_watch = """watch(activeTab, (tab) => {
  if (tab === 'analytics') void loadAnalytics();
  if (tab === 'applications') void reloadApplications();
  if (tab === 'matches') void reloadMatches();
  if (tab === 'users') void reloadUsers();
  if (tab === 'venues') void reloadVenues();
  if (tab === 'reviews') void reloadReviews();
  if (tab === 'reports') void reloadReports();
});"""
content = re.sub(r'watch\(activeTab, \(tab\) => \{[\s\S]*?\}\);', tab_watch, content)

# update loadDashboard Promise.all
content = content.replace("api.value.listReviews(),", "api.value.listReviews({ page: reviewPage.value }),")
content = content.replace("api.value.listReports({ status: 'open' }),", "api.value.listReports({ status: 'open', page: reportPage.value }),")

content = content.replace("reviews.value = reviewPayload.items;", "reviews.value = reviewPayload.items;\n    reviewTotal.value = reviewPayload.total;\n    reviewPageSize.value = reviewPayload.pageSize;")
content = content.replace("reports.value = reportPayload.items;", "reports.value = reportPayload.items;\n    reportTotal.value = reportPayload.total;\n    reportPageSize.value = reportPayload.pageSize;")

# Fix the manual pagination blocks
# For applications
content = re.sub(r'<div class="pagination" v-if="applicationTotal > 0">[\s\S]*?</div>', '<Pagination v-if="applicationTotal > 0" v-model:page="applicationPage" :page-size="applicationPageSize" :total="applicationTotal" @change="reloadApplications" />', content)

# Remove manual prevApplicationPage, nextApplicationPage
content = re.sub(r'function prevApplicationPage\(\) \{[\s\S]*?\}', '', content)
content = re.sub(r'function nextApplicationPage\(\) \{[\s\S]*?\}', '', content)

# For matches
content = content.replace("""            </table>
          </div>
  
          <div v-if="activeTab === 'users'" class="table-search">""", """            </table>
            <Pagination v-if="matchTotal > 0" v-model:page="matchPage" :page-size="matchPageSize" :total="matchTotal" @change="reloadMatches" />
          </div>
  
          <div v-if="activeTab === 'users'" class="table-search">""")

# For users
content = content.replace("""            </table>
          </div>
  
          <div v-if="activeTab === 'venues'" class="table-search">""", """            </table>
            <Pagination v-if="userTotal > 0" v-model:page="userPage" :page-size="userPageSize" :total="userTotal" @change="reloadUsers" />
          </div>
  
          <div v-if="activeTab === 'venues'" class="table-search">""")

# For venues
content = content.replace("""            </table>
          </div>
  
          <div v-if="activeTab === 'reviews'" class="table-wrap">""", """            </table>
            <Pagination v-if="venueTotal > 0" v-model:page="venuePage" :page-size="venuePageSize" :total="venueTotal" @change="reloadVenues" />
          </div>
  
          <div v-if="activeTab === 'reviews'" class="table-wrap">""")

# For reviews
content = content.replace("""            </table>
          </div>
  
          <div v-if="activeTab === 'reports'" class="table-wrap">""", """            </table>
            <Pagination v-if="reviewTotal > 0" v-model:page="reviewPage" :page-size="reviewPageSize" :total="reviewTotal" @change="reloadReviews" />
          </div>
  
          <div v-if="activeTab === 'reports'" class="table-wrap">""")

# For reports
content = content.replace("""            </table>
          </div>
        </div>
      </template>
    </main>""", """            </table>
            <Pagination v-if="reportTotal > 0" v-model:page="reportPage" :page-size="reportPageSize" :total="reportTotal" @change="reloadReports" />
          </div>
        </div>
      </template>
    </main>""")


# also remove `.pagination` styles from App.vue since it's now in the component
content = re.sub(r'\.pagination \{[\s\S]*?\.pagination-info \{[\s\S]*?\}', '', content)
# wait, .pagination is still in the flex group. It can stay there.

with open('apps/admin/src/App.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
