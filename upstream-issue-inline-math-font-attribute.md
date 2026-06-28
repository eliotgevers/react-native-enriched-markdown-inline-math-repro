## iOS inline math attachments miss the active font attribute

### Summary

Inline math on iOS is rendered as an `NSTextAttachment`. In the current `0.7` nightly, the attachment string is appended without the active `NSFontAttributeName`, while surrounding text has a font attribute from the current block style.

That matters because `0.7` now has paragraph line-height baseline-offset handling. When the math attachment character has no font attribute, it does not participate in that attribution-dependent pass the same way surrounding text does.

The relevant code path still looks like this in `0.7.0-nightly-20260627-4e5ceb7c3`:

```objc
NSAttributedString *attachmentString = [NSAttributedString attributedStringWithAttachment:attachment];
[output appendAttributedString:attachmentString];
```

### Reproduction

Minimal Expo/iOS reproduction:

https://github.com/eliotgevers/react-native-enriched-markdown-inline-math-repro

Run:

```sh
npm install
npm run ios
```

The repro uses `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3` on purpose. Current 0.7 code applies `applyBaselineOffset(...)` after `applyLineHeight(...)` in `ios/renderer/ParagraphRenderer.m`; that helper reads `NSFontAttributeName` in `ios/utils/ParagraphStyleUtils.m` to compute the font line height and add `NSBaselineOffsetAttributeName`. This issue is about the inline math attachment missing that font attribute, not the older pre-0.7 line-height behavior.

The image below compares the current nightly with the same app after applying the small candidate patch.

<img width="720" alt="iOS inline math comparison for missing font attribute on inline math attachments" src="https://raw.githubusercontent.com/eliotgevers/react-native-enriched-markdown-inline-math-repro/main/assets/inline-math-font-attribute-comparison-ios.png" />

### Expected behavior

Inline math attachments should carry the current font attribute so they participate in the same font/line-height baseline adjustment as surrounding text.

### Actual behavior

In the current nightly, math rows such as fractions and sums sit visibly lower than the row center when paragraph `lineHeight` is larger than the natural font line height. Adding the current font attribute to the attachment string makes those rows align with the baseline-offset logic that already handles normal text.

Note: shallow formulas such as `$2\pi$` still have a smaller residual visual offset after this patch. I believe that is a separate math-box/optical-centering issue, not the missing font attribute issue described here.

### Suggested fix

Create the attachment string as mutable and add the current font attribute before appending it:

```objc
NSMutableAttributedString *attachmentString =
    [[NSAttributedString attributedStringWithAttachment:attachment] mutableCopy];
if (currentFont) {
  [attachmentString addAttribute:NSFontAttributeName value:currentFont range:NSMakeRange(0, attachmentString.length)];
}
[output appendAttributedString:attachmentString];
```

This keeps the fix inside the default iOS renderer and avoids requiring consumers to add app-specific transforms or special inline-math styling.

### Environment

- `react-native-enriched-markdown@0.7.0-nightly-20260627-4e5ceb7c3`
- `react-native@0.85.3`
- `expo@~56.0.12`
- iOS Simulator
