import type { NestedKeysStripped } from '@payloadcms/translations'
import { enTranslations } from '@payloadcms/translations/languages/en'

export const customTranslations = {
    en: {
        general: {
            header: {
                label: 'Header',
            },
            footer: {
                label: 'Footer',
            },
            users: {
                label: {
                    plural : 'Users',
                    singular: 'User',
                }
            },
            pages: {
                label: {
                    plural : 'Pages',
                    singular: 'Page',
                }
            },
            categories: {
                label: {
                    plural : 'Categories',
                    singular: 'Category',
                }
            },
            media: {
                label: {
                    plural : 'Media',
                    singular: 'Media',
                }
            },
            forms: {
                label: {
                    plural : 'Forms',
                    singular: 'Form',
                }
            },
            formSubmissions: {
                label: {
                    plural : 'Form Submissions',
                    singular: 'Form Submission',
                }
            }
        },
    },
    pt: {
        general: {
            header: {
                label: 'Cabeçalho',
            },
            footer: {
                label: 'Rodapé',
            },
            users: {
                label: {
                    plural: 'Usuários',
                    singular: 'Usuário',
                }
            },
            pages: {
                label: {
                    plural: 'Páginas',
                    singular: 'Página',
                }
            },
            categories: {
                label: {
                    plural: 'Categorias',
                    singular: 'Categoria',
                }
            },
            media: {
                label: {
                    plural: 'Mídia',
                    singular: 'Mídia',
                }
            },
            forms: {
                label: {
                    plural: 'Formulários',
                    singular: 'Formulário',
                }
            },
            formSubmissions: {
                label: {
                    plural: 'Envios de Formulário',
                    singular: 'Envio de Formulário',
                }
            }
        },
    },
    ar: {
        general: {
            header: {
                label: 'رأس الصفحة',
            },
            footer: {
                label: 'تذييل',
            },
            users: {
                label: {
                    plural: 'المستخدمين',
                    singular: 'المستخدم',
                }
            },
            pages: {
                label: {
                    plural: 'الصفحات',
                    singular: 'الصفحة',
                }
            },
            categories: {
                label: {
                    plural: 'الفئات',
                    singular: 'الفئة',
                }
            },
            media: {
                label: {
                    plural: 'الوسائط',
                    singular: 'الوسائط',
                }
            },
            forms: {
                label: {
                    plural: 'النماذج',
                    singular: 'نموذج',
                }
            },
            formSubmissions: {
                label: {
                    plural: 'إرسالات النماذج',
                    singular: 'إرسال النموذج',
                }
            }
        },
    }
}

export type CustomTranslationsObject = typeof customTranslations.en &
    typeof enTranslations
export type CustomTranslationsKeys =
    NestedKeysStripped<CustomTranslationsObject>