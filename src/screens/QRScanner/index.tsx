import {H2, H3} from '@components/Heading';
import {PayCard} from '@components/PayCard';
import {
  BottomSheetBackdrop,
  BottomSheetDraggableView,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';
import {useOracleInr} from '@hooks/useInr';
import {useOracleSol} from '@hooks/useSolPrice';
import {useWallet} from '@hooks/useWallet';
import {useIsFocused} from '@react-navigation/native';
import {View} from 'moti';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Linking,
  NativeModules,
  Pressable,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  MD3Colors,
  Text,
  TextInput,
} from 'react-native-paper';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {QRScreenProps} from 'src/types/navigation';
import {
  Barcode,
  BarcodeFormat,
  useScanBarcodes,
} from 'vision-camera-code-scanner';
import Icon from 'react-native-vector-icons/Feather';
import {launchImageLibrary} from 'react-native-image-picker';

const QRreader = (fileUrl: string) => {
  const QRScanReader = NativeModules.QRScanReader;
  return QRScanReader.readerQR(fileUrl);
};

enum SCANSTEPS {
  SCAN = 'scan',
  PAYMENT = 'payment',
}

export const QRScanner: React.FC<QRScreenProps> = ({navigation}) => {
  const [accepted, setAccepted] = useState(false);
  const devices = useCameraDevices();
  const device = useMemo(() => devices.back, [devices]);

  const [step, setStep] = useState(SCANSTEPS.SCAN);
  const [scannedCode, setScannedCode] = useState<
    Barcode | {content: {data: string}}
  >();
  const [scanning, setScanning] = useState(false);

  const {account} = useWallet();

  const [frameProcessor, barCodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });

  const {data: solanaPrice, isLoading: solanaPriceLoading} = useOracleSol({
    enabled: !!scannedCode,
  });

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['20%', '50%'], []);

  const {data: inrPrice, isLoading: inrPriceLoading} = useOracleInr({
    enabled: !!scannedCode,
  });

  const isLoading = inrPriceLoading || solanaPriceLoading;

  const [amount, setAmount] = useState<string | null>();

  const [solAmount, setSolAmount] = useState<number | null>();
  const [usdAmount, setUsdAmount] = useState<number | null>();

  const [active, setActive] = useState(true);

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      setActive(true);
    } else {
      setStep(SCANSTEPS.SCAN);
      setAmount(null);
      setSolAmount(null);
      setUsdAmount(null);
      setActive(false);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!amount) {
      return;
    }
    if (!isFocused) {
      setAmount(null);
    }
    const amountInUSD =
      Number(amount ?? '1') * Number.parseFloat(inrPrice?.value ?? '1');

    console.log(Number.parseFloat(inrPrice?.value ?? '1'));
    setUsdAmount(amountInUSD);
    const amountInSOL =
      amountInUSD / Number.parseFloat(solanaPrice?.value ?? '1');

    setSolAmount(Number(amountInSOL.toPrecision(5)));
  }, [amount, inrPrice?.value, solanaPrice?.value, inrPrice, isFocused]);

  const upiParams: URLSearchParams | null = useMemo(() => {
    if (!scannedCode) {
      return null;
    }

    const url = new URL(scannedCode.content.data as string);
    return url.searchParams;
  }, [scannedCode]);

  useEffect(() => {
    const check = async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission === 'not-determined') {
        const newStatus = await Camera.requestCameraPermission();
        if (newStatus === 'authorized') {
          setAccepted(true);
        }
      } else if (cameraPermission === 'authorized') {
        setAccepted(true);
      } else {
        ToastAndroid.show(
          'No Permissions set, please approve',
          ToastAndroid.LONG,
        );
        Linking.openSettings();
      }
    };
    check();
  }, [accepted]);

  useEffect(() => {
    if (barCodes.length > 0) {
      setStep(SCANSTEPS.PAYMENT);
    }
  }, [barCodes]);

  useEffect(() => {
    if (scannedCode) {
      setScanning(false);
      return;
    }
    if (step === SCANSTEPS.PAYMENT) {
      setScanning(true);
      const upiCode = barCodes?.find(_code => {
        try {
          const scheme = new URL(_code.content.data as string);
          return scheme.protocol === 'upi:';
        } catch (err) {
          return false;
        }
      });

      console.log(upiCode, 'code');

      if (!upiCode) {
        ToastAndroid.show('Invalid QR Code', ToastAndroid.SHORT);
        setStep(SCANSTEPS.SCAN);
      }

      setScannedCode(upiCode);
      setScanning(false);
    }
  }, [step, barCodes, scannedCode]);

  const imagePicker = useCallback(async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      presentationStyle: 'popover',
      selectionLimit: 1,
      includeBase64: true,
    });
    if (result.didCancel) {
      ToastAndroid.show('No Image selected', ToastAndroid.LONG);
      return;
    }
    if (!result.assets) {
      ToastAndroid.show('No Image selected', ToastAndroid.SHORT);
      return;
    }
    for (const asset of result.assets) {
      const qrResult = await QRreader(asset.uri!);
      try {
        const uri = new URL(qrResult);
        if (uri.protocol === 'upi:') {
          setScannedCode({
            content: {data: qrResult},
          });
          setStep(SCANSTEPS.PAYMENT);
          return;
        }
      } catch (e) {
        console.log(e);
      }
    }
    ToastAndroid.show('No UPI code in it', ToastAndroid.LONG);
  }, []);

  if (!device) {
    return <ActivityIndicator style={StyleSheet.absoluteFill} />;
  }

  return (
    <View style={{height: '100%', position: 'relative'}}>
      {step === SCANSTEPS.SCAN && (
        <>
          <Camera
            isActive={active}
            frameProcessor={frameProcessor}
            frameProcessorFps={5}
            device={device}
            enableZoomGesture
            onError={e => console.log(e)}
            style={StyleSheet.absoluteFill}
          />
          <Pressable onPress={imagePicker} style={styles.pickImage}>
            <Icon name={'image'} color={MD3Colors.primary100} size={25} />
          </Pressable>
        </>
      )}

      {step === SCANSTEPS.PAYMENT && (
        <>
          {(scanning || isLoading) && (
            <ActivityIndicator style={StyleSheet.absoluteFill} size={'large'} />
          )}
          {!scannedCode && (
            <View style={StyleSheet.absoluteFill}>
              <H2>No QR Found</H2>
            </View>
          )}
          {scannedCode && (
            <View style={{height: '100%'}}>
              {!isLoading && (
                <View style={styles.payments}>
                  <H2>You're Paying to:</H2>
                  <Text style={styles.userInfo}>
                    {upiParams?.get('pn') ?? 'Merchant'} (
                    {upiParams?.get('pa') ?? 'None'})
                  </Text>

                  <View style={styles.amountSection}>
                    <TextInput
                      placeholder="Enter amount"
                      keyboardType="number-pad"
                      onChangeText={e => setAmount(e)}
                    />
                    <View style={styles.amountDescription}>
                      {solAmount && (
                        <Text>{`Amount in SOL: ${solAmount?.toPrecision(
                          2,
                        )}`}</Text>
                      )}
                      {usdAmount && (
                        <Text>{`Amount in USD: ${usdAmount?.toPrecision(
                          2,
                        )}`}</Text>
                      )}
                    </View>
                  </View>
                  <Button
                    onPress={() => sheetRef.current?.present()}
                    mode="contained"
                    style={{top: '20%'}}>
                    Pay
                  </Button>
                </View>
              )}
            </View>
          )}
        </>
      )}
      <BottomSheetModal
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableOverDrag
        enableDismissOnClose
        enableHandlePanningGesture
        // eslint-disable-next-line react/no-unstable-nested-components
        backdropComponent={props => (
          <BottomSheetBackdrop
            {...props}
            pressBehavior={'close'}
            onPress={() => {
              sheetRef.current?.close();
            }}
          />
        )}>
        <BottomSheetDraggableView style={styles.sheetModal}>
          <H3>Please confirm the Transaction</H3>
          <View style={{marginTop: 5}}>
            <PayCard
              label={"You're Paying to:"}
              value={upiParams?.get('pa') ?? ''}
            />
            <PayCard
              label="You're Paying from account: "
              trim
              value={account?.publicKey.toBase58() ?? ''}
            />
            <View style={styles.action}>
              <Button
                onPress={() => {
                  navigation.navigate('Payment', {
                    amount,
                    solAmount,
                    usdAmount,
                    upiParams: Object.fromEntries(upiParams?.entries() ?? []),
                    inr: inrPrice?.value,
                    sol: solanaPrice?.value,
                  });
                  sheetRef.current?.close();
                }}
                style={styles.complete}
                mode="contained">
                <H3 style={{color: MD3Colors.primary100}}>Complete</H3>
              </Button>
              <Button
                onPress={() => sheetRef.current?.close()}
                mode="contained-tonal">
                <H3>Cancel</H3>
              </Button>
            </View>
          </View>
        </BottomSheetDraggableView>
      </BottomSheetModal>
    </View>
  );
};

const styles = StyleSheet.create({
  barcodeTextURL: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  payments: {
    marginTop: 30,
    paddingHorizontal: 20,
    height: '100%',
  },
  userInfo: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '700',
  },
  amountSection: {
    marginTop: 20,
  },
  amountDescription: {
    marginTop: 20,
  },
  sheetModal: {
    padding: 20,
    zIndex: 10,
  },
  action: {
    marginTop: 20,
  },
  complete: {
    marginBottom: 20,
  },
  pickImage: {
    position: 'absolute',
    bottom: '15%',
    left: '50%',
    padding: 5,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: MD3Colors.primary100,
    transform: [{translateX: -12.5}],
  },
});
