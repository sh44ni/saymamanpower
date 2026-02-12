import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { MapPin, Phone, Send, Instagram } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: t.common.success,
          description: t.contact.messageSent,
        });
        e.currentTarget.reset();
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={`${t.nav.contact} - Sayma Manpower`}
        description="Contact Sayma Manpower for trusted housemaids in Oman."
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {t.contact.title}
              </h1>
              <p className="text-xl text-gray-600">{t.contact.subtitle}</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>{t.contact.send}</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.contact.name}</Label>
                      <Input id="name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.contact.phone}</Label>
                      <Input id="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">{t.contact.message}</Label>
                      <Textarea id="message" rows={5} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? t.common.loading : t.contact.send}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info & Map */}
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                        <MapPin className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{t.contact.office}</h3>
                        <p className="text-gray-600">{t.contact.officeAddress}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{t.contact.phoneLabel}</h3>
                        <p className="text-gray-600" dir="ltr">{t.contact.phoneNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
                        <Instagram className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{t.contact.instagram || "Instagram"}</h3>
                        <a
                          href="https://instagram.com/sayma.manpower"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 hover:text-purple-600 transition-colors"
                        >
                          @sayma.manpower
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* WhatsApp Button */}
                <Button
                  className="w-full h-14 bg-green-500 hover:bg-green-600 text-white text-lg gap-2"
                  onClick={() => window.open(`https://wa.me/96812345678`, '_blank')}
                >
                  <Send className="h-5 w-5" />
                  {t.contact.whatsapp}
                </Button>

                {/* Map Placeholder */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 font-medium">Google Maps Embed Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}