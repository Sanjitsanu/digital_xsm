import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  CheckCircle2,
  MessageCircle,
  Mail,
  Building,
  Calendar,
  ShieldCheck,
  Check,
  Plus,
  Trash2,
  ArrowRight
} from 'lucide-react';
import { COMPANY_INFO } from '../data/siteData';
import {
  DEFAULT_PILLAR_SERVICES,
  platformStore
} from '../services/platformStore';
import { Quotation, QuotationItem } from '../types';
import { trackEvent } from '../services/analyticsService';

interface QuotationGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedServices?: string[];
}

export const QuotationGeneratorModal: React.FC<QuotationGeneratorModalProps> = ({
  isOpen,
  onClose,
  preselectedServices = [],
}) => {
  const [step, setStep] = useState<'build' | 'preview'>('build');
  const [clientName, setClientName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [timeline, setTimeline] = useState('Within 2-3 weeks');
  const [requirements, setRequirements] = useState('');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [generatedQuotation, setGeneratedQuotation] = useState<Quotation | null>(null);

  // Initialize selected services when modal opens
  useEffect(() => {
    if (isOpen) {
      if (preselectedServices.length > 0) {
        const ids: string[] = [];
        preselectedServices.forEach((name) => {
          const match = DEFAULT_PILLAR_SERVICES.find(
            (s) => s.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(s.name.toLowerCase())
          );
          if (match && !ids.includes(match.id)) {
            ids.push(match.id);
          }
        });
        setSelectedServiceIds(ids.length > 0 ? ids : ['srv-web', 'srv-ai-chatbot']);
      } else {
        setSelectedServiceIds(['srv-web', 'srv-meta-ads']);
      }
      setStep('build');
    }
  }, [isOpen, preselectedServices]);

  if (!isOpen) return null;

  const toggleService = (id: string) => {
    if (selectedServiceIds.includes(id)) {
      if (selectedServiceIds.length > 1) {
        setSelectedServiceIds(selectedServiceIds.filter((item) => item !== id));
      }
    } else {
      setSelectedServiceIds([...selectedServiceIds, id]);
    }
  };

  // Build items from configuration
  const selectedItems: QuotationItem[] = selectedServiceIds.map((id) => {
    const s = DEFAULT_PILLAR_SERVICES.find((item) => item.id === id);
    return {
      id: 'qi-' + id,
      service: s?.name || 'Custom Digital Service',
      description: s?.description || 'Professional execution and deliverables by Digital X.',
      quantity: 1,
      unit_price: s?.basePrice || 15000,
      total_price: s?.basePrice || 15000,
    };
  });

  const subtotal = selectedItems.reduce((acc, curr) => acc + curr.total_price, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = subtotal - discountAmount;
  const tax = Math.round(taxableAmount * 0.18); // 18% GST standard
  const grandTotal = taxableAmount + tax;

  const handleGenerateQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !email.trim() || !phone.trim()) return;

    const validUntilDate = new Date(Date.now() + 3600000 * 24 * 15).toISOString().split('T')[0];

    const quote = platformStore.createQuotation({
      client_name: clientName,
      business_name: businessName || clientName + ' Enterprise',
      email: email,
      phone: phone,
      items: selectedItems,
      subtotal,
      discount: discountAmount,
      tax,
      grand_total: grandTotal,
      status: 'Sent',
      valid_until: validUntilDate,
      terms: [
        '50% advance upon project sign-off, remaining 50% upon final testing & domain deployment.',
        'Includes 30 days of post-launch technical support and maintenance.',
        'Client provides brand assets, content text, product photos, and access keys.',
        'Official quotation valid for 15 days from issue date.',
      ],
      notes: requirements,
    });

    setGeneratedQuotation(quote);
    setStep('preview');
    trackEvent('generate_quotation', 'sales', quote.quotation_number);
  };

  const handlePrint = () => {
    trackEvent('print_quotation_pdf', 'sales', generatedQuotation?.quotation_number);
    window.print();
  };

  const handleAcceptQuotation = () => {
    if (generatedQuotation) {
      platformStore.updateQuotationStatus(generatedQuotation.id, 'Accepted');
      setGeneratedQuotation({ ...generatedQuotation, status: 'Accepted' });
      trackEvent('accept_quotation', 'sales', generatedQuotation.quotation_number);
    }
  };

  const getWhatsAppShareUrl = () => {
    if (!generatedQuotation) return '';
    const text =
      `Hello Digital X Team! I have reviewed quotation ${generatedQuotation.quotation_number}.\n\n` +
      `👤 Client: ${generatedQuotation.client_name}\n` +
      `🏢 Business: ${generatedQuotation.business_name}\n` +
      `💰 Grand Total: ₹${generatedQuotation.grand_total.toLocaleString()}\n` +
      `🎯 Services:\n${generatedQuotation.items.map((i) => `• ${i.service}`).join('\n')}\n\n` +
      `Please let me know the kickoff schedule!`;
    return `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div
      role="dialog"
      aria-label="Online Quotation Generator"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
    >
      <div className="relative w-full max-w-4xl bg-[#071126] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B1938] border-b border-blue-500/20 select-none">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-cyan-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                {step === 'build' ? 'Online Quotation Generator' : `Official Quotation: ${generatedQuotation?.quotation_number}`}
              </h3>
              <p className="text-xs text-slate-400">Digital X Multi Services Pvt. Ltd.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 'build' ? (
            /* BUILDER FORM */
            <form onSubmit={handleGenerateQuote} className="space-y-6">
              {/* Client & Business Information */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3">
                  1. Client &amp; Business Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. Shamas"
                      className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Business / Company Name
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Shamas Enterprises"
                      className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. shamas@example.com"
                      className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 7970884193"
                      className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                    2. Select Services to Include
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedServiceIds.length} Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                  {DEFAULT_PILLAR_SERVICES.map((srv) => {
                    const isSelected = selectedServiceIds.includes(srv.id);
                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 text-xs ${
                          isSelected
                            ? 'bg-blue-900/40 border-cyan-400 text-white font-semibold'
                            : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="truncate">
                          <span className="text-[10px] text-slate-400 block font-mono">[{srv.category}]</span>
                          <span className="truncate">{srv.name}</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-cyan-400 text-slate-950 font-bold' : 'border border-slate-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Completion Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-slate-900 text-white text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Urgent (7-10 Days)">Urgent (7-10 Days)</option>
                    <option value="Within 2-3 weeks">Standard (Within 2-3 weeks)</option>
                    <option value="1 Month">1 Month</option>
                    <option value="Flexible / Ongoing">Flexible / Ongoing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Special Requirements or Scope Details
                  </label>
                  <input
                    type="text"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. Integrate Razorpay UPI and Hindi language support"
                    className="w-full bg-slate-900 text-white placeholder-slate-400 text-xs sm:text-sm p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Live Price Estimation Bar */}
              <div className="p-4 rounded-2xl bg-[#0B1938] border border-blue-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-300">
                  <div>Subtotal ({selectedItems.length} items): <strong className="text-white font-mono">₹{subtotal.toLocaleString()}</strong></div>
                  <div>GST (18%): <strong className="text-white font-mono">₹{tax.toLocaleString()}</strong></div>
                  <div className="text-cyan-300 font-bold text-sm mt-0.5">Grand Total: ₹{grandTotal.toLocaleString()}</div>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#1769FF] to-[#0052CC] hover:from-[#2563EB] hover:to-[#1769FF] shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Official PDF Quotation →</span>
                </button>
              </div>
            </form>
          ) : (
            /* PREVIEW / EXPORT PDF VIEW (Section 22) */
            generatedQuotation && (
              <div className="space-y-6">
                {/* Print Ready Document Container */}
                <div
                  id="printable-quotation"
                  className="p-6 sm:p-8 rounded-2xl bg-white text-slate-900 shadow-2xl font-sans"
                >
                  {/* Document Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight">
                        DIGITAL X
                      </div>
                      <div className="text-xs text-slate-600 font-semibold">
                        Digital X Multi Services Pvt. Ltd.
                      </div>
                      <div className="text-[11px] text-slate-500 leading-tight mt-1">
                        Sonepur, Shahpur, Saran, Bihar 841101<br />
                        Phone / WhatsApp: +91 7970884193 • Email: info@thedigitalx.in
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="inline-block px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-black font-mono">
                        QUOTATION
                      </div>
                      <div className="text-sm font-mono font-bold text-slate-900 mt-1">
                        {generatedQuotation.quotation_number}
                      </div>
                      <div className="text-xs text-slate-500">
                        Date: {generatedQuotation.created_at}<br />
                        Valid Until: {generatedQuotation.valid_until}
                      </div>
                    </div>
                  </div>

                  {/* Billed To */}
                  <div className="py-4 border-b border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Quotation Prepared For:
                    </span>
                    <div className="text-sm font-bold text-slate-900">
                      {generatedQuotation.client_name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {generatedQuotation.business_name} • {generatedQuotation.phone} • {generatedQuotation.email}
                    </div>
                  </div>

                  {/* Services Table */}
                  <div className="py-4 overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b-2 border-slate-300 text-slate-500 uppercase tracking-wider font-semibold">
                          <th className="py-2 pr-4">Service</th>
                          <th className="py-2 px-4">Description</th>
                          <th className="py-2 px-2 text-center">Qty</th>
                          <th className="py-2 pl-4 text-right">Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {generatedQuotation.items.map((item, idx) => (
                          <tr key={idx} className="text-slate-800">
                            <td className="py-2.5 pr-4 font-bold text-slate-950 align-top">
                              {item.service}
                            </td>
                            <td className="py-2.5 px-4 text-slate-600 text-[11px] align-top">
                              {item.description}
                            </td>
                            <td className="py-2.5 px-2 text-center align-top font-mono">
                              {item.quantity}
                            </td>
                            <td className="py-2.5 pl-4 text-right font-mono font-semibold align-top text-slate-950">
                              ₹{item.total_price.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Breakdown */}
                  <div className="pt-4 border-t border-slate-200 flex justify-end">
                    <div className="w-full max-w-xs space-y-1.5 text-xs text-slate-700">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-mono">₹{generatedQuotation.subtotal.toLocaleString()}</span>
                      </div>
                      {generatedQuotation.discount > 0 && (
                        <div className="flex justify-between text-emerald-600">
                          <span>Discount:</span>
                          <span className="font-mono">-₹{generatedQuotation.discount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>GST (18%):</span>
                        <span className="font-mono">₹{generatedQuotation.tax.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-slate-950 pt-2 border-t border-slate-300">
                        <span>Grand Total:</span>
                        <span className="font-mono text-blue-700">₹{generatedQuotation.grand_total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Terms &amp; Conditions
                    </h5>
                    <ul className="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
                      {generatedQuotation.terms.map((t, idx) => (
                        <li key={idx}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Authorized by Digital X Multi Services Pvt. Ltd.</span>
                    <span>Official Verified Document</span>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Download / Print PDF</span>
                    </button>

                    <a
                      href={getWhatsAppShareUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:brightness-110 text-xs font-bold text-white shadow transition-colors cursor-pointer"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Send on WhatsApp</span>
                    </a>
                  </div>

                  {/* Accept quotation action (Section 45) */}
                  <div className="flex items-center gap-2">
                    {generatedQuotation.status === 'Accepted' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Quotation Accepted! Project Created</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAcceptQuotation}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg transition-colors cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Accept Quotation &amp; Start Project</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
