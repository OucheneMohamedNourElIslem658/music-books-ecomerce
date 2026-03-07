import type { Form } from '@/payload-types'
import { RequiredDataFromCollectionSlug } from 'payload'

export const contactPageData = ({
  contactForm,
}: {
  contactForm: Form
}): RequiredDataFromCollectionSlug<'pages'> => ({
  slug: 'contact',
  _status: 'published',
  title: 'Reach the Author\'s Tower',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            tag: 'h1',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Send a Raven to the High Tower', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            version: 1,
          },
          {
            type: 'paragraph',
            children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'Your missive will be carried by starlight across the enchanted forests. Write your legend below.', version: 1 }],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
    links: [],
  },
  layout: [
    {
      blockType: 'formBlock',
      enableIntro: true,
      form: contactForm,
      introContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'heading',
              tag: 'h3',
              children: [{ type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text: 'The Messenger Scroll', version: 1 }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  ],
  meta: {
    title: 'Reach the Author\'s Tower | Contact',
    description: 'Send a message to the Composer-Author. Your missive will be carried by starlight.',
  },
})

export const contactFormData = () => ({
  confirmationMessage: {
    root: {
      type: 'root' as const,
      children: [
        {
          type: 'heading' as const,
          tag: 'h2' as const,
          children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Your raven has been dispatched! The Chronicler will respond soon.', version: 1 }],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      ],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  },
  confirmationType: 'message' as const,
  emails: [
    {
      emailFrom: '"Melody & Myth" <noreply@melodymyth.com>',
      emailTo: '{{email}}',
      message: {
        root: {
          type: 'root' as const,
          children: [
            {
              type: 'paragraph' as const,
              children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Your message to the Author\'s Tower has been received. The Chronicler will be in touch soon.', version: 1 }],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              textFormat: 0,
              version: 1,
            },
          ],
          direction: 'ltr' as const,
          format: '' as const,
          indent: 0,
          version: 1,
        },
      },
      subject: 'Your raven has reached the tower.',
    },
  ],
  fields: [
    { name: 'full-name', blockName: 'full-name', blockType: 'text' as const, label: 'Your Legend\'s Name', required: true, width: 100 },
    { name: 'email', blockName: 'email', blockType: 'email' as const, label: 'The Return Address', required: true, width: 100 },
    { name: 'message', blockName: 'message', blockType: 'textarea' as const, label: 'Your Missive', required: true, width: 100 },
  ],
  redirect: undefined,
  submitButtonLabel: 'Cast Message',
  title: 'Contact Form',
  updatedAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
})

// ─── Arabic translation ───────────────────────────────────────────────────────

export const contactPageAR = ({ contactForm }: { contactForm: Form }) => ({
  title: 'تواصل مع البرج',
  hero: {
    type: 'lowImpact' as const,
    richText: {
      root: {
        type: 'root' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
        children: [
          {
            type: 'heading' as const, tag: 'h1' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'أرسل غراباً إلى البرج العالي', version: 1 }]
          },
          {
            type: 'paragraph' as const, direction: 'rtl' as const, format: '' as const, indent: 0, textFormat: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'ستُحمل رسالتك بضوء النجوم عبر الغابات المسحورة. اكتب أسطورتك أدناه.', version: 1 }]
          },
        ],
      },
    },
    links: [],
  },
  layout: [
    {
      blockType: 'formBlock' as const,
      enableIntro: true,
      form: contactForm,
      introContent: {
        root: {
          type: 'root' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
          children: [
            {
              type: 'heading' as const, tag: 'h3' as const, direction: 'rtl' as const, format: '' as const, indent: 0, version: 1,
              children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'طومار المرسال', version: 1 }]
            },
          ],
        },
      },
    },
  ],
  meta: {
    title: 'تواصل مع برج المؤلف',
    description: 'أرسل رسالة إلى المؤلف الموسيقي. ستُحمل رسالتك بضوء النجوم.',
  },
})

// ─── Portuguese translation ───────────────────────────────────────────────────

export const contactPagePT = ({ contactForm }: { contactForm: Form }) => ({
  title: 'Contactar a Torre',
  hero: {
    type: 'lowImpact' as const,
    richText: {
      root: {
        type: 'root' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
        children: [
          {
            type: 'heading' as const, tag: 'h1' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'Envie um Corvo para a Torre Alta', version: 1 }]
          },
          {
            type: 'paragraph' as const, direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0, version: 1,
            children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'A sua mensagem será transportada pela luz das estrelas através das florestas encantadas. Escreva a sua lenda abaixo.', version: 1 }]
          },
        ],
      },
    },
    links: [],
  },
  layout: [
    {
      blockType: 'formBlock' as const,
      enableIntro: true,
      form: contactForm,
      introContent: {
        root: {
          type: 'root' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
          children: [
            {
              type: 'heading' as const, tag: 'h3' as const, direction: 'ltr' as const, format: '' as const, indent: 0, version: 1,
              children: [{ type: 'text' as const, detail: 0, format: 0, mode: 'normal' as const, style: '', text: 'O Pergaminho do Mensageiro', version: 1 }]
            },
          ],
        },
      },
    },
  ],
  meta: {
    title: 'Contactar a Torre do Autor',
    description: 'Envie uma mensagem ao Autor-Compositor. A sua mensagem será transportada pela luz das estrelas.',
  },
})