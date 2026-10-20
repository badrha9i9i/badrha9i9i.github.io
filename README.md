# Badr Al Haqiqi Gaming — public storefront + PS4 host

Published website: https://badrha9i9i.github.io/
Source repository is PRIVATE. Previous personal GitHub Pages deployment is no longer the publication target.
Repository: https://github.com/redaoujane/badrhaqiqi

Phone and computer visitors are redirected to `shop.html`. PlayStation 4 visitors remain in the existing activation, firmware verification and offline flow. An unknown PS4 firmware still requires verification; desktop device detection does not enable any payload. The owner-supplied father-and-son image appears in full on the shop page. Contact links come from the owner’s HiHello card; see CONTACT-SOURCES.md.

Free deployment plan: keep this source repository private and publish only the generated runtime files to a PUBLIC `badrha9i9i/badrha9i9i.github.io` repository. The repository is owned by the owner-created GitHub Free organization. The public distribution necessarily includes client-side JavaScript, assets and PS4 runtime files; it does not hide shipped code or the local activation PIN. Development JSX, tests, tool scripts and source history stay in this private repository. GitHub Pages then uses the distribution `main` branch at `/`. Keep `.nojekyll` and byte-preserving `.gitattributes`. After runtime edits, regenerate `python tools/manifest.py`, repackage using `python tools/package_public.py`, then publish the runtime archive to the organization Pages repository. Validate with `python tests/http_audit.py https://badrha9i9i.github.io/`.

On PS4, bookmark the exact published URL, activate online and wait for cache completion. Power off, disconnect the internet, restart and reopen that same bookmark to validate real offline use. PC tests do not establish PS4 hardware compatibility. Raw13G 13.52 is now enabled experimentally; other Raw13G versions remain blocked.

Build the storefront with `npm ci` then `npm run build:shop`, followed by `python tools/manifest.py`. React and modern libraries are loaded only by shop.html; PS4 root visitors use the existing ES5 entry flow.

For a local preview: `python tools/serve.py 8765`.

---

# بدر الحقيقي — BADR AL HAQIQI

## النسخة الحالية: Multi-host v2.1 — Firmware Safety Verification

واجهة فعلية للتفعيل وتأكيد Firmware والكاش، مع محركين معزولين. **Raw13G مفعّل تجريبياً لإصدار 13.52؛ باقي إصداراته محجوبة حتى يتأكد توافقها.** الموقع منشور، ولكن نجاح تشغيل الـPayload على جهاز الزبون يحتاج تجربة فعلية.

## Architecture

```text
index.html                  Presentation / PIN / confirmation / installation
settings.html               PIN-protected owner actions
shop.html                   Address, services, WhatsApp
credits.html                Original author and license links
assets/shop.jpg             Local baseline JPEG (provided shop artwork)
assets/style.css            Lightweight TV / controller UI
js/firmware-detector.js      Strict PS4 User-Agent parser
js/firmware-router.js        Explicit compatibility + payload metadata map
js/firmware-safety.js       Shared offline verification on every launch
js/activation.js            Atomic localStorage setup record
js/offline-manager.js       Real AppCache state/events and reload guard
js/app.js                    First-run and returning-device workflow
js/host-bridge.js            Activation/cache/firmware gates before module load
js/navigation.js            D-pad key navigation; native X/Enter retained
js/settings.js              Protected reset/change/debug/cache maintenance
js/version.js               Deterministic generated build ID
flash/                      RawGame4 engine, payload, patches, original license
flash2/                     Raw13G engine, payloads, patches, original license
cache.appcache              One atomic root + BOTH hosts cache group
source-lock.json             Original per-file SHA-256 and upstream commits
tools/manifest.py            Rebuild version and cache manifest
tools/serve.py               Local static server with manifest MIME
tests/                      Unit, browser and original-source audits
```

Both hosts retain their own offsets, JS, workers, patch blobs and payloads. Original runtime JavaScript is byte-identical. Host HTML landing/run pages were replaced with guarded delivery wrappers preserving `state`, `out`, and Raw13G `msg` nodes. RawGame4 still selects Lapse/Poops from the confirmed, detected firmware. Raw13G's original `off.payload` selection remains untouched. Its 13.52 row is enabled experimentally.

Every active HTML page refers to the **same root manifest** (`../cache.appcache` inside hosts). This avoids claiming readiness from one group while another host group is incomplete. Both hosts are cached, approximately 2.16 MB of explicitly listed resources including URL aliases. Their original child manifests remain preserved byte-identically as source artifacts, but no active page uses them. This intentionally favors reliability over downloading only the selected host.

