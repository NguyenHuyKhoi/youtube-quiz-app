import {EN, VN} from '@assets/locales';
import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
i18next.use(initReactI18next).init({
  lng: 'vi',
  resources: {
    en: EN,
    vi: VN,
  },
  react: {
    useSuspense: false,
  },
});
export default i18next;
