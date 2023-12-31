import Container from "../../subcomponents/container/container";
import {
  PrimaryAccentText,
  SecondaryText,
  ErrorText,
} from "../../subcomponents/text/text";
import { PrimaryButton, LinkButton } from "../../subcomponents/button/button";
import { View } from "react-native";
import Input from "../../subcomponents/input/input";
import { useState } from "react";
import { Loading } from "../../subcomponents/loading/loadingPage";
import { importkeys } from "../../subcomponents/api/nodeserver";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useNotifications from "../../notifications/notifications";
import { registerDevice } from "../../subcomponents/api/nodeserver";

const ImportAccount = ({ navigation }) => {
  const [phrase, setPhrase] = useState("");
  const [isloading, setisloading] = useState(false);
  const [error, setError] = useState("");
  const { notification, expoPushToken, registerForPushNotificationsAsync } =
    useNotifications();

  const findAccount = async () => {
    setError("");
    const words = phrase.split(" ");

    if (words.length !== 12) {
      setError("Passphrase should have 12 words. No extra spaces.");
      return;
    }

    setisloading(true);

    await importkeys(phrase)
      .then(async (res) => {
        const keys = res.data.keys;
        await AsyncStorage.setItem("phrase", keys.seedPhrase);
        await AsyncStorage.setItem("publicKey", keys.publicKey);
        await AsyncStorage.setItem("secretKey", keys.secretKey);
        try {
          const token = await registerForPushNotificationsAsync();
          await registerDevice(token.data);
        } catch {
          console.log("could not register device---");
        }
        navigation.navigate("Home");
      })
      .catch((err) => console.log(err));
    setisloading(false);
  };

  return (
    <Container>
      <View
        style={{
          flex: 1,
          padding: 20,
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <View style={{ width: 60 }}>
          <LinkButton
            title="< Back"
            onPress={() => navigation.navigate("CreateorImport")}
          />
        </View>

        <View style={{ gap: 10 }}>
          <PrimaryAccentText>
            Recover Existing Account Using Passphrase
          </PrimaryAccentText>
          <SecondaryText>
            Enter the backup passphrase associated with the account.
          </SecondaryText>
        </View>
        <Input
          label="Passphrase (12 words)"
          placeholder="Enter phrase..."
          value={phrase}
          onChangeText={(e) => setPhrase(e.toString().toLowerCase())}
        />
        <ErrorText>{error}</ErrorText>

        {isloading ? (
          <View style={{ padding: 20 }}>
            <Loading />
          </View>
        ) : (
          <PrimaryButton title="Find My Account" onPress={findAccount} />
        )}
      </View>
    </Container>
  );
};

export default ImportAccount;