The main `/` and `/index.html`, host directory URLs, run pages, versioned imports, artwork, license pages and all binaries are listed explicitly. Routing uses relative URLs so a GitHub Pages project subdirectory works. Save the final `/index.html` URL as the recommended bookmark; directory bookmarks are also included.

## Firmware and payload policy

| Firmware | Host | State in this build |
|---|---|---|
| 11.00, 11.50, 12.00 | RawGame4 / Lapse | Enabled per upstream; hardware acceptance pending |
| 12.02 | RawGame4 / Lapse | Experimental alias; explicit first-time confirmation |
| 12.50, 13.00 | RawGame4 / Poops | Enabled per upstream; hardware acceptance pending |
| 12.52 | RawGame4 / Poops | Experimental alias; explicit first-time confirmation |
| 13.02, 13.04 | Raw13G / 663 chain | Experimental, execution unavailable: payload support unresolved |
| 13.50 | Raw13G / 663 chain | Experimental, execution unavailable: patch and payload unverified |
| 13.52 | Raw13G / 663 chain | Experimental, enabled: upstream 13.52 engine and patch; bundled payload requires console validation |
| All other versions | None | Blocked |

See **COMPATIBILITY.md** for source evidence, independent hardware reports and binary hashes. Raw13G has no README at the pinned commit. The enabled 13.52 route uses its original files and may still fail on a real console.

## First activation in the store

1. Connect PS4 to the internet and open the final deployed `/index.html`. Save that exact origin and path as a bookmark.
2. Enter **52053832**, not the WhatsApp number.
3. Check the detected firmware against PS4 system settings. Press YES, CONTINUE, or NO, CHANGE FIRMWARE to inspect the explicit selection list.
4. Mismatched manual choices cannot start the exploit. If the User-Agent is unrecognized, a manual selection and explicit “Is that right?” confirmation are displayed, but execution remains blocked while the original engine cannot detect its offsets: the original engines also need a valid firmware User-Agent. No spoofing is introduced.
5. Wait for real AppCache completion. Progress is shown only if the event exposes a computable total; 100% download events alone do not authorize activation.
6. Only after a valid choice and an IDLE complete cache is the atomic `badr_setup_v2` record saved. It contains schema, activated/setupComplete, firmware, host, and cacheVersion. The interface then routes automatically to the original engine wrapper.
7. For blocked Raw13G rows the site explains the reason and saves no completed activation. This is expected behavior, not a download failure.

AppCache may start downloading before PIN entry because the browser sees the manifest in HTML. That never implies activation. The PIN is intentionally local and visible in source, not an access-control or licensing system.

## Next time offline

Power on → browser → saved bookmark → read setup → validate current detected firmware against saved firmware and compatibility map → require complete AppCache → route automatically. No PIN or firmware question for an unchanged supported device.

Firmware changes, missing cache, obsolete cache, corrupted setup, unknown User-Agent or unavailable payload stop execution. A stored activation flag alone is insufficient. Firmware changes show `Firmware Changed! Previous: 13.00 — Current: 13.52` and stop auto launch. Use RE-VERIFY FIRMWARE, confirm the newly detected version, then wait for compatible setup/cache completion. The old activation remains intact until the replacement is committed. Owner settings → Change firmware is still PIN/checkbox protected and now stages re-verification rather than resetting activation.

If cache is entirely erased, the offline browser cannot load even the error page. Restore internet and reopen the same URL. AppCache exposes group state, not a list of cached bytes; disk corruption that the browser does not report cannot be disproved by JavaScript. Real power-cycle/offline tests are mandatory.

## Owner settings

The small Owner settings link shows detected/confirmed firmware, host, activation, cache state, current/saved versions and debug state. Change firmware, Reset activation, debug toggling and maintenance require the correct PIN and the confirmation checkbox.

Reset clears local activation and debug, not the cache. Reinstall / verify requests `applicationCache.update()`; the API has no selective delete/reinstall method. The page explains that a genuinely damaged cache requires clearing browser website data, reconnecting and reactivating. It never claims that pressing this button erased and rebuilt the cache.

Debug exposes the original RawGame4 log without modifying the engine or forwarding unsafe query parameters. It cannot override compatibility. Raw13G 13.52 follows the same enabled route in debug; its other rows remain blocked. The original Raw13G logger emits full logs only with its own `log=1` option.

## Deployment

