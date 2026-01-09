"use client";
import { useState, useTransition } from "react";
import { useTranslations } from 'next-intl';
import { contactSchema, ContactFormData } from "@/lib/validations/contact";
import { sendContactEmail } from "@/lib/actions/sendEmail";

const initialState: ContactFormData = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactForm() {
  const t = useTranslations('Contact');
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string[]>>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    // Validación cliente
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(parsed.error.flatten().fieldErrors as any);
      return;
    }
    startTransition(async () => {
      const result = await sendContactEmail(form);
      if (result.success) {
        setSuccess(t('success'));
        setForm(initialState);
      } else if (result.error) {
        setErrors(result.error);
        setSuccess(null);
      }
    });
  }

  return (
    <form className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg" onSubmit={handleSubmit} noValidate>
      <h2 className="text-2xl font-bold mb-4">{t('title')}</h2>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="name">{t('name')}</label>
        <input
          className={`input input-bordered w-full ${errors.name ? 'border-red-500' : ''}`}
          type="text"
          name="name"
          id="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="email">{t('email')}</label>
        <input
          className={`input input-bordered w-full ${errors.email ? 'border-red-500' : ''}`}
          type="email"
          name="email"
          id="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="phone">{t('phone')}</label>
        <input
          className={`input input-bordered w-full ${errors.phone ? 'border-red-500' : ''}`}
          type="tel"
          name="phone"
          id="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone[0]}</p>}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="subject">{t('subject')}</label>
        <input
          className={`input input-bordered w-full ${errors.subject ? 'border-red-500' : ''}`}
          type="text"
          name="subject"
          id="subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject[0]}</p>}
      </div>
      <div className="mb-4">
        <label className="block font-semibold mb-1" htmlFor="message">{t('message')}</label>
        <textarea
          className={`textarea textarea-bordered w-full ${errors.message ? 'border-red-500' : ''}`}
          name="message"
          id="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          required
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message[0]}</p>}
      </div>
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={pending}
      >
        {pending ? t('send') + '...' : t('send')}
      </button>
      {success && <p className="text-green-600 text-center mt-4">{success}</p>}
    </form>
  );
}