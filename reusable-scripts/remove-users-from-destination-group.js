// Remove users from dstGroup if they are members of srcGroup using https://gabrielsroka.github.io/console
// srcGroupId = the group whose members you want to remove
// dstGroupId = the group to remove them from
srcGroupId = '00g...'
dstGroupId = '00g...'

for await (user of getObjects('/api/v1/groups/' + srcGroupId + '/users')) {
  const result = await remove('/api/v1/groups/' + dstGroupId + '/users/' + user.id)
  if (result?.errorCode) {
    log('error removing', user.profile.login, '-', result.errorSummary)
  } else {
    log('removed', user.profile.login)
  }
}
