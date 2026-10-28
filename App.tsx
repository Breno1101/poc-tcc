import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const API_URL = 'http://SEU_IP:3000/diagnostico';
const REQUEST_TIMEOUT_MS = 10_000;

type Diagnosis = {
  doenca: string;
  confianca: number;
};

type AnalysisState = 'idle' | 'loading' | 'success' | 'error';

export default function App() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<Diagnosis | null>(null);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [message, setMessage] = useState<string | null>(null);

  const handleImageResult = (result: ImagePicker.ImagePickerResult) => {
    if (result.canceled) {
      setMessage('Captura cancelada. Você pode tentar novamente.');
      return;
    }

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setDiagnosis(null);
    setAnalysisState('idle');
    setMessage(null);
  };

  const takePhoto = async () => {
    setMessage(null);

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setMessage('Permissão da câmera negada. Autorize o acesso para fotografar.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      handleImageResult(result);
    } catch {
      setMessage('Não foi possível abrir a câmera. Tente novamente.');
    }
  };

  const chooseFromGallery = async () => {
    setMessage(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage('Permissão da galeria negada. Autorize o acesso para escolher uma foto.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });
      handleImageResult(result);
    } catch {
      setMessage('Não foi possível abrir a galeria. Tente novamente.');
    }
  };

  const analyzeImage = async () => {
    if (!imageUri || analysisState === 'loading') {
      return;
    }

    setAnalysisState('loading');
    setDiagnosis(null);
    setMessage(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const imageResponse = await fetch(imageUri, { signal: controller.signal });
      if (!imageResponse.ok) {
        throw new Error('Não foi possível preparar a imagem para envio.');
      }

      const imageBlob = await imageResponse.blob();
      const formData = new FormData();
      formData.append('foto', imageBlob, `soja-${Date.now()}.jpg`);

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Servidor respondeu com status ${response.status}.`);
      }

      const result: unknown = await response.json();
      if (
        typeof result !== 'object' ||
        result === null ||
        !('doenca' in result) ||
        !('confianca' in result) ||
        typeof result.doenca !== 'string' ||
        typeof result.confianca !== 'number' ||
        result.confianca < 0 ||
        result.confianca > 1
      ) {
        throw new Error('A resposta do servidor está em formato inválido.');
      }

      setDiagnosis({ doenca: result.doenca, confianca: result.confianca });
      setAnalysisState('success');
    } catch (error) {
      setAnalysisState('error');
      if (error instanceof Error && error.name === 'AbortError') {
        setMessage('A análise demorou mais de 10 segundos. Verifique a conexão e tente novamente.');
      } else if (error instanceof TypeError) {
        setMessage('Não foi possível conectar ao servidor. Verifique a rede e tente novamente.');
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Não foi possível analisar a foto. Tente novamente.');
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>PoC TCC · SOJA</Text>
        <Text style={styles.title}>Diagnóstico da folha</Text>
        <Text style={styles.subtitle}>
          Fotografe ou escolha uma imagem para consultar a análise simulada.
        </Text>

        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={takePhoto} disabled={analysisState === 'loading'}>
            <Text style={styles.primaryButtonText}>Fotografar</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={chooseFromGallery} disabled={analysisState === 'loading'}>
            <Text style={styles.secondaryButtonText}>Escolher da galeria</Text>
          </Pressable>
        </View>

        {imageUri ? (
          <View style={styles.previewCard}>
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
            <Text style={styles.previewCaption}>Imagem selecionada</Text>
          </View>
        ) : (
          <View style={styles.emptyPreview}>
            <Text style={styles.emptyPreviewText}>Sua foto aparecerá aqui</Text>
          </View>
        )}

        {message ? (
          <View style={styles.messageBox}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}

        {imageUri ? (
          <Pressable
            style={[styles.analyzeButton, analysisState === 'loading' && styles.disabledButton]}
            onPress={analyzeImage}
            disabled={analysisState === 'loading'}
          >
            {analysisState === 'loading' ? (
              <View style={styles.loadingContent}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.analyzeButtonText}>Analisando...</Text>
              </View>
            ) : (
              <Text style={styles.analyzeButtonText}>
                {analysisState === 'error' ? 'Tentar novamente' : 'Analisar'}
              </Text>
            )}
          </Pressable>
        ) : null}

        {diagnosis ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Resultado</Text>
            <Text style={styles.disease}>{diagnosis.doenca}</Text>
            <Text style={styles.confidence}>
              Confiança: {Math.round(diagnosis.confianca * 100)}%
            </Text>
          </View>
        ) : null}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f4f8f2',
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  eyebrow: {
    color: '#4f7d35',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#19321a',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#526052',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
  },
  actions: {
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#3e6e2b',
    borderRadius: 12,
    padding: 16,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#3e6e2b',
    borderRadius: 12,
    borderWidth: 1,
    padding: 15,
  },
  secondaryButtonText: {
    color: '#3e6e2b',
    fontSize: 16,
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  preview: {
    height: 240,
    width: '100%',
  },
  previewCaption: {
    color: '#526052',
    fontSize: 13,
    padding: 12,
  },
  emptyPreview: {
    alignItems: 'center',
    backgroundColor: '#e5eee1',
    borderColor: '#c4d6bd',
    borderRadius: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    height: 180,
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyPreviewText: {
    color: '#71806e',
    fontSize: 15,
  },
  messageBox: {
    backgroundColor: '#fff1e9',
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
  },
  messageText: {
    color: '#9b452d',
    fontSize: 14,
    lineHeight: 20,
  },
  analyzeButton: {
    alignItems: 'center',
    backgroundColor: '#ba6d2d',
    borderRadius: 12,
    padding: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  analyzeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderLeftColor: '#3e6e2b',
    borderLeftWidth: 4,
    borderRadius: 12,
    marginTop: 20,
    padding: 18,
  },
  resultLabel: {
    color: '#71806e',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  disease: {
    color: '#19321a',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
  },
  confidence: {
    color: '#526052',
    fontSize: 16,
    marginTop: 8,
  },
});
