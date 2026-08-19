#!/usr/bin/env bash
# Post-deploy verification. Costs ZERO Airtable API calls — it only makes HTTP
# requests to the deployed site.
#
#   ./scripts/verify-deploy.sh                      # defaults to the vercel.app URL
#   ./scripts/verify-deploy.sh https://www.dssberkeley.org
#
# The important check is #2: if the page still contains Airtable CDN URLs, those
# images WILL break within hours (that was the original production bug). Zero
# Airtable URLs means nothing left in the page can expire.
set -uo pipefail

URL="${1:-https://dss-website-fawn.vercel.app}"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
PAGES=(/ /about /partners /join /acadev /consulting /social-good /contact)
pass=0; fail=0
ok(){ printf "  \033[32mPASS\033[0m %s\n" "$1"; pass=$((pass+1)); }
no(){ printf "  \033[31mFAIL\033[0m %s\n" "$1"; fail=$((fail+1)); }

get(){ curl -s -L -A "$UA" --max-time 30 "$URL$1"; }
code(){ curl -s -o /dev/null -w '%{http_code}' -L -A "$UA" --max-time 30 "$URL$1"; }

echo "Verifying $URL"
echo
echo "1. Routes respond"
for p in "${PAGES[@]}"; do
  c=$(code "$p")
  [ "$c" = "200" ] && ok "$p -> 200" || no "$p -> $c"
done

echo
echo "2. No expiring Airtable URLs baked into the HTML  <-- the critical one"
total_air=0
for p in "${PAGES[@]}"; do
  n=$(get "$p" | grep -o "v5\.airtableusercontent\.com" | wc -l | tr -d " ")
  total_air=$((total_air + n))
done
if [ "$total_air" -eq 0 ]; then
  ok "0 Airtable CDN references across ${#PAGES[@]} pages"
else
  no "$total_air Airtable CDN references remain — these expire within hours"
  echo "       => an attachment failed to mirror; check the build log for"
  echo "          '[mirror-airtable] FAILED' lines"
fi

echo
echo "3. Mirrored assets are present and serving"
mirrored=$(for p in "${PAGES[@]}"; do get "$p" | grep -oE '/airtable/att[A-Za-z0-9]+\.[a-z0-9]+'; done | sort -u)
mcount=$(printf '%s\n' "$mirrored" | grep -c . || true)
if [ "$mcount" -gt 0 ]; then
  ok "$mcount distinct mirrored assets referenced"
  bad=0
  while read -r a; do
    [ -z "$a" ] && continue
    c=$(code "$a"); [ "$c" = "200" ] || { no "$a -> $c"; bad=$((bad+1)); }
  done <<< "$mirrored"
  [ "$bad" -eq 0 ] && ok "every mirrored asset returns 200"
else
  no "no /airtable/ assets referenced — did prebuild run?"
fi

echo
echo "4. Real Airtable content, not JSON fallbacks"
if get /join | grep -q "fallback-"; then
  no "/join is showing the SAMPLE recruitment timeline (Airtable fetch failed)"
else
  ok "/join shows the real Airtable timeline"
fi
# getExecProfiles() returns [] on failure and the page swaps in this copy, which
# is a direct signal independent of how images happen to be served.
if get /about | grep -q "Exec board profiles are on their way"; then
  no "/about shows the exec empty state — getExecProfiles() failed"
else
  ok "/about renders real exec profiles"
fi

echo
echo "5. Redirects"
check_redirect(){
  got=$(curl -s -o /dev/null -w '%{redirect_url}' -A "$UA" --max-time 30 "$URL$1" | sed "s|^$URL||")
  [ "$got" = "$2" ] && ok "$1 -> $2" || no "$1 -> '${got:-none}' (expected $2)"
}
check_redirect /committees/acadev /acadev
check_redirect /committees/consulting /consulting
check_redirect /home /
check_redirect /joinus /join
check_redirect /socialgood /social-good
check_redirect /decalinfo /acadev

echo
echo "6. Static assets under /committees/ are NOT swallowed by the redirect"
# Regression guard: the committee-route redirect was once written as
# /committees/:id, which also matched /committees/social-good-hero.jpg and 308'd
# every committee image into a 404. Any 308 here means that rule is too greedy.
asset_fail=0
for a in /committees/social-good-hero.jpg /committees/acadev-hero.jpg /committees/consulting-card.png; do
  c=$(curl -s -o /dev/null -w '%{http_code}' -A "$UA" --max-time 30 "$URL$a")
  [ "$c" = "200" ] || { no "$a -> $c (redirect rule is too greedy)"; asset_fail=$((asset_fail+1)); }
done
[ "$asset_fail" -eq 0 ] && ok "committee image assets serve directly"

echo
echo "7. Unknown paths 404 (root dynamic segment is guarded)"
c=$(code /definitely-not-a-page); [ "$c" = "404" ] && ok "unknown path -> 404" || no "unknown path -> $c"

echo
echo "─────────────────────────────────────"
echo "  $pass passed, $fail failed"
[ "$fail" -eq 0 ] && echo "  ✅ deployment verified" || echo "  ❌ see failures above"
exit $((fail > 0))
