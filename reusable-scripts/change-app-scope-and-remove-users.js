// Change app assignment scope from GROUP to USER, unassign users from apps,
// and remove users from groups using https://gabrielsroka.github.io/console
//
// Set these — replace all placeholder values below with real Okta IDs.

userIds = [
  '00u1.....', // replace with real user ID
  '00u1.....', // replace with real user ID
  '00u1.....'  // replace with real user ID
]

appIds = [
  '0oa1.....', // replace with real app ID
  '0oa1.....', // replace with real app ID
  '0oa1.....', // replace with real app ID
  '0oa1.....', // replace with real app ID
  '0oa1.....'  // replace with real app ID
]

groupIds = [
  '00g1.....', // replace with real group ID
  '00g1.....', // replace with real group ID
  '00g1.....'  // replace with real group ID
]

summary = []

for (userId of userIds) {
  log('=== Processing user', userId, '===')

  // Step 1 & 2: change scope to USER, then unassign from each app.
  for (appId of appIds) {
    log('Processing app', appId)

    row = {
      userId,
      type: 'app',
      id: appId,
      scopeChangeResult: '',
      unassignResult: ''
    }

    changeRes = await postJson(`/api/v1/apps/${appId}/users/${userId}`, {scope: 'USER'})
    if (changeRes?.errorCode) {
      row.scopeChangeResult = 'ERROR: ' + (changeRes.errorSummary || '') + ' ' +
        (changeRes.errorCauses?.map(c => c.errorSummary).join('; ') || '')
      log('  ERROR changing scope:', row.scopeChangeResult)
      row.unassignResult = 'SKIPPED'
      summary.push(row)
      if (cancel) break
      continue
    }

    row.scopeChangeResult = 'OK'
    log('  Scope changed to USER')

    removeRes = await remove(`/api/v1/apps/${appId}/users/${userId}`)
    if (removeRes?.errorCode) {
      row.unassignResult = 'ERROR: ' + (removeRes.errorSummary || '') + ' ' +
        (removeRes.errorCauses?.map(c => c.errorSummary).join('; ') || '')
      log('  ERROR unassigning:', row.unassignResult)
    } else {
      row.unassignResult = 'OK'
      log('  Unassigned from app')
    }

    summary.push(row)

    if (cancel) break
  }
  if (cancel) break

  // Step 3: remove the user from each group.
  for (groupId of groupIds) {
    log('Removing from group', groupId)

    row = {
      userId,
      type: 'group',
      id: groupId,
      scopeChangeResult: 'N/A',
      unassignResult: ''
    }

    removeRes = await remove(`/api/v1/groups/${groupId}/users/${userId}`)
    if (removeRes?.errorCode) {
      row.unassignResult = 'ERROR: ' + (removeRes.errorSummary || '') + ' ' +
        (removeRes.errorCauses?.map(c => c.errorSummary).join('; ') || '')
      log('  ERROR removing from group:', row.unassignResult)
    } else {
      row.unassignResult = 'OK'
      log('  Removed from group')
    }

    summary.push(row)

    if (cancel) break
  }
  if (cancel) break
}

log('Done.')
table(summary)
results.innerHTML += '<br><button id="exportCSV" class="button button-primary">Download CSV</button>'
exportCSV.onclick = () => downloadCSV(csv(summary), 'app-and-group-removal-multi-user')
