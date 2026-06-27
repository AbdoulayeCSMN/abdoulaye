"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Textarea } from "@components/ui/textarea"
import { 
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldContent,
  FieldTitle,
} from "@components/ui/field"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@components/ui/card"
import { 
  Send, 
  User, 
  Mail, 
  Phone, 
  MessageSquare, 
  Check, 
  Shield,
  AlertCircle,
  Bot
} from "lucide-react"
import { Alert, AlertDescription } from "@components/ui/alert"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import ReCAPTCHA from "react-google-recaptcha"

// Fonction pour créer le schéma conditionnellement
const createContactSchema = (requireCaptcha: boolean) => {
  return z.object({
    name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().email("Adresse email invalide"),
    phone: z.string().optional(),
    subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
    message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
    recaptchaToken: requireCaptcha
      ? z.string().min(1, "Veuillez vérifier que vous n'êtes pas un robot")
      : z.string().optional(),
  })
}

type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>

interface ContactFormProps {
  title?: string
  description?: string
  submitText?: string
  showPhone?: boolean
  showCaptcha?: boolean
  recaptchaSiteKey?: string
  onSuccess?: () => void
  className?: string
}

export default function ContactForm({
  title = "Contactez-moi",
  description = "Remplissez le formulaire ci-dessous et je vous répondrai dans les plus brefs délais.",
  submitText = "Envoyer le message",
  showPhone = true,
  showCaptcha = false,
  recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
  onSuccess,
  className = "",
}: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null)
  const [recaptchaVerified, setRecaptchaVerified] = useState(false)
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle")
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  // Schéma conditionnel basé sur showCaptcha
  const contactSchema = useMemo(
    () => createContactSchema(showCaptcha),
    [showCaptcha]
  )

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      recaptchaToken: "",
    },
  })

  // Gérer le changement de reCAPTCHA
  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaValue(token)
    if (token) {
      setRecaptchaVerified(true)
      setValue("recaptchaToken", token)
    } else {
      setRecaptchaVerified(false)
      setValue("recaptchaToken", "")
    }
  }

  // Réinitialiser reCAPTCHA
  const resetRecaptcha = () => {
    setRecaptchaValue(null)
    setRecaptchaVerified(false)
    setValue("recaptchaToken", "")
    recaptchaRef.current?.reset()
  }

  // Réinitialiser l'état du captcha si showCaptcha devient false
  useEffect(() => {
    if (!showCaptcha) {
      setRecaptchaValue(null)
      setRecaptchaVerified(false)
      setValue("recaptchaToken", "")
    }
  }, [showCaptcha, setValue])

  // Vérifier la clé reCAPTCHA uniquement si le captcha est activé
  useEffect(() => {
    if (showCaptcha && !recaptchaSiteKey) {
      console.warn("Clé reCAPTCHA non définie. Utilisez NEXT_PUBLIC_RECAPTCHA_SITE_KEY")
    }
  }, [showCaptcha, recaptchaSiteKey])

  const onSubmit = async (data: ContactFormData) => {
    // Si le captcha est activé, vérifier qu'il est validé
    if (showCaptcha && (!recaptchaVerified || !recaptchaValue)) {
      setFormStatus("error")
      return
    }

    setIsLoading(true)
    setFormStatus("idle")

    try {
      // Vérification reCAPTCHA côté serveur (uniquement si activé)
      if (showCaptcha) {
        const recaptchaResponse = await fetch("/api/verify-recaptcha", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ recaptchaToken: data.recaptchaToken }),
        })

        const recaptchaResult = await recaptchaResponse.json()

        if (!recaptchaResult.success) {
          throw new Error("Échec de la vérification reCAPTCHA")
        }
      }
      
      // Envoi des données
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création')
      }

      setFormStatus("success")
      reset() // Réinitialise tous les champs du formulaire
      if (showCaptcha) {
        resetRecaptcha() // Réinitialise aussi le widget captcha
      }
      if (onSuccess) {
        onSuccess()
      }
      
      // Réinitialiser le statut après 5 secondes
      setTimeout(() => setFormStatus("idle"), 5000)
    } catch (error) {
      console.error("Erreur d'envoi:", error)
      setFormStatus("error")
      if (showCaptcha) {
        resetRecaptcha()
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className={`w-full max-w-2xl mx-auto shadow-lg border-border ${className}`}>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <FieldTitle>Informations personnelles</FieldTitle>
            <FieldDescription>
              Renseignez vos coordonnées pour que je puisse vous recontacter.
            </FieldDescription>
            
            <FieldGroup>
              {/* Nom */}
              <Field>
                <FieldLabel htmlFor="name">
                  <User className="h-4 w-4 mr-2" />
                  Nom complet *
                </FieldLabel>
                <Input
                  id="name"
                  placeholder="Votre nom et prénom"
                  {...register("name")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <FieldError>{errors.name.message}</FieldError>
                )}
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">
                  <Mail className="h-4 w-4 mr-2" />
                  Adresse email *
                </FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  {...register("email")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <FieldError>{errors.email.message}</FieldError>
                )}
              </Field>

              {/* Téléphone (optionnel) */}
              {showPhone && (
                <Field>
                  <FieldLabel htmlFor="phone">
                    <Phone className="h-4 w-4 mr-2" />
                    Téléphone
                    <span className="text-muted-foreground text-sm ml-1">(optionnel)</span>
                  </FieldLabel>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+33 1 23 45 67 89"
                    {...register("phone")}
                  />
                  <FieldDescription>
                    Facultatif, mais utile pour vous rappeler plus rapidement.
                  </FieldDescription>
                </Field>
              )}
            </FieldGroup>
          </FieldSet>

          <FieldSet>
            <FieldTitle>Votre message</FieldTitle>
            
            <FieldGroup>
              {/* Sujet */}
              <Field>
                <FieldLabel htmlFor="subject">Sujet *</FieldLabel>
                <Input
                  id="subject"
                  placeholder="Objet de votre message"
                  {...register("subject")}
                  className={errors.subject ? "border-destructive" : ""}
                />
                {errors.subject && (
                  <FieldError>{errors.subject.message}</FieldError>
                )}
              </Field>

              {/* Message */}
              <Field>
                <FieldLabel htmlFor="message">Message *</FieldLabel>
                <Textarea
                  id="message"
                  placeholder="Décrivez votre projet ou posez votre question..."
                  rows={5}
                  {...register("message")}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <FieldError>{errors.message.message}</FieldError>
                )}
                <FieldDescription>
                  Soyez aussi précis que possible pour une réponse adaptée.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>

          {/* Section reCAPTCHA (affichée uniquement si showCaptcha est true) */}
          {showCaptcha && (
            <FieldSet className="bg-muted/30 p-4 rounded-lg border">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <FieldTitle>Vérification de sécurité</FieldTitle>
              </div>
              
              <FieldDescription className="mb-4">
                Pour vérifier que vous n'êtes pas un robot, veuillez compléter le reCAPTCHA ci-dessous.
              </FieldDescription>

              <div className="space-y-4">
                {/* Champ caché pour le token reCAPTCHA */}
                <input type="hidden" {...register("recaptchaToken")} />
                
                {/* Widget reCAPTCHA */}
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={recaptchaSiteKey}
                    onChange={handleRecaptchaChange}
                    theme="light"
                    size="normal"
                  />
                </div>

                {/* Indicateur de vérification reCAPTCHA */}
                <div className={`flex items-center gap-2 p-3 rounded-md border transition-colors ${
                  recaptchaVerified 
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800" 
                    : "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                }`}>
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    recaptchaVerified 
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400" 
                      : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
                  }`}>
                    {recaptchaVerified ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {recaptchaVerified 
                        ? "✓ Vérification reCAPTCHA réussie" 
                        : "En attente de vérification reCAPTCHA"}
                    </p>
                    <p className="text-xs opacity-70">
                      {recaptchaVerified 
                        ? "Vous pouvez maintenant envoyer votre message." 
                        : "Veuillez compléter le reCAPTCHA ci-dessus."}
                    </p>
                  </div>
                </div>

                {/* Erreur reCAPTCHA (uniquement si le captcha est requis) */}
                {errors.recaptchaToken && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {errors.recaptchaToken.message}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Note sur la confidentialité */}
                <div className="text-xs text-muted-foreground text-center">
                  <p>
                    Ce site est protégé par reCAPTCHA. Les 
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline mx-1"
                    >
                      Conditions d'utilisation
                    </a>
                    et la
                    <a 
                      href="https://policies.google.com/privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline ml-1"
                    >
                      Politique de confidentialité
                    </a>
                    de Google s'appliquent.
                  </p>
                </div>
              </div>
            </FieldSet>
          )}

          {/* Messages d'état */}
          {formStatus === "success" && (
            <Alert variant="default" className="bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-300">
                Votre message a été envoyé avec succès ! Je vous répondrai dans les plus brefs délais.
              </AlertDescription>
            </Alert>
          )}

          {formStatus === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Une erreur est survenue lors de l'envoi. Veuillez vérifier vos informations et réessayer.
              </AlertDescription>
            </Alert>
          )}

          {/* Bouton d'envoi */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              size="lg"
              disabled={isLoading || (showCaptcha && !recaptchaVerified)}
              className="min-w-[200px]"
            >
              {isLoading ? (
                <>
                  <Send className="mr-2 h-4 w-4 animate-pulse" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  {submitText}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="text-center text-sm text-muted-foreground border-t pt-4 justify-center">
        <p>
          Vos données sont traitées de manière confidentielle et ne seront jamais partagées avec des tiers.
        </p>
      </CardFooter>
    </Card>
  )
}