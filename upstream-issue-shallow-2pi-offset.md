## Shallow `2\pi` inline math still sits visually low

### Summary

This is separate from the missing `NSFontAttributeName` issue for iOS inline math attachments.

After adding the active font attribute to the inline math attachment string, larger formulas such as fractions and sums align much better with the surrounding line-height behavior. However, shallow zero-depth formulas such as `$2\pi$` can still look optically low compared with plain text in the same fixed-height row.

This appears to come from the math box reported by RaTeX, not from the missing font attribute. For example, `2\pi` is reported as a shallow formula with height above the baseline and no depth below the baseline. Aligning the formula baseline is technically consistent, but the visible ink can still sit lower than comparable plain text in centered UI rows.

### Reproduction

Minimal Expo/iOS reproduction:

https://github.com/eliotgevers/react-native-enriched-markdown-inline-math-repro

Run:

```sh
npm install
npm run ios
```

The repro uses `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3` so this is tested against the current 0.7 nightly line-height behavior. In 0.7, `ios/renderer/ParagraphRenderer.m` applies `applyBaselineOffset(...)` after `applyLineHeight(...)`, and the helper in `ios/utils/ParagraphStyleUtils.m` uses `NSFontAttributeName` to compute the font line height. That matters because the first issue fixes the missing font attribute, while this issue is about the remaining shallow-formula visual offset after that fix.

The image below highlights the residual shallow-formula case after the font-attribute fix. The red line marks the row center.

<img width="520" alt="Shallow inline math formula 2 pi remains visually low compared with plain text" src="https://raw.githubusercontent.com/eliotgevers/react-native-enriched-markdown-inline-math-repro/main/assets/shallow-inline-math-residual-ios.png" />

### Expected behavior

Shallow inline formulas should not look visibly lower than plain text when rendered in the same centered row with the same paragraph font size and line height.

### Actual behavior

`$2\pi$` remains visually low compared with plain text, even after the attachment receives the current font attribute. Taller formulas such as `\frac{a}{b}` and `\sum_{i=0}^{n} i` look much better because their math boxes have meaningful height/depth balance.

### Notes

I am not sure this should be fixed by changing the existing baseline rule directly. RaTeX and the native attachment path currently align the math baseline to the surrounding text baseline, which is important for real formulas in prose. A fix may need to be narrowly scoped to shallow zero-depth inline formulas, or exposed as an alignment option, so larger formulas do not get overcorrected.

### Environment

- `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3`
- `react-native@0.85.3`
- `expo@~56.0.12`
- iOS Simulator
