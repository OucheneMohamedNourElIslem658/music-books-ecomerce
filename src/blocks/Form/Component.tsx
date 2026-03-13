'use client'
import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'

import { RichText } from '@/components/RichText'
import { Button } from '@/components/ui/button'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { useRouter } from 'next/navigation'
import React, { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { cn } from '@/utilities/cn'
import { getClientSideURL } from '@/utilities/getURL'
import { Send } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { DefaultDocumentIDType } from 'payload'
import { buildInitialFormState } from './buildInitialFormState'
import { fields } from './fields'

export type Value = unknown

export interface Property {
  [key: string]: Value
}

export interface Data {
  [key: string]: Property | Property[]
}

export type FormBlockType = {
  blockName?: string
  blockType?: 'formBlock'
  enableIntro: boolean
  form: FormType
  introContent?: SerializedEditorState
}

export const FormBlock: React.FC<
  FormBlockType & {
    id?: DefaultDocumentIDType
  }
> = (props) => {
  const {
    enableIntro,
    form: formFromProps,
    form: { id: formID, confirmationMessage, confirmationType, redirect, submitButtonLabel } = {},
    introContent,
  } = props

  const t = useTranslations('blocks.form')

  const formMethods = useForm({
    defaultValues: buildInitialFormState(formFromProps.fields),
  })
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = formMethods

  const [isLoading, setIsLoading] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState<boolean>()
  const [error, setError] = useState<{ message: string; status?: string } | undefined>()
  const router = useRouter()

  const onSubmit = useCallback(
    (data: Data) => {
      let loadingTimerID: ReturnType<typeof setTimeout>
      const submitForm = async () => {
        setError(undefined)

        const dataToSend = Object.entries(data).map(([name, value]) => ({
          field: name,
          value,
        }))

        loadingTimerID = setTimeout(() => {
          setIsLoading(true)
        }, 1000)

        try {
          const req = await fetch(`${getClientSideURL()}/api/form-submissions`, {
            body: JSON.stringify({
              form: formID,
              submissionData: dataToSend,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
          })

          const res = await req.json()
          clearTimeout(loadingTimerID)

          if (req.status >= 400) {
            setIsLoading(false)
            setError({
              message: res.errors?.[0]?.message || t('error.internal'),
              status: res.status,
            })
            return
          }

          setIsLoading(false)
          setHasSubmitted(true)

          if (confirmationType === 'redirect' && redirect) {
            const { url } = redirect
            if (url) router.push(url)
          }
        } catch (err) {
          console.warn(err)
          setIsLoading(false)
          setError({ message: t('error.generic') })
        }
      }

      void submitForm()
    },
    [router, formID, redirect, confirmationType, t],
  )

  return (
    <div className="container flex flex-col items-center">

      {/* Intro */}
      {enableIntro && introContent && !hasSubmitted && (
        <div className="w-full max-w-240 px-4 text-center mb-16">
          <RichText
            className={cn(
              'space-y-4',
              '[&_h1]:text-foreground [&_h1]:text-4xl [&_h1]:md:text-6xl [&_h1]:font-black [&_h1]:tracking-tighter [&_h1]:leading-tight',
              '[&_p]:text-muted-foreground [&_p]:text-lg [&_p]:max-w-2xl [&_p]:mx-auto',
            )}
            data={introContent}
            enableGutter={false}
          />
        </div>
      )}

      {/* Scroll container */}
      <div className="w-full max-w-200 px-4 relative mt-8">

        {/* Scroll top rod */}
        <div className="absolute -top-6 left-0 right-0 h-12 bg-accent-gold rounded-t-full shadow-lg z-10 mx-8" />

        {/* Parchment box — uses CSS vars so it adapts to light/dark automatically */}
        <div
          className="relative overflow-hidden rounded-lg p-8 md:p-12 shadow-2xl"
          style={{ background: 'linear-gradient(135deg, oklch(92.41% 0.087 86.15deg) 0%, oklch(87.52% 0.092 86.15deg) 100%)' }}
        >

          {/* Subtle dot texture */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[radial-gradient(circle_at_center,currentColor_1px,transparent_1px)] bg-size-[32px_32px]" />

          <div className="relative z-20">
            <FormProvider {...formMethods}>

              {/* Success message */}
              {!isLoading && hasSubmitted && confirmationType === 'message' && (
                <div className="text-center py-8">
                  <RichText
                    className="[&_p]:text-slate-900 [&_p]:text-xl [&_p]:font-bold"
                    data={confirmationMessage}
                  />
                </div>
              )}

              {/* Loading */}
              {isLoading && !hasSubmitted && (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold text-slate-900/60 uppercase tracking-widest text-xs">
                    {t('loading')}
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-xl mb-8 text-center font-bold">
                  {`${error.status || '500'}: ${error.message || ''}`}
                </div>
              )}

              {/* Form */}
              {!hasSubmitted && !isLoading && (
                <form
                  id={formID}
                  onSubmit={handleSubmit(onSubmit)}
                  className={cn(
                    'space-y-8',
                    '[&_label]:text-slate-900/80 [&_label]:text-xs [&_label]:font-black [&_label]:uppercase [&_label]:tracking-[0.2em] [&_label]:pl-2',
                    '[&_input]:rounded-xl [&_input]:border-slate-900/10 [&_input]:bg-white/40 [&_input]:backdrop-blur-md [&_input]:h-14 [&_input]:text-slate-900 [&_input]:placeholder:text-slate-900/30 [&_input]:focus:ring-primary [&_input]:transition-all',
                    '[&_textarea]:rounded-xl [&_textarea]:border-slate-900/10 [&_textarea]:bg-white/40 [&_textarea]:backdrop-blur-md [&_textarea]:text-slate-900 [&_textarea]:placeholder:text-slate-900/30 [&_textarea]:focus:ring-primary [&_textarea]:transition-all',
                  )}
                >
                  <div className="grid grid-cols-1 gap-6">
                    {formFromProps?.fields?.map((field, index) => {
                      const Field: React.FC<any> | undefined =
                        fields?.[field.blockType as keyof typeof fields]

                      if (Field) {
                        return (
                          <Field
                            key={index}
                            form={formFromProps}
                            {...field}
                            {...formMethods}
                            control={control}
                            errors={errors}
                            register={register}
                          />
                        )
                      }
                      return null
                    })}
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      form={formID}
                      type="submit"
                      className="group min-w-60 h-16 rounded-full bg-primary text-primary-foreground text-lg font-black shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                      {submitButtonLabel || t('submit')}
                      <Send className="size-5 ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Button>
                  </div>
                </form>
              )}

            </FormProvider>
          </div>
        </div>

        {/* Scroll bottom rod */}
        <div className="absolute -bottom-6 left-0 right-0 h-12 bg-accent-gold rounded-b-full shadow-lg z-10 mx-8" />
      </div>
    </div>
  )
}