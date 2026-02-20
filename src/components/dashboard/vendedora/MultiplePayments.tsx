import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Upload, AlertCircle, X, Image, CheckCircle, Plus } from 'lucide-react';
import { PaymentType, PaymentEntry, PAYMENT_TYPE_LABELS } from '@/types/orders';

interface MultiplePaymentsProps {
  payments: PaymentEntry[];
  onPaymentsChange: (payments: PaymentEntry[]) => void;
  cartTotal: number;
}

const PAYMENT_OPTIONS: { type: PaymentType; icon: string; requiresEvidence: boolean }[] = [
  { type: 'cash', icon: '💵', requiresEvidence: false },
  { type: 'transfer', icon: '🏦', requiresEvidence: true },
  { type: 'payment_link', icon: '🔗', requiresEvidence: true },
  { type: 'loyalty_points', icon: '⭐', requiresEvidence: false },
];

const MAX_EVIDENCE_FILES = 3;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ValidationResult {
  valid: boolean;
  error?: string;
}

const validateFile = (file: File): ValidationResult => {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: 'Formato no soportado. Usa JPG, PNG o WEBP.' };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `El archivo excede 5MB (${(file.size / 1024 / 1024).toFixed(1)}MB).` };
  }
  return { valid: true };
};

export function MultiplePayments({ payments, onPaymentsChange, cartTotal }: MultiplePaymentsProps) {
  const [fileErrors, setFileErrors] = useState<Record<PaymentType, string | null>>({} as any);
  const [previews, setPreviews] = useState<Record<PaymentType, string[]>>({} as any);

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      Object.values(previews).forEach(urls => {
        urls?.forEach(url => URL.revokeObjectURL(url));
      });
    };
  }, []);

  const togglePayment = (type: PaymentType) => {
    const existing = payments.find(p => p.type === type);
    if (existing) {
      // Clear previews when removing payment
      previews[type]?.forEach(url => URL.revokeObjectURL(url));
      setPreviews(prev => ({ ...prev, [type]: [] }));
      setFileErrors(prev => ({ ...prev, [type]: null }));
      onPaymentsChange(payments.filter(p => p.type !== type));
    } else {
      let autoAmount = 0;
      if (type === 'cash') {
        const currentCovered = payments.reduce((sum, p) => sum + p.amount, 0);
        autoAmount = Math.max(0, cartTotal - currentCovered);
      }
      
      onPaymentsChange([...payments, { 
        id: crypto.randomUUID(), 
        type, 
        amount: autoAmount, 
        evidenceFile: null,
        evidenceFiles: [],
        existingEvidenceUrls: [],
      }]);
    }
  };

  const updatePaymentAmount = (type: PaymentType, amount: number) => {
    onPaymentsChange(payments.map(p => 
      p.type === type ? { ...p, amount: Math.max(0, amount) } : p
    ));
  };

  const addEvidenceFile = (type: PaymentType, file: File) => {
    const payment = payments.find(p => p.type === type);
    if (!payment) return;

    const totalExisting = (payment.existingEvidenceUrls?.length || 0) + (payment.evidenceFiles?.length || 0);
    if (totalExisting >= MAX_EVIDENCE_FILES) {
      setFileErrors(prev => ({ ...prev, [type]: `Máximo ${MAX_EVIDENCE_FILES} imágenes por comprobante.` }));
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      setFileErrors(prev => ({ ...prev, [type]: validation.error! }));
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviews(prev => ({ ...prev, [type]: [...(prev[type] || []), previewUrl] }));
    setFileErrors(prev => ({ ...prev, [type]: null }));

    onPaymentsChange(payments.map(p => 
      p.type === type ? { ...p, evidenceFiles: [...(p.evidenceFiles || []), file] } : p
    ));
  };

  const removeNewFile = (type: PaymentType, index: number) => {
    const currentPreviews = previews[type] || [];
    if (currentPreviews[index]) {
      URL.revokeObjectURL(currentPreviews[index]);
    }
    setPreviews(prev => ({
      ...prev,
      [type]: currentPreviews.filter((_, i) => i !== index),
    }));
    setFileErrors(prev => ({ ...prev, [type]: null }));
    onPaymentsChange(payments.map(p => 
      p.type === type ? { ...p, evidenceFiles: (p.evidenceFiles || []).filter((_, i) => i !== index) } : p
    ));
  };

  const removeExistingUrl = (type: PaymentType, index: number) => {
    onPaymentsChange(payments.map(p => 
      p.type === type ? { 
        ...p, 
        existingEvidenceUrls: (p.existingEvidenceUrls || []).filter((_, i) => i !== index),
        existingEvidenceUrl: undefined,
      } : p
    ));
  };

  const totalCovered = payments.reduce((sum, p) => sum + p.amount, 0);
  const isBalanced = Math.abs(totalCovered - cartTotal) < 0.01;

  return (
    <div className="space-y-3">
      <Label className="flex items-center gap-2">
        <CreditCard className="h-4 w-4" />
        Formas de Pago
      </Label>
      
      <div className="space-y-2">
        {PAYMENT_OPTIONS.map(option => {
          const payment = payments.find(p => p.type === option.type);
          const isSelected = !!payment;
          const fileError = fileErrors[option.type];
          const currentPreviews = previews[option.type] || [];
          const existingUrls = payment?.existingEvidenceUrls || [];
          const newFiles = payment?.evidenceFiles || [];
          const totalImages = existingUrls.length + newFiles.length;
          const canAddMore = totalImages < MAX_EVIDENCE_FILES;

          return (
            <div key={option.type} className="space-y-2">
              <div 
                className={`flex items-center gap-3 p-3 border rounded-md transition-colors ${
                  isSelected ? 'bg-primary/10 border-primary/30' : 'hover:bg-muted'
                }`}
              >
                <Checkbox 
                  checked={isSelected}
                  onCheckedChange={() => togglePayment(option.type)}
                  id={`payment-${option.type}`}
                />
                <label 
                  htmlFor={`payment-${option.type}`}
                  className="flex-1 cursor-pointer flex items-center gap-2"
                >
                  <span>{option.icon}</span>
                  <span>{PAYMENT_TYPE_LABELS[option.type]}</span>
                  {isSelected && payment.amount > 0 && (
                    <Badge variant="outline" className="ml-1 bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Recibido
                    </Badge>
                  )}
                </label>
                
                {isSelected && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">$</span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={payment.amount || ''}
                      onChange={(e) => updatePaymentAmount(option.type, parseFloat(e.target.value) || 0)}
                      className="w-24 h-8"
                      placeholder="0.00"
                    />
                  </div>
                )}
              </div>

              {/* Evidence upload for transfer/payment_link */}
              {isSelected && option.requiresEvidence && (
                <div className="ml-8 p-3 bg-amber-500/10 border border-amber-500/30 rounded-md space-y-3">
                  <Label className="text-amber-400 flex items-center gap-2 text-sm">
                    <Upload className="h-3 w-3" />
                    Comprobantes ({totalImages}/{MAX_EVIDENCE_FILES})
                    {totalImages === 0 && ' - Obligatorio'}
                  </Label>
                  
                  {/* Existing evidence images */}
                  {existingUrls.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {existingUrls.map((url, idx) => (
                        <div key={`existing-${idx}`} className="relative border rounded-md overflow-hidden group">
                          <img 
                            src={url} 
                            alt={`Comprobante ${idx + 1}`} 
                            className="w-full h-24 object-contain bg-black/50 cursor-pointer"
                            onClick={() => window.open(url, '_blank')}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingUrl(option.type, idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* New file previews */}
                  {currentPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {currentPreviews.map((previewUrl, idx) => (
                        <div key={`new-${idx}`} className="relative border rounded-md overflow-hidden group">
                          <img 
                            src={previewUrl} 
                            alt={`Nuevo ${idx + 1}`} 
                            className="w-full h-24 object-contain bg-black/50 cursor-pointer"
                            onClick={() => window.open(previewUrl, '_blank')}
                          />
                          <button
                            type="button"
                            onClick={() => removeNewFile(option.type, idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-emerald-500/80 text-white text-[10px] text-center py-0.5">
                            Nuevo
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File error message */}
                  {fileError && (
                    <div className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {fileError}
                    </div>
                  )}
                  
                  {/* Add file button */}
                  {canAddMore && (
                    <div>
                      <label className="cursor-pointer">
                        <Input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) addEvidenceFile(option.type, file);
                            e.target.value = ''; // Reset to allow same file
                          }}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 p-2 border border-dashed border-amber-500/50 rounded-md hover:bg-amber-500/10 transition-colors text-sm text-amber-400">
                          <Plus className="h-4 w-4" />
                          {totalImages === 0 ? 'Subir comprobante' : 'Agregar otra imagen'}
                          <span className="text-xs text-muted-foreground ml-auto">
                            JPG, PNG, WEBP (máx 5MB)
                          </span>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Total covered indicator */}
      {cartTotal > 0 && payments.length > 0 && (
        <div className={`p-3 rounded-md border ${
          isBalanced 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
        }`}>
          {isBalanced && (
            <div className="flex items-center gap-2 mb-2 text-emerald-400">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Resumen de Pagos Recibidos</span>
            </div>
          )}
          
          {payments.filter(p => p.amount > 0).map(p => (
            <div key={p.type} className="flex justify-between text-sm opacity-80">
              <span>{PAYMENT_TYPE_LABELS[p.type]}:</span>
              <span>${p.amount.toFixed(2)} ✓</span>
            </div>
          ))}
          
          <div className="border-t border-current/20 mt-2 pt-2">
            <div className="flex justify-between font-medium">
              <span>Total Recibido:</span>
              <span>${totalCovered.toFixed(2)} de ${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          
          {!isBalanced && (
            <div className="text-sm mt-1">
              {totalCovered < cartTotal 
                ? `⚠️ Falta: $${(cartTotal - totalCovered).toFixed(2)}` 
                : `⚠️ Excede: $${(totalCovered - cartTotal).toFixed(2)}`
              }
            </div>
          )}
        </div>
      )}
    </div>
  );
}
