const file = await new Promise(resolve => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.csv'
  input.onchange = () => resolve(input.files[0])
  input.click()
})

const text = await file.text()

const rows = text.trim().split('\n')
const headers = rows[0].split(',').map(h => h.trim())
const users = rows.slice(1).map(row => {
  const values = row.split(',')
  return Object.fromEntries(headers.map((h, i) => [h, values[i]?.trim()]))
})

log('loaded', users.length, 'users from', file.name)

for (const row of users) {
  const result = await postJson('/api/v1/users/' + row.oktaId, {
    credentials: { password: { value: row.password } }
  })
  if (result?.errorCode) {
    log('error -', row.oktaId, '-', result.errorSummary)
  } else {
    log('updated -', row.oktaId)
  }
}
