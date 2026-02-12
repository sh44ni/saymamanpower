import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { SEO } from "@/components/SEO";
import { prisma } from "@/lib/prisma";
import type { GetServerSideProps } from "next";
import { MaidCard } from "@/components/maid/MaidCard";

interface MaidsPageProps {
  maids: any[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const maids = await prisma.maid.findMany({
    orderBy: { createdAt: "desc" },
  });

  return {
    props: {
      maids: JSON.parse(JSON.stringify(maids)), // Serialize dates
    },
  };
};

export default function MaidsPage({ maids }: MaidsPageProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);

  return (
    <>
      <SEO
        title="Available Housemaids - Sayma Manpower"
        description="Browse verified housemaids, nannies, and caregivers in Oman. Background checked and ready to work."
      />
      <div className="min-h-screen flex flex-col">
        <Navbar />

        <main className="flex-1 bg-gray-50 pt-20">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {language === "en" ? "Available Housemaids" : "الخادمات المتاحات"}
              </h1>
              <p className="text-xl text-gray-600">
                {language === "en"
                  ? "Browse our verified profiles below"
                  : "تصفح الملفات الشخصية المعتمدة أدناه"}
              </p>
            </div>

            {maids.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  {language === "en" ? "No housemaids available at the moment." : "لا يوجد خادمات متاحين في الوقت الحالي."}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {maids.map((maid) => (
                  <MaidCard key={maid.id} maid={maid} />
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}