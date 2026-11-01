# Phase 7 — fresh jury re-score and close-out

Run only after every earlier phase is committed. The old card must never
influence this one: same workflow, brand-new critic, no old scores shown.

## Steps

1. Rename the old card:
   `.jury/127.0.0.1-4400/scorecard.md` → `scorecard-1.md`.
2. Serve production-identical output on 4400:

   ```bash
   node C:\Users\VICTUS\.agents\skills\jury\scripts\serve.mjs "D:\Study\Coding\Portfolio" --port 4400
   ```

3. Capture fresh evidence into a NEW directory:

   ```bash
   node C:\Users\VICTUS\.agents\skills\jury\scripts\shoot.mjs http://127.0.0.1:4400 --crawl --nav --out "D:\Study\Coding\Portfolio\.jury\127.0.0.1-4400-rescore\shots"
   node C:\Users\VICTUS\.agents\skills\jury\scripts\audit.mjs http://127.0.0.1:4400 > "D:\Study\Coding\Portfolio\.jury\127.0.0.1-4400-rescore\audit.txt"
   ```

   Expect audit 0 FAIL / 0 WARN.
4. Spawn a **fresh** critic subagent with the brief from
   `C:\Users\VICTUS\.agents\skills\jury\references\quality-bar.md`
   ("Critic brief"), filled in with the new shots dir and audit path. Give it
   nothing else: no DESIGN.md, no old scorecard, no fix list, no concept
   notes. (Playwright + axe-core are already installed in `~/.cache/jury`;
   run the scripts from there.)
5. Write `.jury/127.0.0.1-4400-rescore/scorecard.md`, then compare per
   category against the old card in chat only.
6. Regression check — all of these must now be clear in the new evidence:
   - `keyboard.invisibleFocus` empty (was: 4 GitHub icon links)
   - home `noHoverChange` empty and 404 `noHoverChange` empty
   - audit WARNs gone (canonical, twitter, robots, sitemap, 404 h1)
   - valve beads stay clay through a deflect cycle (click test)
   - no orphan "of." at d-03/m-02; contact gap tightened at d-07
7. If any category dropped below its old score, treat it as a regression:
   find the causing commit with `git log`/`git revert <sha>`, fix, re-run
   steps 2–6. Do not argue the score up; dispute only with a screenshot the
   critic misread.

## Close-out

- Run the full AGENTS.md chain once more over the finished tree
  (verifier → reviewer → committer) if anything is uncommitted.
- Report to the owner: old vs new table, the two fixes that moved the
  needle most, and what is still owner-blocked (phase 5 items not yet
  answered).
- Never push. Push is a separate, explicit owner request.

## Done when

A new independent card exists, every listed regression check is clear, and
the tree is clean.
