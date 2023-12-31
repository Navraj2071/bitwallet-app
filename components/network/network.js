import { View } from "react-native";
import Container from "../subcomponents/container/container";
import { TouchableOpacity } from "react-native";
import { PrimaryAccentText } from "../subcomponents/text/text";
import Icon from "../subcomponents/icon/icon";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Network = ({ navigation }) => {
  const [network, setNetwork] = useState("");

  const poppulateNetwork = async () => {
    const selectednetwork = await AsyncStorage.getItem("network");
    if (
      selectednetwork &&
      selectednetwork !== null &&
      selectednetwork !== "null"
    ) {
      setNetwork(JSON.parse(selectednetwork).networkName);
    } else {
      await AsyncStorage.setItem(
        "network",
        JSON.stringify({ networkType: "mainnet", networkName: "Mainnet" })
      );
      setNetwork("Mainnet");
    }
  };

  useEffect(() => {
    poppulateNetwork();
  }, [navigation]);

  const selectNetwork = async (newNetwork, newNetworkname) => {
    await AsyncStorage.setItem(
      "network",
      JSON.stringify({ networkType: newNetwork, networkName: newNetworkname })
    );
    navigation.navigate("Home");
  };

  return (
    <Container>
      <View style={{ padding: 20, gap: 20 }}>
        <PrimaryAccentText>Select Network</PrimaryAccentText>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "#393644",
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => selectNetwork("mainnet", "Mainnet")}
        >
          <PrimaryAccentText align={"left"}>Mainnet</PrimaryAccentText>
          {network === "Mainnet" && (
            <Icon icon={"check"} height={30} width={30} fill="#3498DB" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            padding: 20,
            backgroundColor: "#393644",
            borderRadius: 20,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
          }}
          onPress={() => selectNetwork("testnet", "Testnet")}
        >
          <PrimaryAccentText align={"left"}>Testnet</PrimaryAccentText>
          {network === "Testnet" && (
            <Icon icon={"check"} height={30} width={30} fill="#3498DB" />
          )}
        </TouchableOpacity>
      </View>
    </Container>
  );
};

export default Network;
