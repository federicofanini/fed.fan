import React from 'react';
import Particles from "@/components/magicui/particles";

export default function PrivacyPolicy() {
  return (
    <div className="relative pt-10">
      <div className="container mx-auto px-4 py-16 relative z-10 max-w-screen-lg">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-xl font-semibold leading-relaxed">At <span className="text-primary">Do What Excite</span>, we value your privacy. <br />This policy outlines how we collect, use, and protect your personal information.</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. Information Collection</h2>
            <p className="text-gray-700 dark:text-gray-300">We collect information you provide directly to us when using our service, including but not limited to your name, email address, and usage data.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">2. Use of Information</h2>
            <p className="text-gray-700 dark:text-gray-300">We use the information we collect to provide, maintain, and improve our services, as well as to communicate with you about updates and offers.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. Data Security</h2>
            <p className="text-gray-700 dark:text-gray-300">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">4. Third-Party Services</h2>
            <p className="text-gray-700 dark:text-gray-300">We may use third-party services that collect, monitor and analyze this information to improve our service&apos;s functionality and user experience.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. Changes to This Policy</h2>
            <p className="text-gray-700 dark:text-gray-300">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">6. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:f@fanini.eu" className="text-primary hover:underline">f@fanini.eu</a>.</p>
          </section>
        </div>
      </div>
      <Particles
        className="absolute inset-0 -z-10"
        quantity={5000}
        ease={70}
        size={0.15}
        staticity={100}
        color={"#37ecba"}
      />
    </div>
  );
}
