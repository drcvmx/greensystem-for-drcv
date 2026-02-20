import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { Camera, ImagePlus, X, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Order } from '@/types/orders';

interface DeliveryConfirmationDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (orderId: string, photoUrl: string) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function DeliveryConfirmationDialog({
  order,
  open,
  onOpenChange,
  onConfirm
}: DeliveryConfirmationDialogProps) {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setError(null);
    setUploading(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetState();
    }
    onOpenChange(newOpen);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Formato no válido. Solo se permiten JPG, PNG o WEBP';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'El archivo es muy grande. Máximo 5MB';
    }
    return null;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }

    setError(null);
    setPhoto(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Reset input
    event.target.value = '';
  };

  const removePhoto = () => {
    setPhoto(null);
    setPhotoPreview(null);
    setError(null);
  };

  const uploadPhoto = async (orderId: string, file: File): Promise<string> => {
    // Mock upload for demo: convert file to a Data URL
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleConfirm = async () => {
    if (!order || !photo) return;

    setUploading(true);
    setError(null);

    try {
      // Upload photo
      const photoUrl = await uploadPhoto(order.id, photo);

      // Confirm delivery
      await onConfirm(order.id, photoUrl);

      toast({
        title: '¡Entrega Confirmada!',
        description: `Pedido #${order.order_number} completado exitosamente`,
      });

      handleOpenChange(false);
    } catch (err: any) {
      console.error('Error confirming delivery:', err);
      setError(err.message || 'Error al confirmar la entrega');
    } finally {
      setUploading(false);
    }
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            Confirmar Entrega
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="font-bold">Pedido #{order.order_number}</div>
            <div className="text-sm text-muted-foreground">
              Cliente: {order.customer?.name}
            </div>
          </div>

          {/* Photo Preview Area */}
          <div className="relative">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Foto de entrega"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removePhoto}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-muted-foreground">
                <Camera className="h-12 w-12 mb-2 opacity-50" />
                <span>Sin foto - Obligatoria</span>
              </div>
            )}
          </div>

          {/* Photo Capture Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              Tomar Foto
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Galería
            </Button>
          </div>

          {/* Hidden File Inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Warning */}
          <Alert className="border-amber-500/50 bg-amber-500/10">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <AlertDescription className="text-amber-400">
              La foto es obligatoria para confirmar la entrega
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={uploading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!photo || uploading}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmar Entrega
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
