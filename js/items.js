(async function() {
while (!window.startup || !window.rapierReady) {
    console.log('check')
    await new Promise(resolve => setTimeout(resolve, 500));
}
let items = {}
items.list = [





]
window.items = items
})()