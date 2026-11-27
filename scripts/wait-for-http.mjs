const address = process.argv[2]
if (!address) throw new Error('Usage: node scripts/wait-for-http.mjs <url>')
for (let attempt = 0; attempt < 60; attempt++) {
  try {
    const response = await fetch(address, { signal: AbortSignal.timeout(1000) })
    if (response.ok) {
      console.log('Ready: ' + address)
      process.exit(0)
    }
  } catch {
    // The process may still be starting or migrating its database.
  }
  await new Promise((resolve) => setTimeout(resolve, 1000))
}
throw new Error('Timed out waiting for ' + address)