1. Upload the **contents** of this project, preserving directories and case, to a static host. Do not upload `.git`, `node_modules`, or `test-results`. No npm build is needed for runtime.
2. GitHub Pages: create your own repository, upload the files, select the branch and root under Settings → Pages. Keep `.nojekyll`. A project URL such as `https://OWNER.github.io/REPO/index.html` works with the relative routing.
3. Verify actual deployed headers: `curl -I https://OWNER.github.io/REPO/cache.appcache`. Require `Content-Type: text/cache-manifest`. GitHub Pages ignores `.htaccess`; do not assume headers based on local tests.
4. Fetch the root directory, index, both host directories and all manifest URLs. In particular test `flash/core.js?v=10`, `flash2/core.js?v=10`, `flash2/jb.js?v=19` and binary MIME/content. Missing resources must return a real 404, not an HTML SPA fallback.
5. Apache can use the root `.htaccess`; `_headers` is available for hosts honoring that format. Serve JS as JavaScript, binaries as `application/octet-stream`, manifest as `text/cache-manifest`. Revalidate changed files and the manifest. Disable automatic JS rewrites/minification.
6. Test the final HTTPS certificate and AppCache behavior on PS4. Modern PC browsers are not a substitute. No public hosting headers or TLS were verified in this task.
7. Keep the same domain, protocol and path. Moving the site creates a different cache/storage origin; bookmarks must be reactivated there.

For local PC/LAN tests run `python tools/serve.py`. It serves port 8080; use `http://127.0.0.1:8080/index.html` on PC or the computer's LAN address on PS4. Local activation does not activate a different public URL.

## Updating

Run `python tools/manifest.py` after any runtime change, then tests. Build ID is deterministic. Hashes are full-line comments for audit/versioning; AppCache does **not** enforce SHA-256 from comments. Deploy atomically, or assets first and manifest last, with coherent versions.

UPDATEREADY swaps then reloads before any engine starts. An in-progress confirmed setup is retained temporarily in sessionStorage with the previous activation snapshot; it can resume only if that snapshot still matches localStorage and the newly detected firmware still matches. Activation replacement waits for the new document's ready cache. A storage verification failure attempts to restore the previous record. A repeated update for the same loaded version is blocked rather than looping. Failed update with IDLE may use the previous complete atomic cache; an incomplete/obsolete cache cannot launch.

Migrating from the previous single-host build requires one new setup. Old `badr_ps4_activated` has no firmware metadata and is deliberately not trusted. Root `run_lapse.html` / `run_poops.html` are guarded migration links to the new entry page.

## Tests

`node tests/unit.cjs` and `python tests/audit.py` run without npm dependencies. For browser/source syntax tests run `npm install`, keep the static server running, then `npm run test:browser` and `node tests/sources.cjs`. Browser tests expect installed Microsoft Edge; the test-only dependencies never ship into the runtime cache.

See **TEST-REPORT.md** and **HARDWARE-CHECKLIST.md**. PC tests intercept exploit module loads; no exploit was executed on PC or PS4 during this task. The new delivery JS is ES5. Original engine files still require their existing Modules/async/fetch/Worker/URLSearchParams features; no transpilation or polyfills were injected.

## Credits and originals

- RawGame4 commit `d297459c793b08346409206c537acf40cbcb926f` — https://github.com/rawgame4/rawgame4.github.io/
- Raw13G commit `9ba2f0719591d6900d91aba6cc5291f8fff97e6d` — https://github.com/raw13g/raw13g.github.io/
- Original licenses are in each host directory. RawGame4 README is preserved. ZIP snapshots of both originals are supplied alongside the deliverable.
- Jordy/SLOPKIT, GoldHEN team, original PS4/PS5 patch/research authors, rawgame4/raw13g and repository history credits remain attributed. Third-party components are not relicensed as the port's MIT work.
- Artwork was supplied by the store owner and remains local in baseline JPEG for conservative browser support.

## Firmware Safety Verification (v2.1)

Verification is entirely local: localStorage + current User-Agent + the bundled compatibility map. No authentication or firmware API request is made. It runs at the main bookmark and again at host entry/run pages before any engine module is inserted. Matching firmware and a complete cache continue automatically without another question. Unknown firmware is never treated as a match.

RE-VERIFY FIRMWARE does not delete activation or bypass payload restrictions. Unsupported replacement, cancelled/manual confirmation, failed cache and failed storage keep the previous record. Only explicit Owner settings → Reset activation intentionally clears it. When the entire cached page is erased, internet is still needed to restore that page; this verification cannot run from deleted files.
