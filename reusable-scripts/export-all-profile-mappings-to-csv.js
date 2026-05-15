// Export ALL profile mappings to CSV using https://gabrielsroka.github.io/console
log('Fetching all mappings...')
allMappings = []
url = '/api/v1/mappings'
hasMore = true
while (hasMore) {
  log('Fetching page:', url)
  response = await fetch(url, {credentials: 'include'})
  body = await response.json()
  allMappings = allMappings.concat(body)
  
  link = response.headers.get('Link')
  if (link && link.includes('rel="next"')) {
    url = link.match(/<([^>]+)>;\s*rel="next"/)[1].replace(/^https:\/\/[^\/]+/, '')
    hasMore = true
  } else {
    hasMore = false
  }
  
  if (cancel) break
}
log('Found', allMappings.length, 'total mappings')
log('Building CSV...')
csvRows = []
csvRows.push([
  'Mapping ID',
  'Source Name',
  'Source Type',
  'Source ID',
  'Target Name',
  'Target Type',
  'Target ID',
  'Flow Direction',
  'Target Property',
  'Mapping Type',
  'Expression',
  'Push Status'
])
mappingCount = 0
propertyCount = 0
for (mapping of allMappings) {
  log('Processing (' + (allMappings.indexOf(mapping) + 1) + '/' + allMappings.length + '):', mapping.source.name, '->', mapping.target.name)
  detail = await getJson('/api/v1/mappings/' + mapping.id)
  
  // Determine flow direction
  flowDirection = mapping.source.type + ' -> ' + mapping.target.type
  
  hasProperties = false
  for ([propName, propValue] of Object.entries(detail.properties || {})) {
    mappingType = 'UNKNOWN'
    if (propValue.expression) {
      mappingType = 'EXPRESSION'
    } else if (propValue.mapping && propValue.mapping.ref) {
      mappingType = 'MAP'
    } else if (propValue.mapping) {
      mappingType = 'MAP'
    }
    
    expressionValue = ''
    if (propValue.expression) {
      expressionValue = propValue.expression
    } else if (propValue.mapping && propValue.mapping.ref) {
      expressionValue = propValue.mapping.ref
    } else if (propValue.mapping) {
      expressionValue = JSON.stringify(propValue.mapping)
    }
    
    csvRows.push([
      mapping.id,
      mapping.source.name || 'N/A',
      mapping.source.type || 'N/A',
      mapping.source.id || 'N/A',
      mapping.target.name || 'N/A',
      mapping.target.type || 'N/A',
      mapping.target.id || 'N/A',
      flowDirection,
      propName,
      mappingType,
      expressionValue,
      propValue.pushStatus || 'N/A'
    ])
    propertyCount++
    hasProperties = true
  }
  
  if (hasProperties) mappingCount++
  if (cancel) break
}
csvContent = csv(csvRows)
results.innerHTML = 
  mappingCount + ' mappings with ' + propertyCount + ' total property mappings<br>' +
  '<button id=copyCSV class="button button-primary">Copy to Clipboard</button> ' +
  '<button id=exportCSV class="button button-primary">Download CSV</button>'
copyCSV.onclick = () => {
  navigator.clipboard.writeText(csvContent).then(() => {
    alert('Copied to clipboard!')
  })
}
exportCSV.onclick = () => downloadCSV(csvContent, 'okta-all-profile-mappings')
