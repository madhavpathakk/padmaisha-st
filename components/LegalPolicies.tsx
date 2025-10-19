"use client";
import React from "react";

interface LegalPoliciesProps {
  policyType?: 'privacy' | 'exchange' | 'shipping' | 'terms';
}

const policies = [
  {
    title: "Privacy Policy",
    content: `At Padmaisha, we are committed to safeguarding your privacy with the utmost care. We collect only essential personal information, such as your name, email address, phone number, and shipping details, to process your orders, provide customer support, and personalize your shopping experience. This data is stored securely using advanced encryption technologies and is protected under strict confidentiality protocols compliant with applicable Indian data protection laws. We do not sell, rent, or share your information with third parties for marketing purposes without your explicit consent, except where required by law or to fulfill your order (e.g., sharing with shipping partners). You have the right to access, update, or request deletion of your data by contacting us at padmaisha940@gmail.com. Our privacy practices are regularly reviewed to ensure compliance and transparency, and any updates to this policy will be communicated via our website.`
  },
  {
    title: "Exchange Policy",
    content: `Padmaisha is dedicated to ensuring your satisfaction with every purchase, which is why we offer a flexible exchange policy. You may request an exchange for any product within 7 days from the date of delivery, provided the item remains unused, unwashed, and in its original packaging with all tags intact. A valid purchase receipt or order confirmation is required for processing. Exchanges are subject to the availability of the requested size, color, or style, and we cannot guarantee the exact item will be restocked. Shipping costs for returning the item to our warehouse will be borne by the customer, while the return shipping for the exchanged product will be free if the original order was above ₹999. Defective items reported within 48 hours of delivery will be eligible for a free exchange or refund, subject to inspection. Please contact our support team at 8979865001 to initiate an exchange.`
  },
  {
    title: "Shipping Policy",
    content: `Padmaisha ensures a seamless and reliable shipping experience across India. We partner with trusted courier services to deliver your orders safely and on time. Orders exceeding ₹999 qualify for free standard shipping, while a nominal fee of ₹50 applies to orders below this threshold. Delivery timelines typically range from 5 to 7 business days, though remote areas may experience delays of up to 10 days. Upon dispatch, you will receive a tracking number via email or SMS to monitor your order’s progress. We use eco-friendly packaging materials to minimize environmental impact, and all items are insured during transit. In case of delays or lost shipments, please reach out to our support team within 24 hours for assistance. Note that delivery dates are estimates and may vary due to unforeseen circumstances like weather conditions or public holidays.`
  },
  {
    title: "Terms of Service",
    content: `By accessing and using Padmaisha’s platform, you agree to be bound by our Terms of Service, which govern your relationship with us as a retailer or customer. These terms include acceptance of our listed prices, payment methods (online transfers, UPI, or cash on delivery where applicable), and the conditions of use for our B2B services. All sales are considered final once delivered, except where covered under our exchange or refund policy for defective items. Padmaisha reserves the right to refuse service, terminate accounts, or cancel orders at our discretion if we suspect fraudulent activity or violation of these terms. We may update these terms periodically to reflect changes in our business practices or legal requirements, and such updates will be posted on our website with an effective date noted. You are responsible for regularly reviewing these terms. In the event of any disputes, Indian law will govern, and the jurisdiction for legal proceedings will be the courts of Bareilly, Uttar Pradesh. For clarity on any clause, contact us at padmaisha940@gmail.com.`
  }
];

const LegalPolicies = ({ policyType }: LegalPoliciesProps) => {
  if (policyType) {
    const policy = policies.find(p => 
      p.title.toLowerCase().replace(/\s+/g, '-').includes(policyType)
    );
    
    if (policy) {
      return (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-bold mb-4 text-pink-600">{policy.title}</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{policy.content}</p>
        </div>
      );
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {policies.map((policy) => (
        <div key={policy.title} className="bg-white rounded-xl shadow-lg p-6">
          <h4 className="text-lg font-bold mb-4 text-pink-600">{policy.title}</h4>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{policy.content}</p>
        </div>
      ))}
    </div>
  );
};

export default LegalPolicies;
