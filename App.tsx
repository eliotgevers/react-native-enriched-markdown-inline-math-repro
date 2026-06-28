import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { EnrichedMarkdownText } from "react-native-enriched-markdown";

const rows = [
  {
    label: "Plain text, lineHeight 30",
    markdown: "2pi",
    lineHeight: 30,
  },
  {
    label: "Inline math: shallow 2pi, lineHeight 30",
    markdown: "$2\\pi$",
    lineHeight: 30,
  },
  {
    label: "Mixed text + shallow math, lineHeight 30",
    markdown: "Value: $2\\pi$",
    lineHeight: 30,
  },
  {
    label: "Inline math: variable x, lineHeight 30",
    markdown: "$x$",
    lineHeight: 30,
  },
  {
    label: "Inline math: descender g, lineHeight 30",
    markdown: "$g$",
    lineHeight: 30,
  },
  {
    label: "Inline fraction, lineHeight 34",
    markdown: "$\\frac{a}{b}$",
    lineHeight: 34,
  },
  {
    label: "Inline sum, lineHeight 38",
    markdown: "$\\sum_{i=0}^{n} i$",
    lineHeight: 38,
  },
  {
    label: "Compact mixed row, lineHeight 18",
    markdown: "Value: $2\\pi$",
    lineHeight: 18,
  },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>Inline math alignment repro</Text>
          <Text style={styles.description}>
            Each row has a fixed height and a red center line. The rows compare plain text, shallow inline math, and
            taller formulas using the same paragraph font size and explicit lineHeight values.
          </Text>

          {rows.map((row) => (
            <View key={row.label} style={styles.caseBlock}>
              <Text style={styles.label}>{row.label}</Text>
              <View style={styles.row}>
                <View pointerEvents="none" style={styles.centerLine} />
                <EnrichedMarkdownText
                  allowTrailingMargin={false}
                  flavor="github"
                  markdown={row.markdown}
                  markdownStyle={{
                    paragraph: {
                      fontSize: 16,
                      lineHeight: row.lineHeight,
                      marginTop: 0,
                      marginBottom: 0,
                      color: "#111827",
                    },
                  }}
                  containerStyle={styles.markdownContainer}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    gap: 18,
  },
  title: {
    color: "#0f172a",
    fontSize: 22,
    fontWeight: "700",
  },
  description: {
    color: "#334155",
    fontSize: 14,
    lineHeight: 20,
  },
  caseBlock: {
    gap: 8,
  },
  label: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    height: 52,
    justifyContent: "center",
    overflow: "hidden",
    borderColor: "#cbd5e1",
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
  },
  centerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 25.5,
    height: 1,
    backgroundColor: "#ef4444",
  },
  markdownContainer: {
    justifyContent: "center",
  },
});
