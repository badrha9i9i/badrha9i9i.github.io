/* Keep PS4, including unknown firmware, in the original safety flow. */
window.BadrShopRedirect = !/PlayStation\s*4/i.test(navigator.userAgent);
if (window.BadrShopRedirect) window.location.replace('shop.html');
