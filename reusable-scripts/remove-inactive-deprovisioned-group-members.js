// Remove INACTIVE and DEPROVISIONED group members from a specified group
// Uses https://gabrielsroka.github.io/console

const id = 'YOUR_GROUP_ID_HERE'; // Replace with your group ID

let removed = 0;
let skipped = 0;

for await (user of getObjects('/api/v1/groups/' + id + '/users')) {
  if (user.status === 'INACTIVE' || user.status === 'DEPROVISIONED') {
    log('removing user:', user.profile.login, '|', user.status);
    await remove('/api/v1/groups/' + id + '/users/' + user.id);
    removed++;
  } else {
    skipped++;
  }
}

log(`Done. Removed: ${removed} | Skipped (active): ${skipped}`);
