import React from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type StatusType = 'success' | 'error' | 'warning' | 'info';

export interface StatusModalProps {
  visible: boolean;
  type: StatusType;
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const { width } = Dimensions.get('window');

export default function StatusModal({
  visible,
  type,
  title,
  message,
  buttonLabel = 'Đóng',
  onClose,
  onConfirm,
}: StatusModalProps) {
  const theme = useTheme();

  const getStatusConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'check-circle-outline',
          color: '#528F72',
          bgColor: '#528F7215'
        };
      case 'error':
        return {
          icon: 'alert-circle-outline',
          color: '#FF5252',
          bgColor: '#FF525215'
        };
      case 'warning':
        return {
          icon: 'alert-outline',
          color: '#FFB300',
          bgColor: '#FFB30015'
        };
      default:
        return {
          icon: 'information-outline',
          color: theme.colors.primary,
          bgColor: theme.colors.primary + '15'
        };
    }
  };

  const config = getStatusConfig();

  const handleButtonPress = () => {
    if (type === 'warning' && onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: config.bgColor }]}>
              <MaterialCommunityIcons name={config.icon as any} size={48} color={config.color} />
            </View>

            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: config.color }]}
              onPress={handleButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>{buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  content: {
    padding: 30,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E1E1E',
    textAlign: 'center',
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
