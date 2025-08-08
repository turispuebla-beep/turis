export default {
  name: 'CDSANABRIACF',
  slug: 'cdsanabriacf-mobile',
  version: '1.1.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#dc2626'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.cdsanabriacf.mobile'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#dc2626'
    },
    package: 'com.cdsanabriacf.mobile',
    permissions: [
      'android.permission.INTERNET',
      'android.permission.VIBRATE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
      'android.permission.WAKE_LOCK'
    ]
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    [
      'react-native-vector-icons',
      {
        android: true,
        ios: true
      }
    ]
  ],
  extra: {
    eas: {
      projectId: 'cdsanabriacf-mobile'
    }
  }
};
