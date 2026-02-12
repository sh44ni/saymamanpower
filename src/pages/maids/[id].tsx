import { useRouter } from "next/router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SEO } from "@/components/SEO";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";

interface MaidProfileProps {
  maid: any;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const maid = await prisma.maid.findUnique({
    where: { id: params?.id as string },
  });

  if (!maid) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      maid: JSON.parse(JSON.stringify(maid)),
    },
  };
};

export default function MaidProfilePage({ maid }: MaidProfileProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  // Adapting single image to array for carousel
  const images = maid.image ? [maid.image] : ["/placeholder.svg"];

  // Mock data for missing schema fields
  const languages = ["English", "Arabic"]; // Default mock
  const previousCountries = []; // Default empty

  return (
    <>
      <SEO
        title={`${language === "en" ? maid.name : (maid.nameAr || maid.name)} - Sayma Manpower`}
        description={`${maid.role} from ${maid.nationality} with ${maid.experience} years experience`}
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-12">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Images & Basic Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Photo Gallery */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Gallery" : "معرض الصور"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Carousel className="w-full">
                      <CarouselContent>
                        {images.map((image, index) => (
                          <CarouselItem key={index}>
                            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                              <Image
                                src={image}
                                alt={`${maid.name} - Photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      {images.length > 1 && <CarouselPrevious />}
                      {images.length > 1 && <CarouselNext />}
                    </Carousel>
                  </CardContent>
                </Card>

                {/* Request Button */}
                <Button className="w-full text-lg py-6" size="lg">
                  {language === "en" ? "Request Interview" : "طلب مقابلة"}
                </Button>
              </div>

              {/* Right Column - Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Header */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {language === "en" ? maid.name : (maid.nameAr || maid.name)}
                        </h1>
                        <p className="text-lg text-gray-600">
                          {maid.nationality}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {maid.role}
                      </Badge>
                    </div>

                    <div className="text-2xl font-bold text-green-600">
                      {maid.salary} OMR{" "}
                      <span className="text-sm text-gray-600 font-normal">
                        /mo
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Profile Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>{language === "en" ? "Details" : "التفاصيل"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === "en" ? "Age" : "العمر"}</p>
                        <p className="font-semibold">{maid.age} {language === "en" ? "Years" : "سنوات"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === "en" ? "Religion" : "الديانة"}</p>
                        <p className="font-semibold">
                          {maid.religion}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === "en" ? "Marital Status" : "الحالة الاجتماعية"}</p>
                        <p className="font-semibold">
                          {maid.maritalStatus}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === "en" ? "Children" : "الأطفال"}</p>
                        <p className="font-semibold">
                          {maid.children}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{language === "en" ? "Experience" : "الخبرة"}</p>
                        <p className="font-semibold">{maid.experience} {language === "en" ? "Years" : "سنوات"}</p>
                      </div>
                    </div>

                    {/* Placeholder for Languages/Skills if we add them later */}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}