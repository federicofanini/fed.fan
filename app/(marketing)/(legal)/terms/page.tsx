import React from 'react';
import Particles from "@/components/magicui/particles";

export default function TermsOfService() {
  return (
    <div className="relative pt-10">
      <div className="container mx-auto px-4 py-16 relative z-10 max-w-screen-lg">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <div className="prose prose-lg max-w-none space-y-8">
          <p className="text-xl font-semibold leading-relaxed">Welcome to <span className="text-primary">Do What Excite</span>. <br />By using our service, you agree to these terms. Please read them carefully.</p>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">1. Acceptance of Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">By accessing or using our service, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">2. Use of Service</h2>
            <p className="text-gray-700 dark:text-gray-300">You agree to use our service only for lawful purposes and in accordance with these Terms of Service.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">3. Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300">The content, features, and functionality of our service are owned by Do What Excite and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">4. Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300">Do What Excite shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">5. Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300">We reserve the right to modify these terms at any time. Your continued use of the service after any such changes constitutes your acceptance of the new Terms of Service.</p>
          </section>
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">6. Contact Us</h2>
            <p className="text-gray-700 dark:text-gray-300">If you have any questions about these Terms, please contact us at <a href="mailto:f@fanini.eu" className="text-primary hover:underline">f@fanini.eu</a>.</p>
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
