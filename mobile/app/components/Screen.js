import { SafeAreaView, StyleSheet, View } from "react-native";
import OfflineNotice from "./OfflineNotice";
import { StatusBar } from "expo-status-bar";

const Screen = ({ children, style }) => {
  return (
    <View style={{ flex: 1 }}>
      <OfflineNotice />

      <SafeAreaView style={[styles.screen, style]}>
        <View style={[styles.container, style]}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default Screen;
