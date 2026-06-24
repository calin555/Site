"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { submitContactMessageAction } from "@/lib/actions/contact.actions";

interface ContactFormProps {
  defaultSubject?: string;
}

export function ContactForm({ defaultSubject = "" }: ContactFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setErrors({});
    startTransition(async () => {
      const result = await submitContactMessageAction({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        subject: formData.get("subject"),
        message: formData.get("message"),
        website: formData.get("website"),
      });

      if (!result.success) {
        setErrors(result.errors);
        return;
      }

      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-brand-200 bg-brand-50/60 p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-brand-600" />
        <h3 className="text-lg font-semibold text-surface-900">
          Mesaj trimis cu succes
        </h3>
        <p className="mt-2 text-sm text-surface-600">
          Îți mulțumim! Echipa noastră îți va răspunde cât mai curând.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-5"
          onClick={() => setSubmitted(false)}
        >
          Trimite alt mesaj
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors._form && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors._form}
        </div>
      )}

      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Prenume"
          name="firstName"
          placeholder="Ion"
          error={errors.firstName}
          required
        />
        <Input
          label="Nume"
          name="lastName"
          placeholder="Popescu"
          error={errors.lastName}
          required
        />
      </div>
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="ion@exemplu.ro"
        error={errors.email}
        required
      />
      <Input
        label="Telefon"
        name="phone"
        type="tel"
        placeholder="07xx xxx xxx"
        error={errors.phone}
      />
      <Input
        label="Subiect"
        name="subject"
        placeholder="Solicitare ofertă stație 22kW"
        defaultValue={defaultSubject}
        error={errors.subject}
      />
      <Textarea
        label="Mesaj"
        name="message"
        placeholder="Descrie-ne nevoia ta: tip vehicul, locație instalare, putere dorită..."
        rows={5}
        error={errors.message}
        required
      />
      <Button type="submit" size="lg" disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {isPending ? "Se trimite..." : "Trimite mesajul"}
      </Button>
    </form>
  );
}
