import { createI18n, I18n } from 'vue-i18n';
import messages from '@intlify/unplugin-vue-i18n/messages';

export default function (): I18n {
  return createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'fr',
    fallbackLocale: 'en',
    messages: messages,
  });
}
