## Summary

Fix iOS inline math line-height alignment by preserving the current font attribute on the math attachment string.

Inline math is rendered as an `NSTextAttachment`. The attachment string did not receive `NSFontAttributeName`, even though surrounding text does. In the current `0.7` nightly, paragraph line-height baseline-offset handling depends on font attributes, so the attachment character can be skipped or handled differently from surrounding text.

This PR keeps the change narrow: it does not add a custom placement path for math attachments. It only gives the attachment string the same current font attribute already used by surrounding text.

## Changes

- Convert the inline math attachment string to a mutable attributed string.
- Add `NSFontAttributeName` to the attachment string when `currentFont` is available.
- Leave attachment bounds and block line-height propagation unchanged.

## Reproduction

Minimal reproduction:

https://github.com/eliotgevers/react-native-enriched-markdown-inline-math-repro

The repro uses `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3` and compares the current nightly with this fix in the same iOS app.

## Test Plan

- Verified the repro on iOS Simulator with `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3`.
- Compared current nightly against the candidate patch using the same simulator, same markdown, and same crop.
- Verified that the patch improves larger inline math formulas such as fractions and sums.
- Rebuilt a real Expo iOS app using the same patch and confirmed `ENRMMathInlineRenderer.m` compiled with the change.

Note: shallow zero-depth formulas such as `$2\pi$` can still have a smaller residual optical offset after this fix. I am treating that as a separate follow-up issue because it appears to involve math box/baseline semantics rather than the missing font attribute fixed here.

Fixes #457
Related to #458
